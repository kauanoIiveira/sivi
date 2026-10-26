const dayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' });
const DAY = 86400000;
const keyFor = value => {
  const parts = Object.fromEntries(dayFormat.formatToParts(value).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
};
const dayNumber = key => Date.parse(`${key}T12:00:00Z`) / DAY;
const keyFromDay = number => new Date(number * DAY).toISOString().slice(0, 10);
const displayDay = key => `${key.slice(8, 10)}/${key.slice(5, 7)}`;
const timestamp = value => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};
const states = [
  ['accepted', 'Em execução', 'execution'], ['blocked', 'Reinspeção', 'blocked'],
  ['released', 'Prontos para expedir', 'released'], ['dispatched', 'Expedidos', 'dispatched'],
  ['delivered', 'Recebidos', 'delivered'], ['other', 'Outros estados', 'other'],
];

/** A série conta criações; a carteira descreve o estado atual, sem simular seu histórico. */
export function buildWorkspaceInsights(records = {}, { role = 'buyer', days = 90, now = Date.now() } = {}) {
  if (!Number.isFinite(now)) throw new Error('Informe um instante válido para os indicadores.');
  days = [30, 60, 90].includes(days) ? days : 90;
  const end = keyFor(now);
  const lastDay = dayNumber(end);
  const firstDay = lastDay - days + 1;
  const series = Array.from({ length: 6 }, (_, index) => {
    const start = keyFromDay(firstDay + Math.ceil(index * days / 6));
    const finish = keyFromDay(firstDay + Math.ceil((index + 1) * days / 6) - 1);
    return { start, end: finish, label: `${displayDay(start)}–${displayDay(finish)}`, demands: 0, proposals: 0, orders: 0 };
  });
  const totals = { demands: 0, proposals: 0, orders: 0 };
  const omitted = { demands: 0, proposals: 0, orders: 0 };
  for (const type of Object.keys(totals)) {
    for (const record of records[type] ?? []) {
      let createdAt = timestamp(record.createdAt);
      if (createdAt === null && type === 'proposals') {
        const dates = (record.versions ?? []).map(version => timestamp(version.createdAt)).filter(value => value !== null);
        if (dates.length) createdAt = Math.min(...dates);
      }
      if (createdAt === null) { omitted[type] += 1; continue; }
      if (createdAt > now) continue;
      const offset = dayNumber(keyFor(createdAt)) - firstDay;
      if (offset < 0 || offset >= days) continue;
      const index = Math.min(5, Math.floor(offset * 6 / days));
      series[index][type] += 1;
      totals[type] += 1;
    }
  }
  const portfolio = states.map(([id, label, tone]) => ({ id, label, tone, count: 0 }));
  let orderValueCents = 0;
  let incompleteOrderValues = 0;
  for (const order of records.orders ?? []) {
    const state = portfolio.find(item => item.id === order.status) ?? portfolio.at(-1);
    state.count += 1;
    const total = order.version?.totalCents;
    const freight = order.version?.freightCents;
    if (![total, freight].every(value => Number.isSafeInteger(value) && value >= 0) || !Number.isSafeInteger(total + freight) || !Number.isSafeInteger(orderValueCents + total + freight)) {
      incompleteOrderValues += 1;
    } else orderValueCents += total + freight;
  }
  return { role, period: { days, start: keyFromDay(firstDay), end }, series, totals, omitted, portfolio: portfolio.filter(row => row.id !== 'other' || row.count), orderValueCents, incompleteOrderValues };
}
