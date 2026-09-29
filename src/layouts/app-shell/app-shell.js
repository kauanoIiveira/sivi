const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const accountSourceLabels = Object.freeze({
  firebase: "Conta autenticada",
  test: "Conta de teste",
});

const icons = {
  home: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  demands: '<path d="M7 3h10v4H7zM5 5H3v16h18V5h-2M7 12h10M7 16h7"/>',
  proposals: '<path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8M8 16h5"/>',
  orders: '<path d="m3 7 9-4 9 4v11l-9 4-9-4zM3 7l9 4 9-4M12 11v11M7 5l10 4"/>',
  profile: '<path d="M3 21V9l6 3V7l6 3V3h6v18zM7 16h1M12 16h1M17 16h1"/>',
  context: '<path d="M3 21V3h12v18M15 9h6v12M7 7h4M7 12h4M7 17h4M1 21h22"/>',
  suppliers: '<path d="M3 21V8l6 3V7l6 3V3h6v18zM7 16h2M13 16h2M18 10h2"/>',
  reviews: '<path d="m12 2 3.1 6.3 7 .9-5.1 5 .9 7-5.9-3.2-5.9 3.2.9-7-5.1-5 7-.9z"/>',
};
const icon = (name) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true">${icons[name] ?? icons.home}</svg>`;

export function createAppShell({ root, onNavigate, onLogout, onChangeContext }) {
  root.innerHTML = `
    <div class="app-shell" data-app-shell data-drawer-open="false">
      <a class="app-shell__skip" href="#app-content">Pular para o conteúdo</a>
      <div class="app-shell__overlay" data-drawer-overlay hidden></div>
      <aside class="app-shell__sidebar" id="app-sidebar" data-app-sidebar aria-label="Navegação principal">
        <div class="app-shell__brand">
          <span><strong>SIVI<span class="app-shell__brand-dot" aria-hidden="true">.</span></strong><small>Vendas industriais</small></span>
        </div>
        <span class="app-shell__nav-label">Área de trabalho</span>
        <nav><ul class="app-shell__nav" data-navigation-list></ul></nav>
        <div class="app-shell__identity">
          <strong data-organization-name>Escolha uma empresa</strong>
          <span data-context-role>Atuação não selecionada</span>
          <span data-user-name>Usuário SIVI</span>
          <button class="app-shell__context-action app-shell__text-button" type="button" data-change-context-compact>Trocar empresa</button>
        </div>
      </aside>
      <div class="app-shell__workspace">
        <header class="app-shell__header">
          <button class="app-shell__icon-button" type="button" data-drawer-trigger aria-label="Abrir menu" aria-controls="app-sidebar" aria-expanded="false">☰</button>
          <div class="app-shell__route-meta">
            <span data-breadcrumbs>Início</span>
            <strong data-route-title>Carregando</strong>
          </div>
          <div class="app-shell__actions">
            <button class="app-shell__text-button" type="button" data-change-context>Trocar empresa</button>
            <button class="app-shell__icon-button" type="button" data-theme-toggle aria-label="Alternar tema">◐</button>
            <details class="app-shell__account" data-account-menu>
              <summary class="app-shell__text-button" aria-label="Menu da conta" aria-controls="account-options" aria-expanded="false">Conta</summary>
              <div class="app-shell__account-popover" id="account-options">
                <strong data-account-user>Usuário SIVI</strong>
                <span data-account-source>Conta autenticada</span>
                <button class="app-shell__text-button" type="button" data-open-preferences>Aparência e acessibilidade</button>
                <button class="app-shell__text-button" type="button" data-logout>Sair</button>
              </div>
            </details>
          </div>
        </header>
        <main class="app-shell__content" id="app-content" tabindex="-1" data-app-outlet></main>
      </div>
      <div class="sr-only" aria-live="polite" aria-atomic="true" data-app-announcer></div>
    </div>`;

  const shell = root.querySelector("[data-app-shell]");
  const skipLink = root.querySelector(".app-shell__skip");
  const sidebar = root.querySelector("[data-app-sidebar]");
  const workspaceRegion = root.querySelector(".app-shell__workspace");
  const overlay = root.querySelector("[data-drawer-overlay]");
  const drawerTrigger = root.querySelector("[data-drawer-trigger]");
  const navigationList = root.querySelector("[data-navigation-list]");
  const outlet = root.querySelector("[data-app-outlet]");
  const announcer = root.querySelector("[data-app-announcer]");
  const accountMenu = root.querySelector("[data-account-menu]");
  const accountTrigger = accountMenu.querySelector("summary");
  const compactDrawer = window.matchMedia("(max-width: 899px)");
  let drawerReturnTarget = drawerTrigger;

  const syncAccountState = () => {
    accountTrigger.setAttribute("aria-expanded", String(accountMenu.open));
  };

  const closeAccount = ({ restoreFocus = false } = {}) => {
    if (!accountMenu.open) return;
    accountMenu.open = false;
    syncAccountState();
    if (restoreFocus) accountTrigger.focus();
  };

  const onAccountOutsideInteraction = (event) => {
    if (!accountMenu.contains(event.target)) closeAccount();
  };

  const closeDrawer = ({ restoreFocus = false } = {}) => {
    shell.dataset.drawerOpen = "false";
    drawerTrigger.setAttribute("aria-expanded", "false");
    drawerTrigger.setAttribute("aria-label", "Abrir menu");
    overlay.hidden = true;
    skipLink.inert = false;
    workspaceRegion.inert = false;
    sidebar.inert = compactDrawer.matches;
    document.body.removeAttribute("data-drawer-open");
    if (restoreFocus) drawerReturnTarget?.focus();
  };

  const openDrawer = () => {
    closeAccount();
    drawerReturnTarget = document.activeElement;
    shell.dataset.drawerOpen = "true";
    drawerTrigger.setAttribute("aria-expanded", "true");
    drawerTrigger.setAttribute("aria-label", "Fechar menu");
    overlay.hidden = false;
    skipLink.inert = true;
    workspaceRegion.inert = true;
    sidebar.inert = false;
    document.body.dataset.drawerOpen = "true";
    sidebar.querySelector(focusableSelector)?.focus();
  };

  const onKeydown = (event) => {
    if (event.key === "Escape" && accountMenu.open) {
      event.preventDefault();
      closeAccount({ restoreFocus: true });
      return;
    }
    if (shell.dataset.drawerOpen !== "true") return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeDrawer({ restoreFocus: true });
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...sidebar.querySelectorAll(focusableSelector)];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const syncDrawerAvailability = () => {
    if (compactDrawer.matches) {
      sidebar.inert = shell.dataset.drawerOpen !== "true";
      return;
    }
    closeDrawer();
    sidebar.inert = false;
  };

  skipLink.addEventListener("click", (event) => {
    event.preventDefault();
    outlet.focus();
  });
  accountMenu.addEventListener("toggle", syncAccountState);
  drawerTrigger.addEventListener("click", () => {
    if (shell.dataset.drawerOpen === "true") closeDrawer({ restoreFocus: true });
    else openDrawer();
  });
  overlay.addEventListener("click", () => closeDrawer({ restoreFocus: true }));
  root.querySelector("[data-logout]").addEventListener("click", () => {
    closeAccount({ restoreFocus: true });
    onLogout();
  });
  root.querySelector("[data-change-context]").addEventListener("click", () => {
    closeAccount();
    onChangeContext();
  });
  root.querySelector("[data-change-context-compact]").addEventListener("click", () => {
    closeAccount();
    closeDrawer({ restoreFocus: true });
    onChangeContext();
  });
  document.addEventListener("keydown", onKeydown);
  document.addEventListener("click", onAccountOutsideInteraction);
  document.addEventListener("focusin", onAccountOutsideInteraction);
  compactDrawer.addEventListener("change", syncDrawerAvailability);
  syncDrawerAvailability();
  window.dispatchEvent(new Event("sivi:theme-refresh"));

  return {
    outlet,
    setIdentity({ user, workspace, accountSource = "firebase" }) {
      closeAccount({ restoreFocus: accountMenu.contains(document.activeElement) });
      const userName = user?.displayName ?? user?.email ?? "Usuário SIVI";
      shell.dataset.workspaceRole = workspace?.organizationRole ?? "none";
      accountTrigger.dataset.initials = userName.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
      const safeAccountSource = Object.hasOwn(accountSourceLabels, accountSource) ? accountSource : "firebase";
      root.querySelector("[data-user-name]").textContent = userName;
      root.querySelector("[data-account-user]").textContent = userName;
      const accountSourceElement = root.querySelector("[data-account-source]");
      accountSourceElement.dataset.accountSource = safeAccountSource;
      accountSourceElement.textContent = accountSourceLabels[safeAccountSource];
      root.querySelector("[data-organization-name]").textContent = workspace?.organizationName ?? "Escolha uma empresa";
      root.querySelector("[data-context-role]").textContent = workspace
        ? ({ buyer: "Atuação: compras", supplier: "Atuação: fornecimento", administration: "Administração da plataforma" })[workspace.organizationRole]
        : "Atuação não selecionada";
    },
    setNavigation(items) {
      navigationList.replaceChildren(...items.map((item) => {
        const entry = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#${item.path}`;
        link.dataset.routeId = item.id;
        link.innerHTML = icon(item.id.split("-").at(-1));
        const label = document.createElement("span");
        label.textContent = item.label;
        link.append(label);
        if (item.current) link.setAttribute("aria-current", "page");
        link.addEventListener("click", (event) => {
          event.preventDefault();
          closeAccount();
          closeDrawer({ restoreFocus: true });
          onNavigate(item.path);
        });
        entry.append(link);
        return entry;
      }));
    },
    setRouteMeta({ title, breadcrumbs, routeId }) {
      closeAccount({ restoreFocus: accountMenu.contains(document.activeElement) });
      shell.dataset.routeId = routeId ?? "";
      accountTrigger.textContent = ["buyer-home", "buyer-suppliers", "buyer-reviews"].includes(routeId) ? root.querySelector("[data-account-user]").textContent : "Conta";
      root.querySelector("[data-route-title]").textContent = title;
      root.querySelector("[data-breadcrumbs]").textContent = breadcrumbs.join(" / ");
      document.title = `${title} — SIVI`;
    },
    setBusy(value) {
      shell.setAttribute("aria-busy", String(Boolean(value)));
    },
    announce(message) {
      announcer.textContent = "";
      requestAnimationFrame(() => { announcer.textContent = message; });
    },
    focusRouteTitle() {
      const title = outlet.querySelector("[data-page-title]");
      if (!title) return;
      title.setAttribute("tabindex", "-1");
      title.focus({ preventScroll: true });
    },
    destroy() {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("click", onAccountOutsideInteraction);
      document.removeEventListener("focusin", onAccountOutsideInteraction);
      accountMenu.removeEventListener("toggle", syncAccountState);
      compactDrawer.removeEventListener("change", syncDrawerAvailability);
      closeAccount();
      closeDrawer();
      root.replaceChildren();
    },
  };
}
