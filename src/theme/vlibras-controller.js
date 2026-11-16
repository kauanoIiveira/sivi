const SDK_URL = 'https://vlibras.gov.br/app/vlibras-plugin.js';
const WIDGET_ROOTS = '#vlibras-access-wrapper, #vlibras-app-root';
const FAILURE_MESSAGE = 'Não foi possível carregar o VLibras. Tente novamente.';

/**
 * Widget 7 loads itself; keep a single SDK in the page and suspend its controls
 * outside the workspace. The app root's data-active attribute also closes the
 * translator and pauses its player, rather than only hiding a running widget.
 */
export function createVLibrasController({
  documentObject = globalThis.document,
  windowObject = globalThis.window,
  onStateChange = () => {},
} = {}) {
  let enabled = false;
  let surface = 'public';
  let disposed = false;
  let state = { status: 'off' };
  let sdkLoaded = false;
  let appLoadFailed = false;
  let loading = null;
  let pendingAppLoads = 0;
  const hiddenRoots = new WeakMap();
  const observedScripts = new WeakSet();
  const observer = new windowObject.MutationObserver(() => {
    observeAppScripts();
    applyVisibility();
    finishDisposal();
  });
  observer.observe(documentObject.body, {
    childList: true, subtree: true, attributes: true,
    attributeFilter: ['data-active', 'data-expanded'],
  });

  const isActive = () => !disposed && enabled && surface === 'app';
  const getState = () => ({ ...state });

  function publish(status, message) {
    if (state.status === status && state.message === message) return;
    state = message ? { status, message } : { status };
    if (!disposed) onStateChange(getState());
  }

  function setHidden(root, hide) {
    if (hide) {
      if (!hiddenRoots.has(root)) hiddenRoots.set(root, {
        hidden: root.hidden, inert: root.inert,
        ariaHidden: root.getAttribute('aria-hidden'),
        display: root.style.getPropertyValue('display'),
        priority: root.style.getPropertyPriority('display'),
      });
      root.hidden = true;
      root.inert = true;
      root.setAttribute('aria-hidden', 'true');
      root.style.setProperty('display', 'none', 'important');
      if (root.id === 'vlibras-app-root') {
        if (root.dataset.active !== 'false') root.dataset.active = 'false';
        delete root.dataset.expanded;
      }
      return;
    }
    const original = hiddenRoots.get(root);
    if (!original) return;
    root.hidden = original.hidden;
    root.inert = original.inert;
    if (original.ariaHidden === null) root.removeAttribute('aria-hidden');
    else root.setAttribute('aria-hidden', original.ariaHidden);
    if (original.display) root.style.setProperty('display', original.display, original.priority);
    else root.style.removeProperty('display');
    hiddenRoots.delete(root);
  }

  function applyVisibility() {
    const visible = isActive() && state.status !== 'error';
    for (const root of documentObject.querySelectorAll(WIDGET_ROOTS)) setHidden(root, !visible);
    if (!visible) delete documentObject.body.dataset.vlibrasExpanded;
  }

  function finishDisposal() {
    // Keep watching scripts already in flight until their late roots are hidden.
    if (disposed && !loading && pendingAppLoads === 0) observer.disconnect();
  }

  function observeAppScripts() {
    for (const script of documentObject.querySelectorAll('script[src]')) {
      if (!/\/vlibras-plugin-app\.js(?:[?#]|$)/.test(script.src) || observedScripts.has(script)) continue;
      observedScripts.add(script);
      pendingAppLoads += 1;
      if (isActive()) publish('loading');
      const settle = event => {
        script.removeEventListener('load', settle);
        script.removeEventListener('error', settle);
        pendingAppLoads -= 1;
        appLoadFailed = event.type === 'error';
        if (isActive()) publish(appLoadFailed ? 'error' : 'ready', appLoadFailed ? FAILURE_MESSAGE : undefined);
        applyVisibility();
        finishDisposal();
      };
      script.addEventListener('load', settle);
      script.addEventListener('error', settle);
    }
  }

  function closeStoredWidget() {
    // The SDK may reopen its translator from its own preference at startup.
    // Our switch activates the entry button; translation starts on user action.
    try {
      const storage = windowObject.localStorage;
      const stored = storage.getItem('@vlibras-widget');
      if (!stored) return;
      const value = JSON.parse(stored);
      if (value?.state && typeof value.state === 'object') value.state.isOpen = false;
      else if (value && typeof value === 'object') value.isOpen = false;
      storage.setItem('@vlibras-widget', JSON.stringify(value));
    } catch { /* The widget also works when browser storage is unavailable. */ }
  }

  function initializeWidget() {
    if (typeof windowObject.VLibras?.Widget !== 'function') throw new Error('VLibras SDK unavailable');
    // Calling its supported constructor removes the delay of automatic startup;
    // the SDK itself guards against duplicate wrappers.
    new windowObject.VLibras.Widget();
    if (!documentObject.getElementById('vlibras-access-wrapper')) throw new Error('VLibras controls unavailable');
    sdkLoaded = true;
    observeAppScripts();
    applyVisibility();
  }

  function loadWidget() {
    if (loading) {
      publish('loading');
      return loading;
    }
    if (sdkLoaded) {
      if (pendingAppLoads > 0) {
        publish('loading');
        applyVisibility();
        return Promise.resolve(getState());
      }
      if (appLoadFailed) {
        publish('loading');
        try {
          if (typeof windowObject.VLibrasWidget?.open !== 'function') throw new Error('VLibras retry unavailable');
          windowObject.VLibrasWidget.open();
          observeAppScripts();
        } catch { publish('error', FAILURE_MESSAGE); }
        applyVisibility();
        return Promise.resolve(getState());
      }
      publish('ready');
      applyVisibility();
      return Promise.resolve(getState());
    }
    publish('loading');
    closeStoredWidget();
    loading = new Promise((resolve, reject) => {
      const script = documentObject.createElement('script');
      script.src = SDK_URL;
      script.async = true;
      script.dataset.siviVlibras = '';
      const timeout = windowObject.setTimeout(() => finish(new Error('VLibras load timeout')), 20000);
      const finish = error => {
        windowObject.clearTimeout(timeout);
        script.onload = null;
        script.onerror = null;
        if (error) { script.remove(); reject(error); return; }
        try { initializeWidget(); resolve(); }
        catch (failure) { script.remove(); reject(failure); }
      };
      script.onload = () => finish();
      script.onerror = () => finish(new Error('VLibras network failure'));
      documentObject.body.append(script);
    }).then(() => {
      if (isActive()) publish('ready');
      applyVisibility();
      return getState();
    }).catch(() => {
      if (isActive()) publish('error', FAILURE_MESSAGE);
      applyVisibility();
      return getState();
    }).finally(() => {
      loading = null;
      finishDisposal();
    });
    return loading;
  }

  function sync() {
    if (!isActive()) {
      publish('off');
      applyVisibility();
      return Promise.resolve(getState());
    }
    return loadWidget();
  }

  return {
    getState,
    setEnabled(value) {
      if (disposed) return Promise.resolve(getState());
      enabled = Boolean(value);
      return sync();
    },
    setSurface(value) {
      if (disposed) return Promise.resolve(getState());
      surface = value;
      return sync();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      enabled = false;
      state = { status: 'off' };
      applyVisibility();
      finishDisposal();
    },
  };
}
