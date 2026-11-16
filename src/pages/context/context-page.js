import { mountApplicationForm } from './application-form.js';
import { applicationLabels, canResubmitApplication } from '../../domain/organization-application.js';

const node = (tag, text, className) => { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; return el; };
export function mountContextPage({ container, workspaces, workspaceState = { status: 'ready' }, currentWorkspace, preferredRole, notice, onSelect, onCreate, onboarding }) {
  container.innerHTML = `<section class="context-page workspace-page" aria-labelledby="context-title">
    <header class="context-page__header workspace-page__header">
      <div><h1 id="context-title" data-page-title>Empresas e atuação</h1><p>Escolha a empresa e a atuação que você quer usar.</p></div>
      <div class="application-actions workspace-page__actions"><button type="button" data-refresh>Atualizar situação</button><button type="button" data-new>Cadastrar empresa</button></div>
    </header>
    <p role="status" data-feedback></p><div data-application-panel></div>
    <section class="workspace-panel context-companies" aria-labelledby="context-companies-title">
      <h2 id="context-companies-title">Empresas vinculadas</h2>
      <div class="context-page__grid workspace-records" data-workspace-options></div>
    </section>
  </section>`;
  let disposed = false, detailRevision = 0;
  let cleanupForm = () => {};
  const signupDraft = onboarding?.getSignupDraft?.();
  const panel = container.querySelector('[data-application-panel]');
  const feedback = container.querySelector('[data-feedback]');
  const newCompany = container.querySelector('[data-new]');
  feedback.tabIndex = -1;
  const canReplacePanel = () => {
    if (panel.querySelector('form[aria-busy=true]')) { feedback.textContent = 'Aguarde o envio do cadastro terminar.'; feedback.focus(); return false; }
    const form = panel.querySelector('form[data-dirty=true]');
    if (!form) return true;
    if (!window.confirm('Descartar as alterações não enviadas deste cadastro?')) return false;
    delete form.dataset.dirty;
    return true;
  };
  const closePanel = () => { detailRevision++; cleanupForm(); cleanupForm = () => {}; panel.replaceChildren(); };
  const openForm = (initial = { roles: preferredRole ? { [preferredRole]: true } : {} }, returnFocus = newCompany) => {
    if (!canReplacePanel()) return;
    closePanel();
    cleanupForm = mountApplicationForm({ container: panel, initial, startAtReview: Boolean(initial.signupDraftId), onCancel: () => { if (canReplacePanel()) { closePanel(); returnFocus.focus(); } }, onSubmit: async values => {
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
  newCompany.hidden = typeof onCreate !== 'function';
  newCompany.addEventListener('click', () => openForm());
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
    const card = node('article', '', 'context-company workspace-record');
    card.dataset.status = workspace.organizationStatus ?? 'active';
    const identity = node('div', '', 'context-company__identity');
    const heading = node('div', '', 'workspace-record__heading');
    heading.append(node('h3', workspace.organizationName), node('span', workspace.organizationRole === 'administration' ? 'Administração da plataforma' : applicationLabels[workspace.organizationStatus] ?? 'Empresa ativa', 'context-page__eyebrow'));
    identity.append(heading);
    const actions = node('div', '', 'application-actions');
    if (workspace.canEnter !== false) {
      for (const role of group) {
        const label = role.organizationRole === 'administration' ? 'Abrir portal administrativo' : role.organizationRole === 'buyer' ? 'Entrar como comprador' : 'Entrar como fornecedor';
        const button = node('button', label, 'context-card');
        button.setAttribute('aria-label', `${label} — ${workspace.organizationName}`);
        button.type = 'button'; button.dataset.workspaceId = role.id;
        button.addEventListener('click', () => { if (canReplacePanel()) onSelect(role.id); });
        const action = node('div', '', 'context-company__role');
        action.append(button);
        if (currentWorkspace?.id === role.id) {
          button.setAttribute('aria-current', 'true');
          action.append(node('span', 'Em uso', 'context-company__current'));
        }
        actions.append(action);
      }
    } else {
      identity.append(node('p', ({ pending: 'Cadastro enviado para análise. Após a aprovação, você poderá começar a negociar.', changes_requested: 'A administração solicitou ajustes. Consulte o motivo e corrija o cadastro.', rejected: 'Sua solicitação não foi aprovada. Consulte o motivo abaixo.', blocked: 'O acesso comercial desta empresa foi suspenso. Consulte o motivo.' })[workspace.organizationStatus] ?? 'Consulte a situação do cadastro.'));
    }
    if (onboarding && workspace.organizationRole !== 'administration') {
      const inspect = node('button', 'Consultar cadastro', 'context-company__inspect'); inspect.type = 'button';
      inspect.setAttribute('aria-label', `Consultar cadastro — ${workspace.organizationName}`);
      inspect.addEventListener('click', async () => {
        if (!canReplacePanel()) return;
        closePanel(); const revision = detailRevision;
        const loading = node('p', 'Carregando cadastro…');
        loading.setAttribute('role', 'status');
        panel.append(loading);
        try {
          const organization = await onboarding.getOrganization(workspace.organizationId ?? workspace.id);
          if (disposed || revision !== detailRevision) return;
          if (!organization) throw new Error('Cadastro não encontrado. Atualize a situação.');
          panel.replaceChildren();
          const detail = node('section', '', 'application-detail');
          const title = node('h2', organization.name); title.tabIndex = -1;
          detail.append(title, node('p', applicationLabels[organization.status]));
          const dl = node('dl', '');
          for (const [label, value] of [['CNPJ', organization.cnpj], ['Localização', [organization.city, organization.state].filter(Boolean).join('/')], ['Contato', organization.contact], ['Enviado em', organization.createdAt ? new Date(organization.createdAt).toLocaleString('pt-BR') : '']]) dl.append(node('dt', label), node('dd', value || 'Não informado'));
          detail.append(dl);
          if (organization.reviewReason) detail.append(node('p', `Retorno da administração: ${organization.reviewReason}`, 'application-reason'));
          if (canResubmitApplication(organization.status) && organization.createdBy === workspace.memberUid) {
            const edit = node('button', organization.status === 'changes_requested' ? 'Corrigir e reenviar' : 'Editar cadastro'); edit.type = 'button';
            edit.addEventListener('click', () => openForm(organization, inspect)); detail.append(edit);
          }
          const close = node('button', 'Fechar cadastro'); close.type = 'button';
          close.addEventListener('click', () => { closePanel(); inspect.focus(); }); detail.append(close);
          panel.append(detail); title.focus();
        } catch (cause) {
          if (!disposed && revision === detailRevision) {
            const error = node('p', cause?.message ?? 'Não foi possível carregar. Tente novamente.');
            error.setAttribute('role', 'alert');
            panel.replaceChildren(error);
          }
        }
      });
      actions.append(inspect);
    }
    card.append(identity, actions);
    container.querySelector('[data-workspace-options]').append(card);
  }
  if (['idle', 'loading'].includes(workspaceState.status)) {
    feedback.textContent = 'Consultando as empresas vinculadas à sua conta…';
    newCompany.disabled = true;
    refresh.disabled = true;
  } else if (workspaceState.status === 'error') {
    feedback.textContent = 'Não foi possível consultar suas empresas. Use Tentar novamente antes de cadastrar uma nova empresa.';
    newCompany.disabled = true;
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
    resume.addEventListener('click', () => openForm({ ...signupDraft.organization, signupDraftId: signupDraft.id }, resume));
    container.querySelector('.application-actions').append(resume);
  }
  if (workspaceState.status === 'ready' && notice) feedback.textContent = notice;
  return () => { disposed = true; closePanel(); container.replaceChildren(); };
}
