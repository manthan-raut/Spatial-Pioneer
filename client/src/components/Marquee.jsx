import { marquee } from "../data/content.js";
import "./Marquee.css";

export default function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((m, i) => (
          <span key={i} className={i % 2 ? "serif" : ""}>{m}</span>
        ))}
      </div>
    </div>
  );
}
