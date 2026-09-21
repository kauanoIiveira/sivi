# Retomar o SIVI — 20/09/2026

O ponto de entrada é `index.html`. As próximas entregas devem continuar no sistema existente, com Firebase e dados da empresa ativa. A página pública foi aprovada após o ajuste de largura do rodapé; preservar essa direção visual.

## Ler primeiro

Consulte primeiro [Transferência e retomada](docs/25-transferencia-e-retomada.md), [Entrada e aprovação de empresas](docs/24-entrada-e-aprovacao.md) e [Jornada, próximas ações e portal administrativo](docs/23-jornada-e-proximas-acoes.md).

1. [Limpeza e revisão da UI](docs/22-limpeza-e-revisao-ui.md): alterações, diagnóstico e verificações desta revisão.
2. [Design System](design-system/MASTER.md): regras visuais atuais para todas as telas.
3. [Entrega de empresas, perfil e match](docs/21-entrega-firebase-empresas-perfil-match.md): estado funcional e configuração da administração.
4. [Plano funcional](docs/19-plano-mvp-academico-dinamico.md) e [plano técnico](docs/20-plano-de-implementacao-mvp-dinamico.md): funcionalidades restantes. A orientação atual de UI e sistema real prevalece sobre a antiga orientação de congelar o demo.

## Estado atual

- Página pública com títulos de maior escala, fundo claro, faixa de entrada, FAQ e rodapé de largura total. Referência de proporção: landing do BarberFlow, adaptada à identidade industrial. Teste do rodapé cobre 360 a 2560px nos dois temas.
- Autenticação Firebase, cadastro dinâmico de empresas e associação por papel.
- Página pública em `#/`, cadastro empresarial guiado com revisão, consulta da solicitação, correção e reenvio. Acesso gratuito nesta etapa.
- Administração pode aprovar, solicitar correção ou recusar com motivo. Cada empresa aparece em um cartão; uma única atuação comercial ativa permite entrada direta após login.
- Portal administrativo com cadastro de empresas para responsáveis com conta verificada, aprovação e bloqueio; perfil industrial de fornecedores.
- Painéis com próximas ações e links que conservam a demanda ou pedido selecionado.
- Navegação “Empresas e atuação”, com entradas para comprar, fornecer e administrar.
- Demandas com vários itens e match explicável.
- Propostas versionadas, aceite único e pedido com condições preservadas.
- Inspeção/reinspeção por pedido, liberação, expedição, recebimento e avaliação.
- Painéis calculados, navegação responsiva e preferência de tema persistida.
- Página demo excluída; simulações isoladas em `tests/fixtures/`.
- UI revisada: navegação grafite, superfície aço clara ou grafite escura, laranja nas ações, tipografia Archivo e IBM Plex Mono.

## Limites a tratar nas próximas entregas

- Propostas ainda usam valor agregado; detalhamento comercial por item permanece no plano.
- Atendimento por estoque/produção, lotes, QR, anexos e auditoria ainda não estão implementados.
- Inspeções atuais pertencem ao pedido, sem divisão operacional por lote.
- Convites e gestão de membros não possuem interface.
- Serviço de notificações pendente; a interface não oferece botão fictício.
- `kauanbarboza2305@gmail.com` está habilitada como administrador no projeto remoto, por UID em `platformAdmins`. Entrar novamente e escolher “Administração SIVI”.
- As regras foram publicadas no `sivi-org` em 18/09 e comparadas com o arquivo local. A etapa de entrada e aprovação também publicou suas regras, confirmadas por leitura remota. Não foram criadas empresas de teste no projeto remoto.
- Marca gráfica e arte final da raposa continuam pendentes. A aplicação usa o nome SIVI; não inventar outra versão do mascote.

## Arquivos centrais

- `src/app/bootstrap.js`: inicia o sistema com Firebase; não importa fixtures.
- `src/repositories/firebase-marketplace-repository.js`: persistência e comandos.
- `src/domain/live-marketplace-selectors.js`: indicadores e etapas reais.
- `src/pages/operations/workflow-view.js`: formulários comerciais e operacionais.
- `src/layouts/app-shell/`: navegação, empresa e conta.
- `src/styles/theme-tokens.css`: cores e tokens.
- `database.rules.json`: autorização e transições.
- `tests/e2e/firebase-marketplace.spec.js`: jornada persistida nos emuladores.

Consulte [COMO_ABRIR.md](COMO_ABRIR.md) para executar e verificar. O SIVI continua intermediador industrial; não ampliar o escopo para ERP, MES ou WMS.

## Próxima sessão

1. Conferir `git status`, ler este arquivo e iniciar com `npm start`.
2. Conferir a página pública e entrar com a conta adequada antes de alterar o fluxo.
3. Escolher com o responsável a próxima página ou função. Os itens pendentes acima são opções de continuidade, não uma ordem para implementar todos.
4. Preservar a entrada e aprovação de empresas, temas, isolamento de dados e navegação entre demanda, proposta e pedido.
5. O repositório de continuidade é `https://github.com/kauanoIiveira/sivi`, branch `main`. Conferir `git remote -v` antes de enviar alterações e seguir `docs/25-transferencia-e-retomada.md`.
6. Manter o histórico iniciado pela publicação completa do projeto, sem integrar commits anteriores de outros repositórios. Novos commits devem usar títulos e descrições naturais em português, com autoria de Kauan Oliveira.
