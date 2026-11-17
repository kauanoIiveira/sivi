import { useState } from "react";
import { ArrowUpRight, ClipboardCheck, Check, FileText, Layers3, PackageCheck, ScanSearch, Truck } from "lucide-react";
import { Action, Arrow, infoLink, publicLink, sectionLink, signupLink, workflowLink } from "./components";
import SplitText from "./motion/SplitText";
import { PublicLayout } from "./public-layout";
import { IndustrialBento } from "../components/ui/web3-bento";
import { exampleOperations, money } from "../domain/public-signup.js";
import { PurchaseRecord, purchaseExamples } from "./purchase-examples";

const steps = [
  [
    "Demanda",
    "Tudo começa com uma necessidade.",
    "Material, processo, quantidade e prazo. Reúna os requisitos por item para que a outra empresa saiba exatamente o que precisa atender.",
    "Comprador publica os requisitos.",
    "Fornecedor consulta as especificações.",
    "Requisitos técnicos por item",
  ],
  [
    "Compatibilidade",
    "Capacidade encontra necessidade.",
    "Confira os critérios de compatibilidade entre a demanda e o perfil do fornecedor. O que precisa de confirmação permanece à vista.",
    "Confere os critérios e as pendências.",
    "Mantém seu perfil industrial atualizado.",
    "Critérios atendidos e pendentes",
  ],
  [
    "Propostas",
    "Condições à vista. Decisão informada.",
    "Preço, prazo, frete e pagamento no mesmo contexto. Uma revisão cria uma nova versão e preserva a anterior.",
    "Compara e escolhe as condições.",
    "Prepara e revisa sua proposta.",
    "Histórico de versões da proposta",
  ],
  [
    "Pedido",
    "O combinado vira referência.",
    "A proposta aceita dá origem ao pedido com os itens e as condições acordadas preservados para as duas empresas.",
    "Aceita a proposta e acompanha o pedido.",
    "Consulta o acordo para executar o fornecimento.",
    "Condições aceitas no pedido",
  ],
  [
    "Inspeção",
    "Qualidade registrada por item.",
    "Registre plano, evidências e quantidades aprovadas. As pendências de qualidade precisam ser resolvidas antes da liberação.",
    "Acompanha os registros de qualidade.",
    "Registra a inspeção e os resultados.",
    "Plano e resultado da inspeção",
  ],
  [
    "Expedição",
    "Saída registrada. Próximo destino: entrega.",
    "Após a liberação, o fornecedor registra a expedição. O pedido passa a aguardar a confirmação do recebimento.",
    "Acompanha a situação do pedido.",
    "Registra a saída após a liberação.",
    "Data e situação da expedição",
  ],
  [
    "Recebimento",
    "Um acordo concluído. Um histórico disponível.",
    "Confirme a chegada dos itens e avalie o fornecimento. A negociação continua disponível para consulta.",
    "Confirma o recebimento e avalia.",
    "Consulta a confirmação e a avaliação.",
    "Recebimento e avaliação do fornecedor",
  ],
];
function Workflow() {
  const [selected, setSelected] = useState(() => {
    const params = new URLSearchParams(location.hash.split("?")[1]);
    const step = Number(params.get("etapa"));
    return Number.isInteger(step) && step > 0 && step <= steps.length ? step - 1 : 0;
  });
  const [hasSelectedStep, setHasSelectedStep] = useState(false);
  const step = steps[selected];
  const stepNumber = String(selected + 1).padStart(2, "0");
  return (
    <section className="sv-workflow sv-shell" aria-labelledby="funcionamento">
      <div className="sv-section-heading sv-display-heading">
        <div>
          <p className="sv-landing-label">Como funciona</p>
          <SplitText id="funcionamento" tabIndex={-1} tag="h2" text="Da demanda à entrega." splitType="words" effect="skew" delay={85} duration={0.75} textAlign="left" />
        </div>
        <p data-landing-reveal="fade">
          As duas empresas acompanham o mesmo acordo. Explore o que acontece em
          cada momento.
        </p>
      </div>
      <div className="sv-workflow-layout" data-landing-reveal="fade">
        <ol aria-label="Etapas da compra">
          {steps.map(([label], i) => (
            <li key={label}>
              <button
                aria-pressed={selected === i}
                aria-controls="sv-workflow-panel"
                onClick={() => {
                  if (i === selected) return;
                  setSelected(i);
                  setHasSelectedStep(true);
                }}
              >
                {label}
                <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
        <div
          id="sv-workflow-panel"
          className="sv-workflow-panel"
          aria-live="polite"
        >
          <div className="sv-workflow-sample" data-visual>
            <span>PEDIDO 0248 · EXEMPLO</span>
            <span className="sv-status">
              <i />
              {step[0]}
            </span>
            <div className="sv-record-sheet">
              <div>
                <FileText size={24} />
                <span>
                  Peça de conexão
                  <br />
                  <strong>Alumínio 6061</strong>
                </span>
                <strong>
                  240 <small>un.</small>
                </strong>
              </div>
              <div>
                <span>
                  Material definido <Check size={14} />
                </span>
                <span>
                  Processo: CNC <Check size={14} />
                </span>
              </div>
              <div key={stepNumber} className="sv-stage-record t-panel-enter">
                <small>REGISTRO EM DESTAQUE</small>
                <p>{step[5]}</p>
              </div>
            </div>
          </div>
          <div className="sv-workflow-copy">
            <p className="sv-eyebrow">
              Etapa{" "}
              <span className="sr-only">{stepNumber}</span>
              <span
                key={stepNumber}
                aria-hidden="true"
                className={`t-digit-group${hasSelectedStep ? " is-animating" : ""}`}
              >
                {[...stepNumber].map((digit, index) => (
                  <span key={index} className="t-digit" data-stagger={index}>{digit}</span>
                ))}
              </span>{" "}
              / {String(steps.length).padStart(2, "0")}
            </p>
            <h3 key={`title-${stepNumber}`} className="sv-stage-record t-panel-enter">{step[1]}</h3>
            <p key={`copy-${stepNumber}`} className="sv-stage-record t-panel-enter">{step[2]}</p>
            <dl key={`roles-${stepNumber}`} className="sv-stage-record t-panel-enter">
              <div>
                <dt>Comprador</dt>
                <dd>{step[3]}</dd>
              </div>
              <div>
                <dt>Fornecedor</dt>
                <dd>{step[4]}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
function Solutions() {
  const quotes = exampleOperations("90").quotes;
  return (
    <section className="sv-solutions" aria-labelledby="solucoes-title">
      <div className="sv-shell">
        <div className="sv-display-heading sv-display-heading--center">
          <p className="sv-landing-label">Soluções</p>
          <h2 id="solucoes-title">Dois lados da mesma compra.</h2>
        </div>
        <div className="sv-solution-list">
          <article className="sv-solution">
            <div className="sv-solution-copy">
              <h3 id="compras" tabIndex={-1}>Para compradores</h3>
              <p>Publique sua demanda com requisitos por item e compare as condições antes de fechar o pedido.</p>
              <ul>
                <li><Check aria-hidden="true" /> Compatibilidade com os requisitos da compra</li>
                <li><Check aria-hidden="true" /> Comparação de preço, prazo, frete e pagamento</li>
                <li><Check aria-hidden="true" /> Acompanhamento até o recebimento e a avaliação</li>
              </ul>
              <Action href={signupLink("buyer")}>Cadastrar como comprador</Action>
            </div>
            <div className="sv-solution-visual sv-quote-visual" data-landing-reveal="lift" data-landing-pointer="tilt">
              <div className="sv-quote">
                <div className="sv-quote-heading">
                  <span><FileText size={17} aria-hidden="true" /> Compras / Propostas</span>
                  <small>Exemplo</small>
                </div>
                <strong>Peça de conexão</strong>
                <p>Alumínio 6061 · Usinagem CNC · 240 peças</p>
                <table aria-label="Exemplo de comparação de propostas">
                  <thead><tr><th scope="col">Proposta</th><th scope="col">Valor</th><th scope="col">Prazo</th></tr></thead>
                  <tbody>
                    {quotes.map(({ label, amount, days }) => (
                      <tr key={label}><th scope="row">{label}</th><td>{money(amount)}</td><td>{days} dias</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </article>
          <article className="sv-solution sv-solution--reverse">
            <div className="sv-solution-copy">
              <h3 id="fornecimento" tabIndex={-1}>Para fornecedores</h3>
              <p>Apresente sua capacidade industrial, encontre demandas compatíveis e acompanhe o fornecimento.</p>
              <ul>
                <li><Check aria-hidden="true" /> Perfil com materiais, processos e regiões</li>
                <li><Check aria-hidden="true" /> Propostas com histórico de revisões</li>
                <li><Check aria-hidden="true" /> Registros de inspeção e expedição</li>
              </ul>
              <Action href={signupLink("supplier")}>Cadastrar como fornecedor</Action>
            </div>
            <div className="sv-solution-visual sv-solution-photo" data-landing-reveal="curtain" data-landing-pointer="photo">
              <img src="./assets/detalhe-torno.jpg" alt="Detalhe de uma ferramenta de usinagem" loading="lazy" width="960" height="640" />
            </div>
          </article>
          <article className="sv-solution">
            <div className="sv-solution-copy">
              <h3>Um pedido para as duas empresas</h3>
              <p>O aceite transforma a proposta em pedido. As duas empresas consultam os mesmos itens, valores e condições durante o fornecimento.</p>
              <ul>
                <li><Check aria-hidden="true" /> Inspeção e liberação antes da expedição</li>
                <li><Check aria-hidden="true" /> Registro da saída pelo fornecedor</li>
                <li><Check aria-hidden="true" /> Confirmação de recebimento pelo comprador</li>
              </ul>
              <Action href={workflowLink(4)}>Ver a etapa do pedido</Action>
            </div>
            <div className="sv-solution-visual sv-quote-visual" data-landing-reveal="lift">
              <PurchaseRecord example={purchaseExamples[3]} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

const purchaseActions = [
  { step: 1, Icon: FileText, label: "Especificar materiais" },
  { step: 2, Icon: ScanSearch, label: "Conferir compatibilidade" },
  { step: 3, Icon: Layers3, label: "Comparar propostas" },
  { step: 5, Icon: ClipboardCheck, label: "Registrar inspeção" },
  { step: 6, Icon: Truck, label: "Acompanhar expedição" },
  { step: 7, Icon: PackageCheck, label: "Confirmar recebimento" },
];

function PurchaseActions() {
  return (
    <section className="sv-purchase-actions" aria-labelledby="recursos-title">
      <div className="sv-shell">
        <div className="sv-display-heading">
          <h2 id="recursos-title">O que você pode fazer no SIVI.</h2>
        </div>
        <ul className="sv-purchase-grid" data-landing-reveal="fade">
          {purchaseActions.map(({ step, Icon, label }) => (
            <li key={step}>
              <a href={workflowLink(step)}><Icon aria-hidden="true" /><span>{label}</span><Arrow /></a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PlatformPage() {
  return (
    <PublicLayout page="platform">
      <section className="sv-page-banner">
        <div className="sv-shell sv-display-heading">
          <h1 id="public-title" tabIndex={-1}>Plataforma industrial</h1>
          <p>Publique demandas, compare propostas e acompanhe pedidos. Cada empresa vê o que precisa fazer em sua etapa da compra.</p>
          <Action href={sectionLink("funcionamento")}>Ver as etapas da compra</Action>
        </div>
      </section>
      <Solutions />
      <section className="sv-platform" aria-labelledby="plataforma-title">
        <div className="sv-shell">
          <div className="sv-display-heading">
            <p className="sv-landing-label">Demonstração</p>
            <h2 id="plataforma-title">A plataforma por dentro.</h2>
            <p data-landing-reveal="fade">Alterne entre Comprador e Fornecedor para explorar como cada empresa acompanha propostas e pedidos.</p>
          </div>
          <div data-landing-reveal="fade"><IndustrialBento /></div>
        </div>
      </section>
      <Workflow />
      <PurchaseActions />
      <section className="sv-agreement" aria-labelledby="historico-title">
        <div className="sv-shell">
          <div className="sv-display-heading">
            <h2 id="historico-title">O acordo fica registrado.</h2>
            <p data-landing-reveal="fade">Consulte o histórico de propostas, condições aceitas e registros do pedido durante a compra.</p>
            <a className="sv-text-link" href={infoLink("seguranca")}>Como o SIVI trata os dados <Arrow /></a>
          </div>
          <dl>
            <div><dt>Etapas da compra</dt><dd data-landing-reveal="number">{String(steps.length).padStart(2, "0")}</dd></div>
            <div><dt>Formas de atuação</dt><dd data-landing-reveal="number">02</dd></div>
            <div><dt>Histórico por pedido</dt><dd data-landing-reveal="number">01</dd></div>
          </dl>
        </div>
      </section>
      <section className="sv-home-agreement sv-home-agreement--dark" aria-labelledby="plataforma-exemplos">
        <div className="sv-shell sv-display-heading">
          <h2 id="plataforma-exemplos">Veja os registros em uma compra.</h2>
          <p>Os casos de uso mostram o que cada empresa faz e o que fica disponível para consulta em cada etapa.</p>
          <Action href={publicLink("cases")}>Explorar casos de uso</Action>
        </div>
      </section>
    </PublicLayout>
  );
}
