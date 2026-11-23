import Logo from "./Logo.jsx";
import Reveal from "./Reveal.jsx";
import { company, services } from "../data/content.js";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <Reveal className="careers">
          <div>
            <span className="eyebrow">Careers</span>
            <h3>Surveyors, GIS analysts, pilots &amp; developers — <span className="serif">join the crew.</span></h3>
          </div>
          <a href={`mailto:${company.email}?subject=Careers`} className="btn btn-hivis">See open roles <span className="arr">→</span></a>
        </Reveal>

        <div className="foot-big" aria-hidden="true">Spatial <span className="serif">Pioneer</span></div>

        <div className="foot-grid">
          <div className="about">
            <a href="#top" className="logo"><Logo /> {company.name}</a>
            <p>GIS, survey, drone mapping, web &amp; mobile GIS and spatial analytics — from field capture to decision-ready insight.</p>
          </div>
          <div>
            <h5>SERVICES</h5>
            <ul>{services.map((s) => <li key={s.code}><a href="#services">{s.name} {s.em}</a></li>)}</ul>
          </div>
          <div>
            <h5>COMPANY</h5>
            <ul>
              <li><a href="#process">Process</a></li>
              <li><a href="#sectors">Sectors</a></li>
              <li><a href="#planner">Mission planner</a></li>
            </ul>
          </div>
          <div>
            <h5>CONTACT</h5>
            <ul>
              <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><a href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a></li>
              {company.socials.map((s) => <li key={s.label}><a href={s.href}>{s.label}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
          <span>DATUM WGS84 · UTM 44N · SHEET 01/01</span>
        </div>
      </div>
    </footer>
  );
}
