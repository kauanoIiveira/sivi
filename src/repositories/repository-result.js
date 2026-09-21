const STATUSES = new Set(["ready", "loading", "empty", "error", "forbidden", "conflict"]);

export function createRepositoryResult(
  status,
  { data = null, error = null, meta = {} } = {},
) {
  if (!STATUSES.has(status)) throw new Error(`Estado de repositório inválido: ${status}`);

  return Object.freeze({ status, data, error, meta: Object.freeze({ ...meta }) });
}
