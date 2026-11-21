import { Plus } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Action, Arrow, infoLink, publicLink, publicSectionLink, sectionLink, workflowLink } from "./components";
import { PublicLayout } from "./public-layout";
import SplitText from "./motion/SplitText";

gsap.registerPlugin(ScrollTrigger);

export function AboutPage() {
  const heroPhoto = useRef<HTMLElement>(null);
  const storyPhoto = useRef<HTMLElement>(null);
  const storyCopy = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const photo = storyPhoto.current;
    if (!photo) return;
    const motion = gsap.matchMedia();
    motion.add("(prefers-reduced-motion: no-preference)", () => {
      if (heroPhoto.current) {
        gsap.fromTo(heroPhoto.current, { clipPath: "inset(4% 0 96% 0 round 14px)" }, {
          clipPath: "inset(0% 0 0% 0 round 14px)",
          delay: .17,
          duration: 1,
          ease: "power3.inOut",
          clearProps: "clipPath",
        });
      }
      gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: photo, start: "top 87%", once: true, fastScrollEnd: true },
      })
        .fromTo(photo, { clipPath: "inset(0 100% 0 0 round 14px)" }, {
          clipPath: "inset(0 0% 0 0 round 14px)",
          duration: 1.05,
          clearProps: "clipPath",
        })
        .from(storyCopy.current?.querySelectorAll("p") ?? [], {
          y: 24, opacity: .1, duration: .68, stagger: .13, clearProps: "transform,opacity",
        }, .26);
    });
    return () => motion.revert();
  }, { scope: storyPhoto });

  return (
    <PublicLayout page="about" lightHeader editorial>
      <section className="sv-shell sv-editorial-intro sv-editorial-about" aria-labelledby="public-title">
        <div>
          <SplitText id="public-title" className="sv-editorial-title" tag="h1" tabIndex={-1}
            text="Por que o SIVI existe" textAlign="start" trigger="load" splitType="lines" mask
            from={{ yPercent: 112, opacity: 0 }} to={{ yPercent: 0, opacity: 1 }} duration={.87} delay={125} />
          <SplitText className="sv-editorial-lead" textAlign="start" trigger="load" splitType="lines" mask
            text="O SIVI aproxima quem precisa comprar de quem pode fornecer para a indústria e registra cada etapa da negociação."
            from={{ yPercent: 60, opacity: 0 }} to={{ yPercent: 0, opacity: 1 }} startDelay={.23} duration={.67} delay={65} />
        </div>
        <figure ref={heroPhoto} className="sv-editorial-photo">
          <img src="./assets/operador-torno.jpg" alt="Operador conferindo uma peça no torno de uma oficina" width="1920" height="1280" fetchPriority="high" />
        </figure>
      </section>
      <section className="sv-editorial-section sv-editorial-story" aria-labelledby="visao-geral">
        <div className="sv-shell sv-editorial-story-grid">
          <figure ref={storyPhoto} className="sv-editorial-photo">
            <img src="./assets/detalhe-torno.jpg" alt="Detalhe do comando de uma máquina de usinagem" width="1920" height="1280" loading="lazy" />
          </figure>
          <div ref={storyCopy} className="sv-editorial-copy">
            <SplitText id="visao-geral" className="sv-editorial-subtitle" tag="h2" tabIndex={-1}
              text="O que foi combinado fica no pedido." textAlign="start" splitType="words" effect="skew"
              duration={.78} delay={86} threshold={.12} rootMargin="0px" />
            <p>Num pedido industrial, material, medidas, prazo e condições precisam estar claros para as duas empresas. Se a cotação muda, é preciso identificar qual versão foi aceita.</p>
            <p>O SIVI reúne os requisitos, as propostas e o pedido no mesmo histórico. Quem fornece registra a inspeção e a expedição. Quem compra confirma o recebimento.</p>
          </div>
        </div>
      </section>
      <section className="sv-shell sv-editorial-close" aria-labelledby="sobre-plataforma">
        <SplitText id="sobre-plataforma" className="sv-editorial-subtitle" tag="h2"
          text="Uma compra vista pelos dois lados." textAlign="start" splitType="lines" effect="blur"
          duration={.73} delay={95} threshold={.13} rootMargin="0px" />
        <Action className="sv-editorial-action" href={publicLink("platform")}>Ver como o SIVI funciona</Action>
      </section>
    </PublicLayout>
  );
}

const faqTopics = [
  {
    id: "duvidas-cadastro",
    title: "Conta e cadastro",
    questions: [
      {
        question: "Quem pode usar o SIVI?",
        answer: "Responsáveis por empresas compradoras ou fornecedoras no setor industrial. Uma mesma empresa pode solicitar as duas atuações.",
      },
      {
        question: "Quais dados preciso informar no cadastro?",
        answer: "Para criar a conta, informe nome, sobrenome, e-mail e senha. Na etapa da empresa, informe nome, CNPJ, cidade, UF, telefone ou e-mail de contato e a atuação desejada.",
      },
      {
        question: "O que acontece depois de criar a conta?",
        answer: "Confirme o e-mail, entre no SIVI e revise os dados empresariais para enviar à análise. Se houver solicitação de correção, consulte o motivo em Empresas e atuação antes de reenviar.",
        link: { label: "Ver orientações de acesso", href: infoLink("ajuda") },
      },
      {
        question: "Como recupero minha senha?",
        answer: "Na tela de acesso, selecione Esqueci minha senha e informe o e-mail cadastrado. Confira também a caixa de spam.",
        link: { label: "Abrir a tela de acesso", href: "#/acesso?modo=login" },
      },
    ],
  },
  {
    id: "duvidas-compras",
    title: "Compras",
    questions: [
      {
        question: "Como encontro fornecedores compatíveis?",
        answer: "Compare os requisitos da demanda com o perfil industrial dos fornecedores. O SIVI indica os critérios compatíveis e os que ainda precisam de confirmação.",
        link: { label: "Ver a perspectiva de compras", href: sectionLink("compras") },
      },
      {
        question: "Como comparo propostas para a mesma demanda?",
        answer: "Compare as condições registradas, como preço, prazo, frete e pagamento. Ao aceitar uma proposta, a versão escolhida dá origem ao pedido.",
        link: { label: "Explorar a comparação de propostas", href: workflowLink(3) },
      },
    ],
  },
  {
    id: "duvidas-fornecimento",
    title: "Fornecimento",
    questions: [
      {
        question: "O que posso informar no perfil da empresa?",
        answer: "Registre materiais, processos industriais e regiões atendidas. Essas informações ajudam a identificar demandas que correspondem ao que sua empresa oferece.",
        link: { label: "Ver a perspectiva de fornecimento", href: sectionLink("fornecimento") },
      },
      {
        question: "Posso revisar uma proposta enviada?",
        answer: "Sim. Uma revisão registra uma nova versão com as condições atualizadas. A versão anterior continua disponível para consulta.",
      },
    ],
  },
  {
    id: "duvidas-pedidos",
    title: "Pedidos e inspeção",
    questions: [
      {
        question: "Quais condições ficam registradas no pedido?",
        answer: "O pedido preserva os itens e as condições da proposta aceita. As duas empresas podem consultar esse histórico de acordo com suas permissões.",
      },
      {
        question: "Quem registra a inspeção e a expedição?",
        answer: "O fornecedor registra a inspeção por item, com evidências e quantidades aprovadas. Depois da liberação, pode registrar a expedição.",
        link: { label: "Ver um exemplo de inspeção", href: workflowLink(5) },
      },
      {
        question: "Quem confirma o recebimento?",
        answer: "O comprador confirma que o pedido chegou e pode avaliar o fornecimento. O fornecedor acompanha a confirmação pelo pedido.",
      },
      {
        question: "Como são combinados a entrega e o pagamento?",
        answer: "Comprador e fornecedor acertam entre si as condições de entrega e de pagamento. O SIVI registra o que foi acordado na proposta aceita.",
      },
    ],
  },
];

export function FaqPage() {
  return (
    <PublicLayout page="faq" lightHeader editorial>
      <section className="sv-shell sv-editorial-intro sv-editorial-faq" aria-labelledby="public-title">
        <header id="duvidas" tabIndex={-1} className="sv-faq-intro">
          <h1 id="public-title" className="sv-editorial-title" tabIndex={-1}>Perguntas frequentes</h1>
          <p className="sv-editorial-lead">Da criação da conta à confirmação do recebimento.</p>
        </header>
        <div className="sv-faq-layout">
          <nav className="sv-faq-index" aria-label="Assuntos das perguntas frequentes">
            {faqTopics.map(({ id, title }) => <a key={id} href={publicSectionLink("faq", id)}>{title}</a>)}
          </nav>
          <div className="sv-faq-answers">
            {faqTopics.map(({ id, title, questions }) => (
              <section key={id} aria-labelledby={id}>
                <h2 id={id} tabIndex={-1}>{title}</h2>
                {questions.map(({ question, answer, link }) => (
                  <details key={question}>
                    <summary>{question}<Plus size={18} aria-hidden="true" /></summary>
                    <div className="sv-faq-answer">
                      <p>{answer}</p>
                      {link && <a className="sv-editorial-link" href={link.href}>{link.label} <Arrow /></a>}
                    </div>
                  </details>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
