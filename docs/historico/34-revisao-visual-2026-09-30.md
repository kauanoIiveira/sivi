# Revisão visual de 30/09/2026

Diretório de continuidade: `C:\Users\Kauan\Desktop\sivi`.

Pedido: integrar somente o favicon da raposa aprovada, substituir a imagem da página inicial, reduzir decoração repetitiva e concentrar os controles do sistema na lateral. A revisão do fluxo continua sendo uma próxima etapa.

## Alterações

- Favicon SVG e ICO copiados do projeto LOGO, sem redesenho.
- Foto da landing substituída por desenho técnico em SVG. A imagem do acesso foi preservada.
- Etiquetas em cápsulas, pontos decorativos, números de apresentação e travessões nas listas da landing retirados. Conteúdo, links, FAQ e sete etapas clicáveis mantidos.
- Controles de conta, tema, aparência, saída e troca de empresa reunidos na lateral, com ícones e rótulos. Em telas pequenas, um botão abre o menu lateral; foco, Escape e Tab continuam disponíveis.
- Ícones de texto do resumo de compras substituídos por SVG. Contagens usam valores sem zeros de preenchimento.
- Mapa de acompanhamento devolvido à visão geral do comprador. O commit local `6cbc567` usava o painel com esse componente; a cópia recebida havia passado a usar `buyer-overview-page.js`, que o omitia. A seção reutiliza `mountIndustrialRail` e `getIndustrialJourney`, com os dados da empresa, links aos registros, leitura em tabela e recuperação de erro. Empresas sem registros não recebem um mapa fictício.

Não houve alteração em domínio, repositórios, serviços, autenticação, regras Firebase ou dados remotos. A comparação SHA-256 com o backup confirmou o escopo dos arquivos existentes. Nenhum arquivo original foi removido.

Backup anterior: `C:\Users\Kauan\Desktop\sivi-backup-design-20260930.zip`, contendo `src`, `index.html` e as regras.

## Referências

[Usabilidade de ícones, NN/G](https://www.nngroup.com/articles/icon-usability/) orientou a combinação de ícones e nomes claros. [Conceitos do Linear](https://linear.app/docs/conceptual-model) serviu de referência para navegação lateral em um produto operacional. [Catálogo do Impeccable](https://impeccable.style/slop/) ajudou a avaliar decoração sem propósito; esses padrões são critérios de crítica, não uma prova de que uma tela foi gerada por IA.

## Verificação

Resultado final: 158 testes unitários aprovados e 81 testes de navegador aprovados, executados em dois grupos (56 e 25). A conferência visual do painel não encontrou transbordamento horizontal nas oito combinações de largura e tema, nem erro JavaScript.

Testes unitários: `npm run test:unit`.

Testes das superfícies afetadas: `npx playwright test tests/e2e/app-shell.spec.js tests/e2e/design-refinement.spec.js tests/e2e/industrial-rail.spec.js tests/e2e/public-experience.spec.js tests/e2e/public-page.spec.js tests/e2e/appearance.spec.js tests/e2e/app-flow.spec.js tests/e2e/product-refinement.spec.js tests/e2e/dashboards.spec.js`.

No Windows desta máquina, foi necessário definir `SIVI_JAVA_HOME=C:\Program Files\Android\Android Studio\jbr` apenas para o processo de teste. A configuração global de Java não mudou.

As fixtures antigas de dashboard continuam usando o contrato de cenário histórico. A fixture autenticada agora fornece registros editáveis ao painel atual do comprador; o teste de preferências no celular abre a lateral antes de acessar a conta. Isso corrige a preparação dos testes, sem alterar a persistência do produto.

Capturas: `exports/design-2026-09-30`. As imagens do painel usam dados de teste identificados como demonstração. `verificacao-visual.json` registra a verificação de largura nos dois temas em 320, 390, 768 e 1440 px, sem transbordamento ou erro JavaScript.
