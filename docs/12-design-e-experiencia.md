# Design e experiência do SIVI

## Estado

**Referência vigente em 16/09/2026:** [Design System](../design-system/MASTER.md). Este documento contém a concepção funcional e visual anterior; especificações estéticas e ordens de implementação abaixo cedem à revisão atual.

Este documento define princípios, hierarquia e necessidades de experiência para a visão final do produto, mas **não representa uma identidade visual ou biblioteca completa de componentes aprovada**. A primeira fatia de cadastro e login já foi implementada em HTML, CSS e JavaScript puro (vanilla), sem framework de interface. Firebase Authentication e Realtime Database estão conectados provisoriamente; a adequação às regras multiempresa ainda precisa ser validada antes da expansão. As features estão organizadas no [benchmark funcional da Odoo](14-arquitetura-escalavel.md).

O arquivo [design-system/MASTER.md](../design-system/MASTER.md) permanece apenas como referência conceitual e pode ser revisado ou descartado se conflitar com o marketplace aprovado.

## Conceito: marketplace industrial de confiança

> **Da demanda industrial à entrega rastreável**

O SIVI deve parecer uma plataforma B2B técnica, confiável e contemporânea. A experiência combina descoberta comercial, decisão comparativa e rastreabilidade operacional sem se parecer com:

- uma loja de varejo com checkout imediato;
- um ERP de uma única fábrica;
- um mural público de anúncios sem curadoria;
- um dashboard genérico formado apenas por cards.

A interface precisa comunicar com clareza:

1. quem está atuando e por qual organização;
2. se o contexto atual é comprador, fornecedor ou administração;
3. quais empresas foram verificadas;
4. por que um fornecedor apareceu no match;
5. como as propostas diferem;
6. qual versão foi aceita;
7. quem é responsável pela execução;
8. onde o pedido está na linha do tempo;
9. quais evidências sustentam qualidade, lote, QR Code e reputação.

A interface deve diferenciar dois conceitos: **qualidade histórica** é o desempenho verificado do fornecedor em transações anteriores e pode aparecer no comparador; **inspeção do pedido atual** é o resultado dos lotes em execução e só aparece na rastreabilidade do pedido contratado.

## Direção visual possível — ainda não aprovada

Uma direção coerente com o setor industrial pode usar:

- grafite ou azul muito escuro na estrutura e navegação;
- superfícies claras ou escuras, neutras e com hierarquia equivalente para leitura prolongada;
- azul-aço para informação, conexão e confiança;
- laranja de sinalização para ações principais e atenção;
- verde somente para conclusão, liberação e conformidade;
- vermelho somente para erro, reprovação, atraso crítico ou bloqueio;
- tipografia legível com personalidade técnica;
- números tabulares para preços, quantidades, notas e prazos;
- ícones acompanhados de texto quando o significado não for universal;
- linhas do tempo, matrizes e comparadores como elementos próprios do produto.

Os temas claro e escuro fazem parte da direção aprovada da interface. Paleta, tipografia, logotipo, espaçamento e componentes ainda devem ser testados com conteúdo real antes da aprovação final dos valores e aplicações.

## Mascote

A **raposa** está definida como mascote do SIVI. A equipe informou possuir direito para utilizar uma referência visual semelhante à raposa do Firefox, mas a versão gráfica exata ainda não foi entregue nem aprovada dentro do projeto.

Antes da implementação final:

- receber o arquivo autorizado e registrar sua origem/licença;
- definir versões principal, reduzida, monocromática e para fundo escuro;
- testar legibilidade em favicon, acesso, estados vazios e materiais institucionais;
- evitar que o mascote prejudique o tom técnico e B2B da interface;
- salvar o arquivo aprovado em `src/assets/brand/`.

## Estrutura principal

### Desktop

~~~text
┌───────────────────────┬──────────────────────────────────────────────────────┐
│ SIVI                  │ Busca          Alertas          Ajuda        Usuário │
│ Organização ativa     ├──────────────────────────────────────────────────────┤
│ Contexto: Comprador ▼ │ Título + estado + contexto              Ação primária│
├───────────────────────┼──────────────────────────────────────────────────────┤
│ Dashboard             │ Indicadores úteis à decisão                         │
│ Fornecedores          ├────────────────────────────────┬─────────────────────┤
│ Demandas/Propostas    │ Conteúdo principal             │ Prazos e pendências │
│ Pedidos               ├────────────────────────────────┴─────────────────────┤
│ Qualidade/Entregas    │ Comparador, lista, detalhe ou linha do tempo         │
│ Empresa               │                                                      │
└───────────────────────┴──────────────────────────────────────────────────────┘
~~~

O seletor de organização e contexto precisa permanecer visível. Uma empresa que atua nos dois lados não pode confundir dados ou ações de compra com dados ou ações de fornecimento.

### Tablet

- navegação recolhida ou em drawer;
- contexto ativo visível na barra superior;
- conteúdo em até oito colunas;
- indicadores em duas colunas;
- filtros e pendências migram para painéis recolhíveis;
- comparador prioriza critérios selecionados e permite alternar propostas.

### Celular

- topbar compacta com organização e contexto acessíveis;
- menu em drawer com foco controlado;
- cards e listas em uma coluna;
- tabela comparativa vira comparação por pares ou critérios expansíveis;
- ações críticas não dependem de hover;
- filtros abrem em painel próprio;
- linha do tempo mantém estado, data e responsável legíveis;
- leitura do QR Code e consulta do lote funcionam sem ampliar a página horizontalmente.

## Hierarquia de navegação por contexto

### Comprador

| Grupo | Destinos |
|---|---|
| Visão geral | Dashboard comprador |
| Fornecedores | Busca e perfis de fornecedores |
| Demandas | Minhas demandas, matches, propostas e comparador |
| Pedidos | Acompanhamento, qualidade, QR Code, entrega e ocorrências |
| Relacionamento | Avaliações e fornecedores contratados |
| Empresa | Cadastro, membros, permissões e documentos |

### Fornecedor

| Grupo | Destinos |
|---|---|
| Visão geral | Dashboard fornecedor |
| Oportunidades | Matches e demandas convidadas |
| Propostas | Rascunhos, versões, revisões e resultados |
| Pedidos | Atendimento por estoque/produção, lotes, qualidade, expedição e prazos |
| Execução | Filas e próximas ações de produção, inspeção, QR Code e entrega |
| Reputação | Avaliações e indicadores |
| Empresa | Perfil industrial, capacidades, certificações e membros |

### Administração da plataforma

| Grupo | Destinos |
|---|---|
| Visão geral | Saúde do marketplace |
| Empresas | Solicitações, aprovações, suspensões e validações |
| Curadoria | Categorias, capacidades, certificações e regiões |
| Moderação | Conteúdo, avaliações, ocorrências e denúncias |
| Governança | Usuários administrativos, parâmetros e auditoria |

## Organização das páginas

Toda página operacional deve seguir uma sequência previsível:

1. organização e contexto ativos;
2. breadcrumb, título, código e estado;
3. explicação curta do momento do fluxo;
4. ação primária única;
5. prazos, alertas ou indicadores que mudam a decisão;
6. filtros visíveis e removíveis;
7. conteúdo principal;
8. origem, versão, histórico e ações secundárias.

## Componentes distintivos do produto

### Cartão de fornecedor

Deve mostrar apenas dados úteis à decisão:

- nome e localização/região atendida;
- atuação na oferta como fabricante, distribuidor ou revendedor;
- marcas ou fabricantes atendidos, quando aplicáveis;
- selo de empresa aprovada;
- categorias e capacidades relevantes;
- razões do match;
- certificações verificadas;
- nota com quantidade de avaliações de pedidos entregues e período;
- pedidos concluídos e percentual de entregas no prazo com período;
- “sem histórico” quando não houver amostra;
- ação para abrir perfil ou convidar para demanda.

Selos não podem sugerir garantia absoluta do SIVI. “Aprovado” significa cadastro validado segundo a política da plataforma, não certificação de toda entrega futura. “Avaliação de pedido entregue” identifica a origem transacional da avaliação e não equivale a auditoria independente de qualidade.

### Explicação de match

Compatibilidade deve ser visualizada por critério:

| Estado | Tratamento sugerido |
|---|---|
| Atendido | Confirmação discreta e texto da evidência |
| Parcial | Atenção e explicação do limite |
| Não informado | Estado neutro, sem presumir reprovação |
| Obrigatório ausente | Bloqueio claro e orientação |

Não usar apenas uma porcentagem misteriosa. Se houver pontuação, o detalhamento dos fatores deve ficar acessível.

### Comparador de propostas

O comparador é a principal assinatura visual do SIVI:

- propostas em colunas e critérios em linhas no desktop;
- primeira coluna fixa com nomes dos critérios;
- organização fornecedora, atuação na oferta, marca e fabricante real separados quando aplicáveis;
- custo total separado de preço dos itens e frete;
- prazo de fabricação/preparação separado de entrega;
- ressalvas técnicas destacadas antes do aceite;
- garantia comparada por responsável, início, duração, cobertura e exclusões essenciais;
- reputação sempre acompanhada de período e amostra; qualidade histórica aparece como dimensão ou evidência, sem ser ponderada duas vezes;
- pedidos concluídos e pontualidade podem aparecer como fatos separados, nunca como nota de popularidade;
- certificações e capacidades mostram se são declaradas ou validadas e a data da informação;
- opção de escolher critérios prioritários;
- diferenças relevantes destacadas sem declarar vencedor automático;
- versão e validade visíveis;
- resumo final antes do aceite.

Cor sozinha não deve indicar a melhor proposta. O comprador pode preferir qualidade ou prazo em vez do menor custo.

O comparador não apresenta “inspeção atual” antes da contratação. Depois do aceite, inspeções dos lotes do pedido são evidências operacionais próprias e não substituem nem reescrevem a reputação histórica.

### Linha do tempo rastreável

Deve conectar:

Demanda → Proposta aceita → Pedido → Estoque/produção → Lote → Qualidade → QR Code → Expedição → Entrega → Avaliação.

Cada marco mostra estado, data, organização responsável e evidência disponível. Processos paralelos podem aparecer como subetapas sem transformar tudo em um único estado.

### Qualidade, lote e QR Code

- lote possui identificação forte e situação visível;
- aprovado, rejeitado e em reinspeção usam texto, ícone e cor;
- quantidade aprovada e rejeitada não ficam escondidas;
- não conformidade mostra impacto e ação corretiva;
- QR Code aparece somente quando o lote está liberado;
- a página aberta pelo QR informa o nível de acesso e nunca revela dados confidenciais por padrão.

### Reputação

- nota média nunca aparece sem número de avaliações;
- número de pedidos concluídos e entregas no prazo aparecem separadamente, com período;
- critérios individuais podem ser consultados;
- avaliação ligada a pedido entregue recebe identificação visual sem sugerir auditoria do SIVI;
- fornecedor novo recebe “sem histórico”, não zero;
- conteúdo moderado ou contestado possui estado transparente.

Visualizações, cliques, seguidores e destaque pago são métricas de alcance, não de reputação. Caso sejam usados futuramente, devem aparecer separados dos indicadores de desempenho e nunca ordenar propostas por padrão.

## Dashboards por perfil

| Contexto | Primeira leitura | Ação destacada |
|---|---|---|
| Comprador | Demandas sem proposta, propostas a decidir, pedidos em risco e entregas pendentes | Publicar demanda |
| Fornecedor | Oportunidades com prazo, revisões solicitadas, pedidos e lotes bloqueados | Enviar proposta |
| Administração | Empresas aguardando aprovação, cobertura de match, conversão e ocorrências | Revisar pendência |

### Regras dos indicadores

- mostrar período e filtros ativos;
- informar unidade e origem;
- evitar casas decimais sem utilidade;
- permitir abrir os registros que formam o número;
- usar séries temporais somente quando houver comparação real;
- não chamar valor negociado de faturamento do SIVI;
- não chamar diferença entre propostas de economia realizada sem base aprovada;
- não usar gráfico quando uma lista priorizada responder melhor.

## Padrões de interação

### Listas

- filtros persistem ao abrir um item e voltar;
- estado, prazo e organização são fáceis de escanear;
- valores e quantidades usam alinhamento tabular;
- ordenação atual é visível;
- ações em massa só aparecem após seleção;
- estado vazio orienta como criar o primeiro registro;
- paginação ou carregamento não altera resultados silenciosamente.

### Detalhes

- cabeçalho mostra código, estado, versão, responsáveis e prazo;
- abas separam resumo, técnica, comercial, qualidade, entrega e histórico quando necessário;
- anexos indicam proprietário, visibilidade e versão;
- ações incompatíveis com o estado ficam indisponíveis com explicação;
- informações de concorrentes nunca aparecem por conveniência de interface.

### Formulários

- demanda e proposta usam etapas curtas e resumo final;
- campos técnicos mudam conforme categoria, mantendo alternativa de descrição;
- rótulos não dependem de placeholder;
- unidade acompanha todo campo quantitativo;
- cálculos atualizam de modo previsível e mostram sua composição;
- erros ficam próximos ao campo e preservam dados preenchidos;
- saída de etapa com alterações não salvas exige confirmação;
- publicação, envio de proposta, aceite, liberação de lote e expedição mostram impacto antes da confirmação.

## Confiança, conteúdo e linguagem

- chamar as partes de “empresa compradora” e “fornecedor/fabricante”;
- evitar frases que façam o SIVI parecer vendedor ou fabricante;
- distinguir dado declarado, dado validado e dado calculado;
- explicar o que significa cada selo;
- apresentar data da última atualização das capacidades;
- mostrar ressalvas e incertezas antes da ação;
- usar linguagem industrial compreensível, sem depender de jargão interno;
- tratar preço, proposta e anexo como conteúdo comercial sensível.

## Acessibilidade

- navegação completa por teclado;
- foco visível e ordem coerente;
- drawer, modal e seletor de contexto com foco controlado e fechamento por Esc;
- rótulos, instruções e erros associados aos campos;
- tabelas com cabeçalhos semânticos e alternativa adequada no celular;
- gráficos acompanhados de resumo textual ou tabela;
- estados não comunicados somente por cor;
- contraste compatível com WCAG 2.2;
- alvos de toque e espaçamento adequados;
- mensagens de sessão e autenticação claras e acessíveis.

## Estado

**Referência vigente em 16/09/2026:** [Design System](../design-system/MASTER.md). Este documento contém a concepção funcional e visual anterior; especificações estéticas e ordens de implementação abaixo cedem à revisão atual. da implementação visual

A página responsiva de cadastro e login está implementada, mas o layout final das áreas autenticadas ainda não foi aprovado. Antes de expandir o frontend, a equipe deve:

1. fechar alinhamento acadêmico, problema industrial, caso técnico e MVP reduzido;
2. validar a arquitetura de informação por contexto;
3. continuar a jornada vertical reduzida em wireframes;
4. testar demanda, match, comparador e rastreabilidade com conteúdo industrial realista;
5. comparar direções visuais;
6. validar responsividade e acessibilidade;
7. consolidar tokens, componentes e organização dos módulos de JavaScript vanilla;
8. validar o Firebase contra isolamento multiempresa, consultas e arquivos, reconsiderando Supabase somente se houver lacunas;
9. implementar a próxima tela somente após a aprovação da fatia correspondente.

## Perguntas para aprovação visual

- Fica evidente que o SIVI intermedeia e não fabrica?
- A organização e o contexto ativos são impossíveis de confundir?
- O marketplace transmite curadoria e confiança sem parecer fechado demais?
- O motivo do match é compreensível sem explicação externa?
- O comparador ajuda a decidir além do menor preço?
- Ressalvas técnicas e versões ficam visíveis antes do aceite?
- Qualidade, lote e QR Code formam uma rastreabilidade clara?
- A reputação mostra amostra e pontualidade, não apenas estrelas?
- Cada dashboard conduz a uma ação real?
- A densidade funciona no desktop sem comprometer tablet e celular?
- A experiência continua acessível por teclado e sem depender de cor?
