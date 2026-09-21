import { mountApplicationForm } from './application-form.js';
import { applicationLabels, canResubmitApplication } from '../../domain/organization-application.js';

const node = (tag, text, className) => { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; return el; };
export function mountContextPage({ container, workspaces, onSelect, onCreate, onboarding }) {
  container.innerHTML = `<section class="context-page" aria-labelledby="context-title">
    <header class="context-page__header"><span class="context-page__eyebrow">EMPRESAS DA SUA CONTA</span><h1 id="context-title" data-page-title>Qual empresa você vai usar?</h1><p>Consulte seu cadastro ou escolha como deseja atuar na empresa.</p></header>
    <div class="application-actions"><button type="button" data-new>Cadastrar empresa</button><button type="button" data-refresh>Atualizar situação</button></div>
    <p role="status" data-feedback></p><div data-application-panel></div><div class="context-page__grid" data-workspace-options></div>
  </section>`;
  let disposed = false, detailRevision = 0;
  let cleanupForm = () => {};
  const panel = container.querySelector('[data-application-panel]');
  const feedback = container.querySelector('[data-feedback]');
  const closePanel = () => { detailRevision++; cleanupForm(); panel.replaceChildren(); };
  const openForm = (initial = {}) => {
    closePanel();
    cleanupForm = mountApplicationForm({ container: panel, initial, onCancel: closePanel, onSubmit: async values => {
      if (initial.id) { await onboarding.resubmitOrganization(initial.id, values); await onboarding.refresh(); }
      else await onCreate(values);
      if (!disposed) { closePanel(); feedback.textContent = 'Cadastro enviado para análise. Acompanhe a situação abaixo.'; }
    } });
    panel.querySelector('h2').focus();
  };
  container.querySelector('[data-new]').hidden = typeof onCreate !== 'function';
  container.querySelector('[data-new]').addEventListener('click', () => openForm());
  const refresh = container.querySelector('[data-refresh]');
  refresh.hidden = !onboarding;
  refresh.addEventListener('click', async () => {
    refresh.disabled = true; feedback.textContent = 'Consultando situação…';
    try { await onboarding.refresh(); if (!disposed) feedback.textContent = 'Situação atualizada.'; }
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
    card.append(node('span', applicationLabels[workspace.organizationStatus] ?? 'Empresa ativa', 'context-page__eyebrow'), node('h2', workspace.organizationName));
    if (workspace.canEnter !== false) {
      const actions = node('div', '', 'application-actions');
      for (const role of group) {
        const label = role.organizationRole === 'administration' ? 'Abrir portal administrativo' : role.organizationRole === 'buyer' ? 'Entrar como comprador' : 'Entrar como fornecedor';
        const button = node('button', label, 'context-card');
        button.setAttribute('aria-label', `${label} — ${workspace.organizationName}`);
        button.type = 'button'; button.dataset.workspaceId = role.id;
        button.addEventListener('click', () => onSelect(role.id)); actions.append(button);
      }
      card.append(actions);
    } else {
      card.append(node('p', ({ pending: 'Cadastro enviado para análise. Após a aprovação, você poderá começar a negociar.', changes_requested: 'A administração solicitou ajustes. Consulte o motivo e corrija o cadastro.', rejected: 'Sua solicitação não foi aprovada. Consulte o motivo abaixo.', blocked: 'O acesso comercial desta empresa foi suspenso. Consulte o motivo.' })[workspace.organizationStatus] ?? 'Consulte a situação do cadastro.'));
    }
    if (onboarding && workspace.organizationRole !== 'administration') {
      const inspect = node('button', 'Consultar cadastro'); inspect.type = 'button';
      inspect.addEventListener('click', async () => {
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
  if (!workspaces.length && typeof onCreate === 'function') openForm();
  return () => { disposed = true; closePanel(); container.replaceChildren(); };
}
