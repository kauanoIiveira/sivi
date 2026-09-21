# Limpeza e revisão da interface

16/09/2026. Esta entrega prepara o sistema existente para a criação das próximas páginas do TCC do SENAI. O ponto de entrada permanece `index.html`, com autenticação e persistência Firebase.

## Limpeza do diretório

Removi 12 arquivos obsoletos:

- `demo.html`, `src/pages/operations/demo-entry.js` e `src/pages/operations/demo-shell.css`: entrada e apresentação da demonstração antiga.
- `tests/marketplace-visual-browser.mjs`: captura exclusiva daquela demonstração.
- `.superpowers/sdd/2026-08-28-sivi-frontend-foundation/task-11-report.md` e `task-12-report.md`: relatórios antigos da fundação.
- `docs/17-entrega-paginas.md` e `docs/18-jornada-comercial-visual.md`: entregas da demonstração substituída pelo sistema com empresas dinâmicas.
- Os quatro planos e especificações em `docs/superpowers/`, das etapas de 28/08 e 08/09: descreviam a fundação e a jornada visual anteriores.

Transferi seis módulos de simulação para `tests/fixtures/`: cenário, empresas, transições, seletores, invariantes e repositório em memória. Os testes ainda precisam dessas massas; o código de produção deixou de importá-las. Removi a opção `demoWorkspaces` da inicialização e os blocos de exemplo fixos das operações.

Preservei os requisitos do TCC, os planos funcionais ainda úteis, o histórico Git, a configuração Firebase, os recursos usados pela interface e a licença da biblioteca distribuída com o projeto. Os documentos de retomada agora apontam para o estado atual.

A revisão automática de aprovação bloqueou os comandos de remoção das pastas vazias `.superpowers/`, `docs/superpowers/` e `src/data/`, sem apresentar justificativa além de “blocked by policy”. Elas permanecem no disco sem código ativo. Os logs locais de verificação permanecem ignorados pelo Git.

## Interface

Adotei navegação grafite, superfícies em cinza aço, ações em laranja e tipografia Archivo com IBM Plex Mono nos dados técnicos. Os temas claro e escuro compartilham componentes e mantêm a preferência do usuário.

- Cabeçalhos menores, indicadores compactos e tabelas com mais espaço útil para os registros.
- Ícones coerentes, empresa ativa visível e menu recolhível no celular.
- Trilho industrial horizontal, com navegação por teclado, estados textuais e alternativa em tabela.
- Formulários, administração e perfil industrial com a mesma hierarquia visual.
- Estados vazios com orientação conforme o papel da empresa. Ausência de histórico aparece como “Sem histórico”.
- Remoção do botão de notificações sem serviço conectado e dos avisos de identidade provisória na interface.

O [Design System](../design-system/MASTER.md) registra cores, tipografia, componentes e critérios para as próximas páginas. A direção industrial solicitada prevalece sobre o minimalismo das referências.

## Correções funcionais

1. Uma empresa sem demandas podia causar erro no cálculo do trilho. O seletor agora trata a ausência de demanda antes de acessar seu identificador.
2. Uma atualização idêntica da lista de empresas remontava o formulário durante o cadastro. A store agora publica apenas quando o estado muda.
3. A aprovação administrativa falhava ao ler o vínculo do responsável e ao validar uma atualização atômica. As regras permitem a leitura específica ao administrador e validam o status contra o novo estado da mesma operação. Os testes cobrem a recusa de leitura por terceiros e de autoaprovação pelo proprietário.
4. O painel deixou de apresentar qualidade zero e planejamento de produção inferido sem registros. Exibe compromissos, quantidades liberadas e reinspeção com base nos pedidos.
5. Propostas sem decisão aparecem como “Aguardando decisão”.

## Verificação

O comando `npm test`, com Edge e os emuladores locais do Firebase, verifica as unidades e os fluxos de navegador. A captura opcional percorre acesso, empresas, administração, perfil industrial, painéis, demandas, propostas e pedidos nos dois temas e em 360, 390, 768 e 1440px.

Resultados desta revisão:

- 74 testes unitários e 61 testes de navegador aprovados.
- Fluxo operacional complementar aprovado: demanda, proposta, pedido, inspeção, reinspeção, expedição, recebimento e avaliação.
- 88 verificações de largura sem transbordamento horizontal da página e 40 capturas em 390 e 1440px. Tabelas comparativas e trilho mantêm rolagem interna.
- Jornada Firebase capturada sem exceções JavaScript não tratadas.

As capturas usam contas e registros criados pelos testes nos emuladores. Não são dados de clientes nem uma nova página demo. As evidências visuais ficam fora do repositório e podem ser recriadas com `SIVI_CAPTURE_UI`; consulte `COMO_ABRIR.md`.

Consulte [COMO_ABRIR.md](../COMO_ABRIR.md) para reproduzir. Nenhum dado remoto foi alterado e esta revisão não publicou as regras no projeto remoto `sivi-org`.

## Próximas entregas

Propostas por item, atendimento por estoque/produção, lotes, QR, anexos, auditoria, convites e notificações permanecem pendentes. As inspeções atuais pertencem ao pedido. A marca gráfica e a raposa continuam sem arte final aprovada.

O sistema deve continuar como intermediador B2B industrial. Use a interface revisada como base das próximas telas e conecte cada ação à persistência e às permissões correspondentes.
