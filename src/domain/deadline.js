import { isCalendarDate, todayInSaoPaulo } from './calendar-date.js';

export function daysUntil(date, today = todayInSaoPaulo()) {
  if (!isCalendarDate(date) || !isCalendarDate(today)) return null;
  return Math.round((Date.parse(`${date}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86_400_000);
}

export function describeRequestedDate(date, today = todayInSaoPaulo()) {
  const days = daysUntil(date, today);
  if (days === null) return null;
  const formatted = date.split('-').reverse().join('/');
  const distance = Math.abs(days);
  const amount = `${distance} ${distance === 1 ? 'dia' : 'dias'}`;
  const when = days === 0 ? `hoje (${formatted})` : `${formatted} (${days < 0 ? 'há' : 'em'} ${amount})`;
  return { days, urgent: days <= 3, text: `Data desejada pelo comprador: ${when}.` };
}
