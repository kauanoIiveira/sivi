# Plano de implementação do MVP dinâmico

**Data:** 14/09/2026

**Base:** [`19-plano-mvp-academico-dinamico.md`](19-plano-mvp-academico-dinamico.md)

**Aplicação-alvo:** `index.html`

**Objetivo:** desenvolver o SIVI como sistema acadêmico dinâmico, com cadastros livres e jornada persistida no Firebase.

## Estratégia de desenvolvimento

O trabalho será feito em fatias funcionais. Cada fatia incluirá, na mesma entrega:

1. modelo e regra de negócio;
2. persistência no Firebase;
3. regra de acesso necessária;
4. página no sistema principal;
5. estados de carregamento, vazio, erro e falta de permissão;
6. testes unitários e teste do fluxo no navegador;
7. atualização da documentação.

Direção atualizada em 16/09/2026: manter uma única aplicação em `index.html`. A revisão da UI antecede as próximas páginas, conforme solicitação do responsável. Aplicar `design-system/MASTER.md`; cenários simulados ficam somente nos testes.

## Modelo de funcionamento

### Cadastro e empresas

- qualquer visitante cria uma conta;
- depois do login, cadastra uma nova empresa;
- escolhe se a empresa atua como compradora, fornecedora ou ambas;
- a solicitação fica pendente até a aprovação do administrador acadêmico;
- uma empresa com as duas atuações gera dois contextos selecionáveis;
- o mesmo usuário pode cadastrar ou participar de várias empresas;
- somente contextos ativos executam ações comerciais;
- empresas bloqueadas preservam seus registros, mas não criam novas operações.

### Registros dinâmicos

Não existirão empresas, demandas ou pedidos obrigatórios gravados no código. A massa das 500 engrenagens será criada por um script de preparação ou pelas próprias telas e servirá somente aos testes e à apresentação.

As listas trabalharão com todos os registros autorizados da empresa ativa. Não haverá limite funcional de uma demanda, dois fornecedores ou dois lotes.

## Evolução do modelo de dados

O modelo atual será ampliado sem apagar dados automaticamente:

```text
users/{uid}
organizations/{organizationId}
membershipsByUser/{uid}/{organizationId}
organizationMembers/{organizationId}/{uid}
platformAdmins/{uid}

supplierProfiles/{supplierId}
demandsByBuyer/{buyerId}/{demandId}
publishedDemands/{demandId}
matchesByDemand/{demandId}/{supplierId}

proposalsByBuyer/{buyerId}/{proposalId}
proposalsBySupplier/{supplierId}/{proposalId}
ordersByBuyer/{buyerId}/{orderId}
ordersBySupplier/{supplierId}/{orderId}

fulfillmentsByOrder/{orderId}
lotsByOrder/{orderId}/{lotId}
nonConformitiesByLot/{lotId}/{occurrenceId}
shipmentsByOrder/{orderId}
traceabilityByToken/{token}
```

Campos essenciais de empresa:

```text
id
name
roles: { buyer, supplier }
status: pending | active | blocked
createdBy
createdAt
updatedAt
reviewedBy?
reviewedAt?
reviewReason?
```

Uma empresa que atua como compradora e fornecedora continuará sendo uma única organização. A atuação atual será parte do contexto selecionado, não outro cadastro empresarial.

## Fase 1 — Base Firebase e cadastro dinâmico de empresas

### Tarefa 1.1 — Tornar o ambiente reproduzível

Arquivos principais:

- `package.json`;
- `firebase.json`;
- `.firebaserc`;
- `scripts/start-auth-emulator.mjs`;
- `COMO_ABRIR.md`.

Ações:

- documentar a instalação ou seleção do JDK necessário aos emuladores;
- adicionar comandos claros para iniciar aplicação e emuladores;
- criar comando específico para validar regras e fluxo Firebase;
- associar o projeto Firebase por alias versionado;
- manter implantação remota como comando explícito, nunca automática durante testes.

Aceite:

- uma instalação limpa inicia Auth e Realtime Database Emulator;
- a suíte do navegador pode rodar com um único comando documentado;
- projeto local e projeto remoto usado na publicação ficam identificados.

### Tarefa 1.2 — Remodelar empresa e contexto

Arquivos principais:

- `src/services/firebase-workspace-service.js`;
- `src/core/workspace-store.js`;
- `src/pages/context/context-page.js`;
- `src/app/app-controller.js`;
- `database.rules.json`.

Ações:

- trocar o campo singular `role` por atuações `buyer` e `supplier`;
- criar empresa com estado `pending`;
- preservar na lista os contextos pendentes e bloqueados para exibir seu estado;
- permitir entrar somente em uma atuação ativa;
- representar uma empresa com duas atuações como dois contextos da mesma organização;
- impedir duplicidade de contexto na store;
- apresentar confirmação clara após o cadastro.

Aceite:

- usuário A cadastra uma empresa compradora;
- usuário B cadastra uma empresa fornecedora;
- usuário C cadastra outra empresa sem alterar registros anteriores;
- usuário pode cadastrar outra empresa e alternar entre contextos autorizados;
- recarregar mantém os cadastros e restaura a empresa ativa.

### Tarefa 1.3 — Criar administração acadêmica mínima

Novos arquivos sugeridos:

- `src/services/firebase-admin-service.js`;
- `src/pages/admin/organizations-page.js`;
- `src/pages/admin/admin-page.css`;
- `tests/unit/firebase-admin-service.test.js`.

Arquivos alterados:

- `src/app/routes.js`;
- `src/app/page-loaders.js`;
- `src/core/route-guard.js`;
- `database.rules.json`.

Ações:

- reconhecer um UID previamente cadastrado em `platformAdmins`;
- criar automaticamente o contexto Administração SIVI para essa conta;
- listar empresas pendentes, ativas e bloqueadas;
- aprovar e bloquear registrando responsável, data e motivo curto;
- impedir que uma conta comum abra a rota administrativa;
- atualizar os contextos do proprietário após a decisão.

Aceite:

- empresa pendente não publica demanda nem envia proposta;
- administrador aprova e a atuação fica disponível sem recriar a empresa;
- administrador bloqueia e novas ações deixam de ser permitidas;
- usuário comum recebe falta de permissão na rota administrativa.

### Tarefa 1.4 — Fechar e publicar regras básicas

Arquivos principais:

- `database.rules.json`;
- `tests/unit/database-rules.test.js`;
- novo teste de regras no Firebase Emulator.

Casos obrigatórios:

- proprietário lê a própria empresa;
- usuário não lê empresa privada sem associação;
- empresa pendente não escreve dados comerciais;
- empresa ativa escreve apenas no próprio escopo;
- fornecedor não lê proposta concorrente;
- alterar `buyerId`, `supplierId` ou `organizationId` não concede acesso;
- administrador executa apenas as ações administrativas permitidas.

Aceite:

- todos os testes de permissão passam no Emulator;
- as mesmas regras são publicadas no Realtime Database correto;
- cadastro e aprovação funcionam remotamente sem `PERMISSION_DENIED` indevido.

## Fase 2 — Perfil industrial, demandas e match

### Tarefa 2.1 — Perfil do fornecedor

Novos arquivos sugeridos:

- `src/services/firebase-supplier-profile-service.js`;
- `src/pages/supplier/profile-page.js`;
- `src/domain/supplier-profile.js`.

Campos iniciais:

- categorias atendidas;
- materiais;
- processos;
- capacidade máxima informada;
- regiões atendidas;
- certificações;
- descrição e prazo indicativo.

Ações:

- criar rota “Perfil industrial” no contexto fornecedor;
- permitir criar, editar e desativar capacidades;
- salvar tudo por `supplierId`;
- impedir edição por outra organização.

Aceite:

- fornecedores diferentes mantêm perfis independentes;
- alterações aparecem no match após recarregar;
- comprador nunca recebe campos internos que não participam da oportunidade.

### Tarefa 2.2 — Editor dinâmico de demandas

Arquivos principais:

- `src/repositories/firebase-marketplace-repository.js`;
- `src/pages/operations/workflow-view.js`;
- `src/pages/operations/operations-page.css`;
- `database.rules.json`.

Ações:

- permitir adicionar e remover itens no rascunho;
- registrar categoria, descrição, quantidade, unidade, material, processo e certificações;
- manter prazo, destino e observações no cabeçalho;
- validar cada item antes da publicação;
- preservar a demanda inteira após o recebimento de propostas;
- preparar suporte a anexos sem bloquear esta fase caso o Storage ainda não esteja configurado.

Aceite:

- duas empresas compradoras criam demandas diferentes;
- cada uma vê apenas seus rascunhos;
- uma demanda com vários itens é restaurada corretamente;
- publicação inválida mostra quais campos faltam.

### Tarefa 2.3 — Match explicável

Novos arquivos sugeridos:

- `src/domain/match-engine.js`;
- `src/services/firebase-match-service.js`;
- `tests/unit/match-engine.test.js`.

Regra inicial:

- categoria e processo são obrigatórios;
- material, capacidade, certificação e região alteram a compatibilidade;
- resultado pode ser `compatible`, `partial` ou `ineligible`;
- cada critério guarda estado e explicação;
- nenhuma pontuação escolhe o vencedor.

Ações:

- calcular resultados ao publicar a demanda;
- gravar o resultado por demanda e fornecedor;
- mostrar na oportunidade somente dados necessários da demanda;
- permitir proposta apenas para fornecedor ativo e elegível conforme a regra acadêmica.

Aceite:

- novos fornecedores podem entrar no sistema e participar de demandas futuras;
- fornecedores com perfis diferentes recebem resultados diferentes;
- a página explica cada critério, sem usar apenas uma porcentagem.

## Fase 3 — Propostas, comparação e pedido

### Tarefa 3.1 — Proposta completa e versionada

Arquivos principais:

- `src/repositories/firebase-marketplace-repository.js`;
- `src/pages/operations/workflow-view.js`;
- `database.rules.json`.

Ações:

- registrar resposta por item, quantidade, fabricante, preço, frete, prazo, pagamento, garantia e validade;
- permitir rascunho antes do envio;
- criar nova versão para cada revisão;
- identificar autor e data;
- impedir edição de versões enviadas;
- permitir retirada antes do aceite.

Aceite:

- cada fornecedor vê apenas sua proposta;
- comprador vê todas as propostas da própria demanda;
- versões anteriores continuam consultáveis;
- nova revisão vira a única versão disponível para aceite.

### Tarefa 3.2 — Comparador e aceite único

Ações:

- comparar versões vigentes por item e total;
- destacar campos ausentes ou incompatíveis;
- confirmar explicitamente demanda, fornecedor e versão;
- executar aceite e criação do pedido em atualização atômica;
- usar ID determinístico ou controle de idempotência por demanda;
- marcar demanda como contratada e impedir novos envios;
- manter as demais propostas como não selecionadas.

Aceite:

- cliques repetidos criam exatamente um pedido;
- versão antiga ou vencida não pode ser aceita;
- pedido preserva snapshot da demanda e da proposta;
- comprador e fornecedor vencedor enxergam o mesmo compromisso;
- concorrente não enxerga o pedido.

## Fase 4 — Atendimento, lotes, qualidade e QR

### Tarefa 4.1 — Plano de atendimento

Ações:

- escolher estoque, produção ou modo misto;
- distribuir a quantidade de cada item;
- registrar responsável, previsão e observação;
- exigir que a soma cubra a quantidade contratada;
- mostrar ao comprador apenas o resumo do atendimento.

Aceite:

- qualquer pedido aceito pode receber plano próprio;
- quantidades negativas ou soma divergente são rejeitadas;
- fornecedor só altera pedidos da própria empresa.

### Tarefa 4.2 — Lotes dinâmicos

Ações:

- criar qualquer quantidade de lotes necessária;
- vincular lote ao pedido, item e origem;
- controlar quantidade total ainda disponível para formação de lote;
- listar lotes separadamente dentro do pedido.

Aceite:

- o cenário de 320 + 180 gera dois lotes, mas outros pedidos podem gerar um ou vários;
- soma dos lotes não ultrapassa o plano;
- cada lote mantém código e histórico próprios.

### Tarefa 4.3 — Inspeção e não conformidade

Ações:

- registrar plano/versão, resultado, quantidade aprovada e reprovada;
- bloquear a quantidade reprovada;
- abrir não conformidade com descrição e ação corretiva;
- registrar reinspeção sem apagar a inspeção anterior;
- liberar somente as quantidades aprovadas.

Aceite:

- lote reprovado não oferece expedição;
- reinspeção cria novo registro;
- histórico mostra falha, correção e decisão final.

### Tarefa 4.4 — QR e consulta de rastreabilidade

Novos arquivos sugeridos:

- `src/domain/traceability-token.js`;
- `src/pages/traceability/traceability-page.js`;
- `src/pages/traceability/traceability-page.css`.

Ações:

- gerar token opaco com `crypto` do navegador;
- criar projeção pública mínima para lote liberado;
- gerar a imagem do QR localmente, sem serviço externo;
- criar rota pública de consulta;
- permitir revogação do token;
- exigir login para detalhes comerciais.

Aceite:

- lote bloqueado não recebe QR;
- leitura do QR abre a rastreabilidade correta;
- token inválido ou revogado mostra estado próprio;
- conteúdo bruto do QR não contém preço, CNPJ ou dados do comprador.

## Fase 5 — Entrega, avaliação e indicadores

### Tarefa 5.1 — Expedição e recebimento

Ações:

- selecionar lotes liberados do pedido;
- registrar transportadora opcional, código, previsão e data;
- registrar expedição;
- permitir ao comprador confirmar recebimento ou ocorrência simples;
- impedir entrega de quantidade bloqueada.

### Tarefa 5.2 — Avaliação e reputação acadêmica

Ações:

- substituir a nota única por qualidade, prazo, conformidade, atendimento e custo-benefício;
- calcular a média ponderada definida nos documentos;
- permitir uma avaliação por pedido entregue;
- mostrar quantidade de avaliações junto da média;
- recalcular após cada nova entrega avaliada.

### Tarefa 5.3 — Painéis com dados reais

Arquivos principais:

- `src/domain/live-marketplace-selectors.js`;
- páginas de dashboard;
- `src/visualizations/industrial-rail/industrial-rail.js`.

Ações:

- remover dependência da fixture nos contextos reais;
- calcular demandas abertas, propostas, pedidos por etapa, quantidades bloqueadas, entregas e avaliações;
- usar a empresa ativa como escopo;
- atualizar o trilho a partir das evidências do pedido selecionado;
- manter período e origem dos indicadores visíveis.

Aceite da fase:

- comprador e fornecedor concluem a jornada em contas separadas;
- recebimento e avaliação persistem;
- painéis mudam conforme novos registros são criados;
- trocar de empresa troca todos os números e listas.

## Fase 6 — Acabamento e publicação acadêmica

Ações:

- integrar anexos técnicos simples pelo Firebase Storage se ainda pendentes;
- revisar navegação por teclado, foco, rótulos e contraste;
- testar 360, 768 e 1440 px;
- revisar textos de erro e permissão;
- preparar script opcional de massa acadêmica;
- executar a jornada completa no Emulator;
- executar a jornada no Firebase remoto com contas de apresentação;
- publicar por HTTPS;
- preparar roteiro AS-IS × TO-BE e limitações declaradas.

Aceite:

- apresentação inteira ocorre pelas telas, sem editar o banco manualmente;
- um usuário novo consegue cadastrar sua empresa e iniciar o fluxo previsto;
- cenário acadêmico pode ser recriado de maneira documentada;
- A jornada funciona em `index.html`, com registros persistidos.

## Estratégia de testes

### Testes unitários

- validação de empresa e atuações;
- conversão de empresa em contextos;
- regras do match;
- totais e versões de propostas;
- idempotência do aceite;
- distribuição de atendimento e lotes;
- bloqueio e reinspeção;
- avaliação ponderada e indicadores.

### Testes das regras Firebase

- operações permitidas por proprietário, comprador, fornecedor e administrador;
- negação para usuário anônimo;
- negação para empresa pendente ou bloqueada;
- negação de leitura cruzada;
- negação de alteração de identidade e versão imutável.

### Testes no navegador

1. cadastro de usuário;
2. cadastro de nova empresa;
3. aprovação administrativa;
4. criação de perfis de fornecedor;
5. publicação de demanda;
6. match e propostas concorrentes;
7. revisão e aceite;
8. atendimento, lotes e qualidade;
9. QR, expedição e recebimento;
10. avaliação, painel e persistência após recarregar.

O cenário automatizado usará quatro contas por ser suficiente para provar os papéis. O sistema continuará aceitando novos usuários e organizações.

## Ordem dos commits

Cada bloco deve terminar com testes passando e um commit independente:

1. `docs: define dynamic academic MVP implementation plan`
2. `chore: make Firebase development environment reproducible`
3. `feat: support dynamic organizations and business contexts`
4. `feat: add academic organization administration`
5. `test: enforce Firebase organization isolation`
6. `feat: add supplier profiles and explainable matching`
7. `feat: support structured multi-item demands`
8. `feat: complete versioned proposals and atomic acceptance`
9. `feat: add fulfillment plans and dynamic lots`
10. `feat: add inspection nonconformity and reinspection`
11. `feat: add QR traceability and shipment flow`
12. `feat: calculate evaluations and live dashboards`
13. `test: validate the complete academic journey`
14. `docs: prepare the SIVI academic presentation`

## Primeiro bloco a executar

O desenvolvimento começará por:

1. preparar a execução dos emuladores;
2. remodelar empresa para `buyer`, `supplier` ou ambas;
3. manter pendentes e bloqueadas visíveis na seleção de contexto;
4. criar a administração acadêmica de empresas;
5. fechar os testes de permissão;
6. publicar as regras no projeto `sivi-org` após autenticação do responsável no Firebase CLI.

Ao final desse bloco, qualquer usuário poderá se cadastrar, registrar a própria empresa e acompanhar sua aprovação. Esse será o primeiro incremento novo realmente utilizável.
