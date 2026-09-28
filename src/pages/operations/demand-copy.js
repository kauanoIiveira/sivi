import { isCalendarDate, todayInSaoPaulo } from '../../domain/calendar-date.js';

// Only editable specification fields belong to a new demand. Never copy workflow
// state, ownership, IDs, proposal versions, inspections or expired deadlines.
export function demandCopyInput(source, today = todayInSaoPaulo()) {
  const text = value => typeof value === 'string' ? value : '';
  const items = source.items?.length ? source.items : [{ ...source, description: source.description }];
  return {
    title: text(source.title), description: text(source.description),
    destination: text(source.destination), region: text(source.region ?? source.destination),
    requiredBy: isCalendarDate(source.requiredBy) && source.requiredBy >= today ? source.requiredBy : '',
    items: items.map(item => ({
      description: text(item.description), category: text(item.category), material: text(item.material), process: text(item.process),
      certifications: Array.isArray(item.certifications) ? item.certifications.map(text).filter(Boolean) : text(item.certifications),
      quantity: item.quantity ?? '', unit: text(item.unit) || 'un',
    })),
  };
}
