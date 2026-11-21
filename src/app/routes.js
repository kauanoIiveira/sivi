export const ROUTE_PATHS = Object.freeze({
  publicHome: "/",
  publicAbout: "/quem-somos",
  publicPlatform: "/plataforma",
  publicFaq: "/duvidas",
  access: "/acesso",
  context: "/app/contexto",
  buyerHome: "/app/comprador/inicio",
  buyerSuppliers: "/app/comprador/fornecedores",
  buyerReviews: "/app/comprador/avaliacoes",
  supplierHome: "/app/fornecedor/inicio",
  adminHome: "/app/administracao/inicio",
});

const route = (definition) => Object.freeze(definition);

export const APP_ROUTES = Object.freeze([
  route({ id: "public-home", path: "/", surface: "public", access: "public", title: "SIVI — Vendas industriais" }),
  route({ id: "public-about", path: ROUTE_PATHS.publicAbout, surface: "public", access: "public", title: "Quem somos — SIVI" }),
  route({ id: "public-platform", path: ROUTE_PATHS.publicPlatform, surface: "public", access: "public", title: "O que fazemos — SIVI" }),
  route({ id: "public-faq", path: ROUTE_PATHS.publicFaq, surface: "public", access: "public", title: "Perguntas frequentes — SIVI" }),
  ...[ ["buyer", "comprador", "demands", "demandas", "Minhas demandas"], ["buyer", "comprador", "proposals", "propostas", "Propostas recebidas"], ["buyer", "comprador", "orders", "pedidos", "Meus pedidos"], ["supplier", "fornecedor", "demands", "oportunidades", "Oportunidades"], ["supplier", "fornecedor", "proposals", "propostas", "Minhas propostas"], ["supplier", "fornecedor", "orders", "pedidos", "Pedidos recebidos"] ].map(([role, context, section, slug, title]) => route({ id: `${role}-${section}`, path: `/app/${context}/${slug}`, surface: "app", access: "authenticated", workspaceRole: role, section, title })),
  route({ id: "supplier-profile", path: "/app/fornecedor/perfil", surface: "app", access: "authenticated", workspaceRole: "supplier", section: "profile", title: "Perfil industrial" }),
  route({ id: "access", path: ROUTE_PATHS.access, surface: "auth", access: "public", title: "Acesso" }),
  route({ id: "context", path: ROUTE_PATHS.context, surface: "app", access: "authenticated", title: "Empresas e atuação" }),
  route({ id: "buyer-home", path: ROUTE_PATHS.buyerHome, surface: "app", access: "authenticated", workspaceRole: "buyer", title: "Visão geral" }),
  route({ id: "buyer-suppliers", path: ROUTE_PATHS.buyerSuppliers, surface: "app", access: "authenticated", workspaceRole: "buyer", title: "Fornecedores" }),
  route({ id: "buyer-reviews", path: ROUTE_PATHS.buyerReviews, surface: "app", access: "authenticated", workspaceRole: "buyer", title: "Avaliações" }),
  route({ id: "supplier-home", path: ROUTE_PATHS.supplierHome, surface: "app", access: "authenticated", workspaceRole: "supplier", title: "Visão do fornecedor" }),
  route({ id: "admin-home", path: ROUTE_PATHS.adminHome, surface: "app", access: "authenticated", workspaceRole: "administration", title: "Visão administrativa" }),
]);

export function getRouteById(id) {
  return APP_ROUTES.find((candidate) => candidate.id === id) ?? null;
}
