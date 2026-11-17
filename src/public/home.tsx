import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Boxes, CalendarDays, Layers3, Pause, Play, Settings2 } from "lucide-react";
import { Action, Arrow, infoLink, publicLink, publicSectionLink, sectionLink, workflowLink } from "./components";
import SplitText from "./motion/SplitText";
import ScrollReveal from "./motion/ScrollReveal";
import { PublicLayout } from "./public-layout";
import { PurchaseRecord, purchaseExamples } from "./purchase-examples";

function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(
    () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      Boolean((navigator as any).connection?.saveData),
  );
  const isOpening = !new URLSearchParams(location.hash.split("?")[1]).has("secao");
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    let onScreen = true;
    const sync = () => {
      if (paused || document.hidden || !onScreen) el.pause();
      else el.play().catch(() => setPaused(true));
    };
    const observer = new IntersectionObserver((entries) => {
      onScreen = entries[0].isIntersecting;
      sync();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      el.pause();
    };
  }, [paused]);
  return (
    <section
      className="sv-hero"
      data-enter
      data-landing-opening={isOpening || undefined}
      data-video-paused={paused || undefined}
      aria-labelledby="public-title"
    >
      <div className="sv-hero-media">
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          poster="./assets/cnc-lathe-poster.jpg"
          aria-hidden="true"
        >
          <source src="./assets/cnc-lathe.webm" type="video/webm" />
        </video>
      </div>
      <div className="sv-shell sv-landing-hero">
        <div className={`sv-landing-lead t-stagger${isOpening ? " is-shown" : ""}`}>
          <h1 id="public-title" tabIndex={-1}>
            <span className="sv-hero-prefix t-stagger-line">Conecte a</span>{" "}
            <span className="sv-hero-word t-stagger-line t-stagger-line--2">
              <span className={isOpening ? "t-shimmer" : undefined}>indústria</span>
            </span>
          </h1>
          <p className="sv-hero-description t-stagger-line t-stagger-line--3">
            Marketplace B2B de compras e fornecimento industrial.
          </p>
          <div className="sv-hero-actions t-stagger-line t-stagger-line--4">
            <Action>Cadastrar empresa</Action>
          </div>
        </div>
        <div className="sv-hero-controls">
          <a className="sv-hero-scroll" href={sectionLink("explorar")}>
            Conheça o SIVI <ArrowDown size={18} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="sv-video-control"
            aria-label={paused ? "Reproduzir vídeo de fundo" : "Pausar vídeo de fundo"}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  );
}
const criteria = [
  { Icon: Layers3, label: "Material", description: "Informe a liga, o insumo ou o tipo de peça." },
  { Icon: Settings2, label: "Processo", description: "Indique a operação necessária, como usinagem CNC." },
  { Icon: Boxes, label: "Quantidade", description: "Defina o volume solicitado para cada item." },
  { Icon: CalendarDays, label: "Prazo", description: "Deixe clara a data necessária para a compra." },
];

const resources = [
  { step: 2, title: "Compatibilidade industrial", description: "Confira quais requisitos da demanda têm correspondência no perfil apresentado pelo fornecedor e quais ainda precisam ser confirmados." },
  { step: 3, title: "Histórico de propostas", description: "Quando uma cotação é revisada, a versão anterior continua disponível. Compare preço, prazo, frete e condições de pagamento." },
  { step: 5, title: "Inspeção e liberação", description: "O fornecedor registra plano, evidências e quantidade aprovada por item. A expedição depende da liberação da qualidade." },
  { step: 7, title: "Recebimento e avaliação", description: "O comprador confirma que recebeu o pedido e registra uma avaliação do fornecimento. As duas empresas podem consultar o histórico da compra." },
];

const guides = [
  { href: publicLink("faq"), title: "Como cadastrar a empresa", description: "Veja quais dados informar e como acompanhar a análise." },
  { href: infoLink("ajuda"), title: "Primeiro acesso", description: "Confirme o e-mail, entre na conta e retome a revisão da empresa." },
  { href: infoLink("seguranca"), title: "Acessos e dados", description: "Entenda a diferença entre conta pessoal, empresa e atuação." },
];

function HomeSolutions() {
  return (
    <section className="sv-solutions" aria-labelledby="solucoes-inicio">
      <div className="sv-shell">
        <div className="sv-display-heading sv-display-heading--center">
          <SplitText id="solucoes-inicio" tag="h2" text="Soluções para cada etapa da compra." effect="wave" delay={22} duration={0.7} hoverEffect="lift" />
        </div>
        <div className="sv-solution-list">
          <article className="sv-solution">
            <div className="sv-solution-copy">
              <h3>Publique uma demanda técnica.</h3>
              <p>Descreva o que sua empresa precisa comprar e separe os requisitos por item. Quem fornece consulta a mesma especificação ao preparar a cotação.</p>
              <Action href={sectionLink("compras")}>Conhecer compras</Action>
            </div>
            <div className="sv-solution-visual sv-quote-visual" data-landing-reveal="record">
              <PurchaseRecord example={purchaseExamples[0]} />
            </div>
          </article>
          <article className="sv-solution sv-solution--reverse">
            <div className="sv-solution-copy">
              <h3>Apresente sua capacidade industrial.</h3>
              <p>Informe os materiais, processos e regiões que atende. Consulte demandas compatíveis com seu perfil e envie suas condições de fornecimento.</p>
              <Action href={sectionLink("fornecimento")}>Conhecer fornecimento</Action>
            </div>
            <div className="sv-solution-visual sv-solution-photo" data-landing-reveal="curtain" data-landing-pointer="photo">
              <img src="./assets/detalhe-torno.jpg" alt="Ferramenta de usinagem em bancada industrial" loading="lazy" width="960" height="640" />
            </div>
          </article>
          <article className="sv-solution">
            <div className="sv-solution-copy">
              <h3>Acompanhe o pedido até a entrega.</h3>
              <p>As condições aceitas ficam no pedido. A partir dele, o fornecedor registra inspeção e expedição, e o comprador confirma o recebimento.</p>
              <Action href={sectionLink("funcionamento")}>Ver etapas do pedido</Action>
            </div>
            <div className="sv-solution-visual sv-quote-visual" data-landing-reveal="record">
              <PurchaseRecord example={purchaseExamples[3]} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function HomeCases() {
  return (
    <section className="sv-home-cases" aria-labelledby="casos-inicio">
      <div className="sv-shell sv-story-split">
        <div className="sv-display-heading sv-story-heading">
          <h2 id="casos-inicio" data-landing-reveal="title">Casos de uso de uma compra industrial.</h2>
          <p>Veja como as duas empresas lidam com cotações diferentes e registram a inspeção dos itens acordados.</p>
          <Action href={publicLink("cases")}>Ver todos os casos</Action>
        </div>
        <div className="sv-story-stack">
          {purchaseExamples.slice(1, 3).map((example) => (
            <article className="sv-story-card" key={example.id}>
              <div className="sv-example-art" data-landing-reveal="record"><PurchaseRecord example={example} /></div>
              <a className="sv-text-link" href={publicSectionLink("cases", example.id)}>{example.title} <Arrow /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <PublicLayout page="home">
      <Hero />
      <section className="sv-home-explore" aria-labelledby="explorar">
        <div className="sv-shell sv-page-split" data-landing-pointer="parallax">
          <div className="sv-display-heading">
            <SplitText id="explorar" tabIndex={-1} tag="h2" text="Da necessidade de compra ao pedido entregue." splitType="words" effect="rise" mask delay={70} duration={0.8} textAlign="left" rootMargin="-48px" />
            <p>O SIVI reúne empresas que compram e empresas que fabricam ou fornecem. A plataforma organiza os requisitos da demanda, as propostas recebidas e os registros do pedido em uma mesma jornada.</p>
            <Action href={publicLink("about")}>Conhecer o SIVI</Action>
          </div>
          <div className="sv-about-visual" data-landing-reveal="iris">
            <img src="./assets/operador-torno.jpg" alt="Operador trabalhando em um torno industrial" loading="lazy" width="960" height="640" />
            <span aria-hidden="true"><Arrow /></span>
          </div>
        </div>
      </section>
      <section className="sv-criteria" aria-labelledby="criterios-inicio">
        <div className="sv-shell">
          <div className="sv-display-heading">
            <h2 id="criterios-inicio">O que entra em uma demanda?</h2>
          </div>
          <dl className="sv-criteria-grid">
            {criteria.map(({ Icon, label, description }, index) => (
              <div key={label} data-landing-reveal="line" style={{ "--sv-delay": `${index * 90}ms` } as CSSProperties}>
                <dt><Icon aria-hidden="true" /> {label}</dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <HomeSolutions />
      <section className="sv-home-agreement" aria-labelledby="acordo-inicio">
        <div className="sv-shell sv-page-split">
          <div className="sv-display-heading">
            <ScrollReveal id="acordo-inicio" baseOpacity={0.35} baseRotation={0} enableBlur={false} wordAnimationEnd="top 40%" smoothing={0.25}>O que foi aceito acompanha o pedido.</ScrollReveal>
          </div>
          <div className="sv-display-heading">
            <p>Preço, prazo, frete e pagamento ficam registrados quando a proposta é aceita. Se ela passou por revisões, o histórico permite consultar como as condições mudaram até o aceite.</p>
            <Action href={workflowLink(4)}>Ver como o pedido é formado</Action>
          </div>
        </div>
      </section>
      <HomeCases />
      <section className="sv-resources" aria-labelledby="recursos-inicio">
        <div className="sv-shell sv-page-split">
          <div className="sv-display-heading">
            <h2 id="recursos-inicio">Recursos do SIVI.</h2>
            <p>Explore como a plataforma organiza o trabalho em cada etapa.</p>
          </div>
          <div className="sv-disclosures">
            {resources.map(({ step, title, description }) => (
              <details key={step}>
                <summary>{title}<span aria-hidden="true">+</span></summary>
                <div>
                  <p>{description}</p>
                  <a className="sv-text-link" href={workflowLink(step)}>Ver etapa <Arrow /></a>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="sv-landing-close" aria-labelledby="comecar-title">
        <div className="sv-shell">
          <div className="sv-display-heading">
            <h2 id="comecar-title" data-landing-reveal="title">Sua empresa<br />na rede industrial.</h2>
            <p data-landing-reveal="fade">Cadastre uma empresa compradora, fornecedora ou com as duas atuações.</p>
            <Action>Cadastrar empresa</Action>
          </div>
          <div className="sv-close-visual" data-landing-scroll="wipe" aria-hidden="true">
            <ArrowUpRight className="sv-close-arrow" strokeWidth={0.8} />
          </div>
        </div>
      </section>
      <section className="sv-guides" aria-labelledby="guias-inicio">
        <div className="sv-shell">
          <div className="sv-display-heading">
            <h2 id="guias-inicio">Guias para começar.</h2>
          </div>
          <div className="sv-explore-grid">
            {guides.map(({ href, title, description }) => (
              <a key={href} href={href}>
                <h3>{title}</h3>
                <Arrow />
                <p>{description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
