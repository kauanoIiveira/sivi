import { runAnimation, wait } from "../../utils/animation.js";

// Tempos concentrados aqui para facilitar ajustes sem procurar pelo código todo.
const MOTION = {
  compactExit: 90,
  compactEnter: 150,
  desktopTotal: 720,
  desktopContentSwap: 210,
};

export function createAuthTransitions({
  root,
  shell,
  storyPanel,
  formStage,
  compactQuery,
  reducedMotionQuery,
  onTransitionChange,
  animationSignal,
}) {
  let currentMode = shell.dataset.mode === "login" ? "login" : "register";
  let isTransitioning = false;
  let resizeFrame = 0;
  let compactHeightFrame = 0;
  let active = true;

  function getView(mode) {
    return [...root.querySelectorAll("[data-view]")].find((view) => view.dataset.view === mode);
  }

  function getStory(mode) {
    return [...root.querySelectorAll("[data-story]")].find((story) => story.dataset.story === mode);
  }

  function setViewState(mode) {
    if (!active) return;
    root.querySelectorAll("[data-view]").forEach((view) => {
      const isActive = view.dataset.view === mode;
      view.classList.toggle("is-active", isActive);
      view.setAttribute("aria-hidden", String(!isActive));
      view.inert = !isActive;
    });

    root.querySelectorAll("[data-story]").forEach((story) => {
      const isActive = story.dataset.story === mode;
      story.classList.toggle("is-active", isActive);
      story.setAttribute("aria-hidden", String(!isActive));
    });

    shell.dataset.mode = mode;
  }

  function getGeometry() {
    const shellWidth = shell.getBoundingClientRect().width;
    const columnGap = 36;
    const panelWidth = (shellWidth - columnGap) / 2;

    return {
      shellWidth,
      panelWidth,
      panelLeft: 0,
      panelRight: panelWidth + columnGap,
      stageLeft: shellWidth / 2,
      stageRight: 0,
    };
  }

  function updateCompactHeight() {
    if (!active) return;
    if (!compactQuery.matches) {
      formStage.style.removeProperty("height");
      return;
    }

    const frame = getView(currentMode)?.querySelector(".form-frame");
    if (!frame) return;

    formStage.style.height = `${Math.ceil(frame.getBoundingClientRect().height + 72)}px`;
  }

  function scheduleCompactHeight() {
    if (!active || !compactQuery.matches) return;
    window.cancelAnimationFrame(compactHeightFrame);
    compactHeightFrame = window.requestAnimationFrame(updateCompactHeight);
  }

  function placeLayout() {
    if (!active || isTransitioning) return;

    if (compactQuery.matches) {
      storyPanel.style.removeProperty("left");
      storyPanel.style.removeProperty("width");
      formStage.style.removeProperty("left");
      updateCompactHeight();
      return;
    }

    const geometry = getGeometry();
    storyPanel.style.left = `${currentMode === "register" ? geometry.panelLeft : geometry.panelRight}px`;
    storyPanel.style.width = `${geometry.panelWidth}px`;
    formStage.style.left = `${currentMode === "register" ? geometry.stageLeft : geometry.stageRight}px`;
    formStage.style.removeProperty("height");
  }

  async function switchCompactMode(nextMode) {
    const previousView = getView(currentMode);
    const previousStory = getStory(currentMode);

    if (!reducedMotionQuery.matches) {
      await Promise.all([
        runAnimation(previousView, { opacity: 0, y: -8, duration: MOTION.compactExit, ease: "inQuad", signal: animationSignal }),
        runAnimation(previousStory, { opacity: 0, duration: MOTION.compactExit, ease: "inQuad", signal: animationSignal }),
      ]);
    }

    if (!active) return;

    currentMode = nextMode;
    setViewState(nextMode);
    updateCompactHeight();

    const nextView = getView(nextMode);
    const nextStory = getStory(nextMode);

    if (reducedMotionQuery.matches) {
      nextView.style.opacity = "1";
      nextStory.style.opacity = "1";
      return;
    }

    nextView.style.opacity = "0";
    nextStory.style.opacity = "0";

    await Promise.all([
      runAnimation(nextView, { opacity: 1, y: [10, 0], duration: MOTION.compactEnter, ease: "outCubic", signal: animationSignal }),
      runAnimation(nextStory, { opacity: 1, duration: MOTION.compactEnter, ease: "outQuad", signal: animationSignal }),
    ]);
  }

  async function switchDesktopMode(nextMode) {
    const geometry = getGeometry();
    const movingRight = nextMode === "login";
    const panelEnd = movingRight ? geometry.panelRight : geometry.panelLeft;
    const stageEnd = movingRight ? geometry.stageRight : geometry.stageLeft;
    const previousView = getView(currentMode);
    const previousStory = getStory(currentMode);

    const panelMotion = runAnimation(storyPanel, {
      left: `${panelEnd}px`,
      duration: MOTION.desktopTotal,
      ease: "inOutCubic",
      signal: animationSignal,
    });

    const formMotion = runAnimation(formStage, {
      left: `${stageEnd}px`,
      duration: MOTION.desktopTotal,
      ease: "inOutCubic",
      signal: animationSignal,
    });

    runAnimation(previousStory, { opacity: 0, duration: 90, delay: 90, ease: "inQuad", signal: animationSignal });
    runAnimation(previousView, { opacity: 0, duration: 90, delay: 105, ease: "inQuad", signal: animationSignal });

    await wait(MOTION.desktopContentSwap);
    if (!active) return;
    currentMode = nextMode;
    setViewState(nextMode);

    const nextView = getView(nextMode);
    const nextStory = getStory(nextMode);
    nextView.style.opacity = "0";
    nextStory.style.opacity = "0";

    runAnimation(nextView, { opacity: 1, duration: 140, ease: "outQuad", signal: animationSignal });
    runAnimation(nextStory, { opacity: 1, duration: 150, ease: "outCubic", signal: animationSignal });

    await Promise.all([panelMotion, formMotion]);
    if (!active) return;
    storyPanel.style.left = `${panelEnd}px`;
    storyPanel.style.width = `${geometry.panelWidth}px`;
    formStage.style.left = `${stageEnd}px`;
  }

  async function switchMode(nextMode) {
    if (!active || nextMode === currentMode || isTransitioning) return;

    isTransitioning = true;
    onTransitionChange(true);

    if (compactQuery.matches || reducedMotionQuery.matches) {
      await switchCompactMode(nextMode);
    } else {
      await switchDesktopMode(nextMode);
    }

    if (!active) return;

    isTransitioning = false;
    onTransitionChange(false);
    placeLayout();

    getView(currentMode)?.querySelector("h1")?.focus({ preventScroll: true });
  }

  function scheduleLayout() {
    if (!active) return;
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(placeLayout);
  }

  function initialize() {
    if (!active) return;
    window.addEventListener("resize", scheduleLayout);
    compactQuery.addEventListener("change", scheduleLayout);
    document.fonts?.ready.then(() => {
      if (active) scheduleLayout();
    });
    setViewState(currentMode);
    placeLayout();
  }

  function destroy() {
    if (!active) return;
    isTransitioning = false;
    root.querySelectorAll("[data-view], [data-story]").forEach((element) => {
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
    });
    storyPanel.style.removeProperty("transform");
    formStage.style.removeProperty("transform");
    setViewState(currentMode);
    placeLayout();
    active = false;
    window.removeEventListener("resize", scheduleLayout);
    compactQuery.removeEventListener("change", scheduleLayout);
    window.cancelAnimationFrame(resizeFrame);
    window.cancelAnimationFrame(compactHeightFrame);
  }

  return {
    get currentMode() {
      return currentMode;
    },
    get isTransitioning() {
      return isTransitioning;
    },
    getView,
    destroy,
    initialize,
    scheduleCompactHeight,
    switchMode,
  };
}
