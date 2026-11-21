import {
  Action,
  Arrow,
  Footer,
  Header,
  PageNavigation,
  infoLink,
} from "./components";

const legalPages = {
  privacidade: {
    title: "Política de privacidade",
    intro:
      "Esta política explica quais dados são usados para criar sua conta, cadastrar sua empresa e registrar negociações no SIVI.",
    sections: [
      [
        "Conta e autenticação",
        "Nome, sobrenome, e-mail e credenciais são usados para criar e acessar a conta com Firebase Authentication. A senha é encaminhada ao serviço de autenticação; não integra o rascunho empresarial salvo no navegador.",
      ],
      [
        "Dados empresariais e negociações",
        "Nome da empresa, CNPJ, cidade, UF, contato e atuação compõem o cadastro para análise. Demandas, propostas, pedidos e seus registros são armazenados no Firebase Realtime Database e disponibilizados conforme as permissões e a relação comercial.",
      ],
      [
        "Armazenamento no navegador",
        "O cadastro integrado pode salvar um rascunho empresarial neste navegador por até sete dias, associado à conta. Ele permite retomar a revisão após confirmar o e-mail. Preferências de aparência e contexto também usam armazenamento local ou de sessão. Não há publicidade ou analytics adicionados nesta repaginação.",
      ],
      [
        "Responsável e atendimento",
        "Esta apresentação usa SIVI Tecnologia, São Paulo/SP, e CNPJ 00.000.000/0000-00 como identificação fictícia. contato@sivi.example é somente um exemplo, sem atendimento. Não há canal real para solicitações de dados configurado nesta versão. Antes de operação comercial, o responsável e esse canal precisam ser substituídos por dados reais.",
      ],
    ],
  },
  condicoes: {
    title: "Condições de uso",
    intro:
      "Estas condições explicam como usar a versão demonstrativa do SIVI e quais são as responsabilidades de quem compra e de quem fornece.",
    sections: [
      [
        "O papel da plataforma",
        "O SIVI organiza o relacionamento e os registros comerciais entre empresas. Não fabrica, transporta nem processa o pagamento dos produtos negociados. Capacidade, requisitos, frete, prazos e pagamento devem ser verificados e acordados pelos participantes.",
      ],
      [
        "Conta e cadastro empresarial",
        "A conclusão do formulário cria uma conta real. O acesso operacional requer confirmação de e-mail e análise da empresa. Informe dados corretos de uma empresa que você está autorizado a representar; não use o CNPJ fictício do SIVI como identificação de uma empresa real.",
      ],
      [
        "Planos e ausência de cobrança",
        "Os valores exibidos são uma proposta de oferta comercial. Nesta versão não existe assinatura financeira ativa, débito, renovação automática, fatura ou captura de pagamento. Os planos não estabelecem limites financeiros de acesso implementados. Não há contratação paga pelo envio do formulário.",
      ],
      [
        "Responsabilidades dos participantes",
        "Revise as especificações e condições antes de aceitar propostas. Mantenha as informações de capacidade atualizadas. Registre inspeção, expedição e recebimento conforme os fatos. Não apresente dados de terceiros sem autorização nem compartilhe sua conta.",
      ],
      [
        "Identidade demonstrativa",
        "SIVI Tecnologia, o CNPJ fictício 00.000.000/0000-00 e o e-mail contato@sivi.example são dados de apresentação, sem registro ou atendimento declarado. Estas condições descrevem o produto atual; a operação comercial exige a identificação real do responsável e a formalização das condições comerciais.",
      ],
    ],
  },
} as const;

const pages: any = {
  sobre: {
    eyebrow: "Sobre o SIVI",
    title: "A indústria se move por boas conexões.",
    intro:
      "O SIVI aproxima a necessidade de quem compra da capacidade de quem fornece. E mantém cada acordo registrado ao longo do caminho.",
    sections: [
      [
        "O que fazemos",
        "Somos uma plataforma B2B para organizar demandas industriais, avaliar compatibilidade, comparar propostas e acompanhar pedidos, inspeção, expedição, recebimento e avaliação.",
      ],
      [
        "Para quem existe",
        "Empresas que compram itens industriais e empresas que fornecem materiais, processos ou serviços descritos nas demandas. Uma mesma empresa pode atuar nos dois lados.",
      ],
      [
        "Onde começa a confiança",
        "Requisitos claros, versões das propostas e condições aceitas consultáveis. O cadastro empresarial passa por análise; isso não constitui certificação técnica nem garantia sobre a capacidade declarada.",
      ],
      [
        "Quem apresenta esta versão",
        "SIVI Tecnologia · São Paulo/SP. Identidade demonstrativa definida para esta apresentação. CNPJ fictício: 00.000.000/0000-00. O nome e o documento não representam pessoa jurídica registrada.",
      ],
    ],
  },
  seguranca: {
    eyebrow: "Segurança e dados",
    title: "Cada acesso tem seu contexto.",
    intro:
      "Conta pessoal, empresa e atuação são etapas diferentes. Entenda como isso se conecta no SIVI.",
    sections: [
      [
        "Confirmação do e-mail",
        "A conta usa Firebase Authentication. Antes de solicitar o cadastro da empresa, confirme o endereço pelo link enviado ao seu e-mail. Não compartilhe senha ou links de confirmação.",
      ],
      [
        "Análise empresarial",
        "O cadastro entra em análise administrativa. Quando houver correção solicitada, consulte a justificativa e reenvie. As permissões operacionais dependem da empresa, da atuação e da situação do cadastro.",
      ],
      [
        "Limites claros",
        "A análise cadastral não substitui a diligência comercial e técnica entre empresas. O SIVI não anuncia certificações de segurança, garantia de entrega ou garantia de fornecimento que não tenham sido comprovadas.",
      ],
    ],
  },
  ajuda: {
    eyebrow: "Ajuda e acesso",
    title: "Um caminho claro para começar.",
    intro:
      "Orientações para criar sua conta, confirmar o e-mail e acompanhar a empresa.",
    sections: [
      [
        "1. Escolha a sua atuação",
        "Compras para publicar demandas e comparar propostas; Fornecimento para apresentar capacidade e enviar condições; Integrado para os dois lados. A seleção aparece no cadastro e pode ser revista antes de criar a conta.",
      ],
      [
        "2. Conclua o cadastro",
        "Preencha seus dados e os da empresa. Depois, leia as condições de uso e selecione Criar conta.",
      ],
      [
        "3. Confirme o e-mail",
        "Procure a mensagem de verificação, inclusive em spam. Abra o link e depois entre na conta. Uma tentativa de entrar com e-mail ainda não confirmado pode reenviar a verificação.",
      ],
      [
        "4. Revise a empresa",
        "No mesmo navegador, os dados empresariais podem ser retomados por até sete dias. Revise e envie para análise. Se o rascunho não estiver disponível, apresente a empresa no contexto da sua conta.",
      ],
      [
        "5. Acompanhe a análise",
        "Em Empresas e atuação, consulte o cadastro e use Atualizar situação. Se houver pedido de correção, leia o motivo, ajuste e reenvie. O acesso comercial é liberado após aprovação.",
      ],
      [
        "Esqueceu a senha?",
        "Na página Entrar, informe o e-mail e use Esqueci minha senha. Por segurança, o retorno não confirma se o endereço possui conta. Procure a mensagem na caixa de entrada e em spam.",
      ],
      [
        "Precisa de atendimento?",
        "O contato@sivi.example exibido nesta apresentação é fictício e não recebe mensagens. Esta página oferece as orientações disponíveis; um canal real de atendimento ainda precisa ser configurado.",
      ],
    ],
  },
  creditos: {
    eyebrow: "Créditos",
    title: "Indústria real, em cada imagem.",
    intro:
      "As fotografias e o vídeo utilizados nesta apresentação foram produzidos por pessoas, com origem identificada.",
    sections: [],
  },
};

function LegalDocument({ page }: { page: keyof typeof legalPages }) {
  const { title, intro, sections } = legalPages[page];
  const related = page === "privacidade" ? "condicoes" : "privacidade";

  return (
    <div className="sv-legal-document">
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <header className="sv-legal-heading">
          <h1 id="public-title" tabIndex={-1}>{title}</h1>
          <p>Última atualização em <time dateTime="2026-10-23">23 de outubro de 2026</time></p>
        </header>
        <div className="sv-legal-reading">
          <p>{intro}</p>
          {sections.map(([heading, text], index) => (
            <section key={heading}>
              <h2 id={`info-${index}`} tabIndex={-1}>{index + 1}. {heading}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>
      </main>
      <footer className="sv-legal-footer">
        <a href={infoLink(related)}>{legalPages[related].title}</a>
      </footer>
      <PageNavigation />
    </div>
  );
}

export function InformationPage({ page }: { page: string }) {
  if (page === "privacidade" || page === "condicoes") return <LegalDocument page={page} />;

  const content = pages[page] ?? pages.sobre;
  return (
    <>
      <Header />
      <main id="conteudo" className="sv-information sv-shell" tabIndex={-1}>
        <a className="sv-back" href="#/">
          ← Voltar à página inicial
        </a>
        <p className="sv-eyebrow">{content.eyebrow}</p>
        <h1 id="public-title" tabIndex={-1}>
          {content.title}
        </h1>
        <p className="sv-information-intro">{content.intro}</p>
        <div className="sv-information-grid">
          <aside>
            <span>Nesta página</span>
            {content.sections.map(([title]: any, i: number) => (
              <a key={title} href={`#/?pagina=${page}&secao=info-${i}`}>
                {title}
              </a>
            ))}
            <a href={infoLink("ajuda")}>
              Ajuda e acesso <Arrow />
            </a>
          </aside>
          <div>
            {content.sections.map(([title, text]: any, i: number) => (
              <section key={title}>
                <h2 id={`info-${i}`} tabIndex={-1}>
                  {title}
                </h2>
                <p>{text}</p>
              </section>
            ))}
            {page === "creditos" && (
              <>
                <section>
                  <h2>Vídeo: CNC lathe</h2>
                  <p>
                    Vandurit inserti, via Wikimedia Commons. Licença CC BY 3.0.
                    Vídeo recortado e apresentado sem áudio.
                  </p>
                  <a
                    href="https://commons.wikimedia.org/wiki/File:CNC_lathe.webm"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver vídeo e autoria <Arrow />
                  </a>{" "}
                  ·{" "}
                  <a
                    href="https://creativecommons.org/licenses/by/3.0/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Licença <Arrow />
                  </a>
                </section>
                <section>
                  <h2>Fotografias industriais</h2>
                  <p>
                    Tima Miroshnichenko, via Pexels. Fotografias recortadas para
                    a composição.
                  </p>
                  <a
                    href="https://www.pexels.com/photo/a-man-using-a-turning-machine-5846270/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Operador no torno <Arrow />
                  </a>
                  <br />
                  <a
                    href="https://www.pexels.com/photo/black-metal-machine-on-brown-wooden-table-5846125/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Detalhe do torno <Arrow />
                  </a>{" "}
                  ·{" "}
                  <a
                    href="https://www.pexels.com/license/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Licença Pexels <Arrow />
                  </a>
                </section>
                <section>
                  <h2>Componentes e identidade</h2>
                  <p>
                    Raposa original do SIVI preservada. Gráfico e preços
                    adaptados dos dois componentes de referência do 21st.dev
                    fornecidos pelo responsável. Ícones Lucide e movimento com
                    Motion.
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
        <div className="sv-information-cta">
          <h2>Pronto para o próximo acordo?</h2>
          <Action>Conhecer o cadastro</Action>
        </div>
      </main>
      <Footer />
      <PageNavigation />
    </>
  );
}
