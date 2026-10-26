import { mountApplicationForm } from './application-form.js';
import { applicationLabels, canResubmitApplication } from '../../domain/organization-application.js';

const node = (tag, text, className) => { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; return el; };
export function mountContextPage({ container, workspaces, workspaceState = { status: 'ready' }, currentWorkspace, preferredRole, notice, onSelect, onCreate, onboarding }) {
  container.innerHTML = `<section class="context-page" aria-labelledby="context-title">
    <header class="context-page__header"><h1 id="context-title" data-page-title>Qual empresa você vai usar?</h1><p>Sua conta pode acessar empresas diferentes. Escolha a empresa e o trabalho que deseja fazer: comprar ou fornecer.</p></header>
    <div class="application-actions"><button type="button" data-new>Cadastrar empresa</button><button type="button" data-refresh>Atualizar situação</button></div>
    <p role="status" data-feedback></p><div data-application-panel></div><div class="context-page__grid" data-workspace-options></div>
  </section>`;
  let disposed = false, detailRevision = 0;
  let cleanupForm = () => {};
  const signupDraft = onboarding?.getSignupDraft?.();
  const panel = container.querySelector('[data-application-panel]');
  const feedback = container.querySelector('[data-feedback]');
  feedback.tabIndex = -1;
  const canReplacePanel = () => {
    if (panel.querySelector('form[aria-busy=true]')) { feedback.textContent = 'Aguarde o envio do cadastro terminar.'; feedback.focus(); return false; }
    const form = panel.querySelector('form[data-dirty=true]');
    if (!form) return true;
    if (!window.confirm('Descartar as alterações não enviadas deste cadastro?')) return false;
    delete form.dataset.dirty;
    return true;
  };
  const closePanel = () => { detailRevision++; cleanupForm(); panel.replaceChildren(); };
  const openForm = (initial = { roles: preferredRole ? { [preferredRole]: true } : {} }) => {
    if (!canReplacePanel()) return;
    closePanel();
    cleanupForm = mountApplicationForm({ container: panel, initial, startAtReview: Boolean(initial.signupDraftId), onCancel: () => { if (canReplacePanel()) { closePanel(); container.querySelector('[data-new]').focus(); } }, onSubmit: async values => {
      if (initial.id) {
        await onboarding.resubmitOrganization(initial.id, values);
        if (disposed) return;
        closePanel(); feedback.textContent = 'Cadastro reenviado. Atualizando a situação…';
        try { await onboarding.refresh(); }
        catch { if (!disposed) feedback.textContent = 'Cadastro reenviado. Não foi possível atualizar a lista; use Atualizar situação.'; return; }
      }
      else {
        const organizationId = initial.signupDraftId ? onboarding.getSignupAttempt(initial.signupDraftId) : undefined;
        await onCreate(values, organizationId ? { organizationId } : undefined);
        if (initial.signupDraftId) onboarding.clearSignupDraft(initial.signupDraftId);
      }
      if (!disposed) { closePanel(); feedback.textContent = 'Cadastro enviado para análise. Acompanhe a situação abaixo.'; }
    } });
    panel.querySelector('h2').focus();
  };
  container.querySelector('[data-new]').hidden = typeof onCreate !== 'function';
  container.querySelector('[data-new]').addEventListener('click', () => openForm());
  const refresh = container.querySelector('[data-refresh]');
  refresh.hidden = !onboarding;
  refresh.addEventListener('click', async () => {
    if (refresh.disabled) return;
    if (panel.querySelector('form[data-dirty=true], form[aria-busy=true]')) {
      feedback.textContent = 'Envie ou cancele o cadastro em preenchimento antes de atualizar a situação.'; feedback.focus(); return;
    }
    refresh.disabled = true; feedback.textContent = 'Consultando situação…';
    try { await (workspaceState.status === 'error' ? onboarding.retry() : onboarding.refresh()); if (!disposed) feedback.textContent = 'Situação atualizada.'; }
    catch { if (!disposed) feedback.textContent = 'Não foi possível atualizar. Tente novamente.'; }
    finally { refresh.disabled = false; }
  });
  const groups = new Map();
  for (const workspace of workspaces) {
    const id = workspace.organizationId ?? workspace.id;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(workspace);
  }
  for (const group of groups.values()) {
    const workspace = group[0];
    const card = node('article', '', 'context-company');
    card.dataset.status = workspace.organizationStatus ?? 'active';
    card.append(node('span', workspace.organizationRole === 'administration' ? 'Administração da plataforma' : applicationLabels[workspace.organizationStatus] ?? 'Empresa ativa', 'context-page__eyebrow'), node('h2', workspace.organizationName));
    if (workspace.organizationRole === 'administration') card.append(node('p', 'Analise cadastros e acompanhe a plataforma. Este acesso não representa uma empresa compradora ou fornecedora.'));
    else if (workspace.canEnter !== false) card.append(node('p', group.length > 1 ? 'Esta empresa compra e fornece. Você pode trocar de atuação nesta página sem criar outra conta.' : workspace.organizationRole === 'buyer' ? 'Crie demandas, compare propostas e acompanhe seus pedidos.' : 'Consulte oportunidades, envie propostas e execute seus pedidos.'));
    if (workspace.canEnter !== false) {
      const actions = node('div', '', 'application-actions');
      for (const role of group) {
        const label = role.organizationRole === 'administration' ? 'Abrir portal administrativo' : role.organizationRole === 'buyer' ? 'Entrar como comprador' : 'Entrar como fornecedor';
        const button = node('button', label, 'context-card');
        button.setAttribute('aria-label', `${label} — ${workspace.organizationName}`);
        button.type = 'button'; button.dataset.workspaceId = role.id;
        if (currentWorkspace?.id === role.id) { button.setAttribute('aria-current', 'true'); card.append(node('p', `Em uso: ${role.organizationRole === 'buyer' ? 'comprador' : role.organizationRole === 'supplier' ? 'fornecedor' : 'administração'}.`)); }
        button.addEventListener('click', () => { if (canReplacePanel()) onSelect(role.id); }); actions.append(button);
      }
      card.append(actions);
    } else {
      card.append(node('p', ({ pending: 'Cadastro enviado para análise. Após a aprovação, você poderá começar a negociar.', changes_requested: 'A administração solicitou ajustes. Consulte o motivo e corrija o cadastro.', rejected: 'Sua solicitação não foi aprovada. Consulte o motivo abaixo.', blocked: 'O acesso comercial desta empresa foi suspenso. Consulte o motivo.' })[workspace.organizationStatus] ?? 'Consulte a situação do cadastro.'));
    }
    if (onboarding && workspace.organizationRole !== 'administration') {
      const inspect = node('button', 'Consultar cadastro'); inspect.type = 'button';
      inspect.addEventListener('click', async () => {
        if (!canReplacePanel()) return;
        closePanel(); const revision = detailRevision; panel.textContent = 'Carregando cadastro…';
        try {
          const organization = await onboarding.getOrganization(workspace.organizationId ?? workspace.id);
          if (disposed || revision !== detailRevision) return;
          if (!organization) throw new Error('Cadastro não encontrado. Atualize a situação.');
          panel.replaceChildren();
          const detail = node('section', '', 'application-detail');
          const title = node('h2', organization.name); title.tabIndex = -1;
          detail.append(title, node('p', applicationLabels[organization.status]));
          const dl = node('dl', '');
          for (const [label, value] of [['CNPJ', organization.cnpj], ['Localização', organization.city ? `${organization.city}/${organization.state}` : ''], ['Contato', organization.contact], ['Enviado em', organization.createdAt ? new Date(organization.createdAt).toLocaleString('pt-BR') : '']]) dl.append(node('dt', label), node('dd', value || 'Não informado no cadastro anterior'));
          detail.append(dl);
          if (organization.reviewReason) detail.append(node('p', `Retorno da administração: ${organization.reviewReason}`, 'application-reason'));
          if (canResubmitApplication(organization.status) && organization.createdBy === workspace.memberUid) {
            const edit = node('button', organization.status === 'changes_requested' ? 'Corrigir e reenviar' : 'Editar cadastro'); edit.type = 'button';
            edit.addEventListener('click', () => openForm(organization)); detail.append(edit);
          }
          const close = node('button', 'Fechar cadastro'); close.type = 'button'; close.addEventListener('click', closePanel); detail.append(close);
          panel.append(detail); title.focus();
        } catch (cause) { if (!disposed && revision === detailRevision) panel.textContent = cause?.message ?? 'Não foi possível carregar. Tente novamente.'; }
      });
      card.append(inspect);
    }
    container.querySelector('[data-workspace-options]').append(card);
  }
  if (['idle', 'loading'].includes(workspaceState.status)) {
    feedback.textContent = 'Consultando as empresas vinculadas à sua conta…';
    container.querySelector('[data-new]').disabled = true;
    refresh.disabled = true;
  } else if (workspaceState.status === 'error') {
    feedback.textContent = 'Não foi possível consultar suas empresas. Use Tentar novamente antes de cadastrar uma nova empresa.';
    container.querySelector('[data-new]').disabled = true;
    refresh.textContent = 'Tentar novamente';
  } else if (!workspaces.length && typeof onCreate === 'function') {
    feedback.textContent = 'Sua conta ainda não está vinculada a uma empresa. Cadastre a empresa pela qual você vai negociar. Se já existe um cadastro, consulte o responsável antes de enviar outro.';
    if (signupDraft) {
      feedback.textContent = 'Retomamos os dados informados no cadastro da conta. Confira antes de solicitar a análise. Nenhuma cobrança foi realizada.';
      openForm({ ...signupDraft.organization, signupDraftId: signupDraft.id });
    } else openForm();
  }
  if (signupDraft && workspaces.length && workspaceState.status === 'ready') {
    const resume = node('button', 'Retomar empresa do cadastro inicial'); resume.type = 'button';
    resume.addEventListener('click', () => openForm({ ...signupDraft.organization, signupDraftId: signupDraft.id }));
    container.querySelector('.application-actions').append(resume);
  }
  if (workspaceState.status === 'ready' && notice) feedback.textContent = notice;
  return () => { disposed = true; closePanel(); container.replaceChildren(); };
}
