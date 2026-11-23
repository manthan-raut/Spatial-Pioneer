import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { SectionHead } from "./Reveal.jsx";
import Reveal from "./Reveal.jsx";
import "./SwipeCompare.css";

// Real place, real tiles. Replace with your own drone orthomosaic + GIS export when available (see CLAUDE.md).
const VIEW = { lat: 21.1335, lon: 79.0445, z: 16, cols: 5, rows: 3 }; // Ambazari Lake, Nagpur (placeholder area)
const IMAGERY = (z, x, y) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
const MAP = (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;

function tileXY(lat, lon, z) {
  const n = 2 ** z, r = (lat * Math.PI) / 180;
  return [Math.floor(((lon + 180) / 360) * n), Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n)];
}

function Mosaic({ url, tiles, className, alt }) {
  return (
    <div className={`mosaic ${className}`} style={{ gridTemplateColumns: `repeat(${VIEW.cols}, 1fr)` }} role="img" aria-label={alt}>
      {tiles.map(([x, y]) => (
        <img key={`${x}-${y}`} src={url(VIEW.z, x, y)} alt="" loading="lazy" decoding="async" draggable="false" />
      ))}
    </div>
  );
}

export default function SwipeCompare() {
  const [pos, setPos] = useState(50);
  const box = useRef();
  const dragging = useRef(false);
  const inView = useInView(box, { once: true, amount: 0.5 });

  const tiles = useMemo(() => {
    const [cx, cy] = tileXY(VIEW.lat, VIEW.lon, VIEW.z);
    const out = [];
    for (let r = 0; r < VIEW.rows; r++) for (let c = 0; c < VIEW.cols; c++) out.push([cx - 2 + c, cy - 1 + r]);
    return out;
  }, []);

  // one gentle hint sweep when it first comes into view
  useEffect(() => {
    if (!inView) return;
    const c = animate(50, [50, 30, 70, 50], { duration: 2.4, ease: "easeInOut", onUpdate: setPos });
    return () => c.stop();
  }, [inView]);

  const setFromEvent = (e) => {
    const r = box.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  };

  return (
    <section className="section bordered swipe">
      <div className="wrap">
        <SectionHead
          eyebrow="From image to map"
          title="A photo shows it."
          serif="A map measures it."
          lede="Drag the slider. On the left, what a satellite or our drone sees. On the right, the same ground as a clean GIS map — every road, building and water body traced, named and measurable."
        />
        <Reveal>
          <div
            ref={box}
            className="swipe-box"
            onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); setFromEvent(e); }}
            onPointerMove={(e) => dragging.current && setFromEvent(e)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
            role="slider"
            aria-label="Compare aerial image and GIS map"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
              if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
            }}
          >
            <Mosaic url={IMAGERY} tiles={tiles} className="m-img" alt="Aerial imagery" />
            <div className="clip" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
              <Mosaic url={MAP} tiles={tiles} className="m-map" alt="GIS map of the same area" />
            </div>
            <div className="swipe-handle" style={{ left: `${pos}%` }}><span>⟷</span></div>
            <span className="swipe-tag l">AERIAL IMAGE</span>
            <span className="swipe-tag r">GIS MAP</span>
            <span className="swipe-attr">Imagery © Esri, Maxar, Earthstar Geographics · Map © OpenStreetMap contributors</span>
          </div>
        </Reveal>
        <div className="swipe-points">
          <div><b>Capture</b><span>Drone or satellite imagery, sharp to 2–5 cm per pixel.</span></div>
          <div><b>Trace</b><span>Roads, buildings, water and land parcels drawn as GIS layers.</span></div>
          <div><b>Use</b><span>Measure areas, search records, plan — on web, mobile or desktop.</span></div>
        </div>
      </div>
    </section>
  );
}
