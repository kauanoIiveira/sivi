# Jornada e próximas ações — 18/09/2026

## Entrega implementada

Primeiro bloco da sequência discutida: orientar cada papel e conectar os registros existentes. Manter HTML/CSS/JS, Firebase, isolamento entre empresas, temas claro e escuro e o design industrial de `design-system/MASTER.md`.

Comprador: empresa → demanda → comparação → pedido → recebimento → avaliação.
Fornecedor: empresa e perfil → oportunidade → proposta → pedido → inspeção → expedição.
Administrador: empresas pendentes → aprovação ou bloqueio com motivo.

## Plano

- [x] Calcular ações pendentes a partir dos dados já autorizados da empresa. Priorizar recebimento, qualidade e expedição; depois decisões comerciais e rascunhos. Não apresentar propostas vencidas como prontas para aceite nem sugerir ações encerradas.
- [x] Apresentar “Próximas ações” nos painéis, com assunto, motivo e link para o registro. Mostrar estado vazio sem inventar trabalho pendente.
- [x] Conectar demanda, propostas e pedido por links que conservem o identificador do registro. Ao abrir, filtrar o registro autorizado e permitir voltar à lista completa. Identificador inexistente ou indisponível deve produzir mensagem recuperável, sem buscar dados de outra empresa.
- [x] Trocar o jargão “Contextos” por “Empresas e atuação” na navegação e explicar a escolha entre comprar e fornecer.
- [x] Verificar seletores com testes unitários e navegação com vários registros, URL inválida, recarga, teclado e celular; inspecionar capturas reais em ambos os temas.

## Arquivos e responsabilidades

- `src/domain/next-actions.js`: seleção das ações e construção de links por papel, sem acesso ao banco.
- `src/domain/live-marketplace-selectors.js`: incluir ações na projeção do painel.
- `src/pages/dashboard/dashboard-view.js` e CSS: apresentação de ações e estado vazio.
- `src/pages/operations/workflow-view.js`: navegação entre registros e seleção do registro existente no resultado autorizado.
- `src/app/app-controller.js`, `src/app/routes.js`, shell e página de empresas: vocabulário de navegação.
- `tests/unit/next-actions.test.js` e testes de navegador: verificar decisões e destinos.

## Continuidade

Depois deste bloco: proposta por item; atendimento e lotes; qualidade por lote e QR; entrega e histórico. A instrução adicional foi incorporada como cadastro de empresas pelo portal administrativo. As regras foram publicadas no projeto `sivi-org` e a leitura da versão remota confirmou igualdade com o arquivo local.

## Portal administrativo

O usuário solicitou administração para `kauanbarboza2305@gmail.com` e cadastro de outras empresas pelo portal. A conta já existia com e-mail verificado. Seu UID recebeu `platformAdmins/{uid} = true`, confirmado por leitura no projeto `sivi-org`. O frontend não concede privilégios comparando o endereço de e-mail.

O administrador informa nome, atuação e e-mail do responsável. O responsável precisa ter conta verificada e ter entrado no SIVI, para registrar seu perfil. A criação grava empresa ativa e os dois vínculos do responsável numa única operação. O administrador não ganha participação comercial na empresa por cadastrá-la. O campo `createdBy` continua identificando o proprietário para compatibilidade com os registros atuais; `registeredBy` identifica o administrador que fez o cadastro.

A consulta por e-mail é permitida somente ao administrador, com filtro exato e limite de dois resultados. A listagem completa dos usuários continua negada. Os testes verificam recusa a usuários comuns, bloqueio/reativação da empresa e entrada do responsável com ambas as atuações.

Para uma pessoa ainda sem conta, o portal orienta o cadastro e a confirmação do e-mail. Nenhuma senha é criada pelo administrador e nenhum convite é enviado por esta implementação.

### Referências da pesquisa

- [Auth0: convites para organizações](https://auth0.com/docs/manage-users/organizations/configure-organizations/invite-members): separação entre identidade pessoal e participação numa organização; convite destinado a um e-mail específico. Usado como referência de fluxo, sem migrar o SIVI para Auth0.
- [Firebase: gerenciamento de usuários](https://firebase.google.com/docs/auth/admin/manage-users): operações privilegiadas de conta pertencem ao ambiente administrativo. O portal usa as regras do Realtime Database para gerenciar os vínculos, preservando o login pessoal existente.

Uma evolução possível é o convite com prazo e aceite pelo responsável. Essa etapa precisa definir revogação, entrega do convite e vinculação segura ao e-mail verificado; não é necessária para cadastrar empresas de contas já existentes.

## Validação e acesso

- 80 testes unitários e 63 testes de navegador passaram na suíte completa.
- Os três testes de cadastro administrativo, jornada Firebase e seleção de registro passaram novamente após os ajustes finais.
- Capturas dos temas claro/escuro e verificações em 360, 390, 768 e 1440px ficam fora do repositório; podem ser recriadas com `SIVI_CAPTURE_UI`, conforme `COMO_ABRIR.md`.
- Backups das regras antes e depois da publicação também estão nesse diretório; nenhum registro de empresa de teste foi criado no banco remoto.

Para usar: abra o sistema por servidor HTTP, entre com a conta administrativa, escolha **Administração SIVI** e abra **Cadastrar empresa**. Informe nome, e-mail do responsável e atuação. Se a sessão já estava aberta antes da habilitação, saia e entre novamente. O frontend continua servido pelo projeto local; esta etapa publicou somente as regras do banco, sem hospedar o site.
