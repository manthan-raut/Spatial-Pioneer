// Spatial Pioneer API + static host
// - POST /api/contact      -> validates and stores a project request in data/submissions.json
// - GET  /api/submissions  -> lists requests (requires header x-admin-token = process.env.ADMIN_TOKEN)
// - GET  /api/health       -> health check
// - Serves ../client/dist in production (after `npm run build`)
import express from "express";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const SUBMISSIONS = path.join(DATA_DIR, "submissions.json");
const DIST = path.join(__dirname, "..", "client", "dist");
const PORT = Number(process.env.PORT) || 5050;

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "50kb" }));

// --- tiny in-memory rate limiter (5 requests / 10 min / IP) ---
const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) return res.status(429).json({ ok: false, error: "Too many requests, please try later." });
  recent.push(now);
  hits.set(ip, recent);
  next();
}

const SERVICES = ["GIS Mapping", "Land Survey", "Drone Mapping", "Web & Mobile GIS", "Spatial Analytics"];
const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

async function readAll() {
  try {
    return JSON.parse(await readFile(SUBMISSIONS, "utf8"));
  } catch {
    return [];
  }
}

// serialise writes so concurrent requests don't clobber the file
let queue = Promise.resolve();
function append(entry) {
  queue = queue.then(async () => {
    await mkdir(DATA_DIR, { recursive: true });
    const all = await readAll();
    all.push(entry);
    await writeFile(SUBMISSIONS, JSON.stringify(all, null, 2));
  });
  return queue;
}

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "spatial-pioneer-api", time: new Date().toISOString() }));

app.post("/api/contact", rateLimit, async (req, res) => {
  const b = req.body || {};
  if (str(b.company_website, 200)) return res.json({ ok: true }); // honeypot: silently accept bots

  const entry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name: str(b.name, 120),
    organisation: str(b.organisation, 160),
    email: str(b.email, 160),
    phone: str(b.phone, 40),
    services: Array.isArray(b.services) ? b.services.filter((s) => SERVICES.includes(s)) : [],
    site: str(b.site, 200),
    lat: Number.isFinite(b.lat) ? b.lat : null,
    lon: Number.isFinite(b.lon) ? b.lon : null,
    message: str(b.message, 4000),
  };

  const errors = {};
  if (!entry.name) errors.name = "Please tell us your name.";
  if (!/^\S+@\S+\.\S+$/.test(entry.email)) errors.email = "Please enter a valid email.";
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });

  try {
    await append(entry);
    console.log(`[contact] ${entry.name} <${entry.email}> — ${entry.services.join(", ") || "no services picked"}`);
    res.status(201).json({ ok: true, id: entry.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Could not save your request." });
  }
});

app.get("/api/submissions", async (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (!token || req.get("x-admin-token") !== token) return res.status(401).json({ ok: false, error: "Unauthorised" });
  res.json(await readAll());
});

app.use("/api", (_req, res) => res.status(404).json({ ok: false, error: "Not found" }));

if (existsSync(DIST)) {
  app.use(express.static(DIST, { maxAge: "7d", index: false }));
  app.use((req, res, next) => (req.method === "GET" ? res.sendFile(path.join(DIST, "index.html")) : next()));
}

app.listen(PORT, () => {
  console.log(`Spatial Pioneer API on http://localhost:${PORT}${existsSync(DIST) ? " (serving client/dist)" : ""}`);
});
