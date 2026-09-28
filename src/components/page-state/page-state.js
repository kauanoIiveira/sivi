export const PAGE_STATE_COPY = Object.freeze({
  loading: Object.freeze({
    title: "Carregando registros",
    description: "Aguarde enquanto buscamos os dados da empresa.",
    action: null,
  }),
  empty: Object.freeze({
    title: "Nenhum registro disponível",
    description: "Ainda não há dados para exibir nesta página.",
    action: "Atualizar registros",
  }),
  error: Object.freeze({
    title: "Não foi possível carregar os registros",
    description: "Confira sua conexão e tente novamente.",
    action: "Tentar novamente",
  }),
  forbidden: Object.freeze({
    title: "Acesso indisponível",
    description: "Sua conta não tem permissão para acessar estes registros. Selecione outra empresa ou atuação no menu.",
    action: null,
  }),
  conflict: Object.freeze({
    title: "Os registros foram alterados",
    description: "Atualize a página para conferir as informações mais recentes antes de continuar.",
    action: "Atualizar registros",
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
