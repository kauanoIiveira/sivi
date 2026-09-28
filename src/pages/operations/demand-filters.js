// Filters last for this tab and are isolated by account, company and role.
export function createDemandFilters(workspace, storage) {
  const key = `sivi.demand-filters.v1:${JSON.stringify([workspace.memberUid ?? 'local', workspace.id, workspace.organizationRole])}`;
  let value = { search: '', status: '' };
  try {
    const stored = JSON.parse(storage.getItem(key));
    if (typeof stored?.search === 'string') value.search = stored.search.slice(0, 200);
    if (['', 'draft', 'published', 'ordered'].includes(stored?.status)) value.status = stored.status;
  } catch { /* Filters still work when storage is unavailable. */ }
  return {
    read: () => ({ ...value }),
    save(search, status) {
      value = { search: search.slice(0, 200), status };
      try { storage.setItem(key, JSON.stringify(value)); } catch {}
    },
  };
}
