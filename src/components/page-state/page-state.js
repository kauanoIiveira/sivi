export const PAGE_STATE_COPY = Object.freeze({
  loading: Object.freeze({
    title: "Organizando os sinais industriais",
    description: "Estamos preparando a leitura deste contexto.",
    action: null,
  }),
  empty: Object.freeze({
    title: "Este contexto ainda está silencioso",
    description: "Ainda não há registros para esta leitura.",
    action: "Atualizar leitura",
  }),
  error: Object.freeze({
    title: "A leitura não pôde ser concluída",
    description: "Tente novamente sem perder o contexto selecionado.",
    action: "Tentar novamente",
  }),
  forbidden: Object.freeze({
    title: "Este contexto não está disponível",
    description: "Troque de contexto; menu oculto não substitui permissão real.",
    action: null,
  }),
  conflict: Object.freeze({
    title: "A versão mudou durante a leitura",
    description: "Recarregue a projeção antes de tomar uma decisão.",
    action: "Recarregar projeção",
  }),
});

export function renderPageState(container, { status, onRetry = () => {} }) {
  const copy = PAGE_STATE_COPY[status];
  if (!copy) throw new Error(`Estado de página não suportado: ${status}`);

  container.replaceChildren();
  const section = document.createElement("section");
  section.className = `page-state page-state--${status}`;
  section.dataset.pageState = status;
  section.setAttribute("role", status === "error" ? "alert" : "status");
  section.setAttribute("aria-live", status === "loading" ? "polite" : "assertive");
  section.innerHTML = `
    <span class="page-state__signal" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    <span class="page-state__kicker">Estado da leitura</span>
    <h1 data-page-title></h1>
    <p></p>`;
  section.querySelector("h1").textContent = copy.title;
  section.querySelector("p").textContent = copy.description;

  let button = null;
  if (copy.action) {
    button = document.createElement("button");
    button.type = "button";
    button.textContent = copy.action;
    button.addEventListener("click", onRetry);
    section.append(button);
  }

  container.append(section);
  return () => {
    button?.removeEventListener("click", onRetry);
    section.remove();
  };
}
