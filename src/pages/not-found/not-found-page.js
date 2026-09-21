export function mountNotFoundPage({ container, path, onReturn }) {
  container.innerHTML = `
    <section class="page-state page-state--empty" data-page-state="not-found">
      <span class="page-state__signal" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <h1 data-page-title>Esta rota não faz parte da jornada</h1>
      <p></p>
      <button type="button">Voltar ao contexto</button>
    </section>`;

  container.querySelector("p").textContent = `Nenhuma página foi registrada para ${path}.`;
  const button = container.querySelector("button");
  button.addEventListener("click", onReturn);

  return () => {
    button.removeEventListener("click", onReturn);
    container.replaceChildren();
  };
}
