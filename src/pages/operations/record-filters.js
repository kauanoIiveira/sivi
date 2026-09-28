import { isCalendarDate, todayInSaoPaulo } from '../../domain/calendar-date.js';

export const recordStatuses = {
  proposals: [['', 'Todas as negociações'], ['awaiting', 'Sem propostas'], ['active', 'Com proposta válida'], ['expired', 'Propostas vencidas'], ['ordered', 'Pedido gerado']],
  orders: [['', 'Todas as situações'], ['accepted', 'Aguardando inspeção'], ['blocked', 'Reinspeção necessária'], ['released', 'Liberado para expedição'], ['dispatched', 'Expedido'], ['delivered', 'Entrega confirmada']],
};
export const recordSorts = [['recent', 'Atualização mais recente'], ['title', 'Título de A a Z'], ['deadline', 'Prazo solicitado mais próximo'], ['total', 'Menor total com frete'], ['total-desc', 'Maior total com frete']];
const defaults = () => ({ search: '', status: '', sort: 'recent' });

export function createRecordFilters(section, workspace, storage) {
  const key = `sivi.record-filters.v1:${JSON.stringify([workspace.memberUid ?? 'local', workspace.id, workspace.organizationRole, section])}`;
  const sanitize = input => ({
    search: typeof input?.search === 'string' ? input.search.slice(0, 200) : '',
    status: recordStatuses[section].some(([value]) => value === input?.status) ? input.status : '',
    sort: recordSorts.some(([value]) => value === input?.sort) ? input.sort : 'recent',
  });
  let value = defaults();
  try { value = sanitize(JSON.parse(storage.getItem(key))); } catch { /* Persistence is optional. */ }
  return {
    read: () => ({ ...value }),
    save(input) { value = sanitize(input); try { storage.setItem(key, JSON.stringify(value)); } catch {} },
    clear() { this.save(defaults()); },
  };
}

const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
const compareText = (left, right) => String(left ?? '').localeCompare(String(right ?? ''), 'pt-BR', { numeric: true });
const proposalsFor = (record, data) => (data.proposals ?? []).filter(proposal => proposal.demandId === record.id);

export function negotiationStatus(record, data, today = todayInSaoPaulo()) {
  if (record.status === 'ordered' || (data.orders ?? []).some(order => order.demandId === record.id)) return 'ordered';
  const proposals = proposalsFor(record, data);
  if (!proposals.length) return 'awaiting';
  return proposals.some(proposal => {
    const current = proposal.versions?.at(-1);
    return isCalendarDate(current?.validUntil) && current.validUntil >= today;
  }) ? 'active' : 'expired';
}

const total = version => Number.isSafeInteger(version?.totalCents) && Number.isSafeInteger(version?.freightCents)
  ? version.totalCents + version.freightCents : null;

export function filterRecords(records, filters, section, data = {}, today = todayInSaoPaulo()) {
  const terms = normalize(filters.search).trim().split(/\s+/).filter(Boolean);
  const supplierName = id => (data.suppliers ?? []).find(supplier => supplier.id === id)?.name ?? '';
  const matching = records.filter(record => {
    const proposals = section === 'proposals' ? proposalsFor(record, data) : [];
    const haystack = normalize([
      record.title, record.id, record.demandId, record.description, record.destination, record.region,
      record.buyerName, record.buyerId, record.supplierName, record.supplierId, supplierName(record.supplierId),
      record.version?.manufacturer, record.version?.technical,
      ...(record.items ?? []).flatMap(item => [item.description, item.material, item.category, item.process]),
      ...proposals.flatMap(proposal => [proposal.id, proposal.supplierName, proposal.supplierId, supplierName(proposal.supplierId),
        ...(proposal.versions ?? []).flatMap(version => [version.manufacturer, version.technical])]),
    ].join(' '));
    const state = section === 'proposals' ? negotiationStatus(record, data, today) : record.status;
    return terms.every(term => haystack.includes(term)) && (!filters.status || state === filters.status);
  });
  const amount = record => section === 'orders' ? total(record.version)
    : proposalsFor(record, data).map(proposal => total(proposal.versions?.at(-1))).filter(value => value !== null).sort((a, b) => a - b)[0] ?? null;
  const updated = record => Math.max(Number(record.updatedAt) || Number(record.createdAt) || 0,
    ...(section === 'proposals' ? proposalsFor(record, data).flatMap(proposal => [Number(proposal.updatedAt) || 0, Number(proposal.versions?.at(-1)?.createdAt) || 0]) : []));
  return matching.sort((left, right) => {
    let order = 0;
    if (filters.sort === 'title') order = compareText(left.title, right.title);
    else if (filters.sort === 'deadline') order = compareText(isCalendarDate(left.requiredBy) ? left.requiredBy : '9999-99-99', isCalendarDate(right.requiredBy) ? right.requiredBy : '9999-99-99');
    else if (['total', 'total-desc'].includes(filters.sort)) {
      const a = amount(left); const b = amount(right);
      order = a === null ? (b === null ? 0 : 1) : b === null ? -1 : (a - b) * (filters.sort === 'total-desc' ? -1 : 1);
    } else order = updated(right) - updated(left);
    return order || compareText(left.id, right.id);
  });
}
