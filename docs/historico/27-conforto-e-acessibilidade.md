# Conforto de uso e acessibilidade

Revisão de 26/09/2026. Esta entrega continua a revisão de rascunhos descrita em [26 — Revisão e evolução](26-revisao-e-evolucao.md).

## Critérios de design

O SIVI é uma ferramenta de compras e fornecimento industrial. O trabalho diário envolve ler especificações, preencher itens e comparar registros. A direção mantém Archivo, IBM Plex Mono, navegação grafite e laranja nas ações principais.

O pedido de uma interface com menos aparência de geração automática foi convertido em critérios verificáveis:

- Agrupar informações da mesma tarefa. O formulário separa necessidade, entrega e itens usando títulos e espaço, sem uma caixa decorativa para cada campo.
- Dar destaque à ação principal. Adicionar e remover itens são ações secundárias; salvar encerra o preenchimento.
- Mostrar indicadores quando há registros. Uma empresa sem demandas vê a orientação para começar, sem três números zerados ocupando o topo.
- Manter controles familiares. Preferências usam seletores nativos e uma janela com fechamento visível, Escape e retorno do foco.
- Usar movimento para mudança de estado. A opção de redução alcança CSS, navegação entre páginas e transições de acesso.
- Escrever instruções relacionadas à tarefa. Foram encurtados os textos de acesso que falavam de uma “jornada” sem explicar a ação.

Esses critérios orientam a qualidade do produto; não são um detector da origem de uma interface. Nenhuma nova identidade, fonte, ilustração ou biblioteca visual foi introduzida.

## Pesquisa utilizada

- [NN/g — AI Prototyping in Real Design Contexts](https://www.nngroup.com/articles/ai-prototyping/): a avaliação descreve resultados genéricos e problemas de hierarquia e agrupamento mesmo quando o protótipo parece convincente à primeira vista. Aplicação no SIVI: avaliar tarefas completas, proximidade entre informações e estados, além da primeira tela.
- [Anthropic — Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills): recomenda dar contexto e restrições de design para reduzir padrões visuais repetidos. Aplicação: seguir a identidade já escolhida e registrar regras específicas do SIVI.
- [IBM Carbon — Forms](https://carbondesignsystem.com/patterns/forms-pattern/): referência de agrupamento, rótulos e sequência de preenchimento. Aplicação: campos gerais separados dos itens e rótulos persistentes.
- [W3C — Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) e [Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html): referências para ampliação de texto e opção de reduzir movimento. Os testes desta entrega não constituem certificação de conformidade WCAG.

As skills **stop-slop**, **anti-ui-slop** (playbook Operate) e **ui-ux-pro-max** foram consultadas. O diretório instalado de ui-ux-pro-max não continha o script de busca descrito no guia; foram aplicadas suas orientações de leitura, foco, alvos e movimento à estrutura HTML/CSS/JS existente. Nenhuma ferramenta de referência visual não disponível foi simulada.

## Funcionalidades

**Aparência e acessibilidade** fica no menu **Conta**, no rodapé público e abaixo da tela de acesso. As mudanças são imediatas:

| Preferência | Opções | Efeito |
|---|---|---|
| Tema | Sistema, claro, escuro | O modo Sistema acompanha mudanças do dispositivo. O atalho de tema continua disponível. |
| Tamanho do texto | Padrão, maior | Texto maior usa 125%; tamanhos tipográficos em rem preservam as proporções. |
| Contraste | Padrão, reforçado | Reforça textos secundários e contornos sem alterar o significado dos estados. |
| Movimento | Sistema, reduzir | A preferência do dispositivo por redução é sempre respeitada. |
| Espaçamento | Confortável, compacto | Ajusta registros e tabelas operacionais, mantendo controles com altura mínima de 44px. |

As preferências ficam neste navegador, não na conta. Se o armazenamento estiver bloqueado, continuam válidas em memória e o painel avisa que não foram salvas. **Restaurar padrão** remove as escolhas explícitas de aparência e tema. O tema mantém a chave anterior `sivi.theme.v1`; as demais opções usam `sivi.appearance.v1`. As opções são aplicadas antes da primeira pintura da página.

A busca e a situação das demandas são lembradas durante a sessão da aba, separadas por usuário, empresa e atuação. Voltar à lista restaura a consulta; um link direto continua abrindo o registro solicitado mesmo que ele não corresponda ao filtro lembrado. **Limpar filtros** também limpa a escolha lembrada.

O formulário mantém os comportamentos da revisão anterior: edição persistida, cancelamento, preservação dos campos em caso de erro, adição/remoção de itens e validação de conflito ao salvar. O cabeçalho de acesso no celular agora cresce com o conteúdo, evitando sobreposição quando o texto é ampliado.

## Verificação

A suíte completa passou com **91 testes unitários e 74 testes de navegador**. A jornada capturada registrou 188 verificações de largura sem transbordamento horizontal. As telas de preferências e o formulário foram inspecionados nos temas claro e escuro, incluindo 360, 390, 768 e 1440px; o acesso também foi verificado com texto a 200%.

Os testes novos cobrem persistência e restauração de preferências, acompanhamento do sistema, armazenamento indisponível, teclado, retorno do foco, ampliação real do texto, filtros isolados por contexto e abertura direta de registros.

As capturas ficam em `exports/acessibilidade-2026-09-26` e `exports/ux-suave-2026-09-26`, diretórios locais ignorados pelo Git. Foram utilizados o aplicativo e os emuladores locais; as fixtures de componentes são identificadas como testes.

Para repetir:

```powershell
$env:SIVI_JAVA_HOME = 'C:/Program Files/Android/Android Studio/jbr'
npm test

# Evidência visual opcional
$env:SIVI_CAPTURE_APPEARANCE = 'exports/acessibilidade'
npx playwright test tests/e2e/appearance.spec.js
$env:SIVI_CAPTURE_UI = 'exports/operacao'
npx playwright test tests/e2e/firebase-marketplace.spec.js
```

O próximo recorte funcional segue sendo a consistência de publicação e aceite, antes de propostas por item e inspeção por requisito. Na interface, a próxima validação deve incluir uso real com leitor de tela e tarefas acompanhadas com compradores e fornecedores. Formulários ainda não recuperam conteúdo não salvo após fechar ou recarregar a aba.
