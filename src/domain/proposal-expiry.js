// Commercial validity ends at 23:59:59.999 in the Brazilian business day (UTC-3).
// The database independently verifies this date and timestamp before accepting.
import { isCalendarDate } from './calendar-date.js';
export function proposalExpiry(validUntil) {
  if (!isCalendarDate(validUntil)) throw new Error('Informe uma data válida.');
  const [year, month, day] = validUntil.split('-').map(Number);
  return { year, month, day, until: Date.parse(`${validUntil}T23:59:59.999-03:00`) };
}
