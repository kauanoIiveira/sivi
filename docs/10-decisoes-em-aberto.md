# Decisões do produto

## Estado

A visão final do SIVI foi redefinida em **11/08/2026** e o benchmark funcional da Odoo foi consolidado em **16/08/2026**. A direção web usa HTML, CSS e JavaScript puro (vanilla), sem framework de interface nesta fase; banco, backend complementar e eventual uso de Python continuam em avaliação.

O nome **SIVI** permanece. O produto passa a ser uma plataforma web B2B industrial, multiempresa e intermediadora, com marketplace curado.

## Tese aprovada

> Empresas compradoras publicam demandas industriais. Fornecedores e fabricantes aprovados enviam propostas. A empresa compradora compara fornecedor, marca e fabricante quando aplicáveis, custo total, prazo, aderência técnica, garantia, reputação com amostra e suas dimensões históricas de qualidade, além de evidências factuais de confiança, escolhe a opção mais adequada às suas prioridades e acompanha pedido, operação, lotes, inspeção atual, QR Code, entrega e avaliação pelo SIVI.

O SIVI cria a ponte e a rastreabilidade entre as partes. Ele não fabrica, não mantém estoque próprio, não vende os itens e não substitui a responsabilidade comercial, técnica ou logística das empresas participantes.

A auditoria de 16/08/2026 confirmou a espinha industrial, mas reabriu pontos de validação antes de wireframes ou código. O diagnóstico está em [15 — Alinhamento ao SENAI e validação industrial](15-alinhamento-senai-e-validacao-industrial.md). Ele não substitui as decisões aprovadas abaixo; novos fechamentos devem ser registrados neste documento.

## P0 — Decisões finais do MVP

| ID | Tema | Decisão aprovada | Impacto |
|---|---|---|---|
| DEC-VIS-01 | Nome e posicionamento | Manter o nome **SIVI** e posicioná-lo como marketplace B2B de soluções industriais. | Preserva a identidade e corrige o papel do produto. |
| DEC-VIS-02 | Papel do SIVI | O SIVI é intermediador e organizador do fluxo; não é comprador, vendedor, fabricante ou transportador. | Telas e indicadores não podem atribuir operações industriais à plataforma. |
| DEC-VIS-03 | Mascote | Adotar a **raposa** como mascote do SIVI. A versão gráfica poderá seguir uma referência semelhante à raposa do Firefox, conforme direito de uso informado pela equipe; o arquivo final e suas regras de aplicação ainda aguardam aprovação. | Define o personagem da marca sem antecipar uma arte que ainda não foi entregue. |
| DEC-PLAT-01 | Plataforma | Sistema web responsivo pelo navegador, sem aplicativo móvel nativo ou programa desktop no MVP. | Uma base atende todos os perfis e dispositivos suportados. |
| DEC-ORG-01 | Modelo multiempresa | Toda operação pertence a organizações isoladas. Uma organização pode ser compradora, fornecedora ou ambas. | Evita duplicar cadastros e permite expansão da rede. |
| DEC-ORG-02 | Usuários e contexto | Usuários atuam por associação, papel e contexto de uma organização; quem possuir duas atuações alterna entre comprador e fornecedor. | Permissões deixam de depender de perfis de uma indústria única. |
| DEC-ACC-01 | Marketplace curado | Entrada por convite ou solicitação sujeita a validação e aprovação. Sem publicação anônima ou fornecedor não verificado no MVP. | Reforça confiança e adequação ao B2B industrial. |
| DEC-ACC-02 | Administração SIVI | A administração aprova empresas, modera conteúdo, acompanha auditoria e trata exceções; não escolhe proposta pelo comprador. | Separa governança da plataforma e decisão comercial. |
| DEC-MVP-01 | Fatia vertical | O MVP contém demanda, match, propostas/versionamento, comparador, aceite/pedido, operação simplificada, qualidade/lotes/QR, entrega manual, avaliação e dashboards por contexto. | Entrega o diferencial completo sem tentar administrar uma fábrica. |
| DEC-DEMO-01 | Cenário de referência | A demonstração usará uma demanda de 500 engrenagens, ao menos dois fornecedores concorrentes e um escolhido que atende 320 por estoque e registra produção simplificada das 180 restantes; os lotes passam por inspeção, QR Code, entrega e avaliação. | Cria massa de dados reproduzível sem limitar o SIVI ao setor de engrenagens. |
| DEC-DEM-01 | Demanda | Comprador publica necessidade de produto pronto ou solução sob medida, com especificação, quantidade, prazo, destino, critérios e anexos. | Atende compras industriais padronizadas e personalizadas. |
| DEC-MAR-01 | Marca, fabricante e vendedor | A oferta identifica separadamente a marca, o fabricante real e a organização que apresenta a proposta como fabricante, distribuidora ou revendedora, quando aplicável. | Evita atribuir fabricação ou reputação à empresa errada. |
| DEC-MAT-01 | Match | Usar regras explicáveis baseadas em categoria, material, processo, capacidade, certificação, região e prazo declarado. IA preditiva fica fora do MVP. | O resultado é demonstrável e não depende de histórico inexistente. |
| DEC-MAT-02 | Fornecedor novo | Fornecedor aprovado sem avaliações aparece como “sem histórico” e pode participar se cumprir requisitos objetivos. | Evita impedir o crescimento da rede. |
| DEC-PRP-01 | Proposta | Proposta informa preço, frete, prazo, pagamento, validade, marca/fabricante quando aplicáveis, garantia estruturada e resposta técnica; alteração após envio cria nova versão imutável. | Preserva negociação, responsabilidade e auditoria. |
| DEC-PRP-02 | Privacidade competitiva | Comprador vê propostas da própria demanda; cada fornecedor vê somente as próprias propostas. | Protege estratégia comercial e isolamento entre empresas. |
| DEC-NEG-01 | Negociação do MVP | Revisões ocorrem por pedido de alteração e nova versão. Chat em tempo real fica para evolução. | Mantém histórico claro e reduz escopo. |
| DEC-CMP-01 | Comparador | Comparar fornecedor, marca/fabricante, custo total, prazo, aderência técnica, garantia, reputação com dimensões históricas de qualidade, evidências factuais de confiança e condições. Ordenação não equivale a recomendação automática. | A decisão continua humana e justificável. |
| DEC-ESC-01 | Escolha | Uma demanda possui uma única proposta vencedora no MVP. O aceite atômico congela a versão e gera um pedido; as demais ficam não selecionadas. | Evita pedidos duplicados e contratação ambígua. |
| DEC-OPE-01 | Atendimento | O fornecedor escolhido declara atendimento por estoque, produção ou modelo misto e registra quantidades, responsável, previsão e marcos. | Demonstra o fluxo industrial sem construir ERP/MES completo. |
| DEC-OPE-02 | Limite industrial | Estoque detalhado, ficha técnica, matéria-prima, máquinas e ordens internas completas não pertencem ao MVP. | O SIVI acompanha a execução declarada, não opera a fábrica. |
| DEC-QLD-01 | Qualidade e lotes | Lotes, inspeção, aprovação/rejeição, não conformidade e liberação entram no MVP. | Qualidade vira evidência da confiança do marketplace. |
| DEC-QLD-02 | Qualidade histórica e atual | O comparador usa resultados históricos do fornecedor; a inspeção atual pertence aos lotes do pedido contratado e não existe antes do aceite. | Evita confundir reputação passada com conformidade da entrega em andamento. |
| DEC-QR-01 | QR Code | Cada lote liberado recebe QR Code com identificador seguro; a consulta mostra rastreabilidade conforme autorização, sem dados sensíveis gravados no código. | Cria diferencial visual e industrial com segurança. |
| DEC-LOG-01 | Logística | Rastreamento do MVP é manual: preparação, expedição, transporte, ocorrência e confirmação de entrega. Integrações ficam para depois. | Permite fluxo completo sem dependência externa. |
| DEC-LOG-02 | Entrega | Uma entrega consolidada por pedido no MVP; o modelo funcional deve permitir entregas parciais futuramente. | Controla escopo sem bloquear evolução. |
| DEC-AVA-01 | Avaliação de pedido entregue | Somente comprador de pedido entregue avalia. Critérios: qualidade 30%, prazo 25%, conformidade 20%, atendimento 15% e custo-benefício 10%. | Reputação deriva de transações reais e não apenas de preço. |
| DEC-AVA-02 | Evidências de confiança | Exibir verificação cadastral, nota, quantidade de avaliações e percentual de entregas no prazo, sem criar uma segunda nota subjetiva de “confiança”. | Evita duplicar critérios ou interpretar uma média pequena como reputação consolidada. |
| DEC-AVA-03 | Popularidade | Não criar nota de popularidade baseada em visualizações ou curtidas. Quando relevante, mostrar pedidos concluídos e pontualidade com período e amostra, separadamente da reputação. | Transforma popularidade em evidência verificável sem favorecer exposição vazia. |
| DEC-AVA-04 | Qualidade histórica | Tratar qualidade como dimensão da avaliação ou evidência transacional identificada, sem somá-la novamente à reputação nem apresentá-la como auditoria do SIVI. | Evita dupla ponderação e promessa indevida de certificação. |
| DEC-DASH-01 | Dashboards | Criar dashboards modernos para comprador, fornecedor e administração, com fórmulas, período e origem explícitos. | Cada participante enxerga decisões e pendências relevantes. |
| DEC-PAG-01 | Pagamento | Forma e condição de pagamento são dados da proposta. O SIVI não processa pagamento, split ou escrow no MVP. | Evita escopo financeiro e regulatório prematuro. |
| DEC-SEC-01 | Isolamento | Autorização por organização é obrigatória na camada de dados/serviços; ocultar elementos na interface não é controle suficiente. | Protege demandas, propostas, pedidos e anexos. |
| DEC-DAT-01 | Localização | Interface em `pt-BR`, moeda BRL e fuso `America/Sao_Paulo`; instantes em UTC e integrações em ISO 8601. | Remove ambiguidades de preço e prazo. |
| DEC-WEB-01 | Navegadores e telas | Suportar as duas versões mais recentes de Chrome, Edge, Firefox e Safari; testar 360, 768, 1280 e 1440 px. | Define critérios objetivos de responsividade. |

## P1 — Decisões de escalabilidade

| ID | Tema | Decisão aprovada | Impacto |
|---|---|---|---|
| DEC-ESCALA-01 | Atuação reversível | Comprador e fornecedor são atuações da organização, não entidades incompatíveis. | Um fabricante também pode comprar insumos usando a mesma conta. |
| DEC-ESCALA-02 | Compras de insumos | Futuramente, um fornecedor alterna para comprador e publica demanda de matéria-prima no mesmo motor. Não haverá uma Central de Cotações paralela como tese principal. | Reutiliza match, proposta, comparador, pedido e reputação. |
| DEC-ESCALA-03 | Versionamento | Demandas e propostas preservam versões; pedidos guardam exatamente as versões aceitas. | Permite auditoria, integração e evolução de negociação. |
| DEC-ESCALA-04 | Processos separados | Demanda, proposta, pedido, operação, qualidade e entrega possuem estados e históricos próprios. | Evita um estado único impossível de ampliar. |
| DEC-ESCALA-05 | Configuração | Categorias, unidades, capacidades, certificações, regiões e critérios são catálogos configuráveis. | Novos segmentos industriais entram sem refazer o núcleo. |
| DEC-ESCALA-06 | Eventos | Ações críticas geram eventos auditáveis e notificáveis. O MVP pode usar alertas internos. | E-mail, mensageria e integrações podem ser adicionados depois. |
| DEC-ESCALA-07 | Organização funcional | Separar as features e reutilizar componentes sem transformar a experiência em vários sistemas independentes. A estrutura técnica será decidida depois dos wireframes e da comparação de dados. | Preserva clareza do produto sem antecipar backend ou infraestrutura. |
| DEC-ESCALA-08 | IA futura | Previsões, recomendações, risco e sugestão de preço só entram com dados suficientes, métricas e explicação. | Evita chamar regras simples de IA. |

## P2 — Decisões funcionais após benchmark da Odoo

| ID | Tema | Decisão aprovada | Impacto |
|---|---|---|---|
| DEC-ODO-01 | Referência Odoo | Adotar e adaptar features comprovadas da Odoo, mas implementar experiência, código e identidade próprios. | Mantém a inspiração sem transformar o SIVI em fork, addon ou ERP genérico. |
| DEC-WEB-02 | Direção da interface | Implementar um sistema exclusivamente web em HTML, CSS e JavaScript puro (vanilla), sem framework de interface nesta fase. | Fecha a direção atual da interface sem decidir banco ou backend complementar. |
| DEC-DB-01 | Dados e backend | Usar Firebase Authentication e Realtime Database provisoriamente na primeira fase. Reavaliar a adequação às invariantes multiempresa antes de expandir para propostas, pedidos e arquivos. | Permite iniciar acesso e perfis sem tratar a escolha atual como validação definitiva de toda a arquitetura. |
| DEC-PYT-01 | Python | Tratar Python como complemento opcional para processamento ou algoritmos que o justifiquem, não como camada obrigatória. | Mantém a solução simples enquanto preserva espaço para match ou análise futura. |
| DEC-FUN-01 | Continuidade documental | Demanda, proposta, pedido, execução, lote, inspeção e entrega permanecem conectados e navegáveis sem redigitação. | Aproveita a melhor característica funcional da Odoo na jornada industrial. |
| DEC-COM-01 | Comunicação e histórico | Separar evento do sistema, observação compartilhada, nota interna, atividade, auditoria e notificação. | A linha do tempo não é confundida com chat nem com trilha de segurança. |
| DEC-OPE-03 | Estoque informado | Reserva e movimento guardam origem, organização, responsável e data; o comprador recebe apenas a projeção necessária ao pedido. | Adapta a disciplina de estoque da Odoo sem transformar o SIVI em WMS ou verdade contábil da fábrica. |
| DEC-QLD-03 | Plano de inspeção | Critérios de qualidade pertencem a um plano versionado e cada inspeção referencia a versão aplicada ao lote. | Resultados tornam-se reproduzíveis e falhas geram não conformidade ou retrabalho. |
| DEC-LIC-01 | Licenças | Não copiar código, UI ou assets da Odoo; revisar licenças de dependências e manter a licença do SIVI aberta até decisão de titularidade com equipe/SENAI. | Preserva possibilidade acadêmica e comercial e evita uso indevido de componentes Enterprise ou copyleft incompatível. |

O detalhamento dessas decisões está em [14 — Benchmark funcional da Odoo para o SIVI](14-arquitetura-escalavel.md).

## Evoluções confirmadas, fora do MVP

- previsão de demanda e capacidade;
- recomendação de fornecedores, produtos e serviços;
- sugestão de preço, prazo e risco;
- pagamentos, split e escrow;
- emissão e integração fiscal;
- assinatura eletrônica de contratos;
- integração com transportadoras e rastreamento automático;
- chat em tempo real e notificações externas;
- vários fornecedores vencedores para uma demanda;
- entregas parciais;
- APIs para ERP, MES, WMS e sistemas financeiros;
- compras de matéria-prima pelo mesmo marketplace quando o fornecedor atuar como comprador.

Esses itens orientam o modelo, mas não devem aumentar o escopo da primeira entrega.

## Decisões anteriores substituídas

Desde 11/08/2026, deixam de orientar o produto:

- uma indústria única como proprietária de clientes, vendedores, estoque e produção;
- o SIVI como empresa que vende ou fabrica;
- cliente apenas como cadastro interno sem acesso;
- experiência compradora adiada;
- perfis internos fixos de vendedor, estoquista e líder de produção como estrutura principal;
- Central de Cotações de matéria-prima como diferencial central;
- comissão de vendedor, margem da indústria e faturamento próprio como indicadores do SIVI;
- ficha técnica, consumo de matéria-prima, recebimento de insumos e estoque da plataforma como núcleo do MVP.

Conceitos reaproveitados continuam válidos no novo contexto: proposta versionada, custo total com frete, histórico de estados, auditoria, qualidade, prazos, comparação não limitada ao menor preço e avaliação por transação.

## Itens de produto reabertos pela auditoria industrial

- curso, unidades curriculares, competências, prazo, equipe e rubrica acadêmica;
- vertical e tipo de item físico do primeiro MVP;
- problema industrial, processo AS-IS e validação com profissionais ou especialista;
- dossiê técnico das 500 engrenagens;
- vínculo entre requisito/desenho aceito, plano, medição, lote, liberação e QR;
- papéis técnicos do comprador e autoridade sobre o plano de inspeção;
- limite entre quantidade comprometida no SIVI e estoque físico global do fornecedor;
- ciclo de vida canônico da demanda e projeção operacional do pedido;
- regra de fornecedor elegível/convidado e tratamento de demanda multi-item;
- redução dos 93 requisitos funcionais atualmente marcados como MVP;
- indicadores com baseline, meta e resultado observado ou simulado.

## Itens de implementação ainda a detalhar

Eles não reabrem a tese do produto, mas devem ser fechados antes da funcionalidade correspondente:

- validação do Firebase atual e critérios objetivos para reconsiderar Supabase;
- necessidade e limite de um backend complementar;
- uso ou não de Python e para quais responsabilidades;
- autenticação inicial já implementada; armazenamento de arquivos e organização dos dados operacionais ainda precisam ser definidos;
- provedor de hospedagem, envio de e-mail e política final de retenção dos anexos;
- critérios documentais e responsável pela aprovação de empresas;
- termos de uso, responsabilidades e política de mediação;
- modelo de sustentabilidade/monetização do SIVI;
- limite, formato e retenção de arquivos;
- catálogo inicial de categorias, capacidades e certificações;
- período de edição/moderação de avaliações;
- textos e níveis de visibilidade da consulta por QR Code.

## Riscos acompanhados

| Risco | Impacto | Mitigação aprovada |
|---|---|---|
| Escopo excessivo | MVP incompleto | Manter a fatia vertical e adiar integrações, pagamentos, fiscal, chat e IA |
| Vazamento multiempresa | Exposição de demanda ou preço | Autorização por organização na camada de dados/serviços e testes de isolamento |
| Marketplace sem liquidez | Demandas sem propostas | Curadoria por categoria/região, demonstração com rede inicial e indicador de cobertura |
| Capacidade declarada incorretamente | Match e prazo enganosos | Validação cadastral, confirmação na proposta, histórico e avaliação de pedido entregue |
| Comparador tendencioso | Escolha sem contexto | Mostrar critérios separados, amostra da reputação e decisão humana |
| QR Code com dados sensíveis | Exposição comercial ou pessoal | Identificador opaco, autorização e conteúdo mínimo |
| Indicadores ambíguos | Dashboards enganosos | Fórmula, período, filtro e origem visíveis |
| Responsabilidade confundida | Usuário atribui fabricação ao SIVI | Linguagem consistente, termos claros e separação dos papéis |
| Fornecedor novo prejudicado | Rede não cresce | Estado “sem histórico” e elegibilidade por requisitos objetivos |
| Estados misturados | Fluxo não escala | Máquinas de estado separadas e histórico por processo |

## Histórico

| Data | IDs | Decisão | Participantes |
|---|---|---|---|
| 05/08/2026 | Decisões anteriores | Foi aprovada uma visão centrada em uma indústria única e seu fluxo interno. | Equipe SIVI |
| 11/08/2026 | Todas as decisões deste documento | A visão anterior foi substituída pelo SIVI marketplace B2B industrial, intermediador, curado e multiempresa. | Responsável pelo projeto SIVI |
| 11/08/2026 | Bloco P0 | Experiência compradora, marketplace, qualidade, lotes, QR Code, entrega e avaliação passaram a integrar o MVP vertical. | Responsável pelo projeto SIVI |
| 16/08/2026 | Bloco P2 | A pesquisa oficial da Odoo foi convertida em arquitetura funcional: continuidade documental, atividades, estoque informado, qualidade versionada, lotes e limites claros para não virar ERP. A interface web em HTML, CSS e JavaScript vanilla foi confirmada; Firebase, Supabase e eventual Python permanecem abertos. | Responsável pelo projeto SIVI |
| 23/08/2026 | DEC-DB-01 e primeira interface | Firebase Authentication e Realtime Database foram escolhidos provisoriamente para a fase inicial. O responsável autorizou a implementação das telas de cadastro e login a partir do wireframe e do vídeo fornecidos. | Responsável pelo projeto SIVI |
