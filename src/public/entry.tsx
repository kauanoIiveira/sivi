import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { MotionConfig } from "motion/react";
import { Home } from "./home";
import { InformationPage } from "./information";
import { AuthExperience } from "./auth";
import { WorkspaceAnalytics } from '../workspace/analytics';
import "./public.css";
import "./demo.css";
import "./auth.css";
import "./finish.css";
import "./review-fixes.css";
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
export function mountPublicExperience(container: HTMLElement) {
  const page = new URLSearchParams(location.hash.split("?")[1]).get("pagina");
  const titles = {
    sobre: "Sobre a plataforma",
    seguranca: "Segurança e dados",
    privacidade: "Privacidade",
    condicoes: "Condições de uso",
    ajuda: "Ajuda e acesso",
    creditos: "Créditos",
  };
  document.title = page
    ? `${titles[page] ?? "Sobre a plataforma"} — SIVI`
    : "SIVI — O próximo acordo começa aqui.";
  return mount(
    container,
    page ? <InformationPage page={page} /> : <Home />,
    "sivi-public-ui",
  );
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
