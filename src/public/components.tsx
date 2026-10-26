import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";

export const sectionLink = (id: string) => `#/?secao=${id}`;
export const infoLink = (id: string) => `#/?pagina=${id}`;
export const signupLink = (plan = "compras", period = "mensal") =>
  `#/acesso?modo=register&plano=${plan}&periodo=${period}`;
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
  return <ArrowUpRight size={19} aria-hidden="true" />;
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
      className={`sv-button ${secondary ? "sv-button--secondary" : ""} ${className}`}
    >
      {children}
      <Arrow />
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
export function Header() {
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
      <a className="sv-skip" href={sectionLink("conteudo")}>
        Ir para o conteúdo
      </a>
      <header className="sv-header">
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
            <a href={sectionLink("funcionamento")}>Plataforma</a>
            <a href={sectionLink("compras")}>Compradores</a>
            <a href={sectionLink("fornecimento")}>Fornecedores</a>
            <a href={sectionLink("planos")}>Planos</a>
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
      ["Planos e valores", sectionLink("planos")],
    ],
  },
  {
    name: "Conheça o SIVI",
    links: [
      ["Sobre a plataforma", infoLink("sobre")],
      ["Segurança e dados", infoLink("seguranca")],
      ["Ajuda e acesso", infoLink("ajuda")],
      ["Dúvidas sobre o cadastro", sectionLink("duvidas")],
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
            <p>
              Boas conexões.
              <br />
              Acordos bem registrados.
            </p>
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
        <div className="sv-footer-identity">
          <span>
            SIVI Tecnologia · São Paulo/SP
            <br />
            CNPJ fictício: 00.000.000/0000-00
          </span>
          <span>
            Identificação demonstrativa, sem registro empresarial declarado.
            <br />
            contato@sivi.example — exemplo, sem atendimento.
          </span>
          <a href={infoLink("ajuda")}>
            Precisa de orientação? <Arrow />
          </a>
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
export function PageNavigation() {
  useEffect(() => {
    const params = new URLSearchParams(location.hash.split("?")[1]);
    const id = params.get("secao");
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(
        id === "topo" ? "public-title" : id || "public-title",
      );
      if (target) {
        target.focus({ preventScroll: true });
        if (id && id !== "topo")
          target.scrollIntoView({ block: "start", behavior: "instant" });
        else window.scrollTo(0, 0);
      } else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}
