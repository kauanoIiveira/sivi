import { isCalendarDate, todayInSaoPaulo } from "./calendar-date.js";
import { daysUntil, describeRequestedDate } from './deadline.js';

export function workflowLink(role, section, recordId) {
  const area = role === "buyer" ? "comprador" : "fornecedor";
  const page = { demands: role === "buyer" ? "demandas" : "oportunidades", proposals: "propostas", orders: "pedidos" }[section];
  const path = `#/app/${area}/${page}`;
  return recordId ? `${path}?registro=${encodeURIComponent(recordId)}` : path;
}

// The repository supplies data already scoped to the active company.
export function buildNextActions(role, { demands, proposals, orders }, today = todayInSaoPaulo()) {
  if (!["buyer", "supplier"].includes(role)) return [];
  const actions = [];
  const add = (kind, record, section, label, reason, priority, dueDate) => {
    const requested = section === 'orders' && record.status !== 'delivered'
      ? describeRequestedDate(record.requiredBy, today) : null;
    actions.push({
      kind, title: record.title || "Registro da empresa", label,
      reason: requested?.urgent ? `${reason} ${requested.text}` : reason,
      priority: requested?.urgent ? Math.min(priority, 0) : priority,
      dueDate: dueDate ?? (requested?.urgent ? record.requiredBy : undefined),
      href: workflowLink(role, section, record.id),
    });
  };
  for (const order of orders) {
    const actionCount = actions.length;
    if (role === "buyer") {
      if (order.status === "dispatched") add("receive", order, "orders", "Conferir recebimento", "O fornecedor registrou a expedição. Confirme após receber.", 0);
      if (order.status === "delivered" && !order.evaluation) add("evaluate", order, "orders", "Avaliar entrega", "Recebimento confirmado; sua avaliação está pendente.", 2);
    } else {
      if (order.status === "blocked") add("reinspect", order, "orders", "Registrar reinspeção", "Pedido bloqueado pela qualidade. Registre uma nova inspeção após a correção.", 0);
      if (order.status === "accepted") add("inspect", order, "orders", "Registrar inspeção", "Pedido aceito; a inspeção é necessária para liberar a expedição.", 1);
      if (order.status === "released") add("dispatch", order, "orders", "Registrar expedição", "Qualidade aprovada; registre a saída quando ocorrer.", 1);
    }
    if (actions.length === actionCount && ['accepted', 'blocked', 'released', 'dispatched'].includes(order.status)
      && describeRequestedDate(order.requiredBy, today)?.urgent) {
      add('follow-delivery', order, 'orders', 'Acompanhar pedido', 'Consulte a etapa atual e as condições combinadas.', 1);
    }
  }
  for (const demand of demands) {
    if (orders.some(order => order.demandId === demand.id)) continue;
    const replies = proposals.filter(proposal => proposal.demandId === demand.id);
    if (role === "buyer") {
      if (demand.status === "draft") add("publish", demand, "demands", "Revisar e publicar", "Rascunho salvo. Confira os requisitos antes de publicar.", 4);
      if (demand.status === 'published') {
        const validDates = replies.map(proposal => proposal.versions.at(-1)?.validUntil)
          .filter(date => isCalendarDate(date) && date >= today).sort();
        if (validDates.length) {
          const remaining = daysUntil(validDates[0], today);
          const expiring = remaining <= 3;
          const validity = remaining === 0 ? 'Uma das propostas vence hoje.'
            : `Uma das propostas vence em ${remaining} ${remaining === 1 ? 'dia' : 'dias'}.`;
          add('compare', demand, 'proposals', 'Comparar propostas',
            expiring ? validity : 'Há propostas dentro da validade aguardando sua decisão.', expiring ? 1 : 3, expiring ? validDates[0] : undefined);
        } else if (replies.some(proposal => {
          const date = proposal.versions.at(-1)?.validUntil;
          return isCalendarDate(date) && date < today;
        })) add('review-expired', demand, 'proposals', 'Conferir propostas vencidas', 'As propostas recebidas estão fora da validade. Consulte as condições antes de continuar a negociação.', 3);
      }
    } else if (demand.status === "published") {
      if (!replies.length) add("propose", demand, "proposals", "Preparar proposta", "Oportunidade disponível para sua empresa, ainda sem resposta.", 3);
      else if (replies.every(proposal => proposal.versions.at(-1)?.validUntil < today)) add("revise", demand, "proposals", "Revisar proposta", "Sua última proposta venceu. Atualize as condições se quiser continuar.", 3);
    }
  }
  return actions.sort((a, b) => a.priority - b.priority || (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31') || a.title.localeCompare(b.title, "pt-BR"));
}
