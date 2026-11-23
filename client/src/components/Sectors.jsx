import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHead } from "./Reveal.jsx";
import Icon from "./Icons.jsx";
import { sectors } from "../data/content.js";
import "./Sectors.css";

export default function Sectors() {
  const [i, setI] = useState(0);
  const s = sectors[i];
  return (
    <section className="section bordered sectors" id="sectors">
      <div className="wrap">
        <SectionHead eyebrow="Industries" title="Who uses" serif="our maps." />
        <div className="sec">
          <div className="sec-tabs" role="tablist">
            {sectors.map((x, k) => (
              <button key={x.id} role="tab" aria-selected={k === i} className={k === i ? "on" : ""} onClick={() => setI(k)} onMouseEnter={() => setI(k)}>
                <span className="n">{String(k + 1).padStart(2, "0")}</span>
                <span className="name">{x.name}</span>
                <span className="arr">→</span>
              </button>
            ))}
          </div>
          <div className="sec-panel">
            <AnimatePresence mode="wait">
              <motion.div key={s.id} className="sec-content" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <motion.div className="sec-glyph" initial={{ rotate: -90, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }}>
                  <Icon name={s.glyph} size={40} />
                </motion.div>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
                <ul>{s.uses.map((u) => <li key={u}>{u}</li>)}</ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
