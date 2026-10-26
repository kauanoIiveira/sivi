# Repaginação pública SIVI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Entregar apresentação profissional e cadastro integrado com pagamento demonstrativo e criação real da conta.

**Architecture:** React/TypeScript/Motion nas superfícies públicas, compilados como biblioteca local Vite. Adaptadores mantêm roteador, Firebase e módulos operacionais existentes. Domínio e rascunhos são JavaScript puro testável; Firebase permanece uma única instância fora do bundle.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind 4 sem preflight global, Motion, Number Flow, Lucide, Firebase existente e Playwright.

**Spec:** `docs/superpowers/specs/2026-10-23-repaginacao-publica-design.md`

## Global Constraints

- Pasta efetiva `C:\Users\Kauan\Desktop\sivi`; sem Git; snapshot em `.checks/public-redesign-20261023/source-before.zip`. Não criar Git nem simular commits.
- Somente apresentação pública e integração pontual do cadastro empresarial; preservar regras e operações autenticadas.
- R$99/149/199 mensal; anual R$79/119/159 por mês, totais R$948/1428/1908. Sem cobrança, gateway, assinatura ou permissões financeiras.
- Dados ilustrativos e identificação fictícia explicitamente marcados; mídia real com créditos; raposa original preservada.
- Nunca persistir ou enviar cartão/CVV. Senha apenas para Firebase Auth. Rascunho empresarial por sete dias, isolado por identidade.
- Node >=22.12, build portátil incluído; CSS público isolado; uma instância Firebase.

## Review Focus

- Retorno perdido após criar conta: resultado conhecido deve informar sucesso parcial e não repetir criação (tarefa 3).
- Troca de usuário no mesmo navegador: rascunho de outra identidade nunca aparece (tarefa 1).
- Escrita empresarial concluída com resposta perdida: tentativa estável reconcilia sem duplicar (tarefa 4).
- Persistência bloqueada/rascunho expirado: fluxo continua e informa quando precisa reapresentar dados (tarefas 1 e 3).
- Teclado, celular e redução de movimento: todas as ações e mensagens permanecem alcançáveis sem animação (tarefa 5).

### Task 1: Contratos de oferta, validação e rascunho

**Files:** criar `src/domain/public-signup.js`, `src/core/signup-draft-store.js`, testes correspondentes em `tests/unit/`.

**Interfaces:** `PUBLIC_PLANS`, `resolvePlan(id)`, `planQuote(id,period)`, `validateSignup(values,step)`; `createSignupDraftStore({storage,now,idFactory})` com `stage`, `bind`, `read`, `ensureAttempt`, `remove`. Dados armazenados por whitelist; email normalizado; validade sete dias.

- [x] Escrever testes: Integrado anual retorna mensal159/total1908; desconhecido vira Integrado mensal (spec prevalece sobre a redação inicial do plano); validação não aceita cartão real; gráfico corresponde aos registros; expiração e UID/email divergentes não recuperam rascunho; falha de storage usa memória; segredo extra nunca é serializado.
- [x] Executar `npm run test:unit` e confirmar falha por módulo ausente.
- [x] Implementar domínio e store com validação empresarial existente, isolamento e IDs estáveis.
- [x] Executar unitários, exigir todos passarem.
- [x] Registrar conclusão no ledger (snapshot substitui commit nesta cópia sem Git).

### Task 2: Home, planos e informações institucionais

**Files:** criar `src/public/{entry.tsx,components.tsx,home.tsx,pricing.tsx,insights.tsx,information.tsx,public.css}`, `vite.public.config.ts`, `tsconfig.public.json`; modificar `package.json`, `index.html`, `src/pages/public/public-page.js`; gerar `src/generated/public/`.

**Interfaces:** `mountPublicExperience(container):()=>void` e `mountAuthExperience(container,bridge):()=>void`. Home lê query de hash `secao`/`pagina`; planos linkam `#/acesso?modo=register&plano=...&periodo=...`.

- [x] Criar verificação browser de navegação, alternância anual, seleção de planos, páginas de rodapé, pausa do vídeo e rótulos de dados de exemplo; observar falha na home anterior.
- [x] Instalar dependências, configurar biblioteca com saídas estáveis, sem Firebase ou preflight global; typecheck e build.
- [x] Adaptar estrutura visual dos componentes fornecidos: gráfico com filtros e dados coerentes, preços com Number Flow, Motion respeitando redução; implementar mídia real e navegação responsiva.
- [x] Implementar Sobre, Ajuda, Segurança e dados, Privacidade, Condições e Créditos com destinos reais e identificação demonstrativa visível.
- [x] Verificar build e navegação browser; registrar evidência e decisões visuais.

### Task 3: Acesso e cadastro integrado

**Files:** criar `src/public/auth.tsx`, `src/public/auth.css`; substituir adaptador `src/pages/auth/auth-page.js`; atualizar marcação inicial em `index.html`; testes `tests/e2e/public-redesign.spec.js`.

**Interfaces:** bridge `loadAuth():Promise<AuthService>`, store da tarefa1. Campos pessoais → empresa → pagamento de teste/revisão. `registerWithEmail` somente no submit final válido; retorno com UID vincula rascunho e mostra orientações reais, inclusive avisos parciais. Providers/login/reset preservados.

- [x] Teste browser com emulador: antes do final conta não existe; final cria conta, não envia cartão; email duplicado oferece entrada; erro não apaga dados. Confirmar falha antes de implementar.
- [x] Implementar formulários rotulados, senha visível, feedback associado, foco em erros, seleção de plano/periodicidade e revisão editável. Preservar IDs úteis ao teste legado.
- [x] Implementar espera/erro/sucesso parcial; impedir submit duplicado; limpar segredos ao sucesso; fallback de persistência explícito.
- [x] Verificar unitários, typecheck, build e teste novo emulado.

### Task 4: Retomada empresarial e reconciliação

**Files:** modificar `src/app/bootstrap.js`, `src/app/app-controller.js`, `src/pages/context/context-page.js`, `src/services/firebase-workspace-service.js`; testes unitários de serviço e browser.

**Interfaces:** `createOrganization(input,{organizationId}={})` opcional; controller propaga options e resultado. Onboarding expõe draft por usuário verificado, tentativa persistida e remoção após sucesso confirmado. Não submeter automaticamente.

- [x] Adicionar teste de tentativa estável com escrita concluída e resposta perdida; nova chamada retorna a mesma empresa. Testar rejeição de ID/identidade conflitantes. Confirmar falha.
- [x] Implementar reconciliação compatível com chamadas existentes, comparando proprietário e dados normalizados; encaminhar opções no bootstrap/controller.
- [x] Apresentar revisão compacta dos dados salvos no contexto após login verificado; converter atuações ao formato esperado; remover rascunho só depois de sucesso, preservando retry.
- [x] Verificar regressão unitária e browser emulado conta → verificação → empresa pendente única.

### Task 5: Acabamento, revisão e entrega

**Files:** atualizar `PRODUCT.md`, documentação da entrega, plano e ledger; corrigir arquivos anteriores conforme verificações.

- [x] Executar typecheck, build, unitários e suite e2e apropriada, comparando falhas legadas com snapshot se necessário.
- [x] Inspecionar screenshots e uso real em360/390/768/1440, hero1920/2560; testar teclado, foco, menu, links, redução de movimento, vídeo e ausência de overflow.
- [x] Solicitar revisão independente de código e acabamento visual com spec e evidências; corrigir achados importantes e repetir somente verificações afetadas.
- [x] Registrar resultado, limitações reais e dados fictícios; confirmar créditos, integridade da raposa e build portátil. Manter ledger e snapshot sem Git.
