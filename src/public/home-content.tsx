import { useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { Action, infoLink, publicLink, publicSectionLink, sectionLink, workflowLink } from "./components";
import { PurchaseRecord, purchaseExamples } from "./purchase-examples";
import "./home-content.css";

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

function HomeWorkflow() {
  const [selected, setSelected] = useState(0);
  const stage = stages[selected];

  return (
    <section className="sv-home-content sv-home-flow" aria-labelledby="solucoes-inicio">
      <div className="sv-shell">
        <div className="sv-home-section-head">
          <h2 id="solucoes-inicio" tabIndex={-1}>Uma compra, do começo ao fim.</h2>
          <a className="sv-home-link" href={sectionLink("funcionamento")}>
            Ver o fluxo completo <ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </div>
        <div className="sv-home-flow-layout" id="criterios-inicio" tabIndex={-1}>
          <div>
            <ol className="sv-home-steps" aria-label="Etapas da compra">
              {stages.map(({ label }, index) => (
                <li key={label}>
                  <button type="button" aria-controls="sv-home-stage" aria-pressed={index === selected} onClick={() => setSelected(index)}>
                    <span className="sv-home-step-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    {label}
                    <ArrowRight aria-hidden="true" size={19} />
                  </button>
                </li>
              ))}
            </ol>
            <div className="sv-home-audiences">
              <a className="sv-home-link" href={sectionLink("compras")}>Para compradores <ArrowUpRight aria-hidden="true" size={16} /></a>
              <a className="sv-home-link" href={sectionLink("fornecimento")}>Para fornecedores <ArrowUpRight aria-hidden="true" size={16} /></a>
            </div>
          </div>
          <div className="app-frame" id="sv-home-stage" role="group" aria-label="Exemplo de compra industrial" aria-live="polite" data-visual>
            <div className="sv-home-stage-top">
              <img src="./src/assets/brand/raposa.svg" width="22" height="22" alt="" />
              <span>Compra industrial</span>
            </div>
            <div key={stage.label} className="sv-home-stage-record">
              <PurchaseRecord example={stage.example} />
              <p>{stage.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeContent() {
  return (
    <>
      <section className="sv-home-content sv-home-intro" aria-labelledby="explorar">
        <div className="sv-shell sv-home-intro-grid">
          <div className="sv-home-intro-copy">
            <h2 id="explorar" tabIndex={-1}>Da necessidade de compra ao pedido entregue.</h2>
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
              <h2 id="casos-inicio" tabIndex={-1}>Casos de compra industrial</h2>
              <p>Veja como o SIVI organiza decisões e registros em exemplos de compras industriais.</p>
            </div>
            <a className="sv-home-link" href={publicLink("cases")}>Ver todos os casos <ArrowUpRight aria-hidden="true" size={18} /></a>
          </div>
          <div className="sv-home-use-grid">
            {cases.map(({ example, image, description }) => (
              <article key={example.id}>
                <a className="sv-home-use" href={publicSectionLink("cases", example.id)}>
                  <div className="sv-home-use-photo">
                    <img src={image} width="1200" height="800" alt="" loading="lazy" />
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
          <div className="sv-home-guides">
            <h3 id="guias-inicio" tabIndex={-1}>Guias de acesso</h3>
            <ul>
              {guides.map(({ href, title }) => (
                <li key={href}><a className="sv-home-link" href={href}>{title}<ArrowUpRight aria-hidden="true" size={16} /></a></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="sv-home-content sv-home-start" aria-labelledby="comecar-title">
        <div className="sv-shell">
          <h2 id="comecar-title" tabIndex={-1}>Sua empresa na rede industrial.</h2>
          <div>
            <p>Cadastre sua empresa para comprar, fornecer ou atuar dos dois lados da plataforma.</p>
            <Action className="sv-home-body-action">Cadastrar empresa</Action>
          </div>
        </div>
      </section>
    </>
  );
}
