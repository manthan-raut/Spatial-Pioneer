import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal.jsx";
import { SERVICE_NAMES, company } from "../data/content.js";
import { BASE, ringPath } from "../lib/geo.js";
import "./Contact.css";

// Set VITE_STATIC_SITE=1 at build time for hosts without the Node API (e.g. GitHub Pages).
const STATIC_SITE = import.meta.env.VITE_STATIC_SITE === "1";

const EMPTY = { name: "", organisation: "", email: "", phone: "", site: "", message: "", company_website: "" };

function PinMap({ pin, onPin }) {
  const bg = useMemo(() => {
    const rings = [];
    [[200, 180, 0.8], [470, 300, 2], [520, 90, 3.3]].forEach(([x, y, s]) => {
      for (let k = 1; k <= 8; k++) rings.push({ d: ringPath(x, y, k * 17, s + k * 0.2, 90, 1.2, 1), major: k % 4 === 0 });
    });
    return rings;
  }, []);

  const click = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 640, y = ((e.clientY - r.top) / r.height) * 440;
    onPin({ x, y, lat: +(BASE.lat + (220 - y) * 0.0009).toFixed(5), lon: +(BASE.lon + (x - 320) * 0.0009).toFixed(5) });
  };

  return (
    <div className="pin-map">
      <svg viewBox="0 0 640 440" onClick={click} role="img" aria-label="Click to drop a pin on your project site">
        <rect width="640" height="440" fill="#11251C" />
        {Array.from({ length: 17 }, (_, i) => <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="440" stroke="#EDE6D6" strokeOpacity=".06" />)}
        {Array.from({ length: 12 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 40} x2="640" y2={i * 40} stroke="#EDE6D6" strokeOpacity=".06" />)}
        {bg.map((c, i) => <path key={i} d={c.d} fill="none" stroke="#C49A6C" strokeOpacity={c.major ? 0.6 : 0.25} />)}
        <path d="M0 330 C160 300 260 380 380 320 S 560 220 640 240" fill="none" stroke="#C49A6C" strokeOpacity=".6" strokeWidth="10" />
        <path d="M0 100 L640 160" stroke="#EDE6D6" strokeOpacity=".35" strokeWidth="3" />
        <path d="M300 0 L260 440" stroke="#EDE6D6" strokeOpacity=".25" strokeWidth="2" />
        <AnimatePresence>
          {pin && (
            <motion.g key={`${pin.x}-${pin.y}`} initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 18 }}>
              <circle cx={pin.x} cy={pin.y} r="30" fill="rgba(233,162,59,.12)" stroke="#E9A23B" strokeDasharray="3 4" />
              <path
                d={`M${pin.x} ${pin.y} C ${pin.x - 12} ${pin.y - 16} ${pin.x - 14} ${pin.y - 24} ${pin.x - 14} ${pin.y - 30} A14 14 0 1 1 ${pin.x + 14} ${pin.y - 30} C ${pin.x + 14} ${pin.y - 24} ${pin.x + 12} ${pin.y - 16} ${pin.x} ${pin.y}Z`}
                fill="#E9A23B"
              />
              <circle cx={pin.x} cy={pin.y - 30} r="5" fill="#0B1A14" />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      <span className="hint">{pin ? `PIN · ${pin.lat}°N ${pin.lon}°E` : "CLICK TO DROP A SITE PIN"}</span>
    </div>
  );
}

export default function Contact() {
  const [f, setF] = useState(EMPTY);
  const [svc, setSvc] = useState([]);
  const [pin, setPin] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [msg, setMsg] = useState("");

  const upd = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.value }));

  const onPin = (p) => {
    setPin(p);
    setF((o) => ({ ...o, site: `${p.lat}°N, ${p.lon}°E` }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!f.name.trim()) errs.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) errs.email = "Please enter a valid email.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    // Static hosting (GitHub Pages) has no API → hand the request to the visitor's email app instead.
    if (STATIC_SITE) {
      const lines = [`Name: ${f.name}`];
      if (f.organisation) lines.push(`Organisation: ${f.organisation}`);
      lines.push(`Email: ${f.email}`);
      if (f.phone) lines.push(`Phone: ${f.phone}`);
      if (svc.length) lines.push(`Services: ${svc.join(", ")}`);
      if (f.site) lines.push(`Site location: ${f.site}`);
      if (f.message) lines.push("", f.message);
      const body = lines.join("\n");
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`Project enquiry — ${f.name}`)}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
      setMsg("Opening your email app with your request — just press send.");
      setTimeout(() => setStatus("idle"), 6000);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, services: svc, lat: pin?.lat ?? null, lon: pin?.lon ?? null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setErrors(data.errors || {});
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("sent");
      setMsg("Request logged — we'll reply within one working day.");
      setF(EMPTY);
      setSvc([]);
      setPin(null);
    } catch (err) {
      setStatus("error");
      setMsg(err.message === "Failed to fetch" ? "Couldn't reach the server. Is the API running?" : err.message);
    }
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section className="section bordered contact" id="contact">
      <div className="wrap contact-grid">
        <Reveal className="contact-left">
          <span className="eyebrow">Contact</span>
          <h2 className="title">Tell us about <span className="serif">your site.</span></h2>
          <p className="lede">Optional: click the map to mark your site. Fill in the form and we'll reply within one working day with a plan and a quote.</p>
          <PinMap pin={pin} onPin={onPin} />
        </Reveal>

        <Reveal delay={0.1}>
          <form className="form" onSubmit={submit} noValidate>
            <h3>Request a survey or demo</h3>
            <p className="sub">Tell us a little about the job.</p>
            <div className="row2">
              <Field id="name" label="Name" value={f.name} onChange={upd("name")} placeholder="Your name" error={errors.name} />
              <Field id="organisation" label="Organisation" value={f.organisation} onChange={upd("organisation")} placeholder="Company / department" />
            </div>
            <div className="row2">
              <Field id="email" type="email" label="Email" value={f.email} onChange={upd("email")} placeholder="you@company.com" error={errors.email} />
              <Field id="phone" type="tel" label="Phone" value={f.phone} onChange={upd("phone")} placeholder="+91 ..." />
            </div>
            <div className="field">
              <label>Services needed</label>
              <div className="svc-pick">
                {SERVICE_NAMES.map((s) => (
                  <button type="button" key={s} className={svc.includes(s) ? "on" : ""} aria-pressed={svc.includes(s)} onClick={() => setSvc((o) => (o.includes(s) ? o.filter((x) => x !== s) : [...o, s]))}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Field id="site" label="Site location" value={f.site} onChange={upd("site")} placeholder="Drop a pin on the map or type a place" />
            <div className="field">
              <label htmlFor="message">Project details</label>
              <textarea id="message" value={f.message} onChange={upd("message")} placeholder="Area, timeline, deliverables..." />
            </div>
            {/* honeypot — hidden from humans */}
            <input className="hp" tabIndex={-1} autoComplete="off" value={f.company_website} onChange={upd("company_website")} aria-hidden="true" />
            <button className="btn btn-hivis submit" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : <>Send request <span className="arr">→</span></>}
            </button>
          </form>
        </Reveal>
      </div>

      <AnimatePresence>
        {(status === "sent" || status === "error") && (
          <motion.div className={`toast ${status}`} initial={{ y: 80, x: "-50%", opacity: 0 }} animate={{ y: 0, x: "-50%", opacity: 1 }} exit={{ y: 80, x: "-50%", opacity: 0 }}>
            {status === "sent" ? "✓ " : "⚠ "}{msg}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Field({ id, label, error, type = "text", ...rest }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} className={error ? "err" : ""} aria-invalid={!!error} {...rest} />
      {error && <span className="field-err">{error}</span>}
    </div>
  );
}
