// Tabs sliding, adapted from transitions.dev. See Transitions.LICENSE.
import { useLayoutEffect, useRef } from "react";

export function SlidingIndicator({ selected }: { selected: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const initial = useRef(true);
  useLayoutEffect(() => {
    const pill = ref.current;
    const bar = pill?.parentElement;
    if (!pill || !bar) return;
    let active = true;
    const move = (animate: boolean) => {
      const button = bar.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
      if (!button) return;
      if (!animate) pill.style.transition = "none";
      pill.style.transform = `translate(${button.offsetLeft}px, ${button.offsetTop}px)`;
      pill.style.width = `${button.offsetWidth}px`;
      pill.style.height = `${button.offsetHeight}px`;
      bar.setAttribute("data-tabs-ready", "");
      if (!animate) { void pill.offsetWidth; pill.style.transition = ""; }
    };
    move(!initial.current);
    initial.current = false;
    const observer = new ResizeObserver(() => move(false));
    observer.observe(bar);
    bar.querySelectorAll("button").forEach(button => observer.observe(button));
    document.fonts?.ready.then(() => { if (active) move(false); });
    return () => { active = false; observer.disconnect(); };
  }, [selected]);
  return <span ref={ref} className="t-tabs-pill" aria-hidden="true" />;
}
