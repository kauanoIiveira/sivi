// This is unfinished input for this tab, not a demand saved for the company.
export function createDemandRecovery(workspace, storage) {
  const key = `sivi.demand-recovery.v1:${JSON.stringify([workspace.memberUid ?? 'local', workspace.id, workspace.organizationRole])}`;
  return {
    read() {
      try {
        const value = JSON.parse(storage.getItem(key));
        if (!value || typeof value !== 'object' || Array.isArray(value) || !Array.isArray(value.items)) return null;
        if (!value.items.every(item => item && typeof item === 'object' && !Array.isArray(item))) return null;
        return value;
      } catch { return null; }
    },
    save(value) {
      try { storage.setItem(key, JSON.stringify(value)); return true; }
      catch { return false; }
    },
    clear() {
      try { storage.removeItem(key); } catch { /* Storage may be unavailable. */ }
    },
  };
}
