# Regras de negócio

## Princípio do domínio

O SIVI é a plataforma intermediadora. A empresa compradora publica uma necessidade e escolhe uma empresa fornecedora/fabricante; a empresa escolhida assume o fornecimento e informa sua execução. O SIVI organiza o encontro, a comparação, o registro da decisão e a rastreabilidade, mas **não é vendedor, comprador, fabricante, transportador nem responsável técnico pelo item negociado**.

## Organizações, usuários e acesso

| ID | Regra |
|---|---|
| RN-ORG-01 | Toda informação de negócio pertence a uma organização e deve ser isolada no servidor pelo vínculo do usuário autenticado. |
| RN-ORG-02 | Uma organização pode atuar como `COMPRADORA`, `FORNECEDORA` ou `AMBAS`; cada ação registra o contexto usado. |
| RN-ORG-03 | Um usuário só atua por uma organização após possuir associação ativa e permissão compatível. |
| RN-ORG-04 | Trocar o identificador da organização, demanda, proposta ou pedido não pode conceder acesso a dados de outra empresa. |
| RN-ORG-05 | O marketplace é curado: organizações precisam de convite ou solicitação, validação cadastral e aprovação antes de publicar demandas ou propostas. |
| RN-ORG-06 | Empresas suspensas não iniciam novas negociações, mas seus registros históricos permanecem consultáveis conforme permissão. |
| RN-ORG-07 | A administração do SIVI pode aprovar, moderar e suspender participantes, mas não pode escolher propostas em nome do comprador. |
| RN-ORG-08 | Fornecedores concorrentes nunca visualizam proposta, preço, anexo privado ou negociação uns dos outros. |

## Demandas industriais

| ID | Regra |
|---|---|
| RN-DEM-01 | Somente uma organização ativa no contexto comprador pode criar e publicar uma demanda. |
| RN-DEM-02 | Uma demanda publicável informa título, categoria, descrição técnica, quantidade, unidade, prazo desejado, destino e responsável. |
| RN-DEM-03 | Material, dimensões, tolerâncias, acabamento, resistência, embalagem, certificações e anexos são informados quando aplicáveis à categoria. |
| RN-DEM-04 | Quantidades devem ser positivas, unidades devem pertencer ao catálogo e datas-limite não podem anteceder a publicação. |
| RN-DEM-05 | O rascunho pertence apenas à empresa compradora; após a publicação, somente fornecedores elegíveis e convidados podem consultar o conteúdo liberado. |
| RN-DEM-06 | Alteração técnica relevante depois da publicação cria nova versão, registra o motivo e exige ciência dos fornecedores participantes. |
| RN-DEM-07 | A demanda pode definir prazo para propostas e critérios obrigatórios; proposta enviada fora do prazo depende de reabertura explícita. |
| RN-DEM-08 | Cancelamento ou encerramento exige motivo e não apaga versões, propostas nem eventos anteriores. |
| RN-DEM-09 | No MVP, uma demanda gera no máximo um fornecedor vencedor e um pedido; divisão entre vários fornecedores é evolução futura. |

Estados iniciais da demanda:

`RASCUNHO → PUBLICADA → RECEBENDO_PROPOSTAS → EM_DECISAO → CONTRATADA → CONCLUIDA`

Saídas alternativas: `EXPIRADA` ou `CANCELADA`.

## Match explicável

| ID | Regra |
|---|---|
| RN-MAT-01 | O match considera somente fornecedores aprovados, ativos e autorizados para a categoria da demanda. |
| RN-MAT-02 | A elegibilidade pode considerar produto/serviço, material, processo, máquina/capacidade, quantidade, certificação, região atendida e prazo declarado. |
| RN-MAT-03 | Cada resultado deve informar por que o fornecedor é compatível, parcialmente compatível ou inelegível; não basta exibir uma pontuação opaca. |
| RN-MAT-04 | Critério obrigatório não atendido bloqueia o convite, salvo liberação justificada por usuário autorizado do comprador. |
| RN-MAT-05 | O match do MVP usa regras e dados cadastrados, sem alegar inteligência artificial ou previsão. |
| RN-MAT-06 | Match não garante capacidade, preço, qualidade ou aceite; esses dados são confirmados na proposta e na execução. |
| RN-MAT-07 | Um fornecedor sem avaliações pode participar se cumprir os critérios objetivos; a interface deve mostrar “sem histórico”, não nota zero. |
| RN-MAT-08 | Mudanças nas regras de match são versionadas para explicar por que um resultado foi apresentado em determinado momento. |

## Propostas e negociação versionada

| ID | Regra |
|---|---|
| RN-PRO-01 | Somente fornecedor elegível e convidado pode enviar proposta para a demanda. |
| RN-PRO-02 | A proposta deve informar quantidade atendida, preço unitário ou global, frete, prazo de preparação/fabricação, prazo de entrega, pagamento, validade, marca, fabricante real e código do fabricante quando aplicáveis, além de garantia e aderência técnica. |
| RN-PRO-03 | Ressalvas de material, dimensão, tolerância, acabamento, quantidade ou prazo devem ser destacadas, nunca ocultadas em observação genérica. |
| RN-PRO-04 | `custo total = valor dos itens + frete + adicionais explicitamente aceitos`. Tributos incluídos ou não incluídos devem ser declarados. |
| RN-PRO-05 | Preço e prazo devem ser positivos; a validade não pode anteceder o envio. |
| RN-PRO-06 | Proposta enviada não é editada no lugar. Uma alteração cria nova versão, relaciona a anterior e preserva autor, data e motivo. |
| RN-PRO-07 | Solicitar revisão não encerra a negociação, mas apenas a versão mais recente e válida pode ser aceita. |
| RN-PRO-08 | Uma nova versão substitui a anterior para aceite sem apagá-la do histórico. |
| RN-PRO-09 | Proposta vencida, retirada, recusada ou substituída não pode ser aceita. |
| RN-PRO-10 | Condições de pagamento são informação comercial no MVP; o SIVI não processa nem confirma pagamentos. |
| RN-PRO-11 | Negociação do MVP ocorre por versões e solicitações de revisão registradas; chat em tempo real fica para evolução. |

Estados iniciais da proposta:

`RASCUNHO → ENVIADA → EM_REVISAO → ACEITA`

Saídas alternativas: `SUBSTITUIDA`, `RECUSADA`, `RETIRADA` ou `VENCIDA`.

## Comparação, escolha e pedido

| ID | Regra |
|---|---|
| RN-ESC-01 | O comparador normaliza e apresenta fornecedor, marca e fabricante quando aplicáveis, custo total, prazo, aderência técnica, reputação com suas dimensões históricas de qualidade, evidências factuais de confiança, garantia e condições comerciais. |
| RN-ESC-02 | Menor preço ou maior nota não escolhe automaticamente o vencedor; a decisão pertence à organização compradora. |
| RN-ESC-03 | O comprador deve confirmar a versão escolhida e pode registrar a justificativa da decisão. |
| RN-ESC-04 | O aceite é atômico e idempotente: cliques ou requisições repetidas não podem gerar dois pedidos. |
| RN-ESC-05 | O aceite congela especificação, quantidade, preço, frete, prazo, pagamento, garantia, anexos e versão da proposta. |
| RN-ESC-06 | Ao aceitar uma proposta, a demanda passa a contratada, a proposta passa a aceita e as demais ficam não selecionadas. |
| RN-ESC-07 | O pedido referencia obrigatoriamente a demanda, sua versão, a proposta aceita, comprador e fornecedor. |
| RN-ESC-08 | O SIVI registra o compromisso entre as empresas, mas não assume a obrigação comercial ou industrial de nenhuma delas. |
| RN-ESC-09 | Cancelamento após o aceite é uma solicitação registrada, exige motivo e decisão da contraparte ou mediação; não desfaz eventos críticos automaticamente. |
| RN-ESC-10 | Marca, fabricante real e organização fornecedora são identificados separadamente; a reputação do vendedor não é atribuída automaticamente à marca, nem o prestígio da marca substitui o histórico do vendedor. |
| RN-ESC-11 | Indicadores de atuação, como pedidos concluídos e entregas no prazo, mostram período e amostra. Visualizações, curtidas ou destaque pago não formam reputação nem escolhem o vencedor. |
| RN-ESC-12 | A garantia informa responsável, início, duração, cobertura e exclusões essenciais; selo ou texto do SIVI não transforma a plataforma em garantidora. |
| RN-ESC-13 | Qualidade histórica pode aparecer como dimensão da reputação ou evidência identificada, mas não recebe peso duas vezes nem origina outra nota subjetiva de confiança. |

## Atendimento pelo fornecedor

| ID | Regra |
|---|---|
| RN-OPE-01 | O fornecedor informa se atenderá o pedido por `ESTOQUE`, `PRODUCAO` ou `MISTO`. |
| RN-OPE-02 | A escolha de atendimento e a capacidade declarada são responsabilidade do fornecedor, não do SIVI. |
| RN-OPE-03 | O MVP registra quantidade disponível, quantidade a produzir, previsão, responsável e marcos de execução, sem controlar toda a fábrica. |
| RN-OPE-04 | Quantidade disponível mais quantidade planejada deve cobrir a quantidade aceita antes da liberação para qualidade. |
| RN-OPE-05 | Alteração de previsão ou capacidade após o aceite exige motivo, nova data e notificação ao comprador. |
| RN-OPE-06 | O fornecedor só avança estados do próprio pedido e deve respeitar a sequência autorizada. |
| RN-OPE-07 | Estoque detalhado de matéria-prima, ficha técnica, máquinas e ordens internas completas ficam fora do MVP. |
| RN-OPE-08 | No futuro, o fornecedor poderá usar o mesmo motor do marketplace como comprador de insumos, sem criar uma “Central de Cotações” paralela. |
| RN-OPE-09 | Toda disponibilidade, reserva ou movimento registrado no SIVI informa origem `MANUAL_SIVI`, `IMPORTADO` ou `INTEGRACAO`, instante, organização e responsável; dado sem origem não pode ser tratado como saldo confiável. |
| RN-OPE-10 | Movimentos formam o histórico físico rastreável e reservas representam compromissos; saldo disponível não pode ser reduzido ou ampliado por edição silenciosa. |

## Qualidade, lotes e QR Code

| ID | Regra |
|---|---|
| RN-QLD-01 | Todo item preparado para envio deve estar associado a pelo menos um lote. |
| RN-QLD-02 | O lote registra código do fornecedor, pedido, quantidade, data, responsável, origem por estoque/produção e situação. |
| RN-QLD-03 | A inspeção registra critérios verificados, resultado, quantidade aprovada/rejeitada, observações e anexos quando aplicável. |
| RN-QLD-04 | Quantidade rejeitada ou lote reprovado não pode ser liberado para expedição. |
| RN-QLD-05 | Não conformidade registra descrição, gravidade, responsável, ação corretiva e resultado da reinspeção. |
| RN-QLD-06 | A soma das quantidades liberadas deve cobrir a quantidade da remessa antes de marcar o pedido como pronto para envio. |
| RN-QLD-07 | Cada lote liberado recebe um QR Code único e não reutilizável. |
| RN-QLD-08 | O QR Code contém somente um identificador opaco ou URL segura; dados comerciais e pessoais não ficam gravados diretamente no código. |
| RN-QLD-09 | A consulta do QR Code respeita autorização e mostra pedido, fornecedor, lote, fabricação/preparação, inspeção e entrega apenas no nível permitido. |
| RN-QLD-10 | Correção de inspeção ou lote gera nova versão/evento auditável; o resultado anterior não é apagado. |
| RN-QLD-11 | A inspeção do pedido atual não é um dado disponível no comparador anterior ao aceite; após a entrega e avaliação, seus resultados podem alimentar indicadores históricos futuros. |
| RN-QLD-12 | Cada inspeção referencia uma versão imutável do plano aplicado, com critérios, instruções, tipo de verificação e obrigatoriedade. |
| RN-QLD-13 | Critério obrigatório reprovado abre não conformidade ou retrabalho e bloqueia a quantidade afetada até decisão e reinspeção registradas. |

## Entrega e confirmação

| ID | Regra |
|---|---|
| RN-ENT-01 | No MVP, o acompanhamento logístico é manual e não depende de transportadora integrada ou GPS. |
| RN-ENT-02 | A expedição exige lotes liberados, data, responsável, modalidade, transportadora quando houver e previsão de entrega. |
| RN-ENT-03 | O fornecedor marca a expedição e o transporte; a empresa compradora confirma o recebimento ou registra ocorrência. |
| RN-ENT-04 | Um pedido é atrasado quando não está entregue/cancelado e a previsão vigente já passou. |
| RN-ENT-05 | Divergência de quantidade, avaria ou atraso gera ocorrência vinculada ao pedido, sem reescrever o histórico. |
| RN-ENT-06 | O MVP opera uma entrega consolidada por pedido; o modelo deve permitir entregas parciais em evolução posterior. |
| RN-ENT-07 | A entrega só é concluída após confirmação do comprador ou encerramento auditado pela administração em caso excepcional. |

Estados externos iniciais do pedido:

`CONFIRMADO → EM_PREPARACAO → EM_PRODUCAO` (quando aplicável) `→ EM_QUALIDADE → PRONTO_PARA_ENVIO → EM_TRANSPORTE → ENTREGUE`.

`OCORRENCIA` complementa o estado operacional sem apagar a etapa em que surgiu. `CANCELADO` exige fluxo autorizado.

## Avaliação e reputação

| ID | Regra |
|---|---|
| RN-AVA-01 | Somente o comprador de um pedido entregue pode avaliar o fornecedor, uma vez por pedido. |
| RN-AVA-02 | A avaliação usa notas de 1 a 5 para qualidade, prazo, conformidade, atendimento e custo-benefício, com comentário opcional. |
| RN-AVA-03 | Nota consolidada inicial: qualidade 30%, prazo 25%, conformidade 20%, atendimento 15% e custo-benefício 10%. |
| RN-AVA-04 | Quantidade de avaliações, pedidos concluídos, período e percentual de entregas no prazo aparecem ao lado da média; a média isolada não representa confiança suficiente. |
| RN-AVA-05 | Apenas avaliações de transações verificadas compõem a reputação pública. |
| RN-AVA-06 | Fornecedor sem entregas avaliadas aparece como “sem histórico”; o match não o exclui apenas por esse motivo. |
| RN-AVA-07 | Avaliação denunciada pode ficar sob moderação, mas não é apagada sem registro da decisão administrativa. |
| RN-AVA-08 | Percentual de entregas no prazo usa pedidos entregues elegíveis no período: entregues até a data acordada vigente divididos pelo total entregue; cancelados ficam fora e mudanças de prazo precisam de aceite registrado. |
| RN-AVA-09 | “Pedidos concluídos” conta somente pedidos entregues e encerrados no período, sem usar visualizações, propostas ou pedidos cancelados como prova de popularidade. |
| RN-AVA-10 | “Avaliação de pedido entregue” confirma o vínculo com uma transação da plataforma; não significa certificação ou auditoria independente do produto pelo SIVI. |

Fórmula inicial:

```text
nota = qualidade × 0,30
     + prazo × 0,25
     + conformidade × 0,20
     + atendimento × 0,15
     + custo_beneficio × 0,10
```

## Estados, auditoria e concorrência

| ID | Regra |
|---|---|
| RN-AUD-01 | Cada transição registra organização, contexto, usuário, data, estado anterior, novo estado e motivo quando exigido. |
| RN-AUD-02 | Estados encerrados não retornam ao fluxo normal sem reabertura autorizada e auditada. |
| RN-AUD-03 | Eventos comerciais e operacionais contabilizados não são editados; correções são novos eventos relacionados. |
| RN-AUD-04 | Aceite, publicação, envio de proposta, liberação de lote, expedição e avaliação devem ser protegidos contra repetição. |
| RN-AUD-05 | Anexos respeitam visibilidade por organização e não podem ser acessados apenas por conhecer a URL. |
| RN-AUD-06 | Datas e valores exibidos usam `pt-BR`, BRL e `America/Sao_Paulo`; instantes são armazenados em UTC e integrações usam ISO 8601. |
| RN-AUD-07 | Evento do sistema, observação compartilhada, nota interna, atividade, notificação e auditoria possuem visibilidade e finalidade distintas e não podem ser armazenados como um único “comentário”. |
| RN-AUD-08 | Um estado só muda por uma ação autorizada e compatível com o estado atual; a interface não permite alteração livre de `status`. |

## Atividades e próximas ações

| ID | Regra |
|---|---|
| RN-ATV-01 | Atividade automática referencia um registro de negócio, responsável, organização, tipo, prazo e situação. |
| RN-ATV-02 | Concluir ou cancelar uma atividade não altera o estado do registro sem executar o comando de negócio correspondente. |
| RN-ATV-03 | Publicação, revisão, validade, atendimento, inspeção, não conformidade, expedição, recebimento e avaliação podem gerar atividades conforme regras versionadas. |
| RN-ATV-04 | Notificação é uma projeção descartável de atenção; a atividade e o evento de origem permanecem como registros separados. |

## Indicadores do MVP

| Indicador | Definição inicial |
|---|---|
| Demandas publicadas | Quantidade de demandas publicadas no período pela organização ou no marketplace, conforme contexto |
| Cobertura de match | Percentual de demandas publicadas com pelo menos um fornecedor elegível |
| Taxa de resposta | Demandas com ao menos uma proposta enviada ÷ demandas publicadas e encerradas no período |
| Tempo até primeira proposta | Intervalo entre publicação e primeira proposta válida |
| Taxa de conversão do fornecedor | Propostas aceitas ÷ propostas encerradas do fornecedor no período |
| Custo total aceito | Valor dos itens, frete e adicionais da versão aceita |
| Faixa de comparação | Diferença entre maior e menor custo total das propostas válidas comparáveis |
| Valor negociado na plataforma | Soma dos pedidos aceitos no período; não é faturamento do SIVI |
| Valor de pedidos do fornecedor | Soma dos pedidos aceitos ou entregues da própria organização, com o estado explicitado |
| Entrega no prazo | Entregas confirmadas até a previsão vigente ÷ entregas concluídas no período |
| Taxa de aprovação de lotes | Quantidade aprovada em inspeção ÷ quantidade inspecionada |
| Reputação | Média ponderada das avaliações vinculadas a pedidos entregues, acompanhada da amostra |
| Pedido atrasado | Pedido não entregue/cancelado cuja previsão vigente já passou |

Todo dashboard deve mostrar período, filtros, fórmula e origem. “Faturamento”, “lucro” ou “economia” só podem aparecer se a definição contábil e a fonte forem explicitadas; o valor transacionado entre empresas não é receita do SIVI.

## Fora das regras ativas do MVP

- escolha automática de fornecedor;
- IA preditiva, previsão de demanda e recomendação de produtos;
- pagamento, split, escrow ou conciliação;
- emissão fiscal;
- assinatura eletrônica de contrato;
- rastreamento GPS e integração automática com transportadoras;
- chat em tempo real;
- contratação de vários fornecedores para uma mesma demanda;
- planejamento industrial detalhado e compras de matéria-prima.
