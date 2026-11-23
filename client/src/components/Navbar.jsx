import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Logo from "./Logo.jsx";
import { company, nav } from "../data/content.js";
import "./Navbar.css";

export default function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // only re-renders when crossing the 30px threshold (React bails out on equal state)
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 30));

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <motion.div className="nav-progress" style={{ scaleX: scrollYProgress }} />
      <div className="wrap nav-inner">
        <a href="#top" className="logo" aria-label={`${company.name} home`}>
          <Logo />
          <span>
            {company.name}
            <small>{company.tagline}</small>
          </span>
        </a>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <a href="#contact" className="btn btn-hivis nav-cta">
            Get a quote <span className="arr">→</span>
          </a>
          <button className="menu-btn" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span className={open ? "x" : ""} />
          </button>
        </div>
      </div>
    </header>
  );
}
