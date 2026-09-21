import { animate } from "../vendor/anime.esm.min.js";

export const wait = (duration) =>
  new Promise((resolve) => window.setTimeout(resolve, duration));

export function runAnimation(target, options) {
  if (!target) return Promise.resolve();

  return new Promise((resolve) => {
    const { signal, ...animationOptions } = options;
    if (signal?.aborted) {
      resolve();
      return;
    }
    let settled = false;
    let cancel = () => {};
    const finish = () => {
      if (settled) return;
      settled = true;
      signal?.removeEventListener("abort", cancel);
      resolve();
    };
    const animation = animate(target, { ...animationOptions, onComplete: finish });
    cancel = () => {
      animation.cancel();
      finish();
    };
    signal?.addEventListener("abort", cancel, { once: true });
  });
}

