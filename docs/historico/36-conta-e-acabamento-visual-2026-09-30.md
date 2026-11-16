# Conta e acabamento visual — 30/09/2026

Projeto editado: `C:\Users\Kauan\Desktop\sivi`.

O rodapé passou a usar grafite, com a marca e os links existentes. A raposa original está na página inicial e no acesso. O acesso usa fundo plano e desenho técnico, preservando cadastro, login, validações, recuperação de senha e provedores. Os controles do sistema e do acesso usam tons neutros; as cores de situação continuam indicando sucesso, pendência e erro.

## Conta e preferências

Na lateral, a engrenagem abre Aparência e acessibilidade: tema, texto, contraste, movimento e espaçamento. Minha conta contém Editar perfil e Sair.

Editar perfil abre os dados da pessoa autenticada. O nome pode ser alterado, o e-mail é mostrado para consulta e o provedor de entrada vem da sessão real. Contas com e-mail e senha podem solicitar o e-mail de redefinição. Não há troca de e-mail ou de provedor nesta entrega.

O nome é salvo pelo `updateProfile` do Authentication. Quando a persistência do perfil está habilitada, o serviço faz PATCH somente de `users/<uid>/displayName` e `updatedAt`. Uma falha nessa sincronização é informada como pendência e pode ser tentada novamente. Troca de sessão impede que o resultado seja aplicado à conta seguinte. Regras, vínculos de empresa, papéis e dados comerciais não foram alterados.

A sessão publica a mudança de perfil com um motivo específico. O shell e a saudação recebem o nome atualizado sem remontar a página nem recarregar os vínculos empresariais. O diálogo protege alterações ao fechar ou recarregar e bloqueia envio duplicado durante a gravação.

## Preservação e análise

O mapa industrial, as sete etapas interativas da página inicial, a seleção de empresa e os controles das páginas continuam presentes. Não foram implementadas funções extras nas páginas comerciais. A análise solicitada está em [35 — Funcionalidades por página](35-analise-de-funcionalidades-2026-09-30.md). As prioridades de continuidade das avaliações e de destino das ações ficam para a revisão de fluxo.

Backup antes das alterações: `C:\Users\Kauan\Desktop\sivi-backup-conta-visual-20260930.zip`. Comparação do código com esse backup confirmou que nenhum arquivo anterior foi removido. A cópia de marca tem hash idêntico ao SVG original do projeto LOGO; veja [origem dos assets](../../src/assets/brand/README.md).

## Verificação

- 171 testes unitários aprovados, incluindo validação de nomes, sessão, gravação parcial e preservação da página.
- Testes de navegador: conta, acesso, cadastro, troca de atuação, menu lateral, foco, tema, acessibilidade, página inicial e mapa. Detalhes e contagens finais em [registro da revisão](reviews/2026-09-30-design-conta.json).
- Conferência visual nos temas claro e escuro, com telas de celular e desktop. Vinte combinações de página inicial/conta sem erro de página ou overflow, além da verificação do acesso.
- Authentication e Database foram exercitados somente nos emuladores locais. Não houve publicação, alteração de regras ou gravação em Firebase de produção.

As capturas foram registradas originalmente em `exports/design-conta-2026-09-30`; essa pasta não acompanha esta cópia do projeto.

Referências técnicas conferidas: [perfil no Authentication](https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile) e [atualização de campos no Database](https://firebase.google.com/docs/database/web/read-and-write#update_specific_fields).
