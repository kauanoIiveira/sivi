# Escopo e MVP

> **Estado após a auditoria de 16/08/2026:** este documento preserva a visão da fatia vertical completa, mas o recorte implementável ainda deve ser reduzido e validado conforme [15 — Alinhamento ao SENAI e validação industrial](15-alinhamento-senai-e-validacao-industrial.md). Itens aqui marcados como MVP não autorizam, isoladamente, implementação imediata.

## Estratégia de recorte

O produto final combina marketplace B2B, negociação comercial e execução industrial. Para preservar esse diferencial sem tornar a primeira entrega inviável, o MVP será uma **fatia vertical completa**: da publicação de uma demanda à avaliação após a entrega.

O SIVI será uma aplicação web responsiva, multiempresa e multitenant. Compradores, fornecedores e equipe da plataforma utilizarão a mesma solução, com áreas e permissões adequadas a cada papel.

## Fluxo demonstrável do MVP

> Demanda publicada → match explicável → propostas versionadas → comparação → aceite → pedido → estoque ou produção do fornecedor → inspeção e lote → QR Code → entrega → avaliação e dashboards

## MVP recomendado

### 1. Acesso, organizações e confiança

- autenticação de usuários;
- cadastro de organização com dados jurídicos, contatos e endereços;
- organização configurada como compradora, fornecedora ou ambas;
- associação de usuários a uma ou mais organizações, com papéis internos;
- validação manual da organização pela equipe SIVI;
- ativação, suspensão e registro do motivo administrativo;
- isolamento dos dados por organização;
- auditoria das ações críticas.

### 2. Perfil industrial e catálogo do fornecedor

- categorias de produtos e soluções;
- cadastro de produtos, serviços industriais e capacidades, com marca e fabricante quando aplicáveis;
- identificação da atuação da empresa na oferta como fabricante, distribuidora ou revendedora;
- materiais, processos, máquinas ou tecnologias atendidas;
- quantidade ou capacidade indicativa;
- prazo indicativo, regiões atendidas e certificações;
- anexos técnicos essenciais;
- ativação e desativação de ofertas sem apagar o histórico.

Esses dados alimentam o match, mas não substituem a confirmação feita na proposta.

### 3. Demandas do comprador

- criação de demanda em rascunho;
- um ou mais itens com descrição, categoria, quantidade e unidade;
- requisitos configuráveis, como material, dimensões, acabamento, tolerância, resistência, embalagem ou personalização;
- prazo desejado, local de entrega, condição de pagamento esperada e observações;
- anexos técnicos;
- publicação para fornecedores compatíveis aprovados e convites opcionais;
- encerramento, expiração ou cancelamento com histórico.

### 4. Match explicável por regras

- filtro por categoria e capacidade declarada;
- consideração de material, processo, região, prazo ou capacidade quando esses dados existirem;
- lista de fornecedores compatíveis;
- indicação dos critérios atendidos, não atendidos e não informados;
- pontuação auxiliar baseada em pesos conhecidos;
- ausência de decisão automática: o comprador continua responsável pela escolha.

No MVP, o match usa regras e dados cadastrados. Não depende de treinamento de modelo, previsão estatística ou IA generativa.

### 5. Propostas e negociação

- proposta técnica e comercial ligada à demanda;
- preço unitário, quantidade, impostos informados, frete e custo total;
- marca, fabricante real e código do fabricante quando aplicáveis;
- prazo de fabricação e entrega;
- validade, pagamento, responsável, prazo, cobertura e exclusões essenciais da garantia, capacidade declarada pelo fornecedor para aquela demanda e observações técnicas;
- criação de nova versão sem sobrescrever versões anteriores;
- histórico de eventos e observações de negociação;
- retirada, rejeição, expiração e substituição de proposta;
- impedimento de novas propostas após o encerramento da demanda.

Chat em tempo real não é necessário no MVP. O histórico estruturado de versões e observações deve preservar a negociação essencial.

### 6. Comparação e aceite

- comparação lado a lado;
- custo total e custo unitário;
- marca, fabricante e relação da empresa proponente com o item, quando aplicáveis;
- prazo;
- aderência técnica;
- certificações e conformidade histórica verificável;
- reputação, suas dimensões históricas de qualidade e avaliações anteriores com amostra visível;
- quantidade de pedidos concluídos e percentual de entregas no prazo, sempre com período e origem;
- condição de pagamento e garantia;
- destaque de dados ausentes ou não comparáveis;
- escolha registrada com justificativa;
- aceite transacional que congela a versão vencedora, encerra as concorrentes e gera o pedido.

O sistema pode sugerir ordenações, mas não deve esconder critérios nem afirmar qual proposta é universalmente a melhor.

“Popularidade” não será uma nota subjetiva nem será calculada por visualizações, curtidas ou destaque pago. Quando útil, ela será representada por indicadores verificáveis de atuação na plataforma, como pedidos concluídos e entregas no prazo, acompanhados do período e do tamanho da amostra.

O comparador usa somente evidências existentes antes da contratação. Qualidade histórica aparece como dimensão da avaliação ou como fato operacional identificado, sem receber peso duplicado dentro e fora da reputação. A inspeção dos lotes do pedido atual começa depois do aceite e pertence à execução, não à reputação usada para selecionar o fornecedor.

### 7. Pedido e execução do fornecedor

- pedido com fotografia das condições aceitas;
- aceite e acompanhamento pelas duas organizações;
- plano de atendimento por item;
- registro da quantidade disponível no estoque do fornecedor com origem e data da informação;
- reserva simplificada dessa quantidade;
- registro, pelo fornecedor, de um plano ou ordem simplificada para produzir a falta;
- etapas manuais de produção;
- registro de quantidade concluída, problema e atraso;
- histórico separado do estado comercial do pedido.

O estoque e a produção são privados e pertencem ao fornecedor. O comprador vê apenas o andamento necessário ao pedido, não os saldos ou operações internas completos.

### 8. Qualidade, lote e QR Code

- criação de lote para itens produzidos ou separados;
- identificação do pedido, item, fornecedor, datas e responsável;
- plano de inspeção versionado com critérios obrigatórios;
- inspeção simples referenciando a versão do plano, com resultado, observação e evidências;
- aprovação, reprovação e retrabalho;
- não conformidade e bloqueio da quantidade afetada quando um controle obrigatório falhar;
- liberação para expedição somente da quantidade aprovada;
- QR Code gerado a partir de token seguro, sem dados sensíveis no conteúdo bruto;
- página de rastreabilidade com visão pública mínima e detalhes adicionais somente para usuários autorizados;
- revogação ou substituição do token quando necessário.

### 9. Logística, recebimento e avaliação

- preparação e expedição;
- transportadora e código de rastreio apenas informativos;
- atualização manual dos eventos da entrega;
- registro de atraso, avaria, recusa ou outra ocorrência;
- confirmação de recebimento pelo comprador;
- avaliação do fornecedor por qualidade, prazo, atendimento, conformidade e custo-benefício;
- cálculo de reputação por regra conhecida e com amostra visível.

### 10. Dashboards modernos

Visões diferentes conforme o papel:

- demandas abertas e propostas recebidas;
- oportunidades compatíveis e propostas enviadas;
- taxa de conversão de propostas;
- pedidos por etapa;
- valor bruto negociado pela plataforma;
- prazo médio e entregas atrasadas;
- produção e inspeções pendentes;
- taxa de conformidade e ocorrências;
- fornecedores mais bem avaliados;
- alertas de validade, prazo, qualidade e entrega.

Os cards devem permitir chegar aos registros que explicam o número apresentado.

## Simplificações permitidas

- moeda BRL e operação nacional;
- validação manual das organizações;
- um local principal de estoque por fornecedor;
- uma proposta vencedora por demanda;
- uma entrega principal por pedido, embora o modelo aceite evolução;
- aprovação comercial simples pelo comprador;
- capacidade e disponibilidade declaradas pelo fornecedor;
- produção por etapas configuradas de forma simples;
- inspeção manual, sem integração com equipamentos;
- atividades automáticas para prazos e pendências essenciais, sem chat corporativo;
- QR Code para rastreabilidade no SIVI, sem integração com impressoras industriais;
- logística atualizada manualmente;
- condição de pagamento apenas informativa;
- notificações apenas dentro do sistema;
- reputação e match calculados por regras determinísticas.
- papéis operacionais modelados separadamente, mas acumuláveis em poucas contas na demonstração acadêmica.

## Próximas versões

### Versão 2

- múltiplos locais de estoque e plantas;
- entregas, lotes e propostas parciais;
- divisão de uma demanda entre fornecedores;
- chat em tempo real;
- notificações por e-mail;
- modelos de requisitos por categoria;
- documentos de qualidade e certificados com validação ampliada;
- integração opcional com ERP, WMS ou sistemas de produção;
- organização fornecedora publicando demandas de insumos pelo mesmo motor do marketplace;
- painéis comparativos e histórico de preços mais avançados.

### Evolução futura

- previsão de demanda e risco de atraso;
- recomendação de produtos e fornecedores com base em histórico;
- apoio inteligente à formação de preço e prazo;
- detecção de anomalias e fraude;
- pagamento online, garantia financeira ou escrow;
- emissão e integração fiscal;
- contrato digital com assinatura jurídica;
- integração com transportadoras, telemetria e GPS;
- APIs públicas e integrações com ecossistemas industriais;
- otimização avançada de capacidade e planejamento fabril.

Funcionalidades inteligentes futuras só devem ser apresentadas como IA quando houver dados, métricas, validação e explicação suficientes.

## Fora do escopo inicial

- participação anônima ou marketplace aberto sem aprovação;
- a empresa SIVI fabricar, vender, armazenar ou transportar produtos;
- estoque central pertencente à plataforma;
- compra de matéria-prima como um segundo fluxo ou marketplace separado;
- pagamento, crédito ou repasse financeiro;
- emissão fiscal, contabilidade e folha;
- assinatura jurídica completa;
- integração direta com transportadora;
- previsão estatística ou IA avançada;
- aplicativo móvel nativo ou programa desktop.

## Critério de conclusão do MVP

O MVP estará concluído quando dados de teste demonstrarem:

1. uma organização compradora publica uma demanda técnica;
2. somente fornecedores aprovados e compatíveis recebem acesso à oportunidade;
3. pelo menos dois fornecedores enviam propostas e um deles cria uma nova versão;
4. o comprador compara critérios, justifica a escolha e aceita uma versão;
5. o aceite gera um pedido imutável sem redigitação;
6. o fornecedor registra atendimento por estoque, produção ou combinação;
7. um lote passa por inspeção, recebe QR Code seguro e é liberado;
8. a entrega é acompanhada, confirmada e avaliada;
9. dashboards refletem todo o fluxo sem vazamento de dados entre organizações.
