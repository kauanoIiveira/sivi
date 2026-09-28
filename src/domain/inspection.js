import { normalizeUnit } from './quantity.js';

export function inspectionQuantities(order, input) {
  const items = order.items?.length ? order.items : [{ id: 'total', quantity: order.quantity, unit: 'un' }];
  const approvals = input.itemApprovals;
  if (items.length > 1 && (!Array.isArray(approvals) || approvals.length !== items.length)) {
    throw new Error('Informe a quantidade aprovada de cada item do pedido.');
  }
  if (approvals && (!Array.isArray(approvals) || approvals.length !== items.length || new Set(approvals.map(item => item.itemId)).size !== items.length)) {
    throw new Error('A inspeção deve identificar cada item uma única vez.');
  }
  const itemApprovals = items.map((item, index) => {
    const itemId = item.id ?? `item-${index + 1}`;
    const raw = approvals ? approvals.find(entry => entry.itemId === itemId)?.approved : input.approved;
    const approved = Number(raw);
    if (raw == null || (typeof raw === 'string' && !raw.trim()) || typeof raw === 'boolean' || !Number.isSafeInteger(approved) || approved < 0) {
      throw new Error(`Informe uma quantidade aprovada válida para o item ${index + 1}.`);
    }
    if (approved > item.quantity) throw new Error(`Quantidade aprovada maior que o pedido no item ${index + 1}.`);
    return { itemId, approved };
  });
  return {
    // Kept for existing stored records. Never present this sum as one physical unit.
    approved: itemApprovals.reduce((sum, item) => sum + item.approved, 0),
    itemApprovals,
    complete: itemApprovals.every((item, index) => item.approved === Number(items[index].quantity)),
  };
}

export function inspectionSummary(order, inspection) {
  if (inspection.itemApprovals?.length && order.items?.length) {
    return order.items.map((item, index) => {
      const approved = inspection.itemApprovals.find(entry => entry.itemId === (item.id ?? `item-${index + 1}`))?.approved;
      return `${item.description}: ${approved ?? '—'}/${item.quantity} ${normalizeUnit(item.unit)}`;
    }).join(' · ');
  }
  if (order.items?.length > 1) return 'Inspeção anterior sem detalhamento por item';
  return `${inspection.approved}/${order.quantity} ${normalizeUnit(order.items?.[0]?.unit)} aprovadas`;
}
