import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { SectionHead } from "./Reveal.jsx";
import { steps } from "../data/content.js";
import "./Process.css";

/** Vertical route that draws itself as you scroll; each waypoint lights up as the line reaches it. */
export default function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setActive(p <= 0.02 ? -1 : Math.min(steps.length - 1, Math.floor(p * steps.length)))
  );

  return (
    <section className="section bordered process" id="process">
      <div className="wrap">
        <SectionHead eyebrow="How we work" title="From site visit" serif="to finished map." lede="Five clear steps. You get an accuracy report with every delivery, so you always know how good the data is." />

        <div className="route" ref={ref}>
          <svg className="route-line" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true">
            <path d="M20 0 C 36 120, 4 240, 20 360 S 36 600, 20 720 S 4 900, 20 1000" stroke="rgba(237,230,214,.15)" strokeWidth="2" fill="none" strokeDasharray="6 8" vectorEffect="non-scaling-stroke" />
            <motion.path d="M20 0 C 36 120, 4 240, 20 360 S 36 600, 20 720 S 4 900, 20 1000" stroke="#E9A23B" strokeWidth="2.5" fill="none" style={{ pathLength: draw }} vectorEffect="non-scaling-stroke" />
          </svg>
          {steps.map((s, i) => (
            <div key={s.n} className={`wp ${i <= active ? "on" : ""} ${i % 2 ? "right" : ""}`}>
              <div className="wp-pin">{s.n}</div>
              <div className="wp-card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <div className="out">→ {s.out}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
