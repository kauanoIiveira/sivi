const number = new Intl.NumberFormat('pt-BR');

export function normalizeUnit(value = 'un') {
  const unit = String(value).trim();
  return ['un', 'un.', 'und', 'und.', 'unidade', 'unidades'].includes(unit.toLocaleLowerCase('pt-BR')) ? 'un' : unit || 'un';
}

export function quantitiesByUnit(records) {
  const quantities = new Map();
  for (const record of records) {
    const items = record.items?.length ? record.items : [{ quantity: record.quantity, unit: record.unit }];
    for (const item of items) {
      if (item.quantity == null || item.quantity === '') continue;
      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity < 0) continue;
      const unit = normalizeUnit(item.unit);
      quantities.set(unit, (quantities.get(unit) ?? 0) + quantity);
    }
  }
  return [...quantities].map(([unit, quantity]) => ({ unit, quantity }));
}

export function quantitySummary(record) {
  return quantitiesByUnit([record]).map(({ unit, quantity }) => `${number.format(quantity)} ${unit}`).join(' · ') || 'Não informada';
}
