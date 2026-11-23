import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "./Reveal.jsx";
import { credentials, why } from "../data/content.js";
import "./Why.css";

/** Animated precision dial — a needle settles on ±2 cm. */
function Dial() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div className="dial" ref={ref}>
      <svg viewBox="0 0 220 130" aria-hidden="true">
        {Array.from({ length: 31 }, (_, i) => {
          const a = Math.PI + (i / 30) * Math.PI;
          const r1 = i % 5 ? 92 : 84;
          return <line key={i} x1={110 + Math.cos(a) * r1} y1={115 + Math.sin(a) * r1} x2={110 + Math.cos(a) * 100} y2={115 + Math.sin(a) * 100} stroke="#1A1F1C" strokeWidth={i % 5 ? 1 : 2} />;
        })}
        <path d="M24 115 A86 86 0 0 1 60 45" stroke="#9A5B2E" strokeWidth="5" fill="none" />
        <motion.g style={{ originX: 0.5, originY: 1 }} initial={{ rotate: 80 }} animate={inView ? { rotate: [80, -70, -40, -58] } : {}} transition={{ duration: 2.2, ease: "easeInOut" }}>
          <line x1="110" y1="115" x2="110" y2="34" stroke="#1A1F1C" strokeWidth="2.5" />
        </motion.g>
        <circle cx="110" cy="115" r="7" fill="#1A1F1C" />
      </svg>
      <div className="dial-read"><b>±2 cm</b><span>typical RTK accuracy</span></div>
    </div>
  );
}

export default function Why() {
  return (
    <section className="section paper why">
      <div className="wrap why-grid">
        <Reveal className="why-sticky">
          <span className="eyebrow">Why choose us</span>
          <h2 className="title">Accuracy you can <span className="serif">audit.</span></h2>
          <p className="lede">We're surveyors who write software and developers who've stood in the field. That's why our deliverables hold up — in review meetings and in court.</p>
          <Dial />
          <div className="creds">{credentials.map((c) => <span key={c}>{c}</span>)}</div>
        </Reveal>
        <div>
          {why.map((w, i) => (
            <Reveal key={w.title} className="why-item" delay={i * 0.05}>
              <div className="num">{["i.", "ii.", "iii.", "iv."][i]}</div>
              <div>
                <h4>{w.title}</h4>
                <p>{w.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
