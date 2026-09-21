const statusLabels = Object.freeze({ pending: "Pendente", active: "Ativa", blocked: "Bloqueada", changes_requested: 'Correção solicitada', rejected: 'Cadastro recusado' });
const roleLabel = (organization) => {
  const roles = organization.roles ?? { [organization.role]: true };
  if (roles.buyer && roles.supplier) return "Compradora e fornecedora";
  return roles.supplier ? "Fornecedora" : "Compradora";
};

export function mountAdminDashboardPage({ container, administration, onReady = () => {} }) {
  if (!administration) {
    container.innerHTML = '<section class="admin-organizations"><h1 data-page-title>Administração indisponível</h1><p>Não foi possível carregar o acesso administrativo.</p></section>';
    onReady();
    return () => container.replaceChildren();
  }
  container.innerHTML = `
    <section class="admin-organizations" aria-labelledby="admin-title">
      <header class="admin-organizations__header">
        <span>ADMINISTRAÇÃO SIVI</span>
        <h1 id="admin-title" data-page-title>Empresas do marketplace</h1>
        <p>Cadastre empresas para seus responsáveis e acompanhe as solicitações de acesso.</p>
      </header>
      <details class="admin-register">
        <summary>Cadastrar empresa</summary>
        <p>O responsável precisa ter uma conta no SIVI com e-mail confirmado e já ter entrado no sistema. A empresa será criada ativa e aparecerá para ele em “Empresas e atuação”.</p>
        <form data-admin-register>
          <label>Nome da empresa<input name="name" maxlength="120" required autocomplete="organization"></label>
          <label>E-mail do responsável<input name="ownerEmail" type="email" maxlength="254" required autocomplete="off"></label>
          <fieldset><legend>Atuação da empresa</legend><label><input type="checkbox" name="roles" value="buyer"> Compradora</label><label><input type="checkbox" name="roles" value="supplier"> Fornecedora</label></fieldset>
          <button type="submit">Cadastrar e liberar acesso</button>
          <p role="alert" data-admin-register-error></p>
        </form>
      </details>
      <p role="status" data-admin-feedback></p>
      <button type="button" data-admin-refresh>Atualizar solicitações</button>
      <div data-admin-content><p>Carregando empresas…</p></div>
    </section>`;
  const content = container.querySelector("[data-admin-content]");
  const feedback = container.querySelector("[data-admin-feedback]");
  let disposed = false;
  const registration = container.querySelector("[data-admin-register]");
  registration.addEventListener("input", () => { registration.querySelector("[data-admin-register-error]").textContent = ""; });
  registration.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = registration.querySelector("button");
    const error = registration.querySelector("[data-admin-register-error]");
    error.textContent = "";
    feedback.textContent = "";
    button.disabled = true;
    button.textContent = "Cadastrando…";
    try {
      const values = new FormData(registration);
      const created = await administration.registerOrganization({ name: values.get("name"), ownerEmail: values.get("ownerEmail"), roles: values.getAll("roles") });
      if (disposed) return;
      registration.reset();
      feedback.textContent = `${created.name}: empresa cadastrada. Acesso liberado para ${created.ownerEmail}.`;
      await render();
    } catch (cause) {
      if (!disposed) error.textContent = cause?.message ?? "Não foi possível cadastrar a empresa.";
    } finally {
      button.disabled = false;
      button.textContent = "Cadastrar e liberar acesso";
    }
  });

  const render = async () => {
    content.innerHTML = "<p>Carregando empresas…</p>";
    try {
      const organizations = await administration.listOrganizations();
      if (disposed) return;
      if (!organizations.length) {
        content.innerHTML = "<p>Nenhuma empresa cadastrada.</p>";
        return;
      }
      content.replaceChildren(...organizations.map((organization) => {
        const card = document.createElement("article");
        card.className = "admin-organization-card";
        card.dataset.status = organization.status;
        const heading = document.createElement("h2");
        heading.textContent = organization.name;
        const meta = document.createElement("p");
        meta.textContent = `${roleLabel(organization)} · ${statusLabels[organization.status] ?? organization.status}`;
        const identifier = document.createElement("small");
        identifier.textContent = `Solicitação ${organization.id}${organization.createdAt ? ` · Enviada em ${new Date(organization.createdAt).toLocaleDateString('pt-BR')}` : ''}`;
        const details = document.createElement('p');
        details.textContent = organization.cnpj ? `CNPJ: ${organization.cnpj} · ${organization.city}/${organization.state} · Contato: ${organization.contact}` : 'Cadastro anterior: dados complementares não informados.';
        const previousReason = document.createElement('p');
        previousReason.textContent = organization.reviewReason ? `Última análise: ${organization.reviewReason}` : '';
        const reason = document.createElement("input");
        reason.type = "text";
        reason.maxLength = 300;
        reason.placeholder = "Motivo da correção, recusa ou bloqueio";
        reason.setAttribute("aria-label", `Motivo para ${organization.name}`);
        const reasonLabel = document.createElement('label');
        reasonLabel.className = 'admin-review-reason';
        reasonLabel.textContent = 'Motivo da decisão';
        reasonLabel.append(reason);
        const actions = document.createElement("div");
        actions.className = "admin-organization-card__actions";
        const button = (label, status) => {
          const control = document.createElement("button");
          control.type = "button";
          control.textContent = label;
          control.dataset.decision = status;
          control.disabled = organization.status === status;
          control.addEventListener("click", async () => {
            feedback.textContent = "";
            for (const action of actions.querySelectorAll('button')) action.disabled = true;
            try {
              await administration.setOrganizationStatus(organization.id, status, reason.value, organization.updatedAt);
              if (disposed) return;
              feedback.textContent = `${organization.name}: ${status === 'active' ? 'cadastro aprovado' : statusLabels[status]}.`;
              await render();
            } catch (error) {
              feedback.textContent = error?.message ?? "Não foi possível atualizar a empresa.";
              for (const action of actions.querySelectorAll('button')) action.disabled = action.dataset.decision === organization.status;
            }
          });
          return control;
        };
        actions.append(button("Aprovar", "active"));
        if (['pending', 'changes_requested'].includes(organization.status)) actions.append(button('Solicitar correção', 'changes_requested'), button('Recusar cadastro', 'rejected'));
        if (['active', 'blocked'].includes(organization.status)) actions.append(button('Bloquear', 'blocked'));
        card.append(heading, meta, details, previousReason, identifier, reasonLabel, actions);
        return card;
      }));
    } catch (error) {
      if (!disposed) {
        const message = document.createElement("p");
        message.setAttribute("role", "alert");
        message.textContent = error?.message ?? "Não foi possível carregar as empresas.";
        const retry = document.createElement("button");
        retry.type = "button";
        retry.textContent = "Tentar novamente";
        retry.addEventListener("click", render, { once: true });
        content.replaceChildren(message, retry);
      }
    }
  };
  container.querySelector('[data-admin-refresh]').addEventListener('click', () => { feedback.textContent = ''; void render(); });
  void render().then(onReady);
  return () => { disposed = true; container.replaceChildren(); };
}
