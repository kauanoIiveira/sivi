import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { MotionConfig } from "motion/react";
import { Home } from "./home";
import { PlatformPage } from "./platform";
import { AboutPage, FaqPage } from "./site-pages";
import { isPlatformSection, type PublicPageName } from "./components";
import { InformationPage } from "./information";
import { AuthExperience } from "./auth";
import { WorkspaceAnalytics } from '../workspace/analytics';
import "./public.css";
import "./demo.css";
import "./auth.css";
import "./finish.css";
import "./review-fixes.css";
import "./brand-palette.css";
function mount(container: HTMLElement, content: any, className: string) {
  container.replaceChildren();
  const root = createRoot(container);
  flushSync(() =>
    root.render(
      <MotionConfig reducedMotion="user">
        <div className={className}>{content}</div>
      </MotionConfig>,
    ),
  );
  return () => root.unmount();
}
const publicPages = {
  home: { Page: Home, title: "SIVI — O próximo acordo começa aqui." },
  about: { Page: AboutPage, title: "Quem somos — SIVI" },
  platform: { Page: PlatformPage, title: "O que fazemos — SIVI" },
  faq: { Page: FaqPage, title: "Perguntas frequentes — SIVI" },
};

export function mountPublicExperience(container: HTMLElement, page: PublicPageName = "home") {
  const params = new URLSearchParams(location.hash.split("?")[1]);
  const information = page === "home" ? params.get("pagina") : null;
  const section = params.get("secao");
  const titles: Record<string, string> = {
    seguranca: "Segurança e dados",
    privacidade: "Política de privacidade",
    condicoes: "Condições de uso",
    ajuda: "Ajuda e acesso",
    creditos: "Créditos",
  };
  if (information && information !== "sobre") {
    document.title = `${titles[information] ?? "Sobre a plataforma"} — SIVI`;
    return mount(container, <InformationPage page={information} />, "sivi-public-ui");
  }

  if (information === "sobre" || (page === "home" && section === "visao-geral")) page = "about";
  if (page === "home" && isPlatformSection(section)) page = "platform";
  if (page === "home" && section === "duvidas") page = "faq";
  const { Page, title } = publicPages[page];
  document.title = title;
  return mount(container, <Page />, "sivi-public-ui");
}
export function mountAuthExperience(container: HTMLElement, bridge: any) {
  document.title =
    new URLSearchParams(location.hash.split("?")[1]).get("modo") === "login"
      ? "Entrar — SIVI"
      : "Cadastro — SIVI";
  return mount(container, <AuthExperience bridge={bridge} />, "sivi-auth-ui");
}
export function mountWorkspaceAnalytics(container: HTMLElement, options: any) {
  return mount(container, <WorkspaceAnalytics {...options} />, 'sivi-workspace-ui');
}
