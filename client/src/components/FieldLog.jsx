import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import Reveal, { SectionHead } from "./Reveal.jsx";
import { stats } from "../data/content.js";
import "./FieldLog.css";

export function Counter({ to, duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease: [0.2, 0.8, 0.2, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, duration]);
  return <span ref={ref}>{v.toLocaleString("en-IN")}</span>;
}

export default function FieldLog() {
  return (
    <section className="section" id="log">
      <div className="wrap">
        <SectionHead eyebrow="Our work in numbers" title="Measured," serif="not estimated.">
          <p className="lede" style={{ marginTop: 0, maxWidth: 420 }}>
            Every number below comes from our own field books. Our teams have walked, flown and modelled it — and we sign our name to the accuracy.
          </p>
        </SectionHead>
        <div className="log-grid">
          {stats.map((s, i) => (
            <Reveal key={s.k} delay={i * 0.08} className="stat">
              <div className="k">{s.k}</div>
              <div className="v">
                <Counter to={s.value} />
                <sup>{s.suffix}</sup>
              </div>
              <p>{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
