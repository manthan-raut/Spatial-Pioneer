import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal, { SectionHead } from "./Reveal.jsx";
import Icon from "./Icons.jsx";
import { services } from "../data/content.js";
import "./Services.css";

export default function Services() {
  const [open, setOpen] = useState(null);
  return (
    <section className="section paper" id="services">
      <div className="wrap">
        <SectionHead eyebrow="What we do" title={<>Five services.<br /></>} serif="One team, start to finish.">
          <p className="lede" style={{ marginTop: 0, maxWidth: 440 }}>
            From the first survey on site to the app your team uses every day — we handle the whole job, so nothing gets lost between vendors. Click a service to see what you receive.
          </p>
        </SectionHead>

        <div className="svc-list">
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={s.code} className={`svc ${isOpen ? "open" : ""}`}>
                <button className="svc-row" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                  <span className="code">{s.code}</span>
                  <span className="svc-name">{s.name} <em>{s.em}</em></span>
                  <span className="desc">
                    {s.desc}
                    <span className="chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</span>
                  </span>
                  <span className="ico"><Icon name={s.icon} size={28} /></span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="svc-detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}
                    >
                      <div className="svc-detail-inner">
                        <div>
                          <h5>DELIVERABLES</h5>
                          <ul>{s.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
                        </div>
                        <div>
                          <h5>TYPICAL ACCURACY</h5>
                          <p>{s.accuracy}</p>
                          <h5 style={{ marginTop: 18 }}>TYPICAL TIMELINE</h5>
                          <p>{s.timeline}</p>
                        </div>
                        <a href="#contact" className="btn btn-hivis">Get a quote <span className="arr">→</span></a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
