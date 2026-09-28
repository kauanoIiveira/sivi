# Proteção das condições aceitas e dos estados — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Impedir alteração do conteúdo comercial de pedidos existentes e retorno de demandas publicadas/contratadas para rascunho, mantendo a jornada legítima.

**Architecture:** Manter a aplicação e as projeções atuais no Realtime Database. Fortalecer as validações dos registros existentes nas regras, com testes autenticados nos emuladores. Este recorte não redesenha publicação/aceite, não introduz comandos de servidor e não constitui a solução completa da liberação de qualidade.

**Tech Stack:** HTML, CSS, JavaScript ES modules, Firebase Realtime Database Rules, Node.js 22+, Playwright e emuladores Auth/Database.

**Spec:** [28 — Próximos passos, bloco 1A](../../28-proximos-passos.md#1a-proteger-o-que-já-foi-acordado). Evidência local: `docs/reviews/2026-09-26-marketplace-evidence.json`, casos R1 e R5 no roteiro.

**Ajuste técnico durante a execução:** regras do RTDB não oferecem igualdade profunda por `val()` para objetos. O congelamento será feito por autorização: criação no nível do pedido; atualizações somente nos filhos operacionais `status`, `updatedAt`, `inspections`, `dispatchedAt`, `deliveredAt` e `evaluation`. Os quatro comandos operacionais do repositório passam a enviar esses caminhos em uma atualização atômica das duas projeções. Isso protege também campos desconhecidos dentro de itens/versão e exclusões, sem migrar registros antigos. Referência: [RuleDataSnapshot.val](https://firebase.google.com/docs/reference/security/database#val).

## Global Constraints

- “Manter a apresentação industrial e as preferências de leitura já implementadas.”
- “Manter os pedidos antigos legíveis. Campo opcional ausente em registro antigo não deve ser preenchido com informação inventada.”
- “O cliente não recebe permissão de leitura global para viabilizar uma transação.”
- Preservar as alterações locais existentes; este plano não autoriza descartá-las, reescrever histórico ou publicar regras remotas.
- A evidência usa os emuladores em `127.0.0.1:9099` e `127.0.0.1:9000`; não testar mutações contra produção.

## Review Focus

- Remover `version`, `items` ou um campo dentro da versão deve ser recusado como alteração, não passar como ausência opcional. Coberto na tarefa 1.
- Atualizar um pedido antigo sem `items`/`description` deve preservar essa ausência e continuar permitido para uma transição legítima. Coberto na tarefa 1.
- Alteração combinada de estado e valor deve falhar por inteiro, sem mudar uma das projeções. Coberto na tarefa 1.
- Um concorrente ou usuário de empresa inativa não deve ganhar permissão ao ajustar as condições de estado. Coberto na tarefa 2.
- Repetição de um estado permitido deve ser compatível com o fluxo existente; retrocesso nunca se confunde com repetição. Coberto na tarefa 2.

## Estrutura

| Arquivo | Responsabilidade |
|---|---|
| `database.rules.json` | Proteção de campos congelados e transições da demanda |
| `src/repositories/firebase-marketplace-repository.js` | Atualizações operacionais por caminhos filhos, mantendo atomicidade entre projeções |
| `tests/helpers/marketplace-rule-fixture.js` (novo) | Contas, contexto sintético e solicitações autenticadas locais reutilizáveis |
| `tests/e2e/marketplace-integrity.spec.js` (novo) | Escritas diretas que devem ser recusadas e atualizações legítimas que devem passar |
| `tests/e2e/firebase-marketplace.spec.js` (existente) | Jornada completa pelo produto para detectar regressão |
| `CONTINUE_AQUI.md`, `docs/28-proximos-passos.md` | Atualizar somente o que o recorte comprovar |

## Tarefa 1: congelar o conteúdo comercial de pedidos existentes

**Interfaces**

- Criar `createMarketplaceRuleFixture(): Promise<{ buyer, supplier, competitor, buyerOrderPath, supplierOrderPath, demandPath, order, request }>` no helper.
- `buyer`, `supplier` e `competitor` contêm `{ uid, organizationId, token }`, usados somente no processo de teste; não escrever tokens em arquivos ou logs.
- `request(path, actor, method = 'GET', body?)` retorna a `Response` da REST API do Database Emulator. `actor` é uma das contas da fixture. Não aceitar host fornecido por variável externa.
- `order` contém `id`, `demandId`, participantes e nomes, `sourceProposalId`, título, descrição, itens, quantidade, versão, `createdAt`, `updatedAt`, `status: 'accepted'`. Usar 10 peças, versão com `totalCents: 10000`, `freightCents: 500`, `revision: 1`.
- A fixture semeia dados sintéticos com o helper existente, mas cada escrita sob teste utiliza o token do participante.

- [x] Criar a fixture e o teste **“rejects commercial changes during an otherwise allowed supplier transition”**. Para cada campo congelado abaixo, alterar somente aquele campo junto de `status: 'released'` e escrever as duas projeções num único PATCH. Esperar HTTP 401 e igualdade completa dos registros antes/depois. Incluir explicitamente 10.000 → 1 centavo e 10 → 1 unidade.
- [x] Incluir casos **“rejects removal of frozen order fields”** com `version: null`, remoção do preço dentro de `version`, `quantity: null` e `items: null` em pedido que já possui itens. Esperar HTTP 401 e nenhuma escrita parcial.
- [x] Executar `npx playwright test tests/e2e/marketplace-integrity.spec.js`. Confirmar falha nos casos de modificação hoje permitidos; não considerar erro de conexão como reprodução.
- [x] Em `ordersByBuyer/$buyerId/$orderId` e `ordersBySupplier/$supplierId/$orderId`, congelar os campos de registros existentes: `id`, `demandId`, `buyerId`, `buyerName`, `supplierId`, `supplierName`, `sourceProposalId`, `title`, `description`, `items`, `quantity`, `version`, `createdAt`. Aplicar a autorização por filhos descrita no ajuste técnico acima; impedir também remoções e alterações internas. Manter as validações existentes e a proteção contra remoção do pedido inteiro.
- [x] Criar **“permits operational changes while preserving accepted terms”**: inspeção completa, liberação e expedição pelo fornecedor; recebimento pelo comprador. Usar o fluxo já permitido e verificar conteúdo comercial idêntico em cada etapa.
- [x] Criar **“keeps legacy orders without optional item detail operational”**: semear pedido sem `items`/`description`; permitir transição legítima conservando os campos ausentes. Não exigir migração artificial para atualizar estado.
- [x] Reexecutar o arquivo de integridade e `tests/e2e/firebase-marketplace.spec.js`. Aceitar a tarefa somente com todos os testes passando.

**Limite:** a transição de liberação usada nestes testes isola a proteção comercial. A exigência de inspeção autoritativa e a preservação de seu histórico pertencem ao bloco 1B; não declarar essa proteção pronta nesta tarefa.

## Tarefa 2: recusar retrocessos da demanda

**Interfaces**

- Reutilizar a fixture e `request` da tarefa 1.
- Estados permitidos no recorte: criação como `draft`; `draft → draft`; `draft → published`; `published → published`; `published → ordered`; `ordered → ordered`.
- Repetir o estado não autoriza modificar requisitos de uma demanda já publicada; a proteção completa da revisão publicada pertence ao bloco 1B. Esse limite deve ficar visível na documentação.

- [x] Acrescentar **“rejects demand status reversals and invalid initial states”**: recusar `ordered → draft`, `ordered → published`, `published → draft`, criação inicial como `published`/`ordered` e estado desconhecido. Em cada recusa, esperar HTTP 401 e registro original inalterado.
- [x] Executar o arquivo e confirmar falha antes de ajustar as regras.
- [x] Acrescentar a matriz explícita acima à validação de `demandsByBuyer/$buyerId/$demandId`, preservando identidade e criação. Na escrita, exigir `newData.exists()` para evitar exclusão contornar as validações de transição.
- [x] Acrescentar **“retains legitimate buyer transitions and role boundaries”**: proprietário ativo consegue criar rascunho, editar, publicar e marcar como contratado através da jornada existente; fornecedor, concorrente e comprador inativo não alteram a demanda. Proteger remoção direta de demanda publicada/contratada.
- [x] Reexecutar os testes de integridade e a jornada comercial. Não enfraquecer as regras para acomodar massa de teste incompleta; corrigir a fixture quando ela não representar um estado legítimo.

## Tarefa 3: concluir e registrar o alcance

- [x] Executar `npm test` com `SIVI_JAVA_HOME` configurado. A linha de base anterior é 91 testes unitários e 74 E2E; registrar as novas contagens reais.
- [x] Conferir `git diff --check` e revisar se somente as regras planejadas e os quatro comandos operacionais mudaram neste recorte, além dos testes/helper e documentação. Preservar as alterações anteriores no repositório.
- [x] Atualizar o roteiro: condições comerciais existentes congeladas e retrocessos negados; manter abertos os itens de publicação concorrente, repetição, criação autoritativa do pedido, inspeção e oportunidades desatualizadas.
- [x] Registrar os resultados em um novo arquivo de evidência, sem sobrescrever a caracterização de 26/09/2026. A reprodução antiga pode falhar após uma correção porque caracteriza o estado anterior; os novos testes são a prova de regressão.

**Saída esperada:** alteração local pequena, revisável e com evidência de que as regras recusam as mutações reproduzidas. Publicação remota é uma etapa separada, com conferência das regras em uso, testes e possibilidade de reversão.
