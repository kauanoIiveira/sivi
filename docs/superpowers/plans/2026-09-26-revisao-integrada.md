# Revisão integrada — plano de implementação

**Objetivo:** entregar melhorias aplicadas para a revisão manual solicitada.
**Referência:** [escopo, escolhas e critérios](../../29-revisao-integrada.md).
**Arquitetura:** preservar aplicação vanilla e regras locais existentes. Separar recuperação transitória do formulário, projeção da interface e comandos persistidos.

## Execução

- [x] Recuperação: criar `createDemandRecovery(workspace, storage)` em `src/pages/operations/demand-recovery.js`, com `read`, `save`, `clear`, isolamento por conta/empresa/papel e falha tolerada de armazenamento. Testar em `tests/unit/demand-recovery.test.js` e no navegador; integrar somente ao preenchimento de nova demanda.
- [x] Interface operacional: melhorar busca sem acentos, contagem, unidades e feedback; impedir perda de formulários alterados por atualização ou outra ação. Manter semântica de rascunho/publicação e foco lógico. Arquivos `workflow-view.js`, `workflow-components.js`, `operations-page.js` e CSS. Provar em `tests/e2e/workflow-usability.spec.js`.
- [x] Repositório: datas de calendário válidas, cache após escrita confirmada e `workflow.getSyncWarning(workspaceId)`. Falhas de escrita continuam erros. Testar todos os comandos afetados com leituras posteriores interrompidas. Reconciliar apenas oportunidades cujo fechamento seja verificável pelas fontes autorizadas.
- [x] Navegação: skip link sem alterar hash; menu Conta fecha por Escape, clique fora e saída do foco. Preservar preferências e drawer, remover listeners ao destruir. Testar em `tests/e2e/app-shell.spec.js`.
- [x] Integração: rodar `npm test`, inspeção visual em ambos os temas e tamanhos, revisão de diff e documentação. Limpeza inventariada, mas bloqueada pela revisão automática de aprovação; nenhuma exclusão executada.

## Casos críticos

Armazenamento bloqueado; recuperação com conta diferente; duas unidades incompatíveis; erro de leitura depois de gravação; formulário alterado durante atualização; foco removido por renderização; menu com texto 200% e janela baixa. Cada caso deve ter evidência na suíte ou inspeção registrada.

As mudanças de lógica e navegação têm arquivos separados e foram delegadas como tarefas independentes conforme a skill de despacho paralelo. A integração e a interface operacional permanecem nesta sessão. Não há commit, push ou deploy automático.

- [ ] Limpeza pendente: a revisão automática bloqueou a exclusão com `blocked by policy`. Ver o inventário e as condições de preservação no documento 29.
