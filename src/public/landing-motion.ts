import { useEffect, type RefObject } from "react";

export function useLandingMotion(root: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const landing = root.current;
    if (!landing) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const homeHero = landing.querySelector(".sv-hero");
    const header = landing.querySelector(".sv-header");
    let lastY = window.scrollY;
    let frame = 0;

    function updateHeader() {
      if (!landing) return;
      frame = 0;
      if (homeHero && header) {
        const pastHero = homeHero.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom;
        landing.toggleAttribute("data-header-solid", pastHero);
        return;
      }
      const y = Math.max(0, window.scrollY);
      const solid = y > 72;
      landing.toggleAttribute("data-header-solid", solid);
      if (y <= 168 || reduced.matches) {
        landing.removeAttribute("data-header-hidden");
        lastY = y;
      } else if (Math.abs(y - lastY) >= 5) {
        landing.toggleAttribute("data-header-hidden", y > lastY);
        lastY = y;
      }
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(updateHeader);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (homeHero) window.addEventListener("resize", onScroll);
    reduced.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      if (homeHero) window.removeEventListener("resize", onScroll);
      reduced.removeEventListener("change", onScroll);
    };
  }, [root]);
}
