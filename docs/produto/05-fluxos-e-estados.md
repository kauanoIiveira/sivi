# Fluxos e estados

## Fluxo principal do marketplace

~~~mermaid
flowchart TD
    A["Comprador cria a demanda"] --> B["Publica requisitos, quantidade, prazo e destino"]
    B --> C["SIVI calcula matches por regras explicáveis"]
    C --> D["Fornecedores aprovados acessam a oportunidade"]
    D --> E["Fornecedores enviam propostas técnicas e comerciais"]
    E --> F["Comprador compara custo, prazo, técnica, certificações e reputação histórica"]
    F --> G{"É necessário revisar?"}
    G -- "Sim" --> H["Comprador solicita revisão"]
    H --> I["Fornecedor envia nova versão"]
    I --> F
    G -- "Não" --> J["Comprador escolhe e justifica"]
    J --> K["Aceite transacional gera o pedido"]
    K --> L["Fornecedor planeja atendimento por item"]
    L --> M{"Há quantidade disponível?"}
    M -- "Integral" --> N["Reservar e separar estoque do fornecedor"]
    M -- "Parcial ou não" --> O["Fornecedor registra produção simplificada para a falta"]
    O --> P["Atualizar etapas e concluir quantidade"]
    N --> Q["Formar lote"]
    P --> Q
    Q --> R["Inspecionar qualidade"]
    R --> S{"Quantidade aprovada?"}
    S -- "Não" --> T["Reprovar ou enviar a retrabalho"]
    T --> R
    S -- "Sim" --> U["Liberar e gerar QR Code seguro"]
    U --> V["Expedir e acompanhar entrega"]
    V --> W["Comprador confirma recebimento"]
    W --> X["Comprador avalia o fornecedor"]
    X --> Y["Dashboards e reputação são atualizados"]
~~~

O SIVI registra e conecta essas etapas. Estoque, produção, inspeção e expedição são executados pela organização fornecedora; a plataforma não se torna fabricante ou vendedora.

## Fluxo de entrada no marketplace

~~~mermaid
stateDiagram-v2
    [*] --> CadastroIncompleto
    CadastroIncompleto --> EmAnalise: enviar cadastro
    EmAnalise --> Aprovada: validação concluída
    EmAnalise --> RequerAjustes: pendência encontrada
    RequerAjustes --> EmAnalise: reenviar
    EmAnalise --> Rejeitada: motivo registrado
    Aprovada --> Suspensa: risco ou descumprimento
    Suspensa --> Aprovada: regularização
    Aprovada --> Inativa: encerramento solicitado
~~~

Somente organização aprovada pode publicar demanda, acessar oportunidade ou enviar proposta. Suspensão não apaga pedidos nem históricos; o tratamento de operações em andamento deve ser registrado.

## Match de fornecedores

1. A demanda publicada passa por validações obrigatórias.
2. O sistema busca organizações fornecedoras aprovadas na categoria.
3. Regras verificam capacidades declaradas, materiais, processos, região, prazo ou outros critérios disponíveis.
4. Cada resultado guarda quais regras foram atendidas, não atendidas ou não puderam ser avaliadas.
5. Convites explícitos são registrados separadamente do match automático.
6. O fornecedor recebe acesso conforme a visibilidade definida para a demanda.
7. A pontuação auxilia descoberta e ordenação; não aprova fornecedor nem escolhe proposta.
8. Se dados relevantes mudarem, um novo cálculo é criado sem apagar o resultado usado anteriormente.

| Resultado de critério | Significado |
|---|---|
| Atendido | Há dado cadastrado compatível com a demanda. |
| Não atendido | Há dado cadastrado que contradiz o requisito eliminatório. |
| Não informado | Não existe dado suficiente; não deve ser tratado automaticamente como compatível. |
| Informativo | O critério ajuda a ordenar, mas não bloqueia participação. |

## Estados da demanda

~~~mermaid
stateDiagram-v2
    [*] --> Rascunho
    Rascunho --> Publicada: publicar
    Publicada --> EmNegociacao: solicitar ou receber revisão
    EmNegociacao --> EmNegociacao: nova interação
    Publicada --> ConvertidaEmPedido: aceitar proposta
    EmNegociacao --> ConvertidaEmPedido: aceitar proposta
    Publicada --> Expirada: atingir prazo
    EmNegociacao --> Expirada: atingir prazo
    Publicada --> EncerradaSemAcordo: encerrar
    EmNegociacao --> EncerradaSemAcordo: encerrar
    Rascunho --> Cancelada: cancelar
    Publicada --> Cancelada: cancelar com motivo
    EmNegociacao --> Cancelada: cancelar com motivo
~~~

| Estado | Significado |
|---|---|
| Rascunho | Editável e invisível aos fornecedores. |
| Publicada | Aberta ao público B2B autorizado definido pela visibilidade. |
| Em negociação | Existe pedido de revisão ou interação comercial ativa. |
| Convertida em pedido | Uma versão foi aceita e o pedido correspondente foi criado. |
| Expirada | O prazo terminou sem aceite. |
| Encerrada sem acordo | O comprador encerrou a oportunidade sem vencedor. |
| Cancelada | Fluxo interrompido com motivo e histórico. |

Receber a primeira proposta é um evento, não precisa criar um estado adicional. A quantidade de propostas abertas pode ser derivada.

## Versões e estados da proposta

Uma proposta é o agrupador da negociação de um fornecedor para uma demanda. Cada envio cria uma versão imutável. A comparação usa a última versão válida de cada proposta, e o pedido referencia exatamente a versão aceita.

~~~mermaid
stateDiagram-v2
    [*] --> Rascunho
    Rascunho --> Enviada: enviar versão
    Enviada --> RevisaoSolicitada: comprador solicita ajuste
    RevisaoSolicitada --> Substituida: fornecedor envia nova versão
    Enviada --> Substituida: fornecedor envia nova versão
    Substituida --> [*]
    Enviada --> Aceita: aceite do comprador
    RevisaoSolicitada --> Aceita: aceite ainda válido
    Enviada --> Rejeitada: outra proposta aceita ou decisão explícita
    RevisaoSolicitada --> Rejeitada
    Enviada --> Retirada: fornecedor retira
    RevisaoSolicitada --> Retirada
    Enviada --> Expirada: validade atingida
    RevisaoSolicitada --> Expirada
~~~

Regras essenciais:

- somente uma versão pode estar vigente por proposta;
- versão enviada não é editada;
- uma revisão cria outra versão e preserva a anterior;
- proposta retirada, expirada ou substituída não pode ser aceita;
- aceitar uma versão encerra as concorrentes conforme a regra do MVP;
- alterações posteriores ao aceite são eventos formais do pedido, não edição da versão.

## Comparação e aceite

1. O sistema normaliza unidades e apresenta os valores informados.
2. Custo total inclui os componentes declarados, sem inventar impostos ou frete ausentes.
3. Marca, fabricante real e relação da empresa proponente com o item aparecem separadamente quando aplicáveis.
4. Aderência técnica mostra requisito por requisito e identifica ressalvas declaradas pelo fornecedor.
5. Garantia informa quem responde por ela, prazo, cobertura e exclusões essenciais.
6. Qualidade histórica aparece como dimensão da reputação ou como fato identificado, sem dupla ponderação; nota, quantidade de avaliações, período e evidências disponíveis não representam a inspeção do pedido atual.
7. Pedidos concluídos e entregas no prazo podem demonstrar atuação na plataforma, mas visualizações e curtidas não formam reputação.
8. O comprador pode ordenar ou ponderar critérios.
9. Dados ausentes permanecem visíveis.
10. O comprador escolhe uma versão e registra justificativa.
11. Em uma transação única, o sistema confirma que a demanda e a versão continuam válidas, registra o aceite, cria o pedido e encerra concorrentes.

Uma pontuação de comparação é apoio decisório. “Melhor proposta” depende da prioridade do comprador e não deve ser apresentada como verdade automática. A reputação pertence à empresa fornecedora; marca e fabricante são atributos da oferta e não recebem essa nota por associação.

## Estados do pedido comercial

~~~mermaid
stateDiagram-v2
    [*] --> Confirmado
    Confirmado --> EmAtendimento: fornecedor inicia planejamento
    EmAtendimento --> ProntoParaExpedicao: quantidades aprovadas e separadas
    ProntoParaExpedicao --> EmCumprimentoLogistico: entrega criada
    EmCumprimentoLogistico --> Concluido: recebimento confirmado
    Confirmado --> Cancelado: conforme regra
    EmAtendimento --> Cancelado: acordo e motivo
    ProntoParaExpedicao --> Cancelado: exceção formal
    EmCumprimentoLogistico --> EmOcorrencia: problema de entrega
    EmOcorrencia --> EmCumprimentoLogistico: retomada
    EmOcorrencia --> Concluido: ocorrência resolvida
    EmOcorrencia --> Cancelado: encerramento acordado
~~~

| Estado | Significado |
|---|---|
| Confirmado | Fotografia comercial criada a partir do aceite. |
| Em atendimento | Estoque, produção ou qualidade do fornecedor estão em andamento. |
| Pronto para expedição | Quantidades necessárias estão aprovadas, separadas e liberadas. |
| Em cumprimento logístico | Existe entrega ativa. |
| Em ocorrência | Exceção relevante exige ação ou registro das partes. |
| Concluído | Recebimento confirmado e obrigações operacionais encerradas. |
| Cancelado | Encerrado com motivo, responsáveis e efeitos registrados. |

O pedido não usa “em produção” ou “em transporte” como seu único estado. Esses estados pertencem aos domínios de produção e entrega e podem coexistir para itens diferentes.

## Atendimento por item

Cada item do pedido possui seu plano de atendimento.

| Estado | Significado |
|---|---|
| Pendente de análise | Fornecedor ainda não informou a origem da quantidade. |
| Reservado em estoque | Quantidade integral reservada no estoque do fornecedor. |
| Atendimento misto | Parte reservada e parte encaminhada à produção. |
| Produção planejada | Quantidade integral será produzida. |
| Aguardando qualidade | Quantidade formada em lote aguarda liberação. |
| Liberado para expedição | Quantidade aprovada e separada. |
| Atendido | Quantidade vinculada a entrega concluída. |
| Cancelado | Item encerrado conforme cancelamento do pedido. |

A soma das quantidades reservada, em produção, aprovada, expedida e cancelada deve respeitar a quantidade contratada e impedir dupla contabilização.

## Estados da ordem de produção

~~~mermaid
stateDiagram-v2
    [*] --> Planejada
    Planejada --> Liberada: responsável e previsão definidos
    Liberada --> EmProducao: iniciar
    EmProducao --> Pausada: problema registrado
    Pausada --> EmProducao: retomar
    EmProducao --> AguardandoQualidade: concluir quantidade
    AguardandoQualidade --> Concluida: lote formado
    Planejada --> Cancelada
    Liberada --> Cancelada
    Pausada --> Cancelada
~~~

| Estado | Visibilidade sugerida ao comprador |
|---|---|
| Planejada ou liberada | Produção planejada |
| Em produção ou pausada | Em produção; atraso compartilhado quando aplicável |
| Aguardando qualidade | Aguardando inspeção |
| Concluída | Produção concluída |
| Cancelada | Ocorrência de atendimento |

O histórico interno pode ser mais detalhado que a visão compartilhada. Toda declaração de estoque ou avanço operacional preserva origem, responsável e instante da informação.

## Estados do lote e da inspeção

~~~mermaid
stateDiagram-v2
    [*] --> LoteFormado
    LoteFormado --> InspecaoPendente
    InspecaoPendente --> EmInspecao
    EmInspecao --> Aprovado
    EmInspecao --> AprovadoParcial
    EmInspecao --> Reprovado
    EmInspecao --> Retrabalho
    Retrabalho --> InspecaoPendente: reinspecionar
    Aprovado --> LiberadoExpedicao
    AprovadoParcial --> LiberadoExpedicao: somente quantidade aprovada
    Reprovado --> Encerrado
~~~

Uma inspeção referencia a versão imutável do plano de inspeção aplicável. Reinspeção não apaga o resultado anterior. Quantidades aprovadas, reprovadas e em retrabalho devem fechar matematicamente com a quantidade inspecionada. Falha de controle obrigatório abre não conformidade e mantém a quantidade afetada bloqueada até uma disposição registrada.

## Fluxo do QR Code

1. Um lote ou volume possui quantidade aprovada.
2. Usuário autorizado solicita a identificação.
3. O sistema cria um token aleatório ou assinado e guarda seu vínculo.
4. O QR Code contém somente a URL com o token.
5. Uma consulta sem autenticação mostra dados mínimos, como código público, fornecedor, estado de conformidade e data, conforme política.
6. Comprador e fornecedor autenticados podem ver detalhes autorizados do pedido, lote e inspeção.
7. Token revogado deixa de abrir dados e permanece registrado no histórico.
8. Uma substituição cria novo token sem alterar a identidade do lote.

Preço, documento do comprador, contatos, endereço completo e dados pessoais não devem constar no conteúdo bruto nem na visão pública.

## Estados da entrega

~~~mermaid
stateDiagram-v2
    [*] --> Pendente
    Pendente --> EmPreparacao
    EmPreparacao --> Expedida
    Expedida --> EmTransporte
    EmTransporte --> Entregue
    EmPreparacao --> Ocorrencia
    Expedida --> Ocorrencia
    EmTransporte --> Ocorrencia
    Ocorrencia --> EmTransporte: retomada
    Ocorrencia --> Entregue: recebimento com ressalva
    Pendente --> Cancelada
    EmPreparacao --> Cancelada
~~~

| Estado | Significado |
|---|---|
| Pendente | Entrega criada, ainda sem preparação. |
| Em preparação | Lotes e volumes estão sendo separados. |
| Expedida | Saída registrada pelo fornecedor. |
| Em transporte | Carga em deslocamento conforme informação disponível. |
| Entregue | Comprador confirmou recebimento, com ou sem ressalva. |
| Ocorrência | Atraso, avaria, recusa, divergência ou outra exceção. |
| Cancelada | Entrega não executada, com motivo. |

No MVP, os eventos são atualizados manualmente e não representam rastreamento GPS.

## Avaliação e reputação

Após a entrega confirmada:

1. o comprador avalia qualidade, prazo, atendimento, conformidade e custo-benefício;
2. uma avaliação é permitida por pedido concluído, com possibilidade de moderação;
3. a nota calculada registra os pesos utilizados;
4. a reputação exibe média, quantidade de avaliações e período;
5. correções ou moderação preservam histórico;
6. a avaliação alimenta matches e comparações apenas como critério transparente.

## Regras para cancelamentos e ocorrências

- todo cancelamento exige autor, data e motivo;
- aceite, reserva, produção, lote e entrega já realizados não podem desaparecer;
- efeitos financeiros são apenas registrados, pois o MVP não processa pagamento;
- a parte contrária deve ser notificada;
- o sistema deve impedir transição impossível ou regressão silenciosa;
- correções administrativas usam evento auditado, não edição direta do histórico;
- disputas complexas e arbitragem formal são evolução futura.

## Evolução da cadeia de suprimentos

Quando uma organização fornecedora também estiver habilitada como compradora, ela poderá futuramente publicar sua necessidade de matéria-prima no mesmo fluxo:

> necessidade de insumo → demanda → matches → propostas → pedido → entrega

Essa evolução reutiliza organizações, demandas, propostas, pedidos, avaliações e logística. Ela não cria uma “Central de Cotações” separada nem altera o fato de que o SIVI apenas intermedeia a relação entre empresas.
