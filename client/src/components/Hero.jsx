import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { heroWords } from "../data/content.js";
import "./Hero.css";

const TerrainScene = lazy(() => import("./TerrainScene.jsx"));

const ease = [0.2, 0.8, 0.2, 1];
const line = (i) => ({
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 1, delay: 0.1 + i * 0.12, ease } },
});

function useTelemetry() {
  const [t, setT] = useState({ alt: 100.0, spd: 9.8, gsd: 2.74, photos: 312, batt: 86, sats: 18 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((o) => ({
        alt: +(100 + (Math.random() - 0.5) * 0.8).toFixed(1),
        spd: +(9.6 + Math.random() * 0.6).toFixed(1),
        gsd: +(2.72 + Math.random() * 0.05).toFixed(2),
        photos: o.photos + 1,
        batt: o.batt <= 22 ? 98 : o.batt - (Math.random() < 0.35 ? 1 : 0),
        sats: 17 + Math.round(Math.random() * 3),
      }));
    }, 1200);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Hero({ ready }) {
  const [w, setW] = useState(0);
  const tel = useTelemetry();

  useEffect(() => {
    const id = setInterval(() => setW((i) => (i + 1) % heroWords.length), 2400);
    return () => clearInterval(id);
  }, []);

  const anim = ready ? "show" : "hidden";

  return (
    <section className="hero">
      <div className="hero-canvas">
        <Suspense fallback={null}>
          <TerrainScene />
        </Suspense>
      </div>
      <div className="hero-veil" />

      {/* small map furniture: north arrow + scale bar */}
      <div className="hero-legend" aria-hidden="true">
        <svg viewBox="0 0 34 46" width="22">
          <path d="M17 2 L25 30 L17 24 L9 30 Z" fill="#E9A23B" />
          <text x="17" y="44" textAnchor="middle" fill="#F1EBD8" fontFamily="JetBrains Mono" fontSize="10">N</text>
        </svg>
        <div className="scalebar">
          <div><i /><i /><i /><i /></div>
          <span>0</span><span>250</span><span>500 m</span>
        </div>
      </div>

      <div className="wrap hero-inner">
        <motion.span className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 0.1 }}>
          GIS · Survey · Drone · Web &amp; Mobile GIS · Analytics
        </motion.span>
        <h1 className="hero-title">
          <span className="ln"><motion.span variants={line(0)} initial="hidden" animate={anim}>Ground truth,</motion.span></span>
          <span className="ln">
            <motion.span variants={line(1)} initial="hidden" animate={anim}>
              <span className="serif">mapped</span> for
            </motion.span>
          </span>
          <span className="ln rot">
            <motion.span variants={line(2)} initial="hidden" animate={anim} className="rot-inner" aria-live="polite">
              {/* all words stacked in one grid cell; the active one slides in, the rest slide out */}
              {heroWords.map((word, i) => (
                <motion.span
                  key={word}
                  className="rot-word"
                  aria-hidden={i !== w}
                  initial={false}
                  animate={{ y: i === w ? "0%" : i < w ? "-105%" : "105%", opacity: i === w ? 1 : 0 }}
                  transition={{ duration: 0.6, ease }}
                >
                  {word}.
                </motion.span>
              ))}
            </motion.span>
          </span>
        </h1>
        <motion.p className="hero-lede" initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.9 }}>
          Spatial Pioneer captures the world with survey-grade accuracy — by GNSS, total station and drone — and turns it into living maps,
          web &amp; mobile GIS apps and analytics your teams can act on.
        </motion.p>
        <motion.div className="hero-cta" initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.65, duration: 0.9 }}>
          <a href="#planner" className="btn btn-hivis">Plan a drone mission <span className="arr">→</span></a>
          <a href="#services" className="btn btn-ghost">Explore services</a>
        </motion.div>
      </div>

      <motion.aside className="telemetry" initial={{ opacity: 0, x: 30 }} animate={ready ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.9, duration: 0.9 }} aria-label="Live drone telemetry (demo)">
        <div className="tel-head"><span className="live">IN FLIGHT</span> Drone survey · demo</div>
        <dl>
          <div><dt>ALT AGL</dt><dd>{tel.alt.toFixed(1)}<small>m</small></dd></div>
          <div><dt>SPEED</dt><dd>{tel.spd.toFixed(1)}<small>m/s</small></dd></div>
          <div><dt>GSD</dt><dd>{tel.gsd.toFixed(2)}<small>cm</small></dd></div>
          <div><dt>PHOTOS</dt><dd>{tel.photos}</dd></div>
          <div><dt>GNSS</dt><dd>{tel.sats}<small>sats</small></dd></div>
          <div><dt>BATT</dt><dd>{tel.batt}<small>%</small></dd></div>
        </dl>
        <div className="batt"><i style={{ width: `${tel.batt}%` }} /></div>
      </motion.aside>

      <a href="#log" className="scroll-cue" aria-label="Scroll down">
        <span>SCROLL</span>
        <i />
      </a>
    </section>
  );
}
