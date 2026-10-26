import '/src/theme/theme-controller.js';
import '/src/theme/preferences-dialog.js';
import { createAppShell } from '/src/layouts/app-shell/app-shell.js';
import { mountBuyerOverviewPage } from '/src/pages/dashboard/buyer-overview-page.js';
import { mountSupplierDashboardPage } from '/src/pages/dashboard/supplier-dashboard-page.js';
import { mountAdminDashboardPage } from '/src/pages/dashboard/admin-dashboard-page.js';
import { mountOperationsPage } from '/src/pages/operations/operations-page.js';
import { mountContextPage } from '/src/pages/context/context-page.js';
import { mountBuyerSuppliersPage } from '/src/pages/buyer/suppliers-page.js';
import { mountBuyerReviewsPage } from '/src/pages/buyer/reviews-page.js';
import { mountSupplierProfilePage } from '/src/pages/supplier/profile-page.js';
import { createWorkspacePreview } from './workspace-preview-data.js';

const preview = createWorkspacePreview();
const params = new URLSearchParams(location.search);
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
  const title = path.endsWith('/inicio') ? 'Visão geral' : path.endsWith('/contexto') ? 'Empresas e atuação' : ({ demandas:'Demandas', oportunidades:'Oportunidades', propostas:'Propostas', pedidos:'Pedidos', fornecedores:'Fornecedores', avaliacoes:'Avaliações', perfil:'Perfil industrial' }[path.split('/').at(-1)] ?? 'Visão geral');
  const items = [{ id: `${workspace.organizationRole}-home`, label: 'Visão geral', path: home() }];
  if (workspace.organizationRole !== 'administration') {
    if (workspace.organizationRole === 'buyer') items.push({ id:'buyer-suppliers', label:'Fornecedores', path:'/app/comprador/fornecedores' });
    items.push(...[['demands', workspace.organizationRole === 'buyer' ? 'Demandas' : 'Oportunidades', workspace.organizationRole === 'buyer' ? 'demandas' : 'oportunidades'], ['proposals','Propostas','propostas'], ['orders','Pedidos','pedidos']].map(([id,label,slug])=>({id:`${workspace.organizationRole}-${id}`,label,path:`/app/${labels[workspace.organizationRole]}/${slug}`})));
    items.push(workspace.organizationRole === 'buyer' ? {id:'buyer-reviews',label:'Avaliações',path:'/app/comprador/avaliacoes'} : {id:'supplier-profile',label:'Perfil industrial',path:'/app/fornecedor/perfil'});
  }
  items.push({ id:'context',label:'Empresas e atuação',path:'/app/contexto' });
  shell.setIdentity({ user: { displayName: 'Mariana Oliveira', uid: 'preview-only', email: 'pessoa@example.test' }, workspace, accountSource:'test' });
  shell.setNavigation(items.map(item=>({...item,current:item.path===path})));
  shell.setRouteMeta({ title, breadcrumbs:[workspace.organizationName,title], routeId:path.endsWith('/inicio') ? `${workspace.organizationRole}-home` : `${workspace.organizationRole}-${path.split('/').at(-1)}` });
  const shared = { container:shell.outlet, workspace, repository:preview.repository, onReady:()=>shell.focusRouteTitle() };
  if (path.endsWith('/contexto')) cleanup=mountContextPage({container:shell.outlet,workspaces:preview.workspaces,onSelect:id=>{roleControl.value=preview.workspaces.find(item=>item.id===id).organizationRole;navigate(home());}});
  else if (workspace.organizationRole==='administration') cleanup=mountAdminDashboardPage({...shared,administration:preview.administration});
  else if (path.endsWith('/fornecedores')) cleanup=mountBuyerSuppliersPage(shared);
  else if (path.endsWith('/avaliacoes')) cleanup=mountBuyerReviewsPage(shared);
  else if (path.endsWith('/perfil')) cleanup=mountSupplierProfilePage({...shared,supplierProfiles:preview.supplierProfiles});
  else if (['demandas','oportunidades','propostas','pedidos'].includes(path.split('/').at(-1))) cleanup=mountOperationsPage({...shared,section:({demandas:'demands',oportunidades:'demands',propostas:'proposals',pedidos:'orders'})[path.split('/').at(-1)]});
  else cleanup=workspace.organizationRole==='buyer' ? mountBuyerOverviewPage({...shared,user:{displayName:'Mariana Oliveira'}}) : mountSupplierDashboardPage({...shared,supplierProfiles:preview.supplierProfiles});
}
roleControl.addEventListener('change',()=>{if(location.hash===`#${home()}`)render();else navigate(home());});
stateControl.addEventListener('change',render);
window.addEventListener('hashchange',render);
if (!location.hash) { history.replaceState(null,'',`#${home()}`); }
render();
