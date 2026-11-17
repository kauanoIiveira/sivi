import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ROUTE_PATHS } from "../app/routes.js";

const publicPaths = {
  home: ROUTE_PATHS.publicHome,
  about: ROUTE_PATHS.publicAbout,
  platform: ROUTE_PATHS.publicPlatform,
  cases: ROUTE_PATHS.publicCases,
  faq: ROUTE_PATHS.publicFaq,
};

export type PublicPageName = keyof typeof publicPaths;
export const publicLink = (page: PublicPageName) => `#${publicPaths[page]}`;
export const publicSectionLink = (page: PublicPageName, id: string) =>
  `${publicLink(page)}?secao=${encodeURIComponent(id)}`;
export const isPlatformSection = (id: string | null) =>
  id === "funcionamento" || id === "compras" || id === "fornecimento";
export const sectionLink = (id: string) =>
  publicSectionLink(isPlatformSection(id) ? "platform" : "home", id);
export const workflowLink = (step: number) => `${sectionLink("funcionamento")}&etapa=${step}`;
export const infoLink = (id: string) => id === "sobre" ? publicLink("about") : `#/?pagina=${encodeURIComponent(id)}`;
export const signupLink = (activity?: "buyer" | "supplier" | "both") =>
  `#/acesso?modo=register${activity ? `&atuacao=${activity}` : ""}`;

const publicNavigation = [
  ["about", "Quem somos"],
  ["platform", "Plataforma"],
  ["cases", "Casos de uso"],
  ["faq", "Dúvidas"],
] as const;
export function Brand({ back = false }: { back?: boolean }) {
  return (
    <a
      className="sv-brand"
      href="#/"
      aria-label={back ? "SIVI, voltar à página inicial" : "SIVI, início"}
    >
      <img src="./src/assets/brand/raposa.svg" width="36" height="36" alt="" />
      <span>SIVI</span>
      <small>
        VENDAS
        <br />
        INDUSTRIAIS
      </small>
    </a>
  );
}
export function Arrow() {
  return <ArrowUpRight className="t-learn-chevron" size={19} aria-hidden="true" />;
}
function LearnArrow() {
  return <svg className="t-learn-chevron" width="19" height="19" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path className="t-learn-arm t-learn-arm-top" d="M6 4L10 8" /><path className="t-learn-arm t-learn-arm-bot" d="M10 8L6 12" /></svg>;
}
export function Action({
  children,
  href = signupLink(),
  secondary = false,
  className = "",
}: any) {
  return (
    <a
      href={href}
      className={`sv-button t-learn ${secondary ? "sv-button--secondary" : ""} ${className}`}
    >
      {children}
      <LearnArrow />
    </a>
  );
}
export function Reveal({ children, className = "", delay = 0 }: any) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function Header({ current }: { current?: PublicPageName }) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menu.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <>
      <a className="sv-skip" href="#conteudo" onClick={(event) => {
        const content = document.getElementById("conteudo");
        if (!content) return;
        event.preventDefault();
        content.focus({ preventScroll: true });
        content.scrollIntoView({ block: "start", behavior: "instant" });
      }}>
        Ir para o conteúdo
      </a>
      <header className="sv-header" data-menu-open={open || undefined}>
        <div className="sv-nav sv-shell">
          <Brand />
          <button
            className="sv-menu"
            ref={menu}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="sv-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="sv-navigation"
            aria-label="Navegação principal"
            className={open ? "is-open" : ""}
            onClick={() => setOpen(false)}
          >
            {publicNavigation.map(([page, label]) => (
              <a key={page} href={publicLink(page)} aria-current={page === current ? "page" : undefined}>
                {label}
              </a>
            ))}
            <a href="#/acesso?modo=login" className="sv-login-link">
              Entrar <Arrow />
            </a>
            <a className="sv-nav-cta" href={signupLink()}>
              Cadastrar empresa <Arrow />
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
const footerGroups = [
  {
    name: "Plataforma",
    links: [
      ["Como funciona", sectionLink("funcionamento")],
      ["Para compradores", sectionLink("compras")],
      ["Para fornecedores", sectionLink("fornecimento")],
      ["Casos de uso", publicLink("cases")],
    ],
  },
  {
    name: "Conheça o SIVI",
    links: [
      ["Quem somos", publicLink("about")],
      ["Segurança e dados", infoLink("seguranca")],
      ["Ajuda e acesso", infoLink("ajuda")],
      ["Dúvidas sobre o cadastro", publicLink("faq")],
    ],
  },
  {
    name: "Sua conta",
    links: [
      ["Entrar na minha conta", "#/acesso?modo=login"],
      ["Cadastrar empresa", signupLink()],
      ["Privacidade", infoLink("privacidade")],
      ["Condições de uso", infoLink("condicoes")],
    ],
  },
];
export function Footer() {
  return (
    <footer className="sv-footer public-footer">
      <div className="sv-shell">
        <div className="sv-footer-top">
          <div className="sv-footer-brand">
            <Brand />
            <small>Sistema Integrado de Vendas Industriais</small>
          </div>
          {footerGroups.map((group) => (
            <nav key={group.name} aria-label={group.name}>
              <h2>{group.name}</h2>
              {group.links.map(([label, href]) => (
                <a key={label} href={href}>
                  {label}
                </a>
              ))}
            </nav>
          ))}
        </div>
        <div className="sv-footer-bottom">
          <span>© {new Date().getFullYear()} SIVI</span>
          <a href={infoLink("creditos")}>Créditos de imagem e vídeo</a>
          <span>Português · Brasil</span>
          <a href={sectionLink("topo")}>Voltar ao início ↑</a>
        </div>
      </div>
    </footer>
  );
}
export function PageNavigation({ focusTitle = false }: { focusTitle?: boolean }) {
  useEffect(() => {
    const params = new URLSearchParams(location.hash.split("?")[1]);
    const id = params.get("secao");
    const frame = requestAnimationFrame(() => {
      const heading = document.getElementById("public-title");
      const anchor = id && id !== "topo" ? document.getElementById(id) : null;
      if (anchor) {
        anchor.focus({ preventScroll: true });
        anchor.scrollIntoView({ block: "start", behavior: "instant" });
      } else {
        if (id === "topo" || focusTitle) heading?.focus({ preventScroll: true });
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [focusTitle]);
  return null;
}
