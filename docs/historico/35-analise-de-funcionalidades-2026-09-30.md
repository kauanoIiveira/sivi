# Análise de funcionalidades por página — 30/09/2026

Diretório analisado: `C:\Users\Kauan\Desktop\sivi`.

Este documento responde ao pedido de avaliar o que cabe nas páginas sem ampliar suas finalidades ou acumular elementos decorativos. É uma análise do código local, não uma implementação das recomendações. A revisão do fluxo permanece uma próxima fase. Os ajustes de rodapé, marca, acesso, conta e preferências foram solicitados diretamente e pertencem à rodada atual.

## Critério de inclusão

Uma adição precisa resolver uma tarefa da própria página com dados e permissões existentes. A prioridade é corrigir continuidade, destino das ações e mensagens antes de introduzir mais funções. Cards, gráficos, percentuais, reputação ou atalhos novos não se justificam por preencher espaço.

As funções identificadas abaixo existem no código desta pasta. A análise não reproduziu todas no navegador, não consultou dados comerciais ou regras remotas e não representa uma certificação da jornada.

## O que já existe e o que cabe

| Página | Funções existentes | Recomendação e momento |
|---|---|---|
| Página inicial | Explicação da compra industrial, sete etapas clicáveis, papéis das empresas, FAQ, cadastro e entrada. | A marca e o acabamento visual pedidos bastam. Nenhuma função extra é necessária. Preservar o conteúdo interativo e os links. |
| Acesso | Cadastro, login, validação de campos, mostrar senha, recuperação de senha, provedores de autenticação e retorno das ações. | Preservar os controles ao substituir a apresentação lateral. Não acrescentar métricas, depoimentos ou demonstrações fictícias. |
| Minha conta | Identificação da pessoa e da origem da sessão, saída e acesso às preferências no menu anterior. | Edição de nome e opções próprias da conta são diretamente justificadas pelo pedido atual. Preferências visuais devem ficar na engrenagem. E-mail, provedores e estado de confirmação devem refletir a conta real. |
| Preferências | Tema do dispositivo/claro/escuro, tamanho do texto, contraste, movimento e espaçamento, com aplicação imediata e restauração. | Reorganizar o acesso pela engrenagem usando o diálogo existente. Informar que as escolhas são deste navegador; não apresentar como sincronização entre dispositivos. |
| Empresas e atuação | Cadastro guiado, consulta de dados e situação, atualização explícita, seleção de atuação, revisão e reenvio quando permitido. | Sem função adicional agora. Convites de equipe e gestão de membros exigem permissões e ciclo de vida próprios. |
| Visão do comprador | Resumo da empresa, demandas recentes, próximos passos, pendências, atividade, fornecedores recomendados e mapa de acompanhamento. | Próxima fase: alinhar o destino das linhas ao próximo passo anunciado. Agora, no máximo distinguir uma consulta de recomendações que falhou de ausência real de fornecedores. |
| Visão do fornecedor | Resumo, oportunidades, próximas ações, pedidos em execução, orientação para completar o perfil e mapa da jornada. | Preservar o acompanhamento. Estoque e produção não são funções disponíveis na operação real desta base e não devem ganhar painéis antes do modelo correspondente. |
| Demandas e oportunidades | Demanda com vários itens, rascunho, edição, publicação, cópia revisável, recuperação na mesma aba, requisitos, busca, filtros e links para registros. | Preservar. Anexos técnicos podem servir à especificação, mas precisam de armazenamento autorizado e versionamento; ficam para outra entrega. |
| Propostas | Preparação e revisão, versões, validade, histórico, comparador, condições e aceite que origina pedido. | A próxima evolução é proposta por item e consistência do aceite, não mais indicadores. Alterações comerciais dependem do domínio, persistência e concorrência. |
| Pedidos | Condições aceitas, inspeção por item, bloqueio, reinspeção, liberação, expedição, recebimento, avaliação, busca, filtros, CSV e resumo imprimível. | Preservar. Divergência no recebimento, dados de transportadora, lotes e QR precisam de decisões e contratos próprios. |
| Fornecedores | Busca, filtros, critérios de compatibilidade, perfil detalhado e convite para demanda publicada, com conferência de convites anteriores. | Não acrescentar favoritos ou reputação sem necessidade e dados verificáveis. Um anúncio acessível da contagem filtrada cabe sem mudar o layout. |
| Perfil industrial | Materiais, processos, categorias, certificações, região, capacidade, prazo, descrição, edição, feedback e aviso de alterações não salvas. | Nenhuma função extra agora. Região estruturada e capacidade por processo/unidade são próximas mudanças de dados, não campos decorativos. |
| Avaliações | Pedidos entregues aguardando avaliação, quatro critérios, comentário, histórico, busca, filtros, detalhes e paginação. | Prioridade de fluxo: proteger o preenchimento ao trocar de pedido ou sair e tratar gravação confirmada separadamente de falha ao atualizar a tela. |
| Administração | Cadastro, aprovação, correção, recusa, bloqueio, motivo, conferência de versão e atualização de solicitações. | Busca por empresa e filtro de situação cabem quando o volume justificar. Não são necessários para a revisão visual atual. |

## Prioridades para a próxima fase de fluxo

### Avaliações: preservar o preenchimento

Em `src/pages/buyer/reviews-page.js`, selecionar outro pedido recria a página e o formulário. As notas e o comentário em preenchimento não são guardados. Esse formulário também não marca `data-dirty` ou `aria-busy`; a proteção de `src/core/unsaved-changes.js` depende desses atributos.

Resultado desejado: trocar de pedido, empresa ou página não perder o preenchimento sem uma decisão explícita da pessoa. Durante envio, a navegação e os controles concorrentes precisam respeitar a operação em andamento. Isso deve reutilizar as proteções existentes, sem criar um novo painel.

### Avaliações: diferenciar salvar de atualizar

A página grava a avaliação e depois consulta os registros. Uma falha na consulta retorna ao mesmo tratamento de erro e reabilita o envio, embora a gravação possa ter sido concluída.

Resultado desejado: mostrar que a avaliação foi salva quando a escrita foi confirmada, manter a ação de envio concluída e oferecer atualização da leitura. A escrita de resultado desconhecido é um caso diferente e depende da consistência tratada nos documentos 28 e 32.

### Visão do comprador: destino coerente com a ação

As linhas de demandas recentes usam o link da demanda, mesmo quando o texto de próximo passo é “Comparar propostas” ou “Acompanhar pedido”.

Resultado desejado: quem segue um próximo passo chega à negociação ou ao pedido correspondente, com o registro já selecionado. Revisar e publicar continua abrindo a demanda. Não é necessário acrescentar atalhos duplicados.

### Consistência comercial antes de ampliar o produto

Os [próximos passos](28-proximos-passos.md) e a [evolução funcional](32-evolucao-e-continuidade.md) já documentam aceite autoritativo, idempotência, reconciliação de registros e validação das transições. São dependências de futuras funções comerciais. Esta análise não confirma publicação das regras ou integridade do ambiente remoto.

## No máximo dois ajustes pequenos que cabem agora

Estas opções são recomendações, não recursos implementados por este documento.

| Ajuste | Problema concreto | Limite |
|---|---|---|
| Diferenciar falha na consulta de fornecedores recomendados | `buyer-overview-page.js` ignora a exceção e mantém uma lista vazia; o painel pode mostrar zero compatíveis quando a consulta não ocorreu. | Mostrar indisponibilidade temporária no bloco existente, mantendo o restante da visão geral. Não adicionar notificações globais ou novo sistema de recomendações. |
| Anunciar resultados e feedback às tecnologias assistivas | Contagens de fornecedores e mensagens de avaliações não têm o mesmo anúncio de estado já usado nas listas operacionais. | Reutilizar elementos existentes para mensagens e contagens, com anúncio discreto. Sem alterar dados, aparência ou regras do fluxo. |

A conta editável e a engrenagem já são as adições mais justificadas nesta rodada, porque atendem instruções diretas. Não é preciso implementar as opções acima para completar a revisão visual.

## O que fica fora desta rodada

Chat, assistente de IA, novos gráficos, números de marketing, pagamentos, ERP, estoque geral, produção, lotes, QR, notificações externas e reputação sem histórico verificável não resolvem as lacunas observadas nesta revisão. As extensões industriais válidas continuam nos documentos de continuidade; sua existência no roadmap não é uma instrução para implementá-las agora.

## Fontes locais da análise

- `src/app/routes.js`: páginas e finalidades de acesso.
- `src/pages/public/public-page.js`: conteúdo e controles públicos.
- `src/pages/auth/auth-page.js` e `src/services/auth-service.js`: acesso e ações da conta.
- `src/layouts/app-shell/app-shell.js` e `src/theme/preferences-dialog.js`: menu e preferências anteriores à reorganização desta rodada.
- `src/pages/dashboard/buyer-overview-page.js`, `buyer-journey.js`, `dashboard-view.js` e `admin-dashboard-page.js`: resumos, próximos passos e acompanhamento.
- `src/pages/operations/workflow-view.js` e `record-collection.js`: operações e controles já disponíveis.
- `src/pages/buyer/suppliers-page.js` e `reviews-page.js`: fornecedores e avaliações.
- `src/pages/supplier/profile-page.js`: perfil industrial e proteção do preenchimento.
- `src/pages/context/context-page.js`: empresas e atuação.
- `src/core/unsaved-changes.js`: proteção global de formulários.
- Documentos [27](27-conforto-e-acessibilidade.md), [28](28-proximos-passos.md), [32](32-evolucao-e-continuidade.md) e [34](34-revisao-visual-2026-09-30.md): entregas, limitações e escopo visual vigente.

Somente este documento foi escrito para registrar a análise. Nenhuma recomendação de fluxo acima foi aplicada ao produto por esta análise.
