import '/src/theme/theme-controller.js';
import '/src/theme/preferences-dialog.js';
import { createAppShell } from '/src/layouts/app-shell/app-shell.js';
import { APP_ROUTES } from '/src/app/routes.js';
import { mountBuyerOverviewPage } from '/src/pages/dashboard/buyer-overview-page.js';
import { mountSupplierDashboardPage } from '/src/pages/dashboard/supplier-dashboard-page.js';
import { mountAdminDashboardPage } from '/src/pages/dashboard/admin-dashboard-page.js';
import { mountOperationsPage } from '/src/pages/operations/operations-page.js';
import { mountContextPage } from '/src/pages/context/context-page.js';
import { mountBuyerSuppliersPage } from '/src/pages/buyer/suppliers-page.js';
import { mountBuyerSupplierDetailPage } from '/src/pages/buyer/supplier-detail-page.js';
import { mountBuyerReviewsPage } from '/src/pages/buyer/reviews-page.js';
import { mountSupplierProfilePage } from '/src/pages/supplier/profile-page.js';
import { mountConversationsPage } from '/src/pages/conversations/conversations-page.js';
import { createWorkspacePreview } from './workspace-preview-data.js';

const params = new URLSearchParams(location.search);
const preview = createWorkspacePreview({ expandedCatalog: params.get('catalog') === 'expanded' });
const roleControl = document.querySelector('[aria-label="Atuação da prévia"]');
const stateControl = document.querySelector('[aria-label="Estado da prévia"]');
roleControl.value = ['buyer', 'supplier', 'administration'].includes(params.get('role')) ? params.get('role') : 'buyer';
stateControl.value = ['normal','empty','error'].includes(params.get('state')) ? params.get('state') : 'normal';
let cleanup = () => {};
const root = document.querySelector('[data-workspace-preview]');
const navigate = path => { location.hash = `#${path}`; };
const shell = createAppShell({ root, onNavigate: navigate, onLogout: () => { location.href = '/#/'; }, onChangeContext: () => navigate('/app/contexto') });
root.querySelector('.app-shell__workspace-toolbar').append(document.querySelector('.workspace-preview-bar'));
const labels = { buyer: 'comprador', supplier: 'fornecedor', administration: 'administracao' };
const home = () => `/app/${labels[roleControl.value]}/inicio`;
function render() {
  cleanup();
  preview.repository.setMode(stateControl.value);
  const workspace = preview.workspaces.find(item => item.organizationRole === roleControl.value);
  const path = location.hash.slice(1).split('?')[0] || home();
  const route = APP_ROUTES.find(item => item.path === path);
  const title = route?.title ?? 'Visão geral';
  const items = [{ id: `${workspace.organizationRole}-home`, label: 'Visão geral', path: home() }];
  if (workspace.organizationRole !== 'administration') {
    if (workspace.organizationRole === 'buyer') items.push({ id:'buyer-suppliers', label:'Fornecedores', path:'/app/comprador/fornecedores' });
    items.push(...APP_ROUTES.filter(item => item.workspaceRole === workspace.organizationRole && ['demands', 'proposals', 'orders'].includes(item.section))
      .map(({ id, title, path }) => ({ id, label: title, path })));
    items.push(workspace.organizationRole === 'buyer' ? {id:'buyer-reviews',label:'Avaliações',path:'/app/comprador/avaliacoes'} : {id:'supplier-profile',label:'Perfil industrial',path:'/app/fornecedor/perfil'});
    const conversations = APP_ROUTES.find(item => item.id === `${workspace.organizationRole}-conversations`);
    items.push({ id: conversations.id, label: conversations.title, path: conversations.path });
  }
  items.push({ id:'context',label:'Empresas e atuação',path:'/app/contexto' });
  shell.setIdentity({ user: { displayName: 'Mariana Oliveira', uid: 'preview-only', email: 'pessoa@example.test' }, workspace, accountSource:'test' });
  const supplierDetail = route?.id === 'buyer-supplier-profile';
  const currentPath = supplierDetail ? '/app/comprador/fornecedores' : path;
  shell.setNavigation(items.map(item=>({...item,current:item.path===currentPath})));
  const breadcrumbs = supplierDetail ? [workspace.organizationName,'Fornecedores',title] : [workspace.organizationName,title];
  shell.setRouteMeta({ title, breadcrumbs, routeId:route?.id });
  const shared = { container:shell.outlet, workspace, repository:preview.repository, onReady:()=>shell.focusRouteTitle() };
  if (path.endsWith('/contexto')) cleanup = mountContextPage({
    container: shell.outlet,
    workspaces: stateControl.value === 'normal' ? preview.workspaces : [],
    workspaceState: { status: stateControl.value === 'error' ? 'error' : 'ready' },
    currentWorkspace: workspace,
    onCreate: preview.administration.registerOrganization,
    onboarding: {
      refresh: async () => {},
      retry: async () => { stateControl.value = 'normal'; render(); },
      getOrganization: async id => {
        const entry = preview.workspaces.find(item => item.organizationId === id);
        return entry && { name: entry.organizationName, status: 'active' };
      },
    },
    onSelect: id => {
      roleControl.value = preview.workspaces.find(item => item.id === id).organizationRole;
      navigate(home());
    },
  });
  else if (workspace.organizationRole==='administration') cleanup=mountAdminDashboardPage({...shared,administration:preview.administration});
  else if (supplierDetail && workspace.organizationRole === 'buyer') cleanup=mountBuyerSupplierDetailPage(shared);
  else if (path.endsWith('/fornecedores')) cleanup=mountBuyerSuppliersPage(shared);
  else if (path.endsWith('/avaliacoes')) cleanup=mountBuyerReviewsPage(shared);
  else if (route?.id === `${workspace.organizationRole}-conversations`) cleanup=mountConversationsPage(shared);
  else if (route?.id === 'supplier-profile') cleanup=mountSupplierProfilePage({...shared,supplierProfiles:preview.supplierProfiles});
  else if (['demandas','oportunidades','propostas','pedidos'].includes(path.split('/').at(-1))) cleanup=mountOperationsPage({...shared,section:({demandas:'demands',oportunidades:'demands',propostas:'proposals',pedidos:'orders'})[path.split('/').at(-1)]});
  else cleanup=workspace.organizationRole==='buyer' ? mountBuyerOverviewPage({...shared,user:{displayName:'Mariana Oliveira'}}) : mountSupplierDashboardPage({...shared,supplierProfiles:preview.supplierProfiles});
}
roleControl.addEventListener('change',()=>{if(location.hash===`#${home()}`)render();else navigate(home());});
stateControl.addEventListener('change',render);
window.addEventListener('hashchange',render);
if (!location.hash) { history.replaceState(null,'',`#${home()}`); }
render();
