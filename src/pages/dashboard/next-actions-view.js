export function renderNextActions(data) {
  const section = document.createElement("section");
  section.className = "dashboard-panel dashboard-next-actions";
  section.setAttribute("aria-label", "Próximas ações");
  section.innerHTML = '<div class="dashboard-panel__heading"><h2>Próximas ações</h2><span class="dashboard-panel__index"></span></div>';
  section.querySelector("span").textContent = data.nextActions.length === 0 ? "Nenhuma pendência" : `${data.nextActions.length} ${data.nextActions.length === 1 ? "pendência" : "pendências"}`;
  if (!data.nextActions.length) {
    const empty = document.createElement("p");
    empty.className = "dashboard-panel__note";
    empty.textContent = data.role === "buyer"
      ? "Nenhuma ação pendente nos registros atuais. Você pode acompanhar suas demandas ou iniciar uma nova compra."
      : "Nenhuma ação pendente nos registros atuais. Mantenha seu perfil industrial atualizado para receber oportunidades.";
    section.append(empty);
    return section;
  }
  const list = document.createElement("ul");
  list.className = "next-actions-list";
  for (const action of data.nextActions) {
    const item = document.createElement("li");
    item.className = "next-action";
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = action.title;
    const reason = document.createElement("p");
    reason.textContent = action.reason;
    copy.append(title, reason);
    const link = document.createElement("a");
    link.className = "dashboard-link";
    link.textContent = `${action.label} →`;
    link.href = action.href;
    item.append(copy, link);
    list.append(item);
  }
  section.append(list);
  return section;
}
