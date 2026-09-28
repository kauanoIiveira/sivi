const fields = Object.freeze([
  ["categories", "Categorias atendidas", "Ex.: engrenagens, usinados", true],
  ["materials", "Materiais", "Ex.: aço 1045, alumínio", true],
  ["processes", "Processos", "Ex.: usinagem, tratamento térmico", true],
  ["regions", "Regiões atendidas", "Ex.: Campinas/SP, Sorocaba/SP", true],
  ["certifications", "Certificações (opcional)", "Ex.: ISO 9001", false],
]);

export function mountSupplierProfilePage({ container, workspace, supplierProfiles, onReady = () => {} }) {
  container.innerHTML = `
    <section class="supplier-profile" aria-labelledby="supplier-profile-title">
      <header>
        <h1 id="supplier-profile-title" data-page-title></h1>
        <p>Informe o que sua empresa pode fornecer. Esses dados são comparados aos requisitos de cada demanda.</p>
      </header>
      <form data-supplier-profile-form>
        <p class="supplier-profile__wide supplier-profile__hint" id="profile-lists-hint">Separe os valores por vírgulas. Preencha todos os campos, exceto os indicados como opcionais.</p>
        ${fields.map(([name, label, placeholder, required]) => `<label>${label}<input name="${name}" placeholder="${placeholder}" aria-describedby="profile-lists-hint${name === "regions" ? " profile-regions-hint" : ""}" disabled ${required ? "required" : ""} />${name === "regions" ? '<small id="profile-regions-hint">Use os nomes informados nas demandas. A comparação é exata: cadastrar SP não inclui automaticamente Campinas/SP.</small>' : ""}</label>`).join("")}
        <label>Capacidade por pedido (unidades)<input name="capacity" type="number" min="1" max="9007199254740991" step="1" aria-describedby="profile-capacity-hint" required disabled /><small id="profile-capacity-hint">Quantidade máxima declarada em unidades. Não representa estoque disponível.</small></label>
        <label>Prazo indicativo (dias, opcional)<input name="leadTimeDays" type="number" min="1" max="9007199254740991" step="1" disabled /></label>
        <label class="supplier-profile__wide">Descrição da operação<textarea name="description" minlength="10" maxlength="1000" aria-describedby="profile-description-hint" required disabled></textarea><small id="profile-description-hint">De 10 a 1.000 caracteres. Descreva os serviços, equipamentos e limites de atendimento.</small></label>
        <div class="supplier-profile__footer"><p role="status" aria-atomic="true" tabindex="-1" data-profile-feedback></p><div class="supplier-profile__actions"><button type="button" data-profile-retry hidden>Tentar novamente</button><button type="submit" disabled>Salvar perfil industrial</button></div></div>
      </form>
    </section>`;
  const form = container.querySelector("[data-supplier-profile-form]");
  const page = container.querySelector(".supplier-profile");
  page.querySelector("h1").textContent = `Perfil industrial de ${workspace.organizationName}`;
  const feedback = container.querySelector("[data-profile-feedback]");
  const submit = form.querySelector("button[type='submit']");
  const retry = form.querySelector("[data-profile-retry]");
  const inputs = [...form.querySelectorAll("input, textarea")];
  let disposed = false;
  let phase = "initial";
  let readyNotified = false;
  let savedValues = "";

  const values = () => Object.fromEntries(new FormData(form));
  const snapshot = () => JSON.stringify(values());
  const setPhase = (next) => {
    phase = next;
    inputs.forEach((input) => { input.disabled = phase !== "ready"; });
    submit.disabled = phase !== "ready";
    submit.textContent = phase === "saving" ? "Salvando perfil…" : "Salvar perfil industrial";
    retry.hidden = phase !== "load-error";
    if (phase === "saving") form.setAttribute("aria-busy", "true");
    else form.removeAttribute("aria-busy");
    if (phase === "loading") page.setAttribute("aria-busy", "true");
    else page.removeAttribute("aria-busy");
  };
  const report = (message, error = false, focus = false) => {
    feedback.textContent = message;
    feedback.dataset.state = error ? "error" : "success";
    if (focus) feedback.focus();
  };

  const fill = (profile) => {
    if (!profile) return;
    for (const [name] of fields) form.elements[name].value = (profile[name] ?? []).join(", ");
    form.elements.capacity.value = profile.capacity ?? "";
    form.elements.leadTimeDays.value = profile.leadTimeDays ?? "";
    form.elements.description.value = profile.description ?? "";
  };
  const load = async () => {
    if (disposed || ["loading", "saving", "ready"].includes(phase)) return;
    const isRetry = phase === "load-error";
    setPhase("loading");
    report("Carregando perfil industrial…");
    try {
      if (!supplierProfiles?.getProfile) throw new Error("O perfil industrial está indisponível. Atualize a página e tente novamente.");
      const profile = await supplierProfiles.getProfile(workspace.id);
      if (disposed) return;
      fill(profile);
      setPhase("ready");
      savedValues = snapshot();
      report(profile ? "" : "Preencha o perfil industrial para receber oportunidades compatíveis.");
      if (isRetry) inputs[0].focus();
    } catch (error) {
      if (disposed) return;
      setPhase("load-error");
      report(error?.message ?? "Não foi possível carregar o perfil. Tente novamente.", true);
    } finally {
      if (!disposed && !readyNotified) {
        readyNotified = true;
        onReady();
      }
    }
  };
  retry.addEventListener("click", load);
  form.addEventListener("input", () => {
    if (disposed || phase !== "ready") return;
    if (snapshot() !== savedValues) form.dataset.dirty = "true";
    else delete form.dataset.dirty;
    report(form.dataset.dirty ? "Há alterações não salvas." : "");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (disposed || phase !== "ready" || !form.reportValidity()) return;
    const input = values();
    setPhase("saving");
    report("Salvando perfil industrial…");
    try {
      const profile = await supplierProfiles.saveProfile(workspace.id, input);
      if (disposed) return;
      fill(profile);
      setPhase("ready");
      savedValues = snapshot();
      delete form.dataset.dirty;
      report("Perfil industrial salvo. Os dados serão usados na comparação de novas demandas.", false, true);
    } catch (error) {
      if (disposed) return;
      setPhase("ready");
      report(error?.message ?? "Não foi possível salvar o perfil. Suas alterações foram mantidas; tente novamente.", true, true);
    }
  });
  load();
  return () => { disposed = true; page.remove(); };
}
