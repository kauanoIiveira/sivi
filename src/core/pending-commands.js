// Keep only unresolved commands, scoped by the caller's account and company.
// A confirmed command is removed; a reload can still recover a lost response.
export function createPendingCommands({ storage, key }) {
  let entries;
  try {
    const saved = JSON.parse(storage?.getItem(key) ?? '[]');
    entries = new Map(Array.isArray(saved) ? saved.filter(entry => Array.isArray(entry) && entry.length === 2 && typeof entry[0] === 'string') : []);
  } catch { entries = new Map(); }
  const persist = () => {
    try { storage?.setItem(key, JSON.stringify([...entries])); } catch { /* Retries remain available in memory. */ }
  };
  return {
    get: intent => entries.get(intent),
    set(intent, command) { entries.set(intent, command); persist(); },
    delete(intent) { entries.delete(intent); persist(); },
  };
}
