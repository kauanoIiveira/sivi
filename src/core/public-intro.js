const KEY = "sivi.public-intro.v1";
export function createPublicIntro({ storage } = {}) {
  let consumed = false;
  return {
    consume() {
      if (consumed) return false;
      consumed = true;
      try {
        if (storage?.getItem(KEY) === "seen") return false;
        storage?.setItem(KEY, "seen");
      } catch {}
      return true;
    },
  };
}
let tracker;
export function consumePublicIntro() {
  if (!tracker) {
    let storage;
    try {
      storage = window.localStorage;
    } catch {}
    tracker = createPublicIntro({ storage });
  }
  return tracker.consume();
}
