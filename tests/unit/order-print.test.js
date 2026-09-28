import test from 'node:test';
import assert from 'node:assert/strict';
import { orderPrintContent } from '../../src/pages/operations/order-print.js';

test('printed summary preserves accepted terms, individual units, inspections and escapes user data', () => {
  const order = { id: 'P-1', title: '<script>alert(1)</script>', buyerName: 'Compradora', supplierName: 'Usinagem',
    status: 'blocked', requiredBy: '2026-09-30', items: [
      { id: 'e', description: 'Eixo', quantity: 5, unit: 'un' }, { id: 'b', description: 'Barra', quantity: 30, unit: 'm' },
    ], version: { revision: 2, totalCents: 5000, freightCents: 1500, leadTimeDays: 7, technical: '"Desenho A" & tolerância' },
    inspections: [{ itemApprovals: [{ itemId: 'e', approved: 3 }, { itemId: 'b', approved: 30 }], plan: 'Plano A', evidence: '<img src=x onerror=alert(1)>' }],
  };
  const before = structuredClone(order); const html = orderPrintContent(order);
  assert.match(html, /&lt;script&gt;/); assert.doesNotMatch(html, /<script>|<img/);
  assert.match(html, /Eixo: 3\/5 un · Barra: 30\/30 m/);
  assert.match(html, /30\/09\/2026/); assert.match(html, /65,00/);
  assert.match(html, /&quot;Desenho A&quot; &amp; tolerância/);
  assert.match(html, /Não registrada/); assert.match(html, /não é nota fiscal/);
  assert.deepEqual(order, before);
});
