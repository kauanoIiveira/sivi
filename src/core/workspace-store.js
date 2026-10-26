const DEFAULT_KEY = "sivi.workspace.v1";

export function createWorkspaceStore({ storage, key = DEFAULT_KEY, workspaces = [], accountScoped = false, legacyKey = null }) {
  let available = [...workspaces];
  let byId = new Map(available.map(workspace => [workspace.id, workspace]));
  const listeners = new Set();
  const readStored = () => {
    try {
      const value = storage?.getItem(key) ?? (legacyKey ? storage?.getItem(legacyKey) : null);
      if (!value) return null;
      try { return JSON.parse(value); } catch { return value; }
    } catch { return null; }
  };
  let stored = readStored();
  let uid = null;
  let status = accountScoped ? 'idle' : 'ready';
  let error = null;
  const findStored = () => typeof stored === 'string'
    ? byId.get(stored) ?? null
    : stored?.uid === uid
      ? available.find(workspace => workspace.organizationId === stored.organizationId && workspace.organizationRole === stored.organizationRole) ?? null
      : null;
  let current = accountScoped ? null : findStored();
  if (current?.canEnter === false) current = null;
  let awaitingInitialLoad = !available.length && Boolean(stored);
  const publish = () => listeners.forEach(listener => listener(current));
  const persist = () => {
    stored = current ? accountScoped
      ? { uid, organizationId: current.organizationId, organizationRole: current.organizationRole }
      : current.id : null;
    try {
      if (stored) storage?.setItem(key, typeof stored === 'string' ? stored : JSON.stringify(stored));
      else storage?.removeItem(key);
      if (legacyKey) storage?.removeItem(legacyKey);
    } catch { /* A seleção continua em memória. */ }
  };
  return {
    list: () => [...available],
    getCurrent: () => current,
    getSnapshot: () => ({ status, error, uid }),
    beginLoad(accountUid) {
      if (uid !== accountUid) {
        uid = accountUid;
        available = []; byId = new Map(); current = null;
        stored = readStored(); awaitingInitialLoad = Boolean(stored);
      }
      status = accountUid ? 'loading' : 'idle'; error = null;
      publish();
    },
    failLoad(cause) { status = 'error'; error = cause; publish(); },
    select(id) {
      const selected = byId.get(id);
      if (!selected) throw new Error(`Contexto inválido: ${id}`);
      if (selected.canEnter === false) throw new Error("Esta empresa ainda não está ativa.");
      if (accountScoped && selected.memberUid && selected.memberUid !== uid) throw new Error('Este contexto pertence a outra conta.');
      current = selected; awaitingInitialLoad = false;
      persist(); publish(); return selected;
    },
    clear() {
      current = null; awaitingInitialLoad = false;
      persist(); publish();
    },
    replace(nextWorkspaces, preferredId = null) {
      if (!Array.isArray(nextWorkspaces)) throw new TypeError("A lista de contextos precisa ser válida.");
      const previousSnapshot = JSON.stringify([available, current?.id ?? null, status]);
      const nextById = new Map();
      for (const workspace of nextWorkspaces) {
        if (!workspace?.id || nextById.has(workspace.id)) throw new Error(`Contexto duplicado ou inválido: ${workspace?.id ?? "sem identificador"}`);
        if (accountScoped && workspace.memberUid && workspace.memberUid !== uid) throw new Error('A lista contém empresas de outra conta.');
        nextById.set(workspace.id, workspace);
      }
      if (preferredId && !nextById.has(preferredId)) throw new Error(`Contexto não encontrado: ${preferredId}`);
      const previous = current;
      available = [...nextWorkspaces]; byId = nextById;
      current = preferredId ? byId.get(preferredId) : previous
        ? available.find(workspace => workspace.organizationId === previous.organizationId && workspace.organizationRole === previous.organizationRole) ?? null
        : awaitingInitialLoad ? findStored() : null;
      if (current?.canEnter === false) current = null;
      awaitingInitialLoad = false; status = 'ready'; error = null;
      persist();
      if (previousSnapshot !== JSON.stringify([available, current?.id ?? null, status])) publish();
    },
    subscribe(listener) {
      listeners.add(listener); listener(current);
      return () => listeners.delete(listener);
    },
  };
}
