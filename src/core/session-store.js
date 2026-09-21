const INITIAL = Object.freeze({ status: "loading", user: null, error: null });

function summarizeUser(user) {
  if (!user) return null;
  return Object.freeze({
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName ?? user.email ?? "Usuário SIVI",
  });
}

export function createSessionStore({ loadAuthModule }) {
  let snapshot = INITIAL;
  let unsubscribeAuth = () => {};
  let authModulePromise = null;
  let startPromise = null;
  let settleInitial = null;
  let generation = 0;
  const listeners = new Set();

  const notifyListener = (listener) => {
    try {
      listener(snapshot);
    } catch {
      // A falha de um consumidor não pode interromper o ciclo da sessão.
    }
  };

  const publish = (next) => {
    snapshot = Object.freeze(next);
    listeners.forEach(notifyListener);
  };

  const getAuthModule = () => {
    authModulePromise ??= Promise.resolve().then(loadAuthModule);
    return authModulePromise;
  };

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      notifyListener(listener);
      return () => listeners.delete(listener);
    },
    start() {
      if (startPromise) return startPromise;
      const activeGeneration = ++generation;

      startPromise = (async () => {
        try {
          const authModule = await getAuthModule();
          if (activeGeneration !== generation) return;

          await new Promise((resolve) => {
            let settled = false;
            const settle = () => {
              if (settled) return;
              settled = true;
              if (settleInitial === settle) settleInitial = null;
              resolve();
            };
            settleInitial = settle;
            const onUser = (user) => {
              if (activeGeneration !== generation) return settle();
              publish({
                status: user ? "authenticated" : "anonymous",
                user: summarizeUser(user),
                error: null,
              });
              settle();
            };
            const onError = (error) => {
              if (activeGeneration === generation) {
                publish({ status: "error", user: null, error });
              }
              settle();
            };
            const unsubscribe = authModule.observeAuthState(onUser, onError);
            if (activeGeneration !== generation) {
              unsubscribe();
              settle();
              return;
            }
            unsubscribeAuth = unsubscribe;
          });
        } catch (error) {
          if (activeGeneration === generation) {
            publish({ status: "error", user: null, error });
          }
        }
      })();

      return startPromise;
    },
    async logout() {
      const authModule = await getAuthModule();
      await authModule.logout();
    },
    stop() {
      generation += 1;
      unsubscribeAuth();
      unsubscribeAuth = () => {};
      const settle = settleInitial;
      settleInitial = null;
      settle?.();
      startPromise = null;
      listeners.clear();
    },
  };
}
