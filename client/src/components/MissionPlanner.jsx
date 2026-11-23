import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHead } from "./Reveal.jsx";
import Reveal from "./Reveal.jsx";
import "./MissionPlanner.css";

// Camera presets (approximate public specs for each drone class)
const DRONES = {
  p4: { label: "1″ 20MP quad (Phantom-4-RTK class)", sensor: 13.2, focal: 8.8, imgW: 5472, imgH: 3648, speed: 10, battery: 20 },
  m3: { label: "4/3″ 20MP quad (Mavic-3E class)", sensor: 17.3, focal: 12.29, imgW: 5280, imgH: 3956, speed: 12, battery: 32 },
  vt: { label: "42MP full-frame VTOL fixed-wing", sensor: 35.9, focal: 35, imgW: 7952, imgH: 5304, speed: 18, battery: 60 },
};

function plan({ area, alt, front, side, drone }) {
  const d = DRONES[drone];
  const gsd = (d.sensor * alt * 100) / (d.focal * d.imgW); // cm/px
  const footW = (gsd / 100) * d.imgW; // m across track
  const footH = (gsd / 100) * d.imgH; // m along track
  const lineSpacing = footW * (1 - side / 100);
  const photoSpacing = footH * (1 - front / 100);
  const sideLen = Math.sqrt(area * 10000);
  const lines = Math.ceil(sideLen / lineSpacing) + 1;
  const dist = lines * sideLen + sideLen; // m
  const photos = lines * (Math.ceil(sideLen / photoSpacing) + 1);
  const minutes = dist / d.speed / 60 + lines * 0.12 + 2;
  const batteries = Math.ceil(minutes / d.battery);
  const days = Math.max(1, Math.ceil(batteries / 12));
  return { gsd, lines, dist, photos, minutes, batteries, days, lineSpacing };
}

function Slider({ label, value, min, max, step = 1, unit, onChange, hint }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="mp-slider">
      <span className="mp-sl-top">
        <span>{label}</span>
        <b>{value}<small>{unit}</small></b>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} style={{ "--p": `${pct}%` }} />
      {hint && <span className="mp-hint">{hint}</span>}
    </label>
  );
}

function Out({ k, v, unit, big }) {
  return (
    <div className={`mp-out ${big ? "big" : ""}`}>
      <span className="k">{k}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.b key={v} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.25 }}>
          {v}
        </motion.b>
      </AnimatePresence>
      <span className="u">{unit}</span>
    </div>
  );
}

export default function MissionPlanner() {
  const [s, setS] = useState({ area: 80, alt: 100, front: 75, side: 65, drone: "p4" });
  const set = (k) => (v) => setS((o) => ({ ...o, [k]: v }));
  const r = useMemo(() => plan(s), [s]);

  // preview path: show up to 40 lines inside a 300x300 square
  const shown = Math.min(r.lines, 40);
  const path = useMemo(() => {
    const x0 = 40, y0 = 40, w = 300, h = 300;
    const step = shown > 1 ? w / (shown - 1) : 0;
    let d = `M${x0} ${y0 + h}`;
    for (let i = 0; i < shown; i++) {
      const x = x0 + i * step;
      const ys = i % 2 ? y0 + h : y0;
      d += ` L${x.toFixed(1)} ${ys}`;
      if (i < shown - 1) d += ` L${(x + step).toFixed(1)} ${ys}`;
    }
    return d;
  }, [shown]);

  return (
    <section className="section paper planner" id="planner">
      <div className="wrap">
        <SectionHead eyebrow="Drone survey estimator" title="How big is" serif="your site?" lede="Move the sliders to match your project. You'll instantly see how sharp the images will be, how many photos the drone takes and how long it flies." />

        <Reveal className="mp">
          <div className="mp-controls">
            <label className="mp-select">
              <span>Drone / camera</span>
              <select value={s.drone} onChange={(e) => set("drone")(e.target.value)}>
                {Object.entries(DRONES).map(([k, d]) => <option key={k} value={k}>{d.label}</option>)}
              </select>
            </label>
            <Slider label="Site area" value={s.area} min={2} max={1000} step={1} unit="ha" onChange={set("area")} hint={`≈ ${(s.area / 100).toFixed(2)} km² · ${(s.area * 2.471).toFixed(0)} acres`} />
            <Slider label="Flying height" value={s.alt} min={30} max={120} unit="m" onChange={set("alt")} hint="Max 120 m AGL under Indian drone rules" />
            <Slider label="Photo overlap (forward)" value={s.front} min={60} max={90} unit="%" onChange={set("front")} />
            <Slider label="Photo overlap (side)" value={s.side} min={50} max={85} unit="%" onChange={set("side")} />
          </div>

          <div className="mp-preview">
            <svg viewBox="0 0 380 380" aria-label="Flight path preview">
              <defs>
                <pattern id="mp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M20 0H0V20" fill="none" stroke="rgba(237,230,214,.06)" />
                </pattern>
              </defs>
              <rect width="380" height="380" fill="#0F2219" />
              <rect width="380" height="380" fill="url(#mp-grid)" />
              <rect x="40" y="40" width="300" height="300" fill="rgba(163,209,107,.06)" stroke="#A3D16B" strokeDasharray="5 4" />
              <path d={path} fill="none" stroke="#E9A23B" strokeWidth="1.3" strokeOpacity=".85" />
              <circle cx="40" cy="340" r="6" fill="#EDE6D6" />
              <text x="50" y="364" fill="#93A3A0" fontFamily="JetBrains Mono" fontSize="10">HOME</text>
              <text x="190" y="28" fill="#A3D16B" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle">{Math.sqrt(s.area * 10000).toFixed(0)} m</text>
              <g key={path}>
                <circle r="13" fill="rgba(233,162,59,.18)" />
                <circle r="6" fill="#E9A23B" />
                <animateMotion dur={`${Math.max(6, shown * 0.6)}s`} repeatCount="indefinite" path={path} />
              </g>
            </svg>
            {r.lines > shown && <span className="mp-note">Preview shows {shown} of {r.lines} lines</span>}
          </div>

          <div className="mp-results">
            <Out big k="IMAGE DETAIL" v={r.gsd.toFixed(2)} unit="cm per pixel — lower is sharper" />
            <Out k="FLIGHT LINES" v={r.lines} unit={`${r.lineSpacing.toFixed(0)} m apart`} />
            <Out k="PHOTOS" v={r.photos.toLocaleString("en-IN")} unit="images" />
            <Out k="DISTANCE" v={(r.dist / 1000).toFixed(1)} unit="km flown" />
            <Out k="FLIGHT TIME" v={Math.round(r.minutes)} unit="minutes" />
            <Out k="BATTERIES" v={r.batteries} unit={`sorties · ~${r.days} field day${r.days > 1 ? "s" : ""}`} />
            <a href="#contact" className="btn btn-hivis">Book this mission <span className="arr">→</span></a>
            <p className="mp-disclaimer">Indicative estimate for a square site on flat terrain. Real plans account for terrain, wind, airspace zones and GCP layout.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
