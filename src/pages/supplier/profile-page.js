const fields = Object.freeze([
  ["categories", "Categorias atendidas", "Ex.: engrenagens, usinados", true],
  ["materials", "Materiais", "Ex.: aço 1045, alumínio", true],
  ["processes", "Processos", "Ex.: usinagem, tratamento térmico", true],
  ["regions", "Regiões atendidas", "Ex.: SP, Sudeste", true],
  ["certifications", "Certificações", "Ex.: ISO 9001", false],
]);

export function mountSupplierProfilePage({ container, workspace, supplierProfiles, onReady = () => {} }) {
  container.innerHTML = `
    <section class="supplier-profile" aria-labelledby="supplier-profile-title">
      <header>
        <span>CAPACIDADE INDUSTRIAL</span>
        <h1 id="supplier-profile-title" data-page-title>Perfil de ${workspace.organizationName}</h1>
        <p>Estas informações alimentam o match das oportunidades.</p>
      </header>
      <form data-supplier-profile-form>
        ${fields.map(([name, label, placeholder, required]) => `<label>${label}<input name="${name}" placeholder="${placeholder}" ${required ? "required" : ""} /></label>`).join("")}
        <label>Capacidade máxima informada<input name="capacity" type="number" min="1" step="1" required /></label>
        <label>Prazo indicativo em dias<input name="leadTimeDays" type="number" min="1" step="1" /></label>
        <label class="supplier-profile__wide">Descrição da operação<textarea name="description" minlength="10" maxlength="1000" required></textarea></label>
        <div class="supplier-profile__footer"><p role="status" data-profile-feedback></p><button type="submit">Salvar perfil industrial</button></div>
      </form>
    </section>`;
  const form = container.querySelector("[data-supplier-profile-form]");
  const feedback = container.querySelector("[data-profile-feedback]");
  const submit = form.querySelector("button[type='submit']");
  let disposed = false;

  const fill = (profile) => {
    if (!profile) return;
    for (const [name] of fields) form.elements[name].value = (profile[name] ?? []).join(", ");
    form.elements.capacity.value = profile.capacity ?? "";
    form.elements.leadTimeDays.value = profile.leadTimeDays ?? "";
    form.elements.description.value = profile.description ?? "";
  };
  if (!supplierProfiles) {
    feedback.textContent = "Não foi possível carregar o perfil industrial. Tente novamente.";
    submit.disabled = true;
    onReady();
    return () => { disposed = true; container.replaceChildren(); };
  }

  supplierProfiles.getProfile(workspace.id).then(fill).catch((error) => {
    feedback.textContent = error?.message ?? "Não foi possível carregar o perfil.";
  }).finally(onReady);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    feedback.textContent = "";
    submit.disabled = true;
    try {
      const profile = await supplierProfiles.saveProfile(workspace.id, Object.fromEntries(new FormData(form)));
      fill(profile);
      feedback.textContent = "Perfil industrial salvo. Ele já pode participar de novos matches.";
    } catch (error) {
      feedback.textContent = error?.message ?? "Não foi possível salvar o perfil.";
    } finally {
      if (!disposed) submit.disabled = false;
    }
  });
  return () => { disposed = true; container.replaceChildren(); };
}
