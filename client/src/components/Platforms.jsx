import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SectionHead } from "./Reveal.jsx";
import Reveal from "./Reveal.jsx";
import { platforms } from "../data/content.js";
import "./Platforms.css";

function TiltCard({ children, className }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 200, damping: 20 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  return (
    <motion.article
      className={className}
      style={{ rotateX: rx, rotateY: ry, "--gx": gx, "--gy": gy }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
    >
      {children}
    </motion.article>
  );
}

const Viz = {
  atlas: (
    <svg viewBox="0 0 400 220" fill="none">
      <rect x=".5" y=".5" width="399" height="219" rx="8" stroke="rgba(237,230,214,.25)" />
      <rect x="12" y="12" width="90" height="196" rx="5" fill="rgba(237,230,214,.05)" />
      {[[26, 60, 0.4], [44, 70, 0.18], [58, 50, 0.18], [72, 64, 1], [86, 44, 0.18]].map(([y, w, o], i) => (
        <rect key={i} x="22" y={y} width={w} height="5" rx="2.5" fill={o === 1 ? "#E9A23B" : `rgba(237,230,214,${o})`} />
      ))}
      <rect x="22" y="160" width="70" height="38" rx="4" fill="rgba(163,209,107,.12)" />
      <path className="viz-spark" d="M28 190 L40 178 L52 184 L64 170 L84 174" stroke="#A3D16B" strokeWidth="1.5" />
      <g transform="translate(112 12)">
        <rect width="276" height="196" rx="5" fill="#0F2219" />
        {[[140, 0.5], [110, 0.35], [80, 0.25]].map(([y, o], i) => (
          <path key={i} d={`M0 ${y} Q60 ${y - 30} 120 ${y - 12} T276 ${y - 44}`} stroke={`rgba(196,154,108,${o})`} />
        ))}
        <path d="M30 20 L90 30 L84 80 L22 70Z M170 44 L240 50 L232 100 L160 94Z" stroke="#A3D16B" strokeOpacity=".7" fill="rgba(163,209,107,.06)" />
        <path className="viz-pulse" d="M100 34 L160 40 L150 92 L92 84Z" fill="rgba(233,162,59,.3)" stroke="#E9A23B" />
        <rect x="150" y="110" width="110" height="64" rx="4" fill="#0B1A14" stroke="rgba(237,230,214,.25)" />
        <rect x="160" y="122" width="50" height="5" rx="2.5" fill="#EDE6D6" fillOpacity=".6" />
        <rect x="160" y="136" width="86" height="4" rx="2" fill="rgba(237,230,214,.2)" />
        <rect x="160" y="148" width="70" height="4" rx="2" fill="rgba(237,230,214,.2)" />
        <line x1="125" y1="62" x2="150" y2="110" stroke="#E9A23B" strokeDasharray="3 3" />
      </g>
    </svg>
  ),
  mobile: (
    <svg viewBox="0 0 300 90" fill="none">
      <rect x="110" y="2" width="80" height="86" rx="12" stroke="rgba(237,230,214,.3)" />
      <circle className="viz-ping" cx="150" cy="38" r="14" stroke="#E9A23B" />
      <circle cx="150" cy="38" r="4" fill="#E9A23B" />
      <rect x="124" y="62" width="52" height="6" rx="3" fill="rgba(237,230,214,.25)" />
      <path className="viz-dash" d="M20 45h70M210 45h70" stroke="rgba(237,230,214,.35)" strokeDasharray="4 5" />
      <circle cx="20" cy="45" r="4" fill="#A3D16B" />
      <circle cx="280" cy="45" r="4" fill="#A3D16B" />
    </svg>
  ),
  flight: (
    <svg viewBox="0 0 300 90" fill="none">
      <path id="pf-path" className="viz-dash" d="M20 10h260v14H20v14h260v14H20v14h260v14H20" stroke="#E9A23B" strokeWidth="1.4" strokeDasharray="5 4" />
      <circle r="4" fill="#EDE6D6">
        <animateMotion dur="9s" repeatCount="indefinite" path="M20 10h260v14H20v14h260v14H20v14h260v14H20" />
      </circle>
    </svg>
  ),
  change: (
    <svg viewBox="0 0 300 90" fill="none">
      <rect x="10" y="10" width="130" height="70" rx="4" fill="#132019" stroke="rgba(237,230,214,.2)" />
      <rect x="160" y="10" width="130" height="70" rx="4" fill="#132019" stroke="rgba(237,230,214,.2)" />
      <rect x="40" y="30" width="30" height="24" stroke="rgba(237,230,214,.5)" />
      <rect x="190" y="30" width="30" height="24" stroke="rgba(237,230,214,.5)" />
      <rect className="viz-pulse" x="232" y="24" width="38" height="36" fill="rgba(233,162,59,.25)" stroke="#E9A23B" />
    </svg>
  ),
  api: (
    <svg viewBox="0 0 300 90" fill="none">
      <circle className="viz-ping" cx="150" cy="45" r="18" stroke="#A3D16B" />
      <circle cx="150" cy="45" r="5" fill="#A3D16B" />
      <path className="viz-dash" d="M132 45H40M168 45h92M150 27V5M150 63v22" stroke="rgba(237,230,214,.4)" strokeDasharray="3 4" />
      <g fill="#EDE6D6"><circle cx="40" cy="45" r="4" /><circle cx="260" cy="45" r="4" /><circle cx="150" cy="5" r="4" /><circle cx="150" cy="85" r="4" /></g>
    </svg>
  ),
};

export default function Platforms() {
  return (
    <section className="section tight-top platforms" id="platforms">
      <div className="wrap">
        <SectionHead eyebrow="Our software" title="Tools we built" serif="because we needed them." />
        <div className="plat-grid">
          {platforms.map((p, i) => (
            <Reveal key={p.tag} delay={(i % 3) * 0.08} className={p.big ? "plat-cell big" : "plat-cell"}>
              <TiltCard className={`plat ${p.big ? "big" : ""}`}>
                <span className="tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <div className="viz">{Viz[p.viz]}</div>
                {p.big && <a className="more" href="#contact">Request a demo →</a>}
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
