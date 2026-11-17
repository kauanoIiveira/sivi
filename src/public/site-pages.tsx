import { ClipboardCheck, FileText, Layers3, ShieldCheck } from "lucide-react";
import { Action, Arrow, infoLink, publicLink, publicSectionLink, sectionLink, workflowLink } from "./components";
import SplitText from "./motion/SplitText";
import { PublicLayout } from "./public-layout";
import { PurchaseRecord, purchaseExamples } from "./purchase-examples";

const principles = [
  { Icon: FileText, title: "Requisitos por item", description: "Cada fornecedor consulta o que foi especificado para a peça ou o material que vai cotar." },
  { Icon: Layers3, title: "Versões consultáveis", description: "As revisões da proposta formam um histórico. O pedido preserva a versão aceita." },
  { Icon: ClipboardCheck, title: "Responsabilidade por etapa", description: "Quem fornece registra a inspeção e a expedição. Quem compra confirma o recebimento." },
  { Icon: ShieldCheck, title: "Acesso por empresa", description: "A confirmação do e-mail e a análise do cadastro precedem o acesso operacional." },
];

export function AboutPage() {
  return (
    <PublicLayout page="about">
      <section className="sv-page-banner">
        <div className="sv-shell sv-page-split">
          <div className="sv-display-heading">
            <h1 id="public-title" tabIndex={-1}>Quem somos</h1>
            <p>Somos o Sistema Integrado de Vendas Industriais. Reunimos compradores e fornecedores em um só lugar para organizar as condições da compra e acompanhar o pedido até a entrega.</p>
            <Action href={publicLink("platform")}>Conhecer a plataforma</Action>
          </div>
          <video className="sv-about-video" controls playsInline preload="none" poster="./assets/cnc-lathe-poster.jpg" muted aria-label="Vídeo de uma operação de usinagem CNC">
            <source src="./assets/cnc-lathe.webm" type="video/webm" />
          </video>
        </div>
      </section>
      <section className="sv-about-purpose" aria-labelledby="visao-geral">
        <div className="sv-shell sv-about-details">
          <div className="sv-display-heading">
            <SplitText id="visao-geral" tabIndex={-1} tag="h2" text="Quem compra encontra quem fabrica." splitType="words" effect="flip" delay={85} duration={0.85} textAlign="left" />
            <p>O SIVI organiza a negociação e os registros. Fabricação, transporte e pagamento são combinados entre as empresas.</p>
          </div>
          <img className="sv-purpose-mark" src="./src/assets/brand/raposa.svg" width="160" height="160" alt="" />
          <dl>
            <div data-landing-reveal="fade">
              <dt>Por que existe</dt>
              <dd>Uma compra industrial depende de especificações que vão além de preço e quantidade. As duas partes precisam trabalhar com os mesmos requisitos.</dd>
            </div>
            <div data-landing-reveal="fade">
              <dt>Como funciona</dt>
              <dd>O comprador descreve os requisitos e compara propostas. O fornecedor apresenta sua capacidade e registra o que foi acordado.</dd>
            </div>
            <div data-landing-reveal="fade">
              <dt>O que fica registrado</dt>
              <dd>As propostas e suas versões, as condições aceitas e o andamento do pedido até o recebimento e a avaliação.</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="sv-about-audiences" aria-labelledby="quem-usa">
        <div className="sv-shell">
          <div className="sv-display-heading sv-display-heading--center">
            <h2 id="quem-usa">Quem usa o SIVI.</h2>
          </div>
          <div className="sv-audience-grid">
            <article>
              <img src="./assets/operador-torno.jpg" data-landing-reveal="curtain" alt="Operador conferindo uma operação de usinagem" loading="lazy" width="960" height="640" />
              <h3>Empresas compradoras</h3>
              <p>Equipes que precisam descrever peças, materiais ou serviços, comparar cotações e acompanhar o que foi combinado até o recebimento.</p>
              <a className="sv-text-link" href={sectionLink("compras")}>Ver como funciona para compras <Arrow /></a>
            </article>
            <article>
              <img src="./assets/detalhe-torno.jpg" data-landing-reveal="curtain" alt="Detalhe de uma máquina de usinagem" loading="lazy" width="960" height="640" />
              <h3>Empresas fornecedoras</h3>
              <p>Empresas que apresentam seus materiais, processos e regiões atendidas, cotam demandas e registram o andamento do fornecimento.</p>
              <a className="sv-text-link" href={sectionLink("fornecimento")}>Ver como funciona para fornecimento <Arrow /></a>
            </article>
          </div>
        </div>
      </section>
      <section className="sv-account-journey" aria-labelledby="conta-operacao">
        <div className="sv-shell">
          <div className="sv-display-heading">
            <h2 id="conta-operacao">Da conta ao acesso da empresa.</h2>
            <p>Uma empresa pode comprar, fornecer ou exercer as duas atuações.</p>
          </div>
          <ol>
            <li><strong>Confirme seu e-mail.</strong><p>Use o link enviado para validar a sua conta pessoal.</p></li>
            <li><strong>Apresente a empresa.</strong><p>Informe os dados empresariais e escolha como ela vai atuar.</p></li>
            <li><strong>Acompanhe a análise.</strong><p>Consulte o cadastro e responda a eventuais pedidos de correção.</p></li>
          </ol>
          <Action href={publicLink("faq")}>Entender o cadastro</Action>
        </div>
      </section>
      <section className="sv-about-principles" aria-labelledby="principios">
        <div className="sv-shell">
          <div className="sv-display-heading sv-display-heading--center">
            <h2 id="principios">Princípios da plataforma.</h2>
          </div>
          <div className="sv-principle-grid">
            {principles.map(({ Icon, title, description }) => (
              <article key={title} data-landing-reveal="fade">
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <Action href={publicLink("cases")}>Ver os princípios em exemplos</Action>
        </div>
      </section>
    </PublicLayout>
  );
}

export function CasesPage() {
  return (
    <PublicLayout page="cases" lightHeader>
      <section className="sv-page-banner sv-page-banner--light sv-page-banner--center">
        <div className="sv-shell sv-display-heading">
          <h1 id="public-title" tabIndex={-1}>Casos de uso</h1>
          <p>Acompanhe uma compra ilustrativa de 240 peças, da primeira especificação à confirmação do recebimento.</p>
          <nav className="sv-section-index" aria-label="Casos nesta página">
            {purchaseExamples.map(({ id, title }) => (
              <a key={id} href={publicSectionLink("cases", id)}>{title}</a>
            ))}
          </nav>
        </div>
      </section>
      <div className="sv-shell sv-cases-list">
        {purchaseExamples.map((example) => (
          <article key={example.id} className="sv-example-entry sv-case-row">
            <div className="sv-case-body sv-display-heading">
              <h2 id={example.id} tabIndex={-1}>{example.title}</h2>
              <p>{example.context}</p>
              <dl>
                <div><dt>Como usar o SIVI</dt><dd>{example.walkthrough}</dd></div>
                <div><dt>O que fica registrado</dt><dd>{example.record}</dd></div>
              </dl>
              <Action href={workflowLink(example.step)} className="sv-case-action">
                Explorar etapa<span className="sr-only"> de {example.title.toLowerCase()}</span>
              </Action>
            </div>
            <div className="sv-example-art" data-landing-reveal="record"><PurchaseRecord example={example} /></div>
          </article>
        ))}
      </div>
      <section className="sv-home-agreement sv-home-agreement--dark" aria-labelledby="casos-jornada">
        <div className="sv-shell sv-display-heading">
          <h2 id="casos-jornada">Veja a jornada completa.</h2>
          <p>Explore os sete passos da compra e confira o papel de cada empresa em cada etapa.</p>
          <Action href={sectionLink("funcionamento")}>Abrir a jornada de compra</Action>
        </div>
      </section>
    </PublicLayout>
  );
}

const accessQuestions = [
  [
    "Quem pode usar o SIVI?",
    "Responsáveis por empresas compradoras ou fornecedoras do setor industrial. Crie uma conta, informe o nome e a atuação da empresa e envie o cadastro para análise.",
  ],
  [
    "Minha empresa pode comprar e fornecer?",
    "Sim. Selecione Compradora e fornecedora no campo Atuação da empresa. Depois da aprovação, você poderá alternar entre os dois contextos.",
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
    "Quais dados preciso informar?",
    "O cadastro da conta pede os dados pessoais. Para a empresa, informe o nome e a atuação. CNPJ, cidade, UF e contato são dados complementares opcionais.",
  ],
  [
    "Posso mudar a atuação escolhida no cadastro?",
    "Sim. Antes de criar a conta, revise a atuação na etapa Apresente sua empresa.",
  ],
  [
    "Esqueci a senha. Como recupero o acesso?",
    "Na tela Entrar, selecione Esqueci minha senha, informe o e-mail da conta e verifique a caixa de entrada e o spam.",
  ],
];

const purchaseQuestions = [
  [
    "Como sei se um fornecedor atende à demanda?",
    "Consulte na demanda os critérios comparados com o perfil do fornecedor, como materiais e processos. Verifique diretamente com a empresa os critérios que ainda precisam de confirmação.",
  ],
  [
    "O que acontece quando uma proposta é revisada?",
    "Cada revisão fica disponível no histórico. Ao aceitar a proposta, o comprador gera um pedido com os itens e condições da versão aceita.",
  ],
  [
    "Qual é o próximo passo antes da expedição?",
    "O fornecedor registra a inspeção por item e resolve eventuais pendências para liberar o pedido. Em seguida pode registrar a expedição.",
  ],
  [
    "Quem fabrica, entrega e recebe o pagamento dos pedidos?",
    "O fornecedor é responsável pela fabricação ou fornecimento. As empresas negociam entrega e pagamento entre si. O SIVI organiza a negociação e seus registros.",
  ],
  [
    "Onde consulto o que foi combinado?",
    "Abra o pedido para consultar os itens, as condições aceitas e os registros vinculados à compra, de acordo com as permissões da sua empresa.",
  ],
];

const faqTopics = [
  { id: "duvidas-cadastro", title: "Cadastro e acesso", questions: accessQuestions },
  { id: "duvidas-compras", title: "Compra e fornecimento", questions: purchaseQuestions },
];

export function FaqPage() {
  return (
    <PublicLayout page="faq" lightHeader>
      <section className="sv-page-banner sv-page-banner--light">
        <div className="sv-shell sv-display-heading">
          <h1 id="public-title" tabIndex={-1}>Dúvidas</h1>
          <p>Encontre orientações para cadastrar a empresa, recuperar o acesso e acompanhar uma compra no SIVI.</p>
          <nav className="sv-section-index" aria-label="Temas de ajuda">
            {faqTopics.map(({ id, title }) => <a key={id} href={publicSectionLink("faq", id)}>{title}</a>)}
          </nav>
        </div>
      </section>
      <section className="sv-faq sv-shell sv-faq-page" aria-labelledby="duvidas">
        <div className="sv-display-heading">
          <h2 id="duvidas" tabIndex={-1}>Perguntas frequentes.</h2>
          <a className="sv-text-link" href={infoLink("ajuda")}>Ver orientações de acesso <Arrow /></a>
        </div>
        <div className="sv-faq-topics">
          {faqTopics.map(({ id, title, questions }) => (
            <section key={id} aria-labelledby={id}>
              <h3 id={id} tabIndex={-1}>{title}</h3>
              {questions.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}<span aria-hidden="true">+</span></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </section>
          ))}
        </div>
      </section>
      <section className="sv-home-agreement sv-home-agreement--dark" aria-labelledby="duvidas-comecar">
        <div className="sv-shell sv-display-heading">
          <h2 id="duvidas-comecar">Pronto para cadastrar sua empresa?</h2>
          <p>Crie sua conta e escolha como a sua empresa vai atuar no SIVI.</p>
          <Action>Cadastrar empresa</Action>
        </div>
      </section>
    </PublicLayout>
  );
}
