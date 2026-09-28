import { normalizeUnit } from '../../domain/quantity.js';
import { inspectionSummary } from '../../domain/inspection.js';
import { isCalendarDate } from '../../domain/calendar-date.js';

const state = { accepted: 'Aguardando inspeção', blocked: 'Reinspeção necessária', released: 'Liberado', dispatched: 'Expedido', delivered: 'Recebido' };
const escape = value => String(value ?? 'Não informado').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const money = value => Number.isSafeInteger(value) ? (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Não informado';
const date = value => isCalendarDate(value) ? value.split('-').reverse().join('/') : 'Não informada';
const time = value => Number.isFinite(value) && value > 0 ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }).format(new Date(value)) : 'Data não registrada';

export function orderPrintContent(order) {
  const version = order.version ?? {};
  const field = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`;
  const items = order.items?.length ? order.items : [{ description: order.description ?? order.title, quantity: order.quantity, unit: 'un' }];
  return `<header><p>SIVI · Resumo do pedido</p><h1>${escape(order.title)}</h1><p>Referência: ${escape(order.id)} · ${escape(state[order.status] ?? order.status)}</p></header>
    <dl>${field('Comprador', order.buyerName ?? order.buyerId)}${field('Fornecedor', order.supplierName ?? order.supplierId)}${field('Demanda', order.demandId)}${field('Pedido criado em', time(order.createdAt))}${field('Destino', order.destination)}${field('Data desejada pelo comprador', date(order.requiredBy))}</dl>
    <h2>Especificação aceita</h2><p>${escape(order.description)}</p>
    <table><thead><tr><th>Item / especificação</th><th>Quantidade</th><th>Unidade</th></tr></thead><tbody>${items.map(item => `<tr><td>${escape(item.description)}${[item.material, item.process, item.category].filter(Boolean).length ? `<small>${[item.material, item.process, item.category].filter(Boolean).map(escape).join(' · ')}</small>` : ''}${item.certifications?.length ? `<small>Certificações: ${escape(Array.isArray(item.certifications) ? item.certifications.join(', ') : item.certifications)}</small>` : ''}</td><td>${escape(item.quantity)}</td><td>${escape(normalizeUnit(item.unit))}</td></tr>`).join('')}</tbody></table>
    <h2>Condições preservadas no pedido</h2><dl>${field('Proposta / versão aceita', `${order.sourceProposalId ?? 'Não informada'} / ${version.revision ?? 'Não informada'}`)}${field('Valor dos itens', money(version.totalCents))}${field('Frete', money(version.freightCents))}${field('Total com frete', money(version.totalCents + version.freightCents))}${field('Prazo contratado', version.leadTimeDays == null ? 'Não informado' : `${version.leadTimeDays} dias`)}${field('Fabricante', version.manufacturer)}${field('Pagamento', version.payment)}${field('Garantia', version.warranty)}</dl><h3>Resposta técnica aceita</h3><p>${escape(version.technical)}</p>
    <h2>Qualidade e entrega</h2>${order.inspections?.length ? order.inspections.map((inspection, index) => `<section><h3>Inspeção ${index + 1} · ${escape(time(inspection.createdAt))}</h3><p>${escape(inspectionSummary(order, inspection))}</p><dl>${field('Plano e versão', inspection.plan)}${field('Resultado e evidência', inspection.evidence)}</dl></section>`).join('') : '<p>Nenhuma inspeção registrada.</p>'}
    <dl>${field('Expedição', order.dispatchedAt ? time(order.dispatchedAt) : 'Não registrada')}${field('Recebimento', order.deliveredAt ? time(order.deliveredAt) : 'Não registrado')}</dl>
    ${order.evaluation ? `<h3>Avaliação do comprador</h3><p>${escape(order.evaluation.score)}/5 · ${escape(order.evaluation.comment)}</p>` : ''}
    <footer>Resumo dos dados salvos no SIVI. Horários de São Paulo. Valores comerciais são totais do pedido; não há preço individual por item. Este resumo não é nota fiscal.</footer>`;
}

const printCss = `#sivi-print-document{display:none}@media print{@page{margin:16mm}body{background:white!important;color:#222!important}body>:not(#sivi-print-document){display:none!important}#sivi-print-document{display:block!important;font:11pt/1.5 Arial,sans-serif;color:#222;background:white;overflow-wrap:anywhere}#sivi-print-document *{box-sizing:border-box}#sivi-print-document h1{font-size:23pt;line-height:1.15;margin:8pt 0}#sivi-print-document h2{font-size:15pt;border-bottom:1px solid #aaa;margin-top:22pt;padding-bottom:6pt;break-after:avoid}#sivi-print-document h3{font-size:12pt;break-after:avoid}#sivi-print-document header{border-bottom:2px solid #222;padding-bottom:12pt}#sivi-print-document dl{display:grid;grid-template-columns:1fr 1fr;gap:12pt 20pt}#sivi-print-document dl>div{break-inside:avoid}#sivi-print-document dt{font-size:9pt;color:#555}#sivi-print-document dd{margin:0;white-space:pre-wrap}#sivi-print-document p{white-space:pre-wrap}#sivi-print-document table{width:100%;border-collapse:collapse;font:inherit}#sivi-print-document th,#sivi-print-document td{text-align:left;padding:8pt;border-bottom:1px solid #bbb;vertical-align:top}#sivi-print-document th{font-size:10pt}#sivi-print-document tr{break-inside:avoid}#sivi-print-document small{display:block;font-size:9pt;margin-top:4pt}#sivi-print-document footer{margin-top:24pt;padding-top:10pt;border-top:1px solid #aaa;font-size:9pt;color:#555}}`;

export function printOrder(order) {
  if (document.getElementById('sivi-print-document')) return;
  const previousTitle = document.title;
  const sheet = document.createElement('article');
  sheet.id = 'sivi-print-document'; sheet.setAttribute('aria-hidden', 'true');
  const style = document.createElement('style'); style.textContent = printCss;
  sheet.innerHTML = orderPrintContent(order); sheet.prepend(style);
  document.body.append(sheet);
  try {
    document.title = `SIVI - Pedido ${order.id ?? ''}`;
    window.print();
  } finally { sheet.remove(); document.title = previousTitle; }
}
