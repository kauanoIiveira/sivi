# Evolução funcional e continuidade — 27/09/2026

Esta entrega atende à revisão ampla solicitada para o TCC, começando por funções úteis na jornada já existente. O sistema permanece HTML/CSS/JavaScript com Firebase, sem build. Não houve envio de alterações ao GitHub nem implantação remota.

## Funções aplicadas

| Necessidade | Comportamento entregue |
|---|---|
| Repetir uma compra sem preencher tudo novamente | **Reutilizar como nova demanda** copia apenas a especificação editável. A revisão abre antes da gravação, gera outro rascunho e não reutiliza IDs, proprietário, propostas ou histórico. Um prazo vencido precisa ser substituído. |
| Encontrar negociações | Busca por referência, empresa, material e título, sem exigir acentos; filtros por situação e ordenação por atualização, título, data desejada ou valor. |
| Encontrar pedidos | Busca, filtros de execução e ordenação. Preferências ficam separadas por conta, empresa, atuação e seção, durante a sessão da aba. Links para registros individuais continuam funcionando independentemente dos filtros. |
| Trabalhar com os dados fora da tela | **Exportar pedidos em CSV** usa a lista filtrada, preserva caracteres portugueses e protege células contra execução de fórmulas. Cada item ocupa uma linha; totais do pedido aparecem apenas na primeira, evitando somas duplicadas. |
| Conferir ou imprimir um pedido | **Imprimir resumo** reúne empresas, referência, itens, condições aceitas, inspeções, expedição, recebimento e avaliação. Pode ser salvo como PDF pelo navegador. Não modifica o pedido e não representa uma nota fiscal. |
| Perceber datas próximas | Próximas ações priorizam propostas que vencem em até três dias e pedidos próximos da data desejada pelo comprador. Essa data é identificada como solicitação, sem inventar promessa de entrega ou multa por atraso. |
| Não perder negociações vencidas | Propostas vencidas oferecem acesso à conferência; o aviso não permite aceitar uma versão expirada. Pedidos concluídos não recebem lembretes de prazo. |
| Ver o acordo correto | O comparador usa a versão congelada do fornecedor escolhido quando já existe pedido, mesmo que outra versão apareça depois na proposta. |

Filtrar não descarta formulários. Uma avaliação ou proposta em preenchimento precisa ser concluída ou cancelada antes de ocultar o registro. A busca e a ordenação reaproveitam os elementos da lista, preservando os detalhes abertos.

## Consistência corrigida

- A publicação inclui a versão de origem do rascunho. A nova regra local rejeita o PATCH inteiro quando outra sessão editou ou publicou nesse intervalo; evita demanda pública e oportunidades parcialmente atualizadas nesse caso.
- A transação de edição incrementa uma revisão numérica independente do horário do servidor. Edição e publicação verificam essa revisão mesmo quando dois salvamentos ocorrem no mesmo milissegundo. O marcador de horário do Firebase permanece intacto.
- Demandas publicadas por esta versão guardam, na cópia privada do comprador, os IDs das empresas que receberam a oportunidade. O aceite encerra essas oportunidades no mesmo PATCH do pedido. A lista de destinatários não é enviada às projeções dos fornecedores.
- Em registros antigos sem essa lista, o fechamento alcança os fornecedores conhecidos pelas propostas. Os demais registros antigos ainda exigem reconciliação.

**As regras novas foram verificadas nos emuladores e não foram publicadas no Firebase remoto.** A proteção da publicação depende da atualização coordenada dessas regras. Por compatibilidade, clientes antigos sem o marcador continuam aceitos; isso não constitui proteção universal contra clientes arbitrários.

## Página pública

Layout editorial industrial com fotografia existente, tipografia Archivo, superfícies planas, divisores discretos e laranja reservado às ações. Entrada comercial, explicação do processo, papéis de comprador/fornecedor, cadastro e FAQ têm hierarquia própria.

O fluxo público permite selecionar sete etapas e entender quem faz o quê e o que fica registrado. Botões mantêm foco por teclado e anunciam a etapa escolhida. Nenhuma métrica, depoimento, certificação ou cliente fictício foi adicionado. A descrição da expedição reflete o que existe: registro da saída e da data, sem prometer integração com transportadoras.

As [referências profissionais consultadas](reviews/2026-09-27-referencias-publicas.md) orientaram organização e clareza. Os conceitos de `minimalist-ui` e `anti-ui-slop` foram adaptados à identidade industrial existente, mantendo temas, contraste, texto ampliado e redução de movimento.

## Brainstorming consolidado para continuidade

As ideias foram comparadas por utilidade, dependência dos dados e possibilidade de validar uma jornada inteira. As linhas pendentes abaixo são planejamento, não recursos oferecidos pela aplicação.

| Área | Aplicado ou preservado nesta base | Próxima evolução justificável |
|---|---|---|
| Entrada | Cadastro guiado, revisão, aprovação, motivo e reenvio | Explicar documentação exigida conforme tipo de organização |
| Multiempresa | Papéis e contexto explícitos, preferências separadas | Convites com expiração e gestão de membros autorizada |
| Demandas | Vários itens, recuperação de preenchimento, edição, cópia | Modelos salvos e anexos técnicos versionados |
| Especificação | Material, processo, quantidade, unidade e certificações | Requisitos dimensionais mensuráveis e revisão do desenho |
| Match | Critérios explicados, ausência de informação pede conferência | Região estruturada por UF/cidade e unidades de capacidade por processo |
| Busca | Demandas, propostas e pedidos filtráveis | Paginação e consultas indexadas quando o volume justificar |
| Propostas | Comparador, histórico, validade e versão aceita identificada | Preço, prazo e atendimento parcial por item |
| Decisão | Condições preservadas no pedido | Comando de aceite autoritativo e idempotente no backend |
| Concorrência | Edição transacional, revisão independente do relógio e precondição de publicação | Comando autoritativo e controle de versão integral |
| Oportunidades | Novos destinatários encerrados no aceite | Migração/reconciliação dos destinatários legados |
| Qualidade | Aprovação por item, bloqueio e reinspeção | Histórico imutável nas regras, critérios e evidências anexas |
| Execução | Situação, inspeção, liberação e expedição | Atendimento por estoque/produção somente com modelo de dados e permissões próprios |
| Logística | Saída e confirmação de recebimento | Dados de expedição, transportadora e rastreio validados |
| Encerramento | Recebimento e avaliação | Tratamento explícito de divergência no recebimento e reabertura autorizada |
| Rastreabilidade | Referências e histórico de proposta/inspeção | Lotes, vínculo por quantidade e QR com acesso controlado |
| Pendências | Próximas ações e avisos de datas | Notificações persistidas com leitura, contexto e preferências |
| Exportação | CSV filtrado e resumo imprimível | Exportação assíncrona e limites para grandes conjuntos |
| Acessibilidade | Teclado, foco, feedback, temas e texto ampliado | Auditoria com leitor de tela em sessões reais de uso |
| Resiliência | Formulários protegidos, retry e gravação confirmada diferenciada de leitura falha | Repetição segura de escritas de resultado desconhecido |
| Apresentação | Landing fiel às funções e jornada completa em emuladores | Roteiro de defesa com contas locais, demonstração e avaliação manual |
| Continuidade | Pasta portátil, ZIP, histórico atual e hashes | Commit revisado pelo responsável e publicação coordenada |

## Validação

Verificação final aprovada: **155 testes unitários e 124 testes de navegador/emuladores**, sem falhas ou testes ignorados. A jornada persistida chega à avaliação e confirma os registros após recarregar. Foram geradas **90 capturas e 180 verificações de largura em 22 telas/estados**, nos dois temas, sem transbordamento horizontal da página. A landing também passou por 320px e texto ampliado a 200%. `git diff --check` não encontrou erros.

O ciclo de testes identificou e corrigiu a conversão indevida do marcador de horário do Firebase; agora a revisão numérica é independente do horário. Também foram atualizados seletores de testes para a lista filtrável, mantendo a verificação da referência e do título de cada pedido.

Consulte o [guia de transferência e limpeza](33-transferencia-e-limpeza.md) e `docs/reviews/2026-09-27-evolucao-final.json` para comandos e evidências. Os documentos 30 e 31 mantêm os resultados históricos, anteriores a esta entrega.

## Limites que permanecem

O bloco 1B do documento 28 ficou parcialmente atendido. Ainda faltam aceite/criação autoritativos, idempotência para resposta de escrita desconhecida, conciliação de cópias preexistentes e validação completa das transições operacionais nas regras. Propostas por item, anexos, produção, estoque, lotes e QR continuam fora da entrega. A análise manual do responsável e a defesa do TCC devem distinguir esses itens do fluxo já implementado.
