export const money = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export { quantitySummary } from '../../domain/quantity.js';
export const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};

export function metrics(entries) {
  const group = element('div', undefined, 'workflow-metrics');
  entries.forEach(([label, value, note]) => {
    const item = element('article', undefined, 'workflow-metric');
    item.append(element('span', label), element('strong', String(value)), element('small', note));
    group.append(item);
  });
  return group;
}

export function emptyState(title, description) {
  const node = element('div', undefined, 'workflow-empty');
  node.append(element('h3', title), element('p', description));
  return node;
}

export function comparison(proposals, supplierName, appendDecision, captionText = 'Condições da versão mais recente de cada fornecedor') {
  const wrap = element('div', undefined, 'workflow-comparison');
  wrap.tabIndex = 0; wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', 'Comparador de propostas, com rolagem horizontal');
  const table = element('table');
  const caption = element('caption', captionText); table.append(caption);
  const head = element('thead'); const headings = element('tr');
  const corner = element('th', 'Condições da oferta'); corner.scope = 'col'; headings.append(corner);
  proposals.forEach(proposal => {
    const th = element('th', supplierName(proposal.supplierId)); th.scope = 'col'; headings.append(th);
  }); head.append(headings); table.append(head);
  const body = element('tbody');
  const criteria = [
    ['Versão atual', v => `Versão ${v.revision}`],
    ['Valor dos itens', v => money(v.totalCents)],
    ['Frete', v => money(v.freightCents)],
    ['Total com frete', v => money(v.totalCents + v.freightCents)],
    ['Prazo', v => `${v.leadTimeDays} dias`],
    ['Validade', v => v.validUntil.split('-').reverse().join('/')],
    ['Fabricante', v => v.manufacturer],
    ['Pagamento', v => v.payment],
    ['Garantia', v => v.warranty],
    ['Resposta técnica', v => v.technical],
  ];
  criteria.forEach(([label, value]) => {
    const row = element('tr'); if (label === 'Total com frete') row.className = 'comparison-total';
    const th = element('th', label); th.scope = 'row'; row.append(th);
    proposals.forEach(proposal => row.append(element('td', value(proposal.versions.at(-1)))));
    body.append(row);
  });
  if (appendDecision) {
    const decisions = element('tr'); const label = element('th', 'Sua decisão'); label.scope = 'row'; decisions.append(label);
    proposals.forEach(proposal => { const cell = element('td'); appendDecision(cell, proposal); decisions.append(cell); }); body.append(decisions);
  }
  table.append(body); wrap.append(table); return wrap;
}

export function orderProgress(order) {
  const steps = ['Pedido confirmado', 'Qualidade', 'Liberado', 'Expedido', 'Recebido'];
  const stage = { accepted: 1, blocked: 1, released: 2, dispatched: 3, delivered: 4 }[order.status] ?? 0;
  const list = element('ol', undefined, 'workflow-progress'); list.setAttribute('aria-label', 'Etapas do pedido');
  steps.forEach((label, index) => {
    const item = element('li', undefined, index < stage ? 'is-complete' : index === stage ? 'is-current' : '');
    if (index === stage) item.setAttribute('aria-current', 'step');
    const marker = element('span', index < stage ? '✓' : String(index + 1)); marker.setAttribute('aria-hidden', 'true');
    item.append(marker, element('strong', label), element('small', index < stage ? 'Concluído' : index === stage ? order.status === 'blocked' ? 'Reinspeção necessária' : order.status === 'delivered' ? 'Entrega confirmada' : 'Etapa atual' : 'Próxima etapa'));
    list.append(item);
  }); return list;
}
