import { isCalendarDate, todayInSaoPaulo } from '../../domain/calendar-date.js';
import { normalizeUnit } from '../../domain/quantity.js';

const statuses = { accepted: 'Aguardando inspeção', blocked: 'Reinspeção necessária', released: 'Liberado para expedição', dispatched: 'Expedido', delivered: 'Entrega confirmada' };
const date = value => isCalendarDate(value) ? value.split('-').reverse().join('/') : '';
const timestamp = value => Number.isFinite(value) && value > 0 ? new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo',
}).format(new Date(value)) : '';
const amount = cents => Number.isSafeInteger(cents) && cents >= 0 ? (cents / 100).toFixed(2).replace('.', ',') : '';

// Quote every cell, preserve line breaks and shield spreadsheet formula prefixes,
// including those concealed by whitespace and control characters.
export function csvCell(value) {
  let text = String(value ?? '').replace(/\u0000/g, '');
  if (/^[\s\u0001-\u001f\u007f-\u009f]*[=+\-@]/u.test(text) || /^[\t\r\n]/u.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function ordersCsv(orders) {
  const rows = [[
    'Pedido', 'Título', 'Situação', 'Comprador', 'Fornecedor', 'Demanda', 'Proposta aceita', 'Versão aceita',
    'Criado em (São Paulo)', 'Prazo solicitado', 'Destino', 'Item', 'Descrição do item', 'Material', 'Processo', 'Quantidade', 'Unidade',
    'Itens do pedido (BRL, primeira linha)', 'Frete do pedido (BRL, primeira linha)', 'Total do pedido (BRL, primeira linha)',
    'Prazo contratado (dias)', 'Fabricante', 'Pagamento', 'Garantia', 'Resposta técnica', 'Expedido em (São Paulo)', 'Recebido em (São Paulo)',
  ]];
  for (const order of orders) {
    const version = order.version ?? {};
    const items = order.items?.length ? order.items : [{ description: order.description ?? order.title, quantity: order.quantity, unit: order.unit }];
    items.forEach((item, index) => rows.push([
      order.id, order.title, statuses[order.status] ?? order.status, order.buyerName ?? order.buyerId, order.supplierName ?? order.supplierId,
      order.demandId, order.sourceProposalId, version.revision,
      timestamp(order.createdAt), date(order.requiredBy), order.destination,
      index + 1, item.description, item.material, item.process, item.quantity, normalizeUnit(item.unit),
      index === 0 ? amount(version.totalCents) : '', index === 0 ? amount(version.freightCents) : '',
      index === 0 && Number.isSafeInteger(version.totalCents) && Number.isSafeInteger(version.freightCents) ? amount(version.totalCents + version.freightCents) : '',
      version.leadTimeDays, version.manufacturer, version.payment, version.warranty, version.technical,
      timestamp(order.dispatchedAt), timestamp(order.deliveredAt),
    ]));
  }
  return '\uFEFF' + rows.map(row => row.map(csvCell).join(';')).join('\r\n') + '\r\n';
}

export function downloadOrdersCsv(orders) {
  const url = URL.createObjectURL(new Blob([ordersCsv(orders)], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = `sivi-pedidos-${todayInSaoPaulo()}.csv`;
  document.body.append(anchor); anchor.click(); anchor.remove();
  // Delay revocation until browsers have consumed the download URL.
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
