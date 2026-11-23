import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHead } from "./Reveal.jsx";
import { personas } from "../data/content.js";
import "./PersonaRouter.css";

export default function PersonaRouter() {
  const [id, setId] = useState(personas[0].id);
  const p = personas.find((x) => x.id === id);

  return (
    <section className="section persona">
      <div className="wrap">
        <SectionHead eyebrow="Who we help" title="I am a" serif="…" lede="Pick the option closest to you. We'll show the usual problem, how we solve it and what you get at the end." />

        <div className="persona-tabs" role="tablist">
          {personas.map((x) => (
            <button key={x.id} role="tab" aria-selected={x.id === id} className={x.id === id ? "on" : ""} onClick={() => setId(x.id)}>
              {x.id === id && <motion.span layoutId="persona-pill" className="pill" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="txt">{x.label}</span>
            </button>
          ))}
        </div>

        <div className="persona-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={p.id}
              className="persona-grid"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="pc challenge">
                <h5>THE CHALLENGE</h5>
                <p className="big">{p.challenge}</p>
              </div>
              <div className="pc pc-route">
                <h5>OUR ROUTE</h5>
                <ol>
                  {p.help.map((h, i) => (
                    <motion.li key={h} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      {h}
                    </motion.li>
                  ))}
                </ol>
              </div>
              <div className="pc out">
                <h5>YOU GET</h5>
                <div className="tags">{p.deliverables.map((d) => <span key={d}>{d}</span>)}</div>
                <div className="kpi">
                  <b>{p.kpi.v}</b>
                  <span>{p.kpi.l}</span>
                </div>
                <a href="#contact" className="btn btn-hivis">Start this route <span className="arr">→</span></a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
