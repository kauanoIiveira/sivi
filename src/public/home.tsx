import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  FileText,
  Pause,
  Play,
  ShieldCheck,
} from "lucide-react";
import {
  Action,
  Arrow,
  Footer,
  Header,
  PageNavigation,
  Reveal,
  infoLink,
  sectionLink,
  signupLink,
} from "./components";
import { PricingSection } from "../components/ui/pricing-section";
import { IndustrialBento } from "../components/ui/web3-bento";
import { consumePublicIntro } from "../core/public-intro.js";

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
const questions = [
  [
    "Quem pode usar o SIVI?",
    "Responsáveis por empresas compradoras ou fornecedoras do setor industrial. O cadastro pede CNPJ, localização, contato e atuação. A empresa passa por análise administrativa antes do acesso comercial.",
  ],
  [
    "Minha empresa pode comprar e fornecer?",
    "Sim. O plano Integrado reúne as duas atuações. Depois da aprovação, você alterna entre os contextos de compras e fornecimento da empresa.",
  ],
  [
    "Vou pagar ao criar a conta?",
    "O acesso acadêmico é gratuito. Os preços apresentados ilustram a proposta comercial.",
  ],
  [
    "O que acontece depois do cadastro?",
    "Confirme o e-mail pelo link recebido e entre na conta. Revise os dados empresariais para enviá-los à análise. No mesmo navegador, o rascunho pode ser retomado por até sete dias.",
  ],
  [
    "Onde acompanho a aprovação?",
    "Em Empresas e atuação, use Atualizar situação e Consultar cadastro. Se houver correção solicitada, leia o motivo, ajuste os dados e reenvie.",
  ],
  [
    "O SIVI fabrica, entrega ou recebe o pagamento dos pedidos?",
    "O SIVI organiza a negociação e seus registros. Fabricação, fornecimento, transporte e pagamento são responsabilidades e condições combinadas entre comprador e fornecedor.",
  ],
  [
    "Posso mudar minha escolha antes de concluir?",
    "Sim. O cadastro permite rever plano, periodicidade e dados antes do botão final. Não há uma assinatura financeira ativa nesta versão.",
  ],
];
function Hero() {
  const reduced = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(
    () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      Boolean((navigator as any).connection?.saveData),
  );
  const [first] = useState(consumePublicIntro);
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
  }, [reduced, paused]);
  return (
    <section className="sv-hero" aria-labelledby="public-title">
      <div className="sv-hero-media">
        <motion.video
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          poster="./assets/cnc-lathe-poster.jpg"
          initial={first && !reduced ? { scale: 1.08 } : false}
          animate={{ scale: 1 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <source src="./assets/cnc-lathe.webm" type="video/webm" />
        </motion.video>
        <div className="sv-hero-shade" />
      </div>
      <div className="sv-shell sv-hero-inner">
        <motion.div
          initial={first && !reduced ? { opacity: 0, y: 30 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 id="public-title" tabIndex={-1}>
            O próximo acordo
            <br />
            começa <em>aqui.</em>
          </h1>
          <p className="sv-hero-description">
            Conecte a necessidade da sua empresa à capacidade de quem fornece.
            Da demanda ao recebimento, com cada condição registrada.
          </p>
          <div className="sv-hero-actions">
            <Action href={sectionLink("planos")}>Encontre seu plano</Action>
            <a className="sv-hero-link" href={sectionLink("funcionamento")}>
              Veja o SIVI em movimento <Arrow />
            </a>
          </div>
          <p className="sv-hero-note">
            Para comprar, fornecer e construir o próximo acordo.
          </p>
        </motion.div>
        <div className="sv-hero-bottom">
          <span>
            INDÚSTRIA REAL.
            <br />
            RELAÇÕES QUE FAZEM ACONTECER.
          </span>
          <div>
            <span>Usinagem CNC · imagens reais</span>
            <button
              aria-label={
                paused ? "Reproduzir vídeo de fundo" : "Pausar vídeo de fundo"
              }
              aria-pressed={!paused}
              onClick={() => setPaused(!paused)}
            >
              {paused ? <Play size={15} /> : <Pause size={15} />}
            </button>
          </div>
          <a href={sectionLink("conteudo")} aria-label="Conhecer a plataforma">
            Explore ↓
          </a>
        </div>
      </div>
    </section>
  );
}
function Workflow() {
  const [selected, setSelected] = useState(0);
  const step = steps[selected];
  return (
    <section className="sv-workflow sv-shell" aria-labelledby="funcionamento">
      <Reveal className="sv-section-heading">
        <div>
          <h2 id="funcionamento" tabIndex={-1}>
            Uma compra.
            <br />
            Cada etapa conectada.
          </h2>
        </div>
        <p>
          As duas empresas acompanham o mesmo acordo. Explore o que acontece em
          cada momento.
        </p>
      </Reveal>
      <div className="sv-workflow-layout">
        <ol aria-label="Etapas da compra">
          {steps.map(([label], i) => (
            <li key={label}>
              <button
                aria-pressed={selected === i}
                aria-controls="sv-workflow-panel"
                onClick={() => setSelected(i)}
              >
                <span>0{i + 1}</span>
                {label}
                <ArrowUpRight size={18} />
              </button>
            </li>
          ))}
        </ol>
        <div
          id="sv-workflow-panel"
          className="sv-workflow-panel"
          aria-live="polite"
        >
          <div className="sv-workflow-sample">
            <span>ACORDO / 0248</span>
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
              <div>
                <small>REGISTRO EM DESTAQUE</small>
                <p>{step[5]}</p>
              </div>
            </div>
            <small>Exemplo ilustrativo de pedido e especificação</small>
          </div>
          <div className="sv-workflow-copy">
            <p className="sv-eyebrow">Etapa 0{selected + 1} / 07</p>
            <h3>{step[1]}</h3>
            <p>{step[2]}</p>
            <dl>
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
export function Home() {
  return (
    <>
      <Header />
      <Hero />
      <main id="conteudo" tabIndex={-1}>
        <div className="sv-value-strip sv-shell">
          <span>
            Da especificação
            <br />
            <strong>à decisão.</strong>
          </span>
          <p>Requisitos claros.</p>
          <p>Propostas comparáveis.</p>
          <p>Acordos registrados.</p>
        </div>
        <section className="sv-intro sv-shell">
          <Reveal>
            <h2>
              Quem precisa encontra.
              <br />
              Quem faz, <span>acontece.</span>
            </h2>
          </Reveal>
          <Reveal>
            <p>
              Uma compra industrial envolve mais que preço. Envolve capacidade,
              prazo e confiança no que foi combinado.
            </p>
            <p>
              O SIVI organiza essa relação em um fluxo que as duas empresas
              podem acompanhar.
            </p>
            <a className="sv-text-link" href={infoLink("sobre")}>
              Conheça a plataforma <Arrow />
            </a>
          </Reveal>
        </section>
        <section className="sv-insights-section">
          <div className="sv-shell">
            <Reveal className="sv-section-heading">
              <div>
                <h2>
                  Veja o contexto.
                  <br />
                  Decida com clareza.
                </h2>
              </div>
              <p>
                Requisitos, propostas e condições no lugar certo. Uma visão do
                que está em negociação e do que já foi acordado.
              </p>
            </Reveal>
            <Reveal className="sv-demo-wrap">
              <IndustrialBento />
            </Reveal>
            <div className="sv-evidence-caption">
              <span>UM FLUXO COMPARTILHADO</span>
              <p>
                O fornecedor entende a demanda.
                <br />O comprador acompanha o combinado.
              </p>
              <a href={sectionLink("funcionamento")} className="sv-text-link">
                Explore as etapas <Arrow />
              </a>
            </div>
          </div>
        </section>
        <Workflow />
        <section
          className="sv-role-section sv-shell"
          aria-label="SIVI para sua empresa"
        >
          <article className="sv-role">
            <div className="sv-role-photo">
              <img
                src="./assets/operador-torno.jpg"
                alt="Operador trabalhando em um torno industrial"
                loading="lazy"
                width="960"
                height="640"
              />
              <span>CAPACIDADE DO OUTRO LADO.</span>
            </div>
            <Reveal className="sv-role-copy">
              <p className="sv-eyebrow">Para compradores</p>
              <h2 id="compras" tabIndex={-1}>
                Compras claras.
                <br />
                Do início ao fim.
              </h2>
              <p>
                Descreva os requisitos, confira a compatibilidade e compare as
                condições. A decisão fica com você, com o contexto à vista.
              </p>
              <ul>
                <li>
                  <ArrowUpRight size={13} aria-hidden="true" />
                  Especificações técnicas por item.
                </li>
                <li>
                  <ArrowUpRight size={13} aria-hidden="true" />
                  Comparação de preço, prazo, frete e pagamento.
                </li>
                <li>
                  <ArrowUpRight size={13} aria-hidden="true" />
                  Acompanhamento até o recebimento e a avaliação.
                </li>
              </ul>
              <a className="sv-text-link" href={signupLink("compras")}>
                Quero comprar com mais clareza <Arrow />
              </a>
            </Reveal>
          </article>
          <article className="sv-role sv-role--reverse">
            <div className="sv-role-photo">
              <img
                src="./assets/detalhe-torno.jpg"
                alt="Detalhe de uma máquina de usinagem em uma oficina"
                loading="lazy"
                width="960"
                height="640"
              />
              <span>NECESSIDADE ENCONTRA CAPACIDADE.</span>
            </div>
            <Reveal className="sv-role-copy">
              <p className="sv-eyebrow">Para fornecedores</p>
              <h2 id="fornecimento" tabIndex={-1}>
                Sua capacidade.
                <br />
                Novas conexões.
              </h2>
              <p>
                Apresente sua capacidade industrial, consulte demandas e prepare
                propostas com condições bem definidas.
              </p>
              <ul>
                <li>
                  <ArrowUpRight size={13} aria-hidden="true" />
                  Perfil com materiais, processos e regiões.
                </li>
                <li>
                  <ArrowUpRight size={13} aria-hidden="true" />
                  Revisões de proposta com histórico.
                </li>
                <li>
                  <ArrowUpRight size={13} aria-hidden="true" />
                  Registros de inspeção e expedição.
                </li>
              </ul>
              <a className="sv-text-link" href={signupLink("fornecimento")}>
                Quero apresentar minha capacidade <Arrow />
              </a>
            </Reveal>
          </article>
        </section>
        <section className="sv-trust">
          <div className="sv-shell">
            <Reveal>
              <ShieldCheck size={30} />
              <h2>
                O combinado não
                <br />
                precisa ficar na memória.
              </h2>
              <p>
                Versões preservadas. Condições registradas.
                <br />
                Uma referência para quem compra e para quem fornece.
              </p>
              <a className="sv-text-link" href={infoLink("seguranca")}>
                Entenda os acessos e os dados <Arrow />
              </a>
            </Reveal>
            <div className="sv-trust-facts">
              <div>
                <span>01</span>
                <h3>Seu e-mail, confirmado.</h3>
                <p>Uma conta pessoal para acessar a plataforma.</p>
              </div>
              <div>
                <span>02</span>
                <h3>Sua empresa, apresentada.</h3>
                <p>Dados empresariais revisados e sujeitos à análise.</p>
              </div>
              <div>
                <span>03</span>
                <h3>Seu contexto, definido.</h3>
                <p>Compras, fornecimento ou as duas atuações.</p>
              </div>
            </div>
          </div>
        </section>
        <PricingSection />
        <section className="sv-faq sv-shell">
          <Reveal>
            <h2 id="duvidas" tabIndex={-1}>
              Tudo às claras.
            </h2>
            <p>
              As respostas que ajudam
              <br />a começar com segurança.
            </p>
            <a className="sv-text-link" href={infoLink("ajuda")}>
              Ver orientações de acesso <Arrow />
            </a>
          </Reveal>
          <div>
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="sv-final-cta">
          <div className="sv-shell">
            <Reveal>
              <h2>
                Sua capacidade.
                <br />
                Uma nova <em>conexão.</em>
              </h2>
              <div>
                <Action href={sectionLink("planos")}>Encontre seu plano</Action>
                <span>
                  Cadastro real. Pagamento demonstrativo.
                  <br />
                  Sem cobrança nesta versão.
                </span>
              </div>
            </Reveal>
            <ArrowUpRight
              className="sv-cta-symbol"
              aria-hidden="true"
              strokeWidth={1}
            />
          </div>
        </section>
      </main>
      <Footer />
      <PageNavigation />
    </>
  );
}
