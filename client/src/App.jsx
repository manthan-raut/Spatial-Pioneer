import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import FieldLog from "./components/FieldLog.jsx";
import Services from "./components/Services.jsx";
import PersonaRouter from "./components/PersonaRouter.jsx";
import SwipeCompare from "./components/SwipeCompare.jsx";
import LayerLab from "./components/LayerLab.jsx";
import MissionPlanner from "./components/MissionPlanner.jsx";
import Process from "./components/Process.jsx";
import Platforms from "./components/Platforms.jsx";
import Sectors from "./components/Sectors.jsx";
import Why from "./components/Why.jsx";
import FAQ from "./components/FAQ.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

// Section order follows how a client reads the page:
// what you do → proof → who it's for → see it work → how → where → why → questions → contact.
export default function App() {
  // play the hero intro right after first paint (no blocking preloader)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <Navbar />
      <main id="top">
        <Hero ready={ready} />
        <Marquee />
        <Services />
        <FieldLog />
        <PersonaRouter />
        <SwipeCompare />
        <LayerLab />
        <MissionPlanner />
        <Process />
        <Sectors />
        <Platforms />
        <Why />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
