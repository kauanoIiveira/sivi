import { useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Action, infoLink, publicLink, sectionLink, workflowLink } from "./components";
import { PurchaseRecord, purchaseExamples } from "./purchase-examples";
import SplitText, { type SplitTextProps } from "./motion/SplitText";
import "./home-content.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stages = [
  {
    label: "Publicar uma demanda",
    description: "Material, processo, quantidade e prazo ficam reunidos na ficha de cada item.",
    example: purchaseExamples[0],
  },
  {
    label: "Comparar propostas",
    description: "Consulte preço, prazo, frete e pagamento. Quando o fornecedor revisa a proposta, a versão anterior continua disponível.",
    example: purchaseExamples[1],
  },
  {
    label: "Acompanhar o pedido",
    description: "O pedido preserva as condições aceitas. Nele, as empresas acompanham inspeção, expedição e recebimento.",
    example: purchaseExamples[3],
  },
];

const cases = [
  {
    example: purchaseExamples[1],
    image: "./assets/home-comparison.webp",
    description: "Duas cotações para a mesma peça. O que pesa mais na decisão, preço ou prazo?",
  },
  {
    example: purchaseExamples[2],
    image: "./assets/home-inspection.webp",
    description: "Veja como documentar a inspeção de cada item antes de liberar a expedição.",
  },
];

const resources = [
  { step: 2, title: "Como encontrar fornecedores compatíveis?", description: "O SIVI indica quais requisitos da demanda correspondem ao perfil do fornecedor e quais ainda precisam ser confirmados." },
  { step: 4, title: "Quais condições ficam no pedido?", description: "Preço, prazo, frete e pagamento são registrados com os itens e as condições da versão aceita." },
  { step: 5, title: "Como o fornecedor registra a inspeção?", description: "O fornecedor informa o plano de inspeção, as evidências e a quantidade aprovada por item. A expedição depende da liberação da qualidade." },
  { step: 7, title: "Quem confirma o recebimento?", description: "O comprador confirma a chegada do pedido e pode avaliar o fornecimento. As duas empresas podem consultar o histórico." },
];

const guides = [
  { href: publicLink("faq"), title: "Cadastro da empresa" },
  { href: infoLink("ajuda"), title: "Primeiro acesso" },
  { href: infoLink("seguranca"), title: "Acessos e dados" },
];

const headingMotion = {
  rise: {
    splitType: "words",
    mask: true,
    from: { yPercent: 112, opacity: 0 },
    to: { yPercent: 0, opacity: 1 },
    duration: .78,
    delay: 75,
  },
  slide: {
    splitType: "lines",
    mask: true,
    from: { xPercent: -18, opacity: 0 },
    to: { xPercent: 0, opacity: 1 },
    duration: .82,
    delay: 125,
  },
  flip: { splitType: "words", effect: "flip", duration: .76, delay: 90 },
  focus: { splitType: "lines", effect: "blur", duration: .73, delay: 110 },
} satisfies Record<string, Partial<SplitTextProps>>;

function HomeHeading({ id, text, animation = "rise" }: { id: string; text: string; animation?: keyof typeof headingMotion }) {
  return (
    <SplitText
      id={id}
      text={text}
      tag="h2"
      tabIndex={-1}
      textAlign="start"
      threshold={.16}
      rootMargin="0px"
      {...headingMotion[animation]}
    />
  );
}

function HomeWorkflow() {
  const [selected, setSelected] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  function selectStage(index: number) {
    setSelected(index);
    setAnnouncement(`${stages[index].example.title}. ${stages[index].description}`);
  }

  return (
    <section className="sv-home-content sv-home-flow" aria-labelledby="solucoes-inicio">
      <div className="sv-shell">
        <div className="sv-home-flow-head">
          <HomeHeading id="solucoes-inicio" text="Uma compra, do começo ao fim." animation="slide" />
        </div>
        <div className="sv-home-flow-layout" id="criterios-inicio" tabIndex={-1}>
          <ol className="sv-home-steps" aria-label="Etapas da compra">
            {stages.map(({ label }, index) => (
              <li key={label}>
                <button type="button" aria-controls="sv-home-stage" aria-pressed={index === selected} onClick={() => selectStage(index)}>
                  <span className="sv-home-step-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  {label}
                  <ArrowRight aria-hidden="true" size={18} />
                </button>
              </li>
            ))}
          </ol>
          <div className="app-frame" id="sv-home-stage" role="group" aria-label="Exemplo de compra industrial" data-visual>
            <div className="sv-home-stage-top">
              <img src="./src/assets/brand/raposa.svg" width="22" height="22" alt="" />
              <span>Compra industrial</span>
            </div>
            {stages.map(({ label, example, description }, index) => (
              <div key={label} className="sv-home-stage-record" aria-hidden={index !== selected}>
                <PurchaseRecord example={example} />
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="sv-home-flow-links">
          <div className="sv-home-audiences">
            <a className="sv-home-link" href={sectionLink("compras")}>Para compradores <ArrowUpRight aria-hidden="true" size={16} /></a>
            <a className="sv-home-link" href={sectionLink("fornecimento")}>Para fornecedores <ArrowUpRight aria-hidden="true" size={16} /></a>
          </div>
          <a className="sv-home-link" href={sectionLink("funcionamento")}>
            Ver o fluxo completo <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </div>
        <span className="sv-home-stage-announcement" role="status">{announcement}</span>
      </div>
    </section>
  );
}

export function HomeContent() {
  const intro = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = intro.current;
    const content = section?.parentElement;
    if (!section || !content) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const compact = window.matchMedia("(max-width: 760px)").matches;
      const focus = new AbortController();
      const art = section.querySelector(".sv-home-intro-art");
      const ground = art?.querySelector(".sv-home-part-ground");
      const part = art?.querySelector("img");

      if (art && ground && part) {
        gsap.timeline({
          defaults: { ease: "power3.out", clearProps: "transform,opacity" },
          scrollTrigger: { trigger: art, start: "top 87%", once: true, fastScrollEnd: true },
        })
          .from(ground, { scaleX: .22, opacity: .35, transformOrigin: "left center", duration: .86 }, 0)
          .from(part, { y: compact ? 32 : 58, scale: .82, rotation: -5, opacity: .35, duration: 1 }, .08);
      }

      content.querySelectorAll<HTMLElement>(".sv-home-use-photo").forEach((frame, index) => {
        const image = frame.querySelector("img");
        const shutter = frame.querySelector(".sv-home-photo-shutter");
        if (!image || !shutter) return;
        const reveal = gsap.timeline({
          defaults: { ease: "power3.out", clearProps: "transform" },
          delay: compact ? 0 : index * .13,
          scrollTrigger: { trigger: frame, start: "top 89%", once: true, fastScrollEnd: true },
        })
          .from(image, { scale: 1.12, duration: 1 }, 0)
          .fromTo(shutter, { scaleX: 1 }, { scaleX: 0, ease: "power2.inOut", duration: .78 }, 0);
        frame.closest("a")?.addEventListener("focus", () => { reveal.progress(1); }, { once: true, signal: focus.signal });
      });

      return () => focus.abort();
    });
    return () => media.revert();
  }, { scope: intro });

  return (
    <>
      <section ref={intro} className="sv-home-content sv-home-intro" aria-labelledby="explorar">
        <div className="sv-shell sv-home-intro-grid">
          <div className="sv-home-intro-copy">
            <HomeHeading id="explorar" text="Da necessidade de compra ao pedido entregue." />
            <p>O SIVI reúne quem compra e quem fornece para a indústria. Compradores publicam o que precisam, fornecedores enviam propostas e as duas empresas acompanham o pedido até o recebimento.</p>
            <Action className="sv-home-body-action" href={publicLink("about")}><span>Conheça melhor a equipe por trás do SIVI</span></Action>
          </div>
          <div className="sv-home-intro-art" aria-hidden="true">
            <div className="sv-home-part-ground" />
            <img src="./assets/home-machined-part.webp" width="1120" height="1120" alt="" loading="lazy" />
          </div>
        </div>
      </section>
      <HomeWorkflow />
      <section className="sv-home-content sv-home-uses" aria-labelledby="casos-inicio">
        <div className="sv-shell">
          <div className="sv-home-section-head">
            <div>
              <HomeHeading id="casos-inicio" text="Casos de compra industrial" animation="flip" />
              <p>Veja como o SIVI organiza decisões e registros em exemplos de compras industriais.</p>
            </div>
            <a className="sv-home-link" href={sectionLink("funcionamento")}>Ver as etapas da compra <ArrowUpRight aria-hidden="true" size={18} /></a>
          </div>
          <div className="sv-home-use-grid">
            {cases.map(({ example, image, description }) => (
              <article key={example.id}>
                <a className="sv-home-use" href={workflowLink(example.step)}>
                  <div className="sv-home-use-photo">
                    <img src={image} width="1200" height="800" alt="" loading="lazy" />
                    <span className="sv-home-photo-shutter" aria-hidden="true" />
                  </div>
                  <div className="sv-home-use-title"><h3>{example.title}</h3><ArrowUpRight aria-hidden="true" size={21} /></div>
                </a>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="sv-home-content sv-home-resources" aria-labelledby="recursos-inicio">
        <div className="sv-shell sv-home-resources-grid">
          <div>
            <h2 id="recursos-inicio" tabIndex={-1}>Registros da compra</h2>
            <p>Do perfil do fornecedor à entrega, veja onde consultar as informações da compra.</p>
            <ul className="sv-home-guides" id="guias-inicio" tabIndex={-1}>
              {guides.map(({ href, title }) => (
                <li key={href}><a className="sv-home-link" href={href}>{title}<ArrowUpRight aria-hidden="true" size={16} /></a></li>
              ))}
            </ul>
          </div>
          <div className="sv-home-disclosures" id="acordo-inicio" tabIndex={-1}>
            {resources.map(({ step, title, description }) => (
              <details key={step}>
                <summary>{title}<ChevronDown aria-hidden="true" size={20} /></summary>
                <div>
                  <p>{description}</p>
                  <a className="sv-home-link" href={workflowLink(step)}>Ver na plataforma <ArrowUpRight aria-hidden="true" size={16} /></a>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="sv-home-content sv-home-start" aria-labelledby="comecar-title">
        <div className="sv-shell">
          <HomeHeading id="comecar-title" text="Sua empresa na rede industrial." animation="focus" />
          <div>
            <p>Cadastre sua empresa para comprar, fornecer ou atuar dos dois lados da plataforma.</p>
            <Action className="sv-home-body-action">Cadastrar empresa</Action>
          </div>
        </div>
      </section>
    </>
  );
}
