import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
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
type HeroPhase = "industrial" | "business";
let homeOpened = false;

const getConnection = () => (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
const prefersStillHero = () => window.matchMedia(reducedMotionQuery).matches || Boolean(getConnection()?.saveData);

function Hero() {
  const hero = useRef<HTMLElement>(null);
  const opening = useRef<HTMLDivElement>(null);
  const industrialVideo = useRef<HTMLVideoElement>(null);
  const businessVideo = useRef<HTMLVideoElement>(null);
  const [firstVisit] = useState(() => {
    const section = new URLSearchParams(location.hash.split("?")[1]).get("secao");
    return !homeOpened && (!section || section === "topo");
  });
  const [still, setStill] = useState(prefersStillHero);
  const [showOpening, setShowOpening] = useState(firstVisit && !still);
  const [phase, setPhase] = useState<HeroPhase>(showOpening ? "industrial" : "business");
  const [industrialFrame, setIndustrialFrame] = useState(false);
  const [businessFrame, setBusinessFrame] = useState(false);

  useGSAP(() => {
    homeOpened = true;
    if (!showOpening || !opening.current) return;
    const compact = window.matchMedia("(max-width: 760px)").matches;
    gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: () => setShowOpening(false) })
      .fromTo(".sv-hero-opening-brand", { opacity: .72, y: 5 }, { opacity: 0, y: -7, duration: .32 }, 0)
      .fromTo(".sv-hero-opening-photo", { scale: 1.035 }, { scale: 1, duration: .76 }, 0)
      .to(opening.current, { opacity: 0, duration: .64 }, .08)
      .fromTo("h1 > span", {
        y: compact ? 16 : 30,
        opacity: .68,
        clipPath: "inset(0 0 27% 0)",
      }, {
        y: 0,
        opacity: 1,
        clipPath: "inset(0 0 0% 0)",
        duration: .63,
        stagger: .12,
        ease: "power3.out",
      }, .04)
      .fromTo(".sv-hero-description", { opacity: .8, y: 12 }, { opacity: 1, y: 0, duration: .56 }, .12);
  }, { scope: hero, dependencies: [showOpening], revertOnUpdate: true });

  useEffect(() => {
    const preference = window.matchMedia(reducedMotionQuery);
    const connection = getConnection();
    const updatePreference = () => {
      const useStill = prefersStillHero();
      setStill(useStill);
      if (useStill) {
        setShowOpening(false);
        setPhase("business");
      }
    };
    preference.addEventListener("change", updatePreference);
    connection?.addEventListener("change", updatePreference);
    return () => {
      preference.removeEventListener("change", updatePreference);
      connection?.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    const section = hero.current;
    const business = businessVideo.current;
    const video = phase === "business" ? business : industrialVideo.current;
    if (!section || !video || !business || still) return;

    let active = true;
    let onScreen = false;
    let playBlocked = false;
    const sync = () => {
      if (!active) return;
      if (document.hidden || !onScreen || playBlocked) {
        video.pause();
        return;
      }
      if (video.error || video.ended) {
        if (phase === "industrial") setPhase("business");
        return;
      }
      if (!video.hasAttribute("src")) video.src = phase === "business" ? businessFilm : heroFilm;
      video.play().catch((error) => {
        if (!active || error.name === "AbortError") return;
        playBlocked = true;
        if (phase === "industrial") setPhase("business");
        else setBusinessFrame(false);
      });
    };
    const observer = new IntersectionObserver((entries) => {
      onScreen = entries[0].intersectionRatio >= 0.15;
      sync();
    }, { threshold: 0.15 });
    observer.observe(section);
    document.addEventListener("visibilitychange", sync);
    return () => {
      active = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [phase, still]);

  return (
    <section ref={hero} className="sv-hero" data-hero-phase={phase} data-hero-still={still || undefined} aria-labelledby="public-title">
      <div className="sv-hero-media" aria-hidden="true">
        <img src={heroPoster} alt="" width={1920} height={1080} />
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
        <img className="sv-hero-business-poster" src={businessPoster} alt="" width={1920} height={1080} />
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
        {showOpening && (
          <div ref={opening} className="sv-hero-opening">
            <img
              className="sv-hero-opening-photo"
              src={openingPhoto}
              width={1600}
              height={1200}
              alt=""
              fetchPriority="high"
              onLoad={(event) => event.currentTarget.setAttribute("data-ready", "")}
            />
            <div className="sv-hero-opening-brand">
              <img src="./src/assets/brand/raposa.svg" width={96} height={96} alt="" />
              <span>SIVI</span>
            </div>
          </div>
        )}
      </div>
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
