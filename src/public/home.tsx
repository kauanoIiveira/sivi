import { useEffect, useRef, useState } from "react";
import { Action } from "./components";
import { HomeContent } from "./home-content";
import { PublicLayout } from "./public-layout";
import "./home-opening.css";
import "./home-footer.css";

const heroFilm = "./assets/home-industrial.webm";
const heroPoster = "./assets/home-industrial-poster.webp";
const businessFilm = "./assets/home-b2b.webm";
const businessPoster = "./assets/home-b2b-poster.webp";
const openingPhoto = "./assets/home-hero-opening.webp";
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
type HeroPhase = "opening" | "industrial" | "business";
let homeOpened = false;

function prefersStillHero() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia(reducedMotionQuery).matches || Boolean(connection?.saveData);
}

function Hero() {
  const hero = useRef<HTMLElement>(null);
  const industrialVideo = useRef<HTMLVideoElement>(null);
  const businessVideo = useRef<HTMLVideoElement>(null);
  const [showOpening] = useState(() => {
    const section = new URLSearchParams(location.hash.split("?")[1]).get("secao");
    return !homeOpened && (!section || section === "topo");
  });
  const [phase, setPhase] = useState<HeroPhase>(showOpening ? "opening" : "business");
  const [openingReady, setOpeningReady] = useState(false);
  const [industrialFrame, setIndustrialFrame] = useState(false);
  const [businessFrame, setBusinessFrame] = useState(false);

  useEffect(() => {
    if (phase !== "opening") return;
    homeOpened = true;
    const timer = window.setTimeout(() => {
      setPhase(prefersStillHero() ? "business" : "industrial");
    }, openingReady ? 1150 : 2200);
    return () => window.clearTimeout(timer);
  }, [phase, openingReady]);

  useEffect(() => {
    const section = hero.current;
    const business = businessVideo.current;
    const video = phase === "business" ? business : industrialVideo.current;
    if (!section || !video || !business) return;

    const preference = window.matchMedia(reducedMotionQuery);
    let active = true;
    let onScreen = false;
    let playBlocked = false;
    const sync = () => {
      if (!active) return;
      if (prefersStillHero() || document.hidden || !onScreen || playBlocked) {
        video.pause();
        return;
      }
      if (video.error || video.ended) {
        if (phase === "industrial") setPhase("business");
        return;
      }
      if (!video.hasAttribute("src")) video.src = phase === "business" ? businessFilm : heroFilm;
      if (phase === "opening") return;

      if (phase === "industrial" && !business.hasAttribute("src")) business.src = businessFilm;
      video.play().catch((error) => {
        if (!active || error.name === "AbortError") return;
        playBlocked = true;
        if (phase === "industrial") setPhase("business");
        else setBusinessFrame(false);
      });
    };
    const updatePreference = () => {
      if (preference.matches && phase === "industrial") setPhase("business");
      sync();
    };
    const observer = new IntersectionObserver((entries) => {
      onScreen = entries[0].intersectionRatio >= 0.15;
      sync();
    }, { threshold: 0.15 });
    observer.observe(section);
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", sync);
    return () => {
      active = false;
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [phase]);

  return (
    <section ref={hero} className="sv-hero" data-hero-phase={phase} aria-labelledby="public-title">
      <div className="sv-hero-media" aria-hidden="true">
        <img src={heroPoster} alt="" width={1440} height={810} />
        <video
          ref={industrialVideo}
          className="sv-hero-industrial-video"
          muted
          playsInline
          preload="auto"
          data-playing-frame={industrialFrame || undefined}
          onPlaying={() => setIndustrialFrame(true)}
          onEnded={() => setPhase("business")}
          onError={() => {
            setIndustrialFrame(false);
            setPhase((current) => current === "industrial" ? "business" : current);
          }}
        />
        <img className="sv-hero-business-poster" src={businessPoster} alt="" width={1280} height={720} />
        <video
          ref={businessVideo}
          className="sv-hero-business-video"
          muted
          playsInline
          loop
          preload="auto"
          data-playing-frame={businessFrame || undefined}
          onPlaying={() => setBusinessFrame(true)}
          onError={() => setBusinessFrame(false)}
        />
      </div>
      {showOpening && (
        <div className="sv-hero-opening" aria-hidden="true">
          <img
            className="sv-hero-opening-photo"
            src={openingPhoto}
            width={1600}
            height={1200}
            alt=""
            fetchPriority="high"
            onLoad={() => setOpeningReady(true)}
            onError={() => setOpeningReady(true)}
          />
          <div className="sv-hero-opening-brand">
            <img src="./src/assets/brand/raposa.svg" width={96} height={96} alt="" />
            <span>SIVI</span>
          </div>
        </div>
      )}
      <div className="sv-shell sv-landing-hero">
        <div className="sv-landing-lead">
          <h1 id="public-title" tabIndex={-1}>
            <span>A indústria</span>{" "}
            <span>se conecta<span className="sv-hero-period">.</span></span>
          </h1>
          <p className="sv-hero-description">
            Marketplace B2B de compras e fornecimento industrial, da cotação ao recebimento.
          </p>
          <Action className="sv-hero-action">Cadastrar empresa</Action>
        </div>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <PublicLayout page="home">
      <Hero />
      <HomeContent />
    </PublicLayout>
  );
}
