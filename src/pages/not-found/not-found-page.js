export function mountNotFoundPage({ container, path, onReturn }) {
  container.innerHTML = `
    <section class="page-state page-state--empty" data-page-state="not-found">
      <h1 data-page-title>Página não encontrada</h1>
      <p></p>
      <button type="button">Voltar às empresas</button>
    </section>`;

  container.querySelector("p").textContent = `Nenhuma página foi registrada para ${path}.`;
  const button = container.querySelector("button");
  button.addEventListener("click", onReturn);

  return () => {
    button.removeEventListener("click", onReturn);
    container.replaceChildren();
  };
}
