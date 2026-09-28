# Revisão e evolução do SIVI — 26/09/2026

O projeto já possui uma jornada persistida de cadastro, aprovação, demanda, proposta, pedido, inspeção e recebimento. Esta revisão priorizou a qualidade da demanda, que alimenta todas as etapas seguintes. A primeira entrega foi aplicada no sistema existente, em HTML, CSS e JavaScript com Firebase.

## Achados da revisão

| Prioridade | Evidência no sistema | Impacto e encaminhamento |
|---|---|---|
| Alta — corrigida | O formulário de demanda enviava vários campos chamados `description` e usava `Object.fromEntries(new FormData(...))`. | O último item sobrescrevia o objetivo geral. O formulário agora coleta os campos gerais separadamente dos itens. Um teste no navegador reproduziu a perda antes da correção. |
| Alta — implementada | O comprador conseguia salvar e publicar, mas não editar o rascunho. | Agora pode revisar objetivo, título, destino, prazo e itens, salvar ou cancelar a edição. |
| Alta — próxima etapa | As validações dos pedidos em `database.rules.json` preservam o identificador da versão, mas não comparam todo o conteúdo comercial. A publicação lê e depois grava a demanda. | Revisar a imutabilidade das condições e as gravações simultâneas antes de ampliar a negociação. A leitura do código identificou esses limites; esta entrega não executou uma auditoria de segurança nem alterou regras remotas. |
| Alta — evolução comercial | `sendProposal` recebe somente `totalCents` para os itens. | A demanda pode ter vários itens, mas a comparação não informa o preço de cada um. Implementar detalhamento por item depois de fechar as garantias de persistência. |
| Média — evolução industrial | `recordInspection` utiliza uma quantidade agregada do pedido. | A inspeção não identifica qual requisito ou item foi aprovado. O próximo avanço industrial deve vincular resultados a itens e requisitos, preservando unidades de medida. |
| Média — organização operacional | Demandas têm busca e situação; propostas e pedidos ainda dependem da lista e dos links dos painéis. | Acrescentar filtros por situação, empresa e prazo quando o volume de registros justificar. |

## Brainstorming e ordem sugerida

1. **Revisão de rascunhos — entregue.** Corrigir a demanda antes de distribuí-la aos fornecedores. Evita recriação e perda de contexto.
2. **Consistência da negociação.** Garantir no banco que condições aceitas não mudem e que publicação/aceite concorrentes preservem a versão correta. Cobrir alterações diretas e duas sessões simultâneas com emuladores.
3. **Propostas por item.** Preço unitário, subtotal por item e frete separado; total calculado em centavos; revisão das condições antes do aceite. Manter a leitura de propostas antigas e preservar a composição aceita no pedido. O primeiro recorte deve exigir resposta a todos os itens; atendimento parcial exige decisões comerciais adicionais.
4. **Inspeção por requisito.** Relacionar pedido, item, requisito acordado, resultado, evidência e reinspeção. Evitar somar, como se fossem equivalentes, quantidades de peças, metros e quilogramas.
5. **Lote e rastreabilidade.** Identificar a origem e a inspeção de cada lote; liberar QR apenas com dados autorizados e depois da aprovação. Depende do vínculo entre item e inspeção.
6. **Anexos e colaboração.** Desenhos e laudos com acesso por empresa, seguidos de convites e gestão de membros. Exigem armazenamento protegido e regras de autorização próprias.

As alternativas iniciais eram refinar a apresentação, ampliar o comercial ou melhorar a preparação da demanda. A terceira foi escolhida porque havia perda de informação demonstrável no fluxo atual e a correção cria uma base melhor para propostas detalhadas. A página pública e a identidade industrial continuam como referência visual.

## Entrega aplicada

- Em **Minhas demandas**, rascunhos têm a opção **Editar rascunho**.
- **Salvar alterações** mantém o registro, a autoria e a data de criação; recalcula a quantidade e preserva os identificadores dos itens mantidos. Novos itens recebem identificadores sem colisão.
- **Cancelar edição** restaura o último conteúdo salvo. Falhas de gravação deixam o preenchimento na tela para nova tentativa.
- A edição usa uma transação no Firebase e compara `updatedAt` com a versão aberta. Se o registro já mudou ou deixou de ser rascunho, a operação é recusada.
- A publicação fica desabilitada enquanto o editor está aberto. A confirmação informa que publica a última versão salva. Fechar o painel não salva alterações.
- O último item não pode ser removido. Adicionar e remover itens mantém o foco em um campo útil para navegação por teclado.

Os arquivos principais são `src/pages/operations/workflow-view.js`, `src/repositories/firebase-marketplace-repository.js` e `src/services/firebase-data-client.js`. A aplicação usa as regras existentes; nenhum dado de teste foi criado no Firebase remoto. Não houve publicação do código nem alteração de regras remotas nesta revisão.

## Skills consultadas

A busca com **find-skills** verificou o diretório e a origem das opções. A [webapp-testing, da Anthropic](https://skills.sh/anthropics/skills/webapp-testing), é adequada para reproduzir o preenchimento, verificar o resultado persistido e inspecionar as telas. Já estava instalada, por isso foi reutilizada com a infraestrutura Playwright existente do projeto. Na consulta, o diretório indicava aproximadamente 164 mil instalações e 178 mil estrelas para o repositório de origem; esses números variam.

Para instalação em outra máquina, a opção verificada é:

```powershell
npx skills add https://github.com/anthropics/skills --skill webapp-testing
```

Também foram usados os procedimentos locais de brainstorming, diagnóstico, desenvolvimento orientado a testes e verificação antes da conclusão. Nenhuma skill adicional foi instalada nesta sessão.

## Verificação

- Base anterior: 83 testes unitários passaram.
- Suíte completa após a implementação: 87 testes unitários e 69 testes de navegador passaram.
- Regressão reproduzida no navegador: o objetivo geral era substituído pelo texto do último item.
- Novos testes cobrem edição, identificadores, conteúdo inválido, conflito de versão, publicação concorrente detectada durante a gravação e preservação dos campos após falha.
- Jornada com Auth e Database Emulator: edição, recarregamento, cancelamento, publicação, leitura pelo fornecedor e geração de pedido.
- Capturas da tela de edição nos temas claro/escuro; verificações de largura em 360, 390, 768 e 1440px, sem transbordamento horizontal.

Para repetir a verificação, use `npm test` com o JDK configurado conforme `COMO_ABRIR.md`. A captura opcional é ativada por `SIVI_CAPTURE_UI` ao executar `tests/e2e/firebase-marketplace.spec.js`.

## Limites desta entrega

A transação protege a gravação feita por **Editar rascunho** contra uma versão já alterada ou publicada. A publicação e o aceite ainda usam o fluxo anterior de leitura e atualização em vários caminhos; a consistência completa dessas operações simultâneas permanece na próxima etapa. Uma falha de conexão preserva o formulário enquanto a página está aberta, mas não há recuperação automática após fechar ou recarregar a aba.

Propostas por item, novas inspeções, lotes, QR e anexos são propostas de continuidade, não funcionalidades entregues nesta revisão.
