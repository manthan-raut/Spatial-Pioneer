import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { SectionHead } from "./Reveal.jsx";
import Reveal from "./Reveal.jsx";
import { BASE, lawnmower, mulberry, ringPath } from "../lib/geo.js";
import "./LayerLab.css";

const LAYERS = [
  { id: "drone", label: "Drone", sw: "#E9A23B", on: true },
  { id: "survey", label: "Survey points", sw: "#EDE6D6", on: true },
  { id: "parcel", label: "Land parcels", sw: "#A3D16B", on: true },
  { id: "contour", label: "Terrain contours", sw: "#C49A6C", on: false },
  { id: "heat", label: "Analysis heatmap", sw: "#E9A23B", on: false },
  { id: "ortho", label: "Aerial photo", sw: "#5DB7DE", on: true },
];

/** Interactive GIS "table of contents" demo — toggle layers like in QGIS. */
export default function LayerLab() {
  const [on, setOn] = useState(() => Object.fromEntries(LAYERS.map((l) => [l.id, l.on])));
  const [hud, setHud] = useState(`${BASE.lat.toFixed(5)}°N ${BASE.lon.toFixed(5)}°E · Z 312.4m`);
  const [cross, setCross] = useState(null);
  const svgRef = useRef();
  const pathRef = useRef();
  const droneRef = useRef();

  const inView = useInView(svgRef, { amount: 0.2 });

  // one real aerial-imagery tile (Esri World Imagery, z17) as the photo layer — swap for your own orthomosaic
  const orthoUrl = useMemo(() => {
    const z = 17, lat = 21.1255, lon = 79.0395, n = 2 ** z, r = (lat * Math.PI) / 180;
    const x = Math.floor(((lon + 180) / 360) * n), y = Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n);
    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
  }, []);

  const data = useMemo(() => {
    const rnd = mulberry(7);
    const parcels = [];
    for (let r = 0; r < 6; r++)
      for (let c = 0; c < 6; c++) {
        const x0 = 40 + c * 72 + r * 6, y0 = 60 + r * 66 - c * 4;
        const j = () => (rnd() - 0.5) * 10;
        parcels.push([x0 + j(), y0 + j(), x0 + 64 + j(), y0 + 2 + j(), x0 + 60 + j(), y0 + 60 + j(), x0 - 2 + j(), y0 + 58 + j()].map((v) => v.toFixed(1)).join(" "));
      }
    const contours = [];
    [[180, 190, 0.4, 10], [370, 350, 2.3, 7]].forEach(([cx, cy, s, n]) => {
      for (let k = 1; k <= n; k++) contours.push({ d: ringPath(cx, cy, k * 19, s + k * 0.2), major: k % 4 === 0 });
    });
    return { parcels, contours, flight: lawnmower(60, 120, 380, 252, 7) };
  }, []);

  // animate drone along its (hidden) path — only while the map is on screen
  useEffect(() => {
    if (!inView) return;
    const path = pathRef.current;
    const len = path.getTotalLength();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf, t0;
    const tick = (ts) => {
      t0 ??= ts;
      const prog = ((ts - t0) / 30000) % 1;
      const pt = path.getPointAtLength(prog * len);
      const ahead = path.getPointAtLength(Math.min(len, prog * len + 2));
      const yaw = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI + 90;
      droneRef.current?.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${yaw.toFixed(1)})`);
      raf = requestAnimationFrame(tick);
    };
    if (reduce) {
      const pt = path.getPointAtLength(len * 0.4);
      droneRef.current?.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    } else raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const onMove = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 500, y = ((e.clientY - r.top) / r.height) * 500;
    setCross([x, y]);
    const lat = BASE.lat + (250 - y) * 0.00004, lon = BASE.lon + (x - 250) * 0.00004;
    const z = 312 + Math.max(0, 60 - Math.hypot(x - 180, y - 190) * 0.3);
    setHud(`${lat.toFixed(5)}°N ${lon.toFixed(5)}°E · Z ${z.toFixed(1)}m`);
  };

  const cls = (id) => `layer ${on[id] ? "" : "off"}`;

  return (
    <section className="section bordered layerlab">
      <div className="wrap ll-grid">
        <div>
          <SectionHead eyebrow="How a GIS map is built" title="One map," serif="many layers." lede="A GIS map is a stack of layers — aerial photo, survey points, land parcels, terrain and analysis — all lined up on the same coordinates. Switch them on and off to see how they fit together." />
          <Reveal delay={0.15} className="ll-notes">
            <div><b>±1.8 cm</b><span>Survey accuracy</span></div>
            <div><b>2.1 cm</b><span>Photo detail per pixel</span></div>
            <div><b>UTM 44N</b><span>Standard map coordinates</span></div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="console">
          <div className="console-bar">
            <div className="dots"><i /><i /><i /></div>
            <span>Map viewer · interactive demo</span>
            <span className="live">DEMO</span>
          </div>
          <div className="console-body">
            <div className="map-stage" onMouseMove={onMove} onMouseLeave={() => setCross(null)}>
              <svg ref={svgRef} viewBox="0 0 500 500" aria-label="Demo map with toggleable GIS layers">
                <defs>
                  <radialGradient id="ll-heatG"><stop offset="0" stopColor="#E9A23B" stopOpacity=".85" /><stop offset=".45" stopColor="#E9A23B" stopOpacity=".35" /><stop offset="1" stopColor="#E9A23B" stopOpacity="0" /></radialGradient>
                  <radialGradient id="ll-heatY"><stop offset="0" stopColor="#A3D16B" stopOpacity=".7" /><stop offset="1" stopColor="#A3D16B" stopOpacity="0" /></radialGradient>
                </defs>
                <g>
                  {Array.from({ length: 11 }, (_, i) => (
                    <g key={i} stroke="#EDE6D6" strokeOpacity=".07">
                      <line x1={i * 50} y1="0" x2={i * 50} y2="500" />
                      <line x1="0" y1={i * 50} x2="500" y2={i * 50} />
                    </g>
                  ))}
                </g>
                <g className={cls("ortho")}><image href={orthoUrl} x="0" y="0" width="500" height="500" preserveAspectRatio="xMidYMid slice" opacity=".85" /></g>
                <g className={cls("contour")}>
                  {data.contours.map((c, i) => (
                    <path key={i} d={c.d} fill="none" stroke="#C49A6C" strokeOpacity={c.major ? 0.85 : 0.4} strokeWidth={c.major ? 1.3 : 0.8} />
                  ))}
                  <text x="183" y="194" fill="#C49A6C" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle">342</text>
                </g>
                <g className={cls("parcel")}>
                  {data.parcels.map((pts, i) => {
                    const hl = i === 14 || i === 21;
                    return <polygon key={i} points={pts} fill={hl ? "rgba(233,162,59,.22)" : "rgba(163,209,107,.04)"} stroke={hl ? "#E9A23B" : "#A3D16B"} strokeOpacity={hl ? 1 : 0.45} strokeWidth={hl ? 1.4 : 0.8} />;
                  })}
                  <path d="M0 330 C120 300 200 360 310 300 S 460 250 500 260" fill="none" stroke="#EDE6D6" strokeOpacity=".5" strokeWidth="6" />
                  <path d="M0 330 C120 300 200 360 310 300 S 460 250 500 260" fill="none" stroke="#0B1A14" strokeWidth="3.5" />
                </g>
                <g className={cls("heat")} style={{ mixBlendMode: "screen" }}>
                  <circle cx="160" cy="180" r="120" fill="url(#ll-heatG)" />
                  <circle cx="380" cy="330" r="100" fill="url(#ll-heatG)" />
                  <circle cx="300" cy="110" r="70" fill="url(#ll-heatY)" />
                  <circle cx="90" cy="400" r="80" fill="url(#ll-heatY)" />
                </g>
                <g className={cls("survey")}>
                  {[[70, 80, "CP-01"], [430, 70, "CP-02"], [250, 250, "BM-03"], [80, 440, "CP-04"], [440, 430, "CP-05"]].map(([x, y, t]) => (
                    <g key={t}>
                      <circle cx={x} cy={y} r="11" fill="none" stroke="#EDE6D6" strokeOpacity=".35" strokeDasharray="2 2" />
                      <path d={`M${x} ${y - 7} L${x + 6} ${y + 4} L${x - 6} ${y + 4}Z`} fill="#0B1A14" stroke="#EDE6D6" strokeWidth="1.3" />
                      <circle cx={x} cy={y} r="1.4" fill="#EDE6D6" />
                      <text x={x + 14} y={y + 3} fill="#EDE6D6" fontFamily="JetBrains Mono" fontSize="9">{t}</text>
                    </g>
                  ))}
                </g>
                <g className={cls("drone")}>
                  <path ref={pathRef} d={data.flight} fill="none" stroke="none" />
                  {/* top-down quadcopter with soft ground shadow */}
                  <g ref={droneRef}>
                    <ellipse cx="6" cy="8" rx="20" ry="18" fill="rgba(0,0,0,.28)" />
                    {[[-13, -13], [13, -13], [-13, 13], [13, 13]].map(([x, y], i) => (
                      <g key={i}>
                        <line x1="0" y1="0" x2={x} y2={y} stroke="#2A2E32" strokeWidth="3.2" strokeLinecap="round" />
                        <circle cx={x} cy={y} r="9" fill="rgba(220,226,230,.22)" stroke="rgba(220,226,230,.5)" strokeWidth=".6" />
                        <circle cx={x} cy={y} r="2.2" fill="#1D2023" />
                      </g>
                    ))}
                    <rect x="-6" y="-8" width="12" height="16" rx="3.5" fill="#D8DCDF" stroke="#3A3F44" strokeWidth="1" />
                    <circle cx="0" cy="-9" r="2" fill="#111" />
                    <circle cx="-13" cy="-13" r="1.6" fill="#FF3B30" />
                    <circle cx="13" cy="-13" r="1.6" fill="#34C759" />
                  </g>
                </g>
                {/* chrome */}
                <g transform="translate(462 40)">
                  <circle r="17" fill="rgba(11,26,20,.8)" stroke="#EDE6D6" strokeOpacity=".4" />
                  <path d="M0 -12 L5 4 L0 1 L-5 4Z" fill="#E9A23B" />
                  <text y="13" fill="#EDE6D6" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle">N</text>
                </g>
                <g transform="translate(380 482)" fontFamily="JetBrains Mono" fontSize="8" fill="#EDE6D6">
                  <rect width="40" height="5" fill="#EDE6D6" />
                  <rect x="40" width="40" height="5" fill="none" stroke="#EDE6D6" />
                  <text y="-4">0</text>
                  <text x="80" y="-4" textAnchor="end">200 m</text>
                </g>
                {cross && (
                  <g stroke="#E9A23B" strokeOpacity=".6" strokeWidth=".8">
                    <line x1={cross[0]} x2={cross[0]} y1="0" y2="500" />
                    <line y1={cross[1]} y2={cross[1]} x1="0" x2="500" />
                  </g>
                )}
              </svg>
              <div className="map-hud">{hud}</div>
            </div>
            <div className="toc">
              <h4>LAYERS</h4>
              {LAYERS.map((l) => (
                <label key={l.id}>
                  <input type="checkbox" checked={on[l.id]} style={{ "--sw": l.sw }} onChange={(e) => setOn((o) => ({ ...o, [l.id]: e.target.checked }))} />
                  {l.label}
                </label>
              ))}
              <div className="meta">CRS EPSG:32644<br />GSD 2.1 cm/px<br />RMSE ±1.8 cm</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
