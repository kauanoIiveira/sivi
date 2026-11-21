import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ROUTE_PATHS } from "../app/routes.js";

const publicPaths = {
  home: ROUTE_PATHS.publicHome,
  about: ROUTE_PATHS.publicAbout,
  platform: ROUTE_PATHS.publicPlatform,
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
  ["platform", "O que fazemos"],
  ["faq", "FAQ"],
] as const;
export function Brand({ back = false, home = false }: { back?: boolean; home?: boolean }) {
  return (
    <a
      className="sv-brand"
      href="#/"
      aria-label={home ? "SIVI, voltar ao topo" : back ? "SIVI, voltar à página inicial" : "SIVI, início"}
      onClick={home ? (event) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (location.hash && location.hash !== publicLink("home")) return;
        event.preventDefault();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.getElementById("public-title")?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
      } : undefined}
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
export function Header({ current, editorial = false }: { current?: PublicPageName; editorial?: boolean }) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  const home = current === "home";
  const sharedNavigation = home || editorial;
  const pages = publicNavigation.map(([page, label]) => (
    <a key={page} href={publicLink(page)} aria-current={page === current ? "page" : undefined}>
      {label}
    </a>
  ));
  const accountLinks = (
    <>
      {!sharedNavigation && <a href="#/acesso?modo=login" className="sv-login-link">Entrar <Arrow /></a>}
      <a className="sv-nav-cta" href={sharedNavigation ? "#/acesso?modo=login" : signupLink()}>
        {sharedNavigation ? "Acessar sistema" : "Cadastrar empresa"} <Arrow />
      </a>
    </>
  );

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
          <Brand home={home} />
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
            {sharedNavigation ? (
              <>
                <div className="sv-home-nav-pages">{pages}</div>
                <div className="sv-home-nav-account">{accountLinks}</div>
              </>
            ) : <>{pages}{accountLinks}</>}
          </nav>
        </div>
      </header>
    </>
  );
}
const footerAccount = {
  name: "Sua conta",
  links: [
    ["Entrar na minha conta", "#/acesso?modo=login"],
    ["Cadastrar empresa", signupLink()],
  ],
};

const footerLegal = [
  ["Privacidade", infoLink("privacidade")],
  ["Condições de uso", infoLink("condicoes")],
];

const footerCredits = infoLink("creditos");
const footerEmail = "info@sivi.com";

const footerGroups = [
  {
    name: "Plataforma",
    links: [
      ["Como funciona", sectionLink("funcionamento")],
      ["Para compradores", sectionLink("compras")],
      ["Para fornecedores", sectionLink("fornecimento")],
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
];

function FooterNewsletter() {
  const [showInstructions, setShowInstructions] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    const subject = encodeURIComponent("Inscrição nas novidades do SIVI");
    const body = encodeURIComponent(`Olá! Gostaria de receber as novidades do SIVI neste e-mail: ${email}`);
    window.location.href = `mailto:${footerEmail}?subject=${subject}&body=${body}`;
    setShowInstructions(true);
  }

  return (
    <form className="sv-footer-newsletter" aria-labelledby="sv-footer-newsletter-title" onSubmit={submit}>
      <h2 id="sv-footer-newsletter-title">Receba novidades do SIVI</h2>
      <div className="sv-footer-newsletter-fields">
        <input
          type="email"
          name="email"
          aria-label="Seu e-mail"
          placeholder="Seu e-mail"
          autoComplete="email"
          required
          onChange={() => setShowInstructions(false)}
        />
        <button type="submit">Inscrever</button>
      </div>
      <p className="sv-footer-newsletter-status" role="status">
        {showInstructions && "Envie a mensagem no seu aplicativo de e-mail para concluir o pedido."}
      </p>
    </form>
  );
}

export function Footer({ home = false, editorial = false }: { home?: boolean; editorial?: boolean }) {
  const copyright = `© ${new Date().getFullYear()} SIVI`;
  const sharedFooter = home || editorial;
  const groups = sharedFooter ? footerGroups : [
    ...footerGroups,
    { ...footerAccount, links: [...footerAccount.links, ...footerLegal] },
  ];
  return (
    <footer className={sharedFooter ? "sv-footer public-footer sv-footer--home" : "sv-footer public-footer"}>
      <div className="sv-shell">
        <div className="sv-footer-top">
          <div className="sv-footer-brand">
            <Brand home={home} />
            <small>Sistema Integrado de Vendas Industriais</small>
          </div>
          {groups.map((group) => (
            <nav key={group.name} aria-label={group.name}>
              <h2>{group.name}</h2>
              {group.links.map(([label, href]) => (
                <a key={label} href={href}>
                  {sharedFooter ? <span>{label}</span> : label}
                </a>
              ))}
            </nav>
          ))}
          {sharedFooter && (
            <div className="sv-footer-contact-column">
              <section className="sv-footer-contact" aria-labelledby="sv-footer-contact-title">
                <h2 id="sv-footer-contact-title">Contato</h2>
                <address>
                  <p>
                    SENAI Manuel Garcia Filho<br />
                    Rua Guatemala, 19<br />
                    Jardim Canhema
                  </p>
                  <a href={`mailto:${footerEmail}`}><span>{footerEmail}</span></a>
                  <p>(11) 0000-0000</p>
                </address>
              </section>
              <FooterNewsletter />
            </div>
          )}
        </div>
        {sharedFooter ? (
          <div className="sv-footer-bottom">
            <div className="sv-footer-legal">
              <span>{copyright}</span>
              <nav aria-label="Informações legais e créditos">
                {footerLegal.map(([label, href]) => <a key={href} href={href}><span>{label}</span></a>)}
                <a href={footerCredits}><span>Créditos de imagem e vídeo</span></a>
              </nav>
            </div>
            <span className="sv-footer-locale">Português · Brasil</span>
          </div>
        ) : (
          <div className="sv-footer-bottom">
            <span>{copyright}</span>
            <a href={footerCredits}>Créditos de imagem e vídeo</a>
            <span>Português · Brasil</span>
            <a href={sectionLink("topo")}>Voltar ao início ↑</a>
          </div>
        )}
      </div>
    </footer>
  );
}
export function PageNavigation({ focusTitle = false }: { focusTitle?: boolean }) {
  useLayoutEffect(() => {
    const params = new URLSearchParams(location.hash.split("?")[1]);
    const id = params.get("secao");
    const anchor = id && id !== "topo" ? document.getElementById(id) : null;
    if (anchor) {
      anchor.focus({ preventScroll: true });
      anchor.scrollIntoView({ block: "start", behavior: "instant" });
    } else {
      if (id === "topo" || focusTitle) document.getElementById("public-title")?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [focusTitle]);
  return null;
}
