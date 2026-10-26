# Repaginação interna SIVI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Remodelar a operação autenticada e entregar gráficos reais adaptados ao modelo fornecido.

**Architecture:** preservar páginas/controladores JavaScript, repositório e Firebase; React/Motion em um módulo de insights com agregados puros. CSS operacional explícito, carregado depois dos estilos anteriores e antes das alternativas cromáticas.

**Tech Stack:** React19, TypeScript, Motion, NumberFlow, Lucide, Vite, módulos JS, Node tests e Playwright existentes.

**Spec:** `docs/superpowers/specs/2026-10-23-repaginacao-interna-design.md`

## Global Constraints

- Pasta Desktop sem Git: snapshot `.checks/workspace-redesign-20261023/source-before.zip`, ledger preservado, sem publicação.
- Sem alterar regras comerciais/Firebase, autenticação, cobrança ou dados persistidos.
- Seis intervalos; 30/60/90dias; fuso São Paulo; datas ausentes explicitadas; carteira atual separada do período.
- CSS público preservado; marca original; acessibilidade, temas, redução de movimento e contexto empresarial.
- Sem dependência adicional; build portátil incluído.

## Review Focus

- Timestamp inválido, limite de período e virada UTC: excluir ou agrupar pelo dia correto, nunca deslocar atividade.
- Empresa sem atividade: não fabricar série positiva, taxa, tendência ou receita.
- Troca de atuação/empresa e desmontagem: atualizar dados e desmontar raízes, sem listeners ou valores antigos.
- Pedido com valor ausente/estado desconhecido: total incompleto identificado e categoria Outros; sem NaN.
- Formulários, menus e preferências: preservar interação e foco mesmo após remodelar layouts e temas.

### Task 1: Dados operacionais verificáveis

**Files:** criar `src/domain/workspace-insights.js`, `tests/unit/workspace-insights.test.js`; modificar `src/domain/live-marketplace-selectors.js`.
**Interfaces:** `buildWorkspaceInsights(records,{role='buyer',days=90,now=Date.now()}={})`: period, series[6], totals, omitted, portfolio, orderValueCents, incompleteOrderValues. Dashboard expõe `activityRecords` apenas com dados já autorizados de sua empresa.

- [x] Escrever testes: limites São Paulo, seis intervalos reconciliados, mudança30/90, faltantes/futuros, estados desconhecidos, frete/centavos, empty e imutabilidade.
- [x] Executar teste novo; confirmar falha por módulo ausente.
- [x] Implementar agregados e expor records no dashboard existente.
- [x] Executar unitários; exigir suite verde e registrar ledger.

### Task 2: Gráficos e composição de painéis

**Files:** criar `src/workspace/analytics.tsx`, `src/workspace/analytics.css`; modificar `src/public/entry.tsx`, `tsconfig.public.json`, `buyer-overview-page.js`, `dashboard-view.js`, `admin-dashboard-page.js`.
**Interfaces:** `mountWorkspaceAnalytics(container,{records,role,now}):cleanup`; gráficos sem acesso direto ao Firebase. Cleanup em recarga e desmontagem. Administração recebe somente resumo dos estados já carregados.

- [x] Criar teste browser de filtros/tabela, carteira independente do período e empty; observar falha anterior.
- [x] Adaptar composição do modelo para série real, NumberFlow, tabela, inspeção acessível e estados vazios; inserir nos dois dashboards comerciais com cleanup.
- [x] Adicionar resumo administrativo calculado da lista atual de empresas.
- [x] Executar typecheck/build, testes novos e regressão dos dashboards.

### Task 3: Mundo visual da operação

**Files:** criar `src/styles/workspace-redesign.css`; modificar shell, index e fixtures de integração; criar fixture/capturador da revisão.

- [x] Remodelar moldura, navegação, títulos/caminho, métricas, listas, filtros, formulários, status e acompanhamento; preservar os controles e IDs sem reescrever os fluxos.
- [x] Cobrir comprador/fornecedor/admin/contexto e páginas de demandas/propostas/pedidos, fornecedores, avaliações e perfil. Construir tema escuro e preferências dentro do mesmo conjunto de tokens.
- [x] Inspecionar render real nas larguras da spec e estados relevantes; corrigir em lote, verificar teclado e transbordamento.

### Task 4: Verificação e entrega

- [x] Rodar unitários, typecheck/build e suite e2e completa nos emuladores.
- [x] Solicitar revisão independente de código e acabamento com spec e capturas; corrigir achados materiais e reconferir.
- [x] Documentar decisões no PRODUCT/DESIGN/sidecar, entrega e ledger, sem apagar o histórico.
- [x] Gerar pacote e verificar manifesto/itens; deixar prévia identificada e captura final.
