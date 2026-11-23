import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal.jsx";
import { faqs } from "../data/content.js";
import "./FAQ.css";

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section bordered faq">
      <div className="wrap faq-grid">
        <Reveal>
          <span className="eyebrow">FAQ</span>
          <h2 className="title">Common <span className="serif">questions.</span></h2>
          <p className="lede">Can't find yours? Ask us directly — a surveyor, not a salesperson, will answer.</p>
        </Reveal>
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div key={f.q} className={`faq-item ${open === i ? "open" : ""}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span>{f.q}</span>
                <i aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} style={{ overflow: "hidden" }}>
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
