# Direção editorial para as páginas públicas do SIVI

Direção aprovada. Os detalhes podem ser ajustados após a revisão de cada página.

## Objetivo

Ajudar quem avalia o SIVI antes de cadastrar uma empresa. A pessoa deve conseguir entender quem criou o projeto, experimentar como uma compra industrial é organizada e tirar dúvidas sobre o primeiro acesso. A nova home e as telas de acesso definem a identidade visual.

O redesenho abrange Quem somos (`#/quem-somos`), O que fazemos (`#/plataforma`) e Perguntas frequentes (`#/duvidas`). As rotas e os links de seção existentes são a base da navegação. A aplicação desta direção visual fica restrita a essas três páginas.

## Direções discutidas

| Direção | Experiência | Consequência |
| --- | --- | --- |
| Editorial industrial | Fotografia e história em Quem somos, demonstração em O que fazemos e leitura rápida no FAQ. | Cada página cumpre uma função própria. Fotografias de equipe podem tornar a apresentação mais pessoal. |
| Produto em primeiro plano | Uma demonstração domina a apresentação e Quem somos fica concentrada em uma breve introdução à equipe. | Encurta o caminho de quem quer avaliar o sistema e dá menos espaço à história do projeto. |

O usuário escolheu **editorial industrial**. A decisão reserva o principal momento interativo para a página em que ele ajuda a entender o produto.

## Base visual

- Manrope, superfícies brancas e cinza-claro, texto grafite e laranja `#ff9000` nas ações principais e nos indicadores de etapa ativa.
- Mesmas margens laterais e linguagem de links da home. Títulos alinhados à esquerda em Quem somos e O que fazemos. O FAQ usa coluna de leitura, similar em sobriedade às páginas legais.
- Header e footer seguem a composição aprovada da home. Em páginas com abertura branca, o header começa com texto escuro e botão cinza-claro. Na navegação global, os rótulos **Plataforma** e **Dúvidas** levam às páginas com os títulos **O que fazemos** e **Perguntas frequentes**.
- A navegação e os controles funcionam por toque e teclado. Com movimento reduzido, o conteúdo aparece no estado final. As páginas mantêm leitura e navegação usuais durante a rolagem.

## Quem somos

A primeira tela combina uma chamada editorial e uma fotografia industrial em formato amplo. A chamada proposta é **Quem está por trás do SIVI**. A introdução apresenta o SIVI como uma plataforma que aproxima compradores e fornecedores industriais e registra as etapas da negociação.

Em seguida, uma composição de texto e imagem apresenta o problema e o propósito do projeto. A origem entra quando houver fatos confirmados. A equipe aparece quando houver nomes, funções e retratos autorizados. Enquanto esse material estiver pendente, a chamada **Por que o SIVI existe** abre a página, que explica o papel da plataforma a partir do fluxo de compra. Uma fotografia licenciada de oficina pode ilustrar o setor.

O momento visual é a revelação de uma fotografia por recorte na seção da história. No celular, o texto precede a imagem e o enquadramento acompanha o formato da tela. A ação de encerramento é **Ver como o SIVI funciona**, que leva à plataforma.

As referências para dar espaço às pessoas e à fotografia industrial vêm da Vention e do ensaio da Arc Boats. [Vention — missão e equipe](https://vention.com/about) · [Arc Boats — fotografia de produção](https://vector.tv/work/arc-boats)

## O que fazemos

A primeira tela apresenta **Uma compra industrial, da demanda ao recebimento** ao lado de uma demonstração baseada na interface do SIVI. O exemplo usa dados fictícios identificados como demonstrativos e pode ser percorrido sem conta. **Quero comprar** e **Quero fornecer** alternam a perspectiva sobre o mesmo pedido. A visão de compras é o ponto de partida.

| Etapa | Quem compra vê | Quem fornece vê |
| --- | --- | --- |
| Demanda | Itens, requisitos técnicos e prazo desejado. | Requisitos e compatibilidade com o perfil industrial. |
| Propostas | Comparação de condições e versões. | Envio ou revisão de uma proposta. |
| Pedido | Condições da versão aceita. | Pedido com os itens e o acordo registrado. |
| Inspeção e expedição | Consulta aos registros do pedido. | Registro das evidências e andamento da expedição. |
| Recebimento | Confirmação do recebimento e avaliação. | Acompanhamento da confirmação do comprador. |

A etapa selecionada troca o painel e explica quem age e o que fica registrado. A troca depende da escolha do visitante. Ao alternar a perspectiva, a etapa selecionada permanece. No celular, o seletor e a tela de exemplo aparecem em sequência. A ação **Cadastrar empresa** encaminha à atuação correspondente.

Os links para `?secao=compras` e `?secao=fornecimento` abrem a perspectiva correspondente. Os links de `funcionamento` preservam os números já publicados. Os números 1 e 2 abrem Demanda, 3 abre Propostas, 4 abre Pedido, 5 e 6 abrem Inspeção e expedição e 7 abre Recebimento. O painel conjunto mantém as informações de compatibilidade e de expedição que esses links indicam.

O SIVI organiza os registros. As empresas acordam as condições comerciais e executam a negociação. A demonstração apresenta comportamentos confirmados no sistema e usa as representações que já aparecem na home como ponto de partida.

A Xometry é referência para apresentar a sequência de ações, e o componente do 21st demonstra como a seleção pode trocar a área visual. [Xometry — demonstração passo a passo](https://www.xometry.com/how-xometry-works/) · [21st — Feature List Showcase](https://21st.dev/@felipemenezes098/components/feature-01)

## Perguntas frequentes

A página abre com o título **Perguntas frequentes** e as primeiras perguntas visíveis. Um índice lateral no desktop lista **Conta e cadastro**, **Compras**, **Fornecimento** e **Pedidos e inspeção**. No celular, os mesmos assuntos aparecem acima da lista.

Cada pergunta abre a resposta logo abaixo, com divisórias finas e um movimento curto. Respostas podem apontar para o cadastro, a demonstração ou os guias públicos conforme o assunto. O conteúdo inicial cobre verificação e análise da empresa, atuação de compradores e fornecedores, condições de proposta e pedido, inspeção e confirmação de recebimento. Começa com um índice por assunto. A busca entra em discussão se o volume de perguntas justificar.

A resposta sobre o que informar no cadastro acompanha os campos obrigatórios do formulário atual. Os links de seção existentes levam ao assunto equivalente. O agrupamento do Framer e a expansão sob a própria pergunta são as referências. [Framer — organização por assunto](https://www.framer.com/help/) · [21st — Basic Accordion](https://21st.dev/@felipemenezes098/components/accordion-01)

## Movimento e escolhas de implementação

GSAP é a primeira opção para o recorte da fotografia. Motion pode fazer a transição entre as telas da demonstração. O FAQ pode usar o padrão de expansão que já funciona na home. Os componentes do 21st servem como referências de comportamento e composição.

O responsável pela implementação pode ajustar enquadramentos, microcopy, duração das transições e o detalhe dos controles conforme as larguras e os conteúdos reais. Antes da publicação, confirmar os dados da equipe e a origem das imagens, verificar navegação por teclado e movimento reduzido e testar as rotas e os links vindos da home em desktop e celular.
