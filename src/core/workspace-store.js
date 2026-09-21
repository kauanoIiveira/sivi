const DEFAULT_KEY = "sivi.workspace.v1";

export function createWorkspaceStore({ storage, key = DEFAULT_KEY, workspaces }) {
  let available = [...workspaces];
  let byId = new Map(available.map((workspace) => [workspace.id, workspace]));
  const listeners = new Set();
  let storedId = null;
  try { storedId = storage.getItem(key); } catch { storedId = null; }
  let current = byId.get(storedId) ?? null;
  let awaitingInitialLoad = available.length === 0 && Boolean(storedId);

  const publish = () => listeners.forEach((listener) => listener(current));

  return {
    list: () => [...available],
    getCurrent: () => current,
    select(id) {
      const selected = byId.get(id);
      if (!selected) throw new Error(`Contexto inválido: ${id}`);
      if (selected.canEnter === false) throw new Error("Esta empresa ainda não está ativa.");
      current = selected;
      storedId = selected.id;
      awaitingInitialLoad = false;
      try { storage.setItem(key, selected.id); } catch { /* Mantém a seleção somente em memória. */ }
      publish();
      return selected;
    },
    clear() {
      current = null;
      storedId = null;
      awaitingInitialLoad = false;
      try { storage.removeItem(key); } catch { /* Limpa o estado em memória mesmo sem storage. */ }
      publish();
    },
    replace(nextWorkspaces, preferredId = null) {
      if (!Array.isArray(nextWorkspaces)) throw new TypeError("A lista de contextos precisa ser válida.");
      const previousSnapshot = JSON.stringify([available, current?.id ?? null]);
      const nextById = new Map();
      for (const workspace of nextWorkspaces) {
        if (!workspace?.id || nextById.has(workspace.id)) {
          throw new Error(`Contexto duplicado ou inválido: ${workspace?.id ?? "sem identificador"}`);
        }
        nextById.set(workspace.id, workspace);
      }
      available = [...nextWorkspaces];
      byId = nextById;
      if (preferredId && !byId.has(preferredId)) throw new Error(`Contexto não encontrado: ${preferredId}`);
      current = preferredId
        ? byId.get(preferredId)
        : current
          ? byId.get(current.id) ?? null
          : awaitingInitialLoad
            ? byId.get(storedId) ?? null
            : null;
      if (current?.canEnter === false) current = null;
      awaitingInitialLoad = false;
      if (current) {
        storedId = current.id;
        try { storage.setItem(key, current.id); } catch { /* A seleção continua em memória. */ }
      } else {
        try { storage.removeItem(key); } catch { /* O contexto é limpo em memória. */ }
      }
      if (previousSnapshot !== JSON.stringify([available, current?.id ?? null])) publish();
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(current);
      return () => listeners.delete(listener);
    },
  };
}
