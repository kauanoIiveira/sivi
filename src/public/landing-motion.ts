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

    const reveals = landing.querySelectorAll<HTMLElement>("[data-landing-reveal]");
    const reveal = (element: Element) => {
      element.removeAttribute("data-awaiting-view");
      element.setAttribute("data-in-view", "");
    };
    const observer = typeof IntersectionObserver === "function"
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            reveal(entry.target);
            observer?.unobserve(entry.target);
          }
        }, { threshold: 0.08 })
      : null;

    function syncReveals() {
      observer?.disconnect();
      for (const item of reveals) {
        if (reduced.matches || !observer) {
          item.removeAttribute("data-awaiting-view");
          item.removeAttribute("data-in-view");
          continue;
        }
        if (item.hasAttribute("data-in-view")) continue;
        if (item.getBoundingClientRect().bottom <= 0 || item.contains(document.activeElement)) {
          item.removeAttribute("data-awaiting-view");
          continue;
        }
        item.setAttribute("data-awaiting-view", "");
        observer.observe(item);
      }
      onScroll();
    }

    function onFocus(event: FocusEvent) {
      let element = (event.target as Element).closest("[data-awaiting-view]");
      while (element) {
        reveal(element);
        observer?.unobserve(element);
        element = element.parentElement?.closest("[data-awaiting-view]") ?? null;
      }
    }

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const visuals = landing.querySelectorAll<HTMLElement>("[data-landing-pointer]");
    function move(event: PointerEvent) {
      if (reduced.matches || !finePointer.matches || event.pointerType === "touch") return;
      const visual = event.currentTarget as HTMLElement;
      const bounds = visual.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      visual.style.setProperty("--pointer-x", x.toFixed(3));
      visual.style.setProperty("--pointer-y", y.toFixed(3));
    }
    function reset(event: PointerEvent) {
      const visual = event.currentTarget as HTMLElement;
      visual.style.removeProperty("--pointer-x");
      visual.style.removeProperty("--pointer-y");
    }

    for (const visual of visuals) {
      visual.addEventListener("pointermove", move);
      visual.addEventListener("pointerleave", reset);
    }
    syncReveals();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (homeHero) window.addEventListener("resize", onScroll);
    reduced.addEventListener("change", syncReveals);
    landing.addEventListener("focusin", onFocus);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      if (homeHero) window.removeEventListener("resize", onScroll);
      reduced.removeEventListener("change", syncReveals);
      landing.removeEventListener("focusin", onFocus);
      for (const visual of visuals) {
        visual.removeEventListener("pointermove", move);
        visual.removeEventListener("pointerleave", reset);
      }
    };
  }, [root]);
}
