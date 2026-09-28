# Próximos passos do SIVI

Análise de 26/09/2026, após a entrega de conforto e acessibilidade. Este documento organiza a próxima sequência de trabalho e substitui a ordem dos roadmaps históricos quando houver divergência. As funcionalidades abaixo continuam planejadas, salvo quando identificadas como existentes.

**Atualização posterior:** a [revisão integrada 29](29-revisao-integrada.md) aplicou recuperação do preenchimento de nova demanda na mesma aba, atualização explícita, busca ampliada, resumos por unidade, datas reais, confirmação de gravação apesar de falha de leitura e encerramento inferido pelo pedido do próprio fornecedor. A [revisão final 30](30-revisao-final-do-produto.md) corrigiu a semântica de unidades nos indicadores, capacidade e inspeção por item, além da proteção de formulários e do refinamento visual. R3 está resolvido quando a escrita já foi confirmada; R4 permanece para concorrentes. R6 tem apresentação e comandos corrigidos, com campos agregados legados mantidos para compatibilidade. Operações concorrentes e validação autoritativa permanecem no bloco 1B. Consulte o documento 30 para a validação mais recente.

## Direção que vou seguir

Consolidar uma jornada que comprador e fornecedor consigam repetir sem perder informações: preparar uma demanda, comparar condições, aceitar a versão correta, registrar a qualidade e concluir a entrega. Manter a apresentação industrial e as preferências de leitura já implementadas.

Nesta rodada, revisei o código comercial, as regras locais do banco, os formulários, as próximas ações, o match e os planos anteriores. Reproduzi os casos de maior impacto nos emuladores locais, com contas e empresas sintéticas. Não consultei os registros comerciais nem validei as regras atualmente publicadas no ambiente remoto.

## O que já serve como base

| Parte | Situação verificada no projeto | Limite que orienta a continuação |
|---|---|---|
| Acesso e empresas | Login, cadastro, análise, correção, aprovação e atuação por empresa | Equipes e convites ainda não têm interface |
| Demanda | Vários itens, rascunho editável, publicação e match explicável | Publicação concorrente, unidades e reavaliação do match precisam de trabalho |
| Negociação | Versões, comparação e pedido a partir do aceite; proteção local dos campos comerciais de pedidos existentes | Preço ainda agregado; criação autoritativa e concorrência no aceite continuam pendentes |
| Execução | Inspeção por pedido, bloqueio, reinspeção, expedição, recebimento e avaliação | Sem requisitos verificáveis por item, plano de atendimento ou lotes |
| Uso diário | Filtros de demandas lembrados, foco, temas, texto, contraste, movimento e espaçamento | Conteúdo não salvo não se recupera após recarregar; dados não se atualizam entre sessões |
| Apresentação | Página pública e estrutura visual definidas; massas de teste separadas | A demonstração industrial completa depende dos lotes e da qualidade por requisito |

A suíte completa após o recorte 1A passou com **91 testes unitários e 84 testes de navegador/emuladores**. Os 11 testes focados também passaram, incluindo escritas diretas autenticadas e a jornada até avaliação persistida. A [evidência da correção](reviews/2026-09-26-marketplace-integrity.json) registra comandos, resultados, hashes e limites. A validação foi local; as novas regras não foram publicadas remotamente.

## Evidências que mudam a prioridade

O [registro da execução local](reviews/2026-09-26-marketplace-evidence.json) contém os resultados anteriores à correção 1A. O script `scripts/review-marketplace.mjs` permite nova caracterização do checkout, com saída separada em `exports`; os testes de regressão em `tests/e2e/marketplace-integrity.spec.js` verificam o comportamento corrigido. A caracterização anterior foi preservada.

| ID | Observação reproduzida | Consequência | Prioridade |
|---|---|---|---|
| R1 | Uma escrita autenticada pelo fornecedor mudou o valor aceito de 10.000 para 1 centavo e a quantidade de 10 para 1 ao mudar o pedido para liberado. O emulador aceitou sem inspeção fornecida. | Proteger condições e liberação nas regras, além das verificações da interface | P0 |
| R2 | Depois de outra sessão salvar um título, a publicação gravou o título anterior lido pelo publicador. | Uma publicação pode descartar uma edição concluída | P0 |
| R3 | Simulei falha de leitura depois de gravar um rascunho. Duas tentativas retornaram erro e deixaram dois registros persistidos. | Distinguir gravação confirmada de falha ao atualizar a tela; evitar duplicação ao repetir | P0 |
| R4 | Após o aceite, a oportunidade do fornecedor continuou com `status: published`; uma nova proposta foi recusada pelas regras. | A tela oferece uma ação que o banco já não permite | P0 |
| R5 | O comprador conseguiu trocar o estado de uma demanda com pedido de `ordered` para `draft` por escrita direta autenticada. | Definir e fazer cumprir as transições permitidas | P0 |
| R6 | A demanda com `10 un` e `20 m` recebeu quantidade agregada `30`. O repositório também aceitou `2027-02-31`. | Corrigir a semântica de quantidades e a validação de datas antes de detalhar preços e qualidade | P1, antes do bloco comercial |

R1 e R5 avaliam escritas diretas autenticadas em dados sintéticos. Não são ações oferecidas pela interface atual. R2 e R3 reproduzem intercalamentos e falhas controladas no repositório real. R6 comprova o limite da validação do domínio; não afirma que o campo de data do navegador permite digitar esse valor.

## Sequência de entregas

| Ordem | Entrega | Resultado para quem usa | Dependência | Porte relativo |
|---|---|---|---|---|
| 1A — aplicado localmente | Proteger condições aceitas e estados | Condições de pedidos existentes ficam preservadas; demandas não retrocedem em `demandsByBuyer` | Publicação remota pendente | Pequeno/médio |
| 1B | Publicação, aceite e repetição confiáveis | Edições concorrentes não somem; nova tentativa não duplica; oportunidades encerram corretamente | 1A e testes de concorrência | Médio/alto |
| 2 | Continuidade e orientação nas telas | Retomar o preenchimento, entender o que foi salvo e encontrar o próximo registro | Pode avançar por partes junto de 1B | Médio |
| 3 | Propostas por item e match atualizado | Comparar peças, quantidades, unidades e preços sem total enganoso | 1B, unidades e versão de dados | Médio/alto |
| 4 | Atendimento, qualidade e lotes | Saber o que será entregue, o que foi inspecionado e o que está bloqueado | 3 e requisitos técnicos registrados | Alto, dividido em entregas |
| 5 | QR, apresentação e validação de uso | Demonstrar a jornada e consultar evidências autorizadas de cada lote | Lote identificado e liberação consistente | Médio |

Porte compara esforço e incerteza dentro deste projeto. Não representa prazo prometido. Cada entrega encerra com um fluxo utilizável e seus testes; não é necessário aguardar o roteiro inteiro para revisar o produto.

### 1A. Proteger o que já foi acordado

- Preservar valor, frete, condições, itens, quantidade, participantes, autoria da origem e versão do pedido em qualquer atualização operacional.
- Recusar remoção de campos congelados e retorno de uma demanda publicada/contratada para rascunho.
- Manter os pedidos antigos legíveis. Campo opcional ausente em registro antigo não deve ser preenchido com informação inventada.
- Testar diretamente as regras com comprador, fornecedor contratado e concorrente.

**Implementação local de 26/09:** as duas projeções dos pedidos existentes permitem atualizar apenas campos operacionais. Versão, valores, frete, condições, itens e identidade ficam fora dessa autorização, inclusive em alterações profundas e exclusões. Pedidos antigos conservam os detalhes opcionais ausentes. Os quatro comandos operacionais enviam somente os campos necessários, num PATCH atômico das duas cópias.

Em `demandsByBuyer`, a criação exige `draft`; a progressão é `draft → published → ordered`, com repetição do estado atual permitida. Saltos, retrocessos e exclusão são recusados. As condições da demanda publicada ainda podem mudar mantendo o estado; sua revisão imutável pertence ao bloco 1B.

O [plano do primeiro recorte](superpowers/plans/2026-09-26-proteger-condicoes-aceitas.md) registra a adaptação necessária: `RuleDataSnapshot.val()` não compara objetos profundamente. A proteção usa autorização por campo, não uma igualdade entre objetos.

**Limites:** isso não resolve R2, R3, R4 nem a comprovação da inspeção de R1. Não garante a origem correta na criação de um pedido, não corrige cópias previamente divergentes e não obriga um cliente arbitrário a atualizar as duas projeções. A matriz deste recorte cobre `demandsByBuyer`; a projeção `publishedDemands` ainda precisa ser vinculada à publicação/aceite autoritativos para impedir reabertura por escrita direta. Publicar as regras remotas e atualizar clientes antigos é uma etapa separada; clientes que substituem o pedido inteiro terão essas operações recusadas pelas novas regras.

### 1B. Tornar gravações e transições consistentes

- Usar revisão explícita para publicar a demanda que o usuário acabou de revisar. Uma gravação baseada em revisão antiga deve retornar conflito recuperável.
- Criar uma identificação estável da tentativa para operações repetíveis. Repetir a mesma intenção deve retornar o registro existente, sem novo rascunho, proposta ou pedido.
- Separar “gravou, mas não conseguiu atualizar a lista” de “não gravou” e de “resultado ainda não confirmado”.
- Testar dois aceites simultâneos, nova versão durante o aceite, publicação durante edição, duas inspeções e falha após confirmação do servidor.
- Encerrar as oportunidades de todos os fornecedores elegíveis ao aceitar a proposta, sem divulgar preços ou condições da concorrência.
- Exigir evidência e quantidade coerentes para liberar; preservar histórico de inspeções e impedir reescrita da avaliação concluída.
- Registrar eventos mínimos: responsável, empresa, operação, revisão e horário do servidor. O histórico deve ser útil para explicar o que aconteceu.

**Concluído quando:** cada disputa tem resultado definido, as cópias de leitura concordam e uma falha deixa uma ação de recuperação clara. O cliente não recebe permissão de leitura global para viabilizar uma transação.

### 2. Fazer o uso diário fluir

| Situação | Comportamento proposto | Critério de conclusão |
|---|---|---|
| Recarregamento durante preenchimento | Recuperação local por conta, empresa, atuação e registro, com escolha de retomar ou descartar | Recarregar na mesma aba conserva os campos; sair da conta limpa a recuperação; conflito com edição remota não é sobrescrito silenciosamente |
| Alteração feita por outra pessoa | Aviso de atualização disponível e consulta atualizada ao voltar à lista | Formulário aberto conserva o texto e informa conflito quando necessário |
| Salvamento demorado ou conexão interrompida | Mensagem junto da ação, preenchimento preservado e tentativa segura | Usuário distingue pendente, confirmado, não confirmado e recusado |
| Retorno de um detalhe | Restaurar busca, situação, posição da lista e foco no registro de origem | Voltar não obriga a refazer a procura |
| Lista grande | Busca e filtros em propostas/pedidos; leitura resumida e detalhes sob demanda | Tarefa de localizar registro testada com 10, 100 e 500 registros sintéticos |
| Aceite, publicação ou recebimento | Resumo acessível do que será confirmado | Fornecedor, versão, itens, total e consequência aparecem antes da confirmação; Escape cancela sem perder contexto |
| Erro no formulário | Texto específico próximo do campo e resumo que leva ao primeiro erro | Leitor de tela identifica o erro; teclado alcança a correção |

O primeiro recorte de recuperação local cobre navegação e recarregamento da mesma aba. Recuperar após fechar o navegador ou em outro dispositivo exige definir armazenamento e retenção; isso fica como decisão posterior.

Manter foco visível, alvos de pelo menos 44px e movimento reduzido. Verificar ampliação de texto a 200%, zoom a 400%, alto contraste do sistema, mensagens de estado e tabelas pelo teclado. Fazer uma sessão manual com leitor de tela e tarefas completas; a presença de atributos ARIA não encerra essa validação.

**Direção visual:** reduzir caixas e repetição de metadados; usar hierarquia, alinhamento, espaço e texto. Não trocar a paleta nem acrescentar animação de entrada em cada registro. No formulário, aproximar quantidade da unidade e dar mais largura às especificações. No pedido, destacar a próxima ação e manter as condições aceitas consultáveis.

### 3. Detalhar a negociação por item

- Vincular cada linha da proposta ao identificador e à revisão do item solicitado.
- Mostrar descrição, unidade, quantidade, preço unitário, subtotal e atendimento técnico; apresentar frete separado e total conferível.
- Preservar cálculos em centavos e definir arredondamento antes de aceitar quantidades fracionadas.
- Substituir totais de unidades incompatíveis por quantidade de itens e resumos por unidade. Não comparar uma capacidade genérica com uma soma de peças e metros.
- Manter a leitura das versões antigas como oferta global, sem distribuir preços fictícios pelos itens.
- Separar “vencida”, “substituída por nova versão”, “aceita” e “não selecionada”. Não inventar perda da negociação antes de uma decisão.
- Recalcular a elegibilidade para demandas ainda abertas quando um perfil novo ou atualizado justificar isso. Registrar os critérios usados na decisão original.

**Padrão proposto:** um fornecedor atende todos os itens de uma demanda; um vencedor e uma entrega consolidada. Quantidades fracionadas, fornecimento parcial e vários vencedores ficam para decisão explícita, pois alteram comparação, aceite, qualidade e logística.

**Concluído quando:** o comprador reconcilia cada subtotal com a proposta, o pedido preserva essa composição e as versões antigas continuam compreensíveis.

### 4. Dar rastreabilidade à execução industrial

Dividir em quatro entregas:

1. **Requisitos e documentos:** requisito por item com critério de aceite e revisão. Desenhos/laudos com tipo e tamanho limitados, acesso por empresa e vínculo à revisão aceita. Não inventar tolerâncias nem tratar o cenário de teste como especificação industrial aprovada.
2. **Plano de atendimento e lotes:** distribuir por item as quantidades de estoque e produção; identificar lotes, origem e saldo. Não transformar o SIVI em controle geral de estoque ou chão de fábrica.
3. **Qualidade:** plano de inspeção vinculado aos requisitos; resultados, evidências, quantidade aprovada/reprovada, não conformidade, correção e reinspeção. Preservar cada evento.
4. **Expedição:** permitir saída somente da quantidade liberada. No recorte inicial, concluir todos os lotes para uma entrega consolidada.

**Concluído quando:** a soma por item reconcilia com o pedido e é possível explicar por que cada lote está liberado ou bloqueado. Deve haver teste que recusa expedição de lote reprovado por escrita direta, além do botão desabilitado na tela.

### 5. QR e apresentação com evidências

- Gerar identificador opaco para lote liberado, com página de consulta que exponha somente os campos autorizados. Minha preferência inicial é consulta autenticada por participante; consulta pública reduzida depende de decisão sobre exposição.
- Oferecer resumo legível e impressão do pedido/lote. Tema claro para impressão, títulos de tabela repetidos e datas identificadas.
- Preparar roteiro reproduzível: comprador registra demanda, duas fornecedoras respondem, comprador aceita revisão, fornecedor cria dois lotes, um lote bloqueia e passa por reinspeção, expedição e recebimento concluem a jornada.
- Manter o cenário de apresentação em ambiente separado dos registros reais. Prever preparação, restauração da massa e verificação antes da apresentação.
- Medir uso com tarefas: cadastrar demanda, comparar, recuperar erro, localizar inspeção e concluir recebimento. Anotar tempo, dúvidas e erros observados, sem confundir quantidade de testes com qualidade de uso.

**Concluído quando:** outra pessoa percorre o roteiro com contas separadas e cada afirmação da apresentação corresponde a um dado gravado ou a uma limitação identificada.

## Decisões técnicas proporcionais

| Caminho | Benefício | Custo/limite | Decisão |
|---|---|---|---|
| Reforçar o Realtime Database atual e operações delimitadas | Preserva a base e permite corrigir já a imutabilidade e os estados | Invariantes entre várias cópias exigem testes de concorrência; não basta chamar `update` | Primeiro caminho |
| Pequena operação de servidor para comandos críticos | Centraliza autoridade onde regras e cliente não bastarem | Acrescenta implantação e verificação de custos/configuração | Usar se a prova do bloco 1B exigir; escopo somente dos comandos necessários |
| Migrar framework ou banco | Pode atender necessidades futuras diferentes | Reimplementa fluxos e amplia o risco antes de resolver os casos reproduzidos | Fora da sequência atual |

O Firebase documenta que um `update` multipath é atômico; isso não valida por si só a revisão usada para montar os dados. Transações tratam disputas de leitura e escrita, e regras precisam declarar os conflitos específicos da aplicação. [Documentação oficial](https://firebase.google.com/docs/database/web/read-and-write).

As regras `.validate` não são executadas para dados removidos. A proteção deve cobrir exclusão e remoção de campos, não apenas valores alterados. [Condições das regras](https://firebase.google.com/docs/database/security/rules-conditions).

Para o retorno das ações, mensagens de estado devem chegar às tecnologias assistivas sem exigir mudança de foco em cada atualização. [W3C: mensagens de estado](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).

## Decisões que ficam fáceis de você revisar

| Tema | Padrão que adoto no planejamento | O que muda se você preferir outra opção |
|---|---|---|
| Primeiro usuário de referência | Comprador que prepara e acompanha compras, com fluxo fornecedor completo | Muda a ordem do refinamento das telas |
| Modelo comercial | Um vencedor e atendimento de todos os itens | Atendimento parcial exige dividir aceite, valores e entregas |
| QR | Consulta autenticada dos participantes | Consulta pública exige selecionar campos e política de acesso |
| Quantidades | Preservar inteiros até definir unidades/fracionamento | Fracionamento exige escala decimal e arredondamento consistente |
| Recuperação | Mesma aba, por contexto, com retomar/descartar | Entre dispositivos exige persistência de rascunho e resolução de conflito |
| Acessibilidade | Padrão confortável e preferências opcionais, com avaliação por tarefa | Necessidades de usuários reais podem alterar densidade e navegação |

Não preciso dessas respostas para concluir a análise. Elas ficam registradas para sua revisão antes das partes que dependem delas.

## Itens fora do próximo ciclo

Chat, assistente de IA, notificações externas, pagamentos, integrações com ERP, aplicativo nativo, estoque geral e múltiplos níveis de aprovação não entram agora. São possibilidades futuras; não resolvem os problemas observados no fluxo atual. Convites e gestão de membros ganham prioridade quando o uso exigir mais de uma pessoa responsável por empresa.

## Primeiro pacote preparado

Começar por **1A: condições aceitas e estados**, com testes diretos das regras e compatibilidade com os registros atuais. Depois, concluir **1B** antes de ampliar valores ou qualidade. O refinamento de continuidade do bloco 2 pode entrar em entregas curtas com a mesma validação de teclado, temas e texto ampliado já adotada.

As conclusões desta rodada vieram de leitura atual do código e das seis reproduções locais. Concorrência real de dois aceites, revisão simultânea de propostas, leitor de tela, carga de 500 registros e integridade do ambiente remoto continuam como verificações futuras, sem resultado presumido.
