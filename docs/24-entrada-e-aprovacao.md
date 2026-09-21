# Entrada e aprovação de empresas — 18/09/2026

Fluxo aprovado pelo usuário: página pública → conta verificada → cadastro empresarial → revisão → análise administrativa → primeiro acesso. Acesso gratuito nesta etapa, sem assinatura ou pagamento simulado.

## Implementação

- [x] Página pública industrial em `/`, mantendo `/acesso` e suas proteções.
- [x] Formulário em etapas com nome, CNPJ, cidade/UF, contato e atuações; revisão antes do envio.
- [x] Uma empresa por cartão; consulta de dados e atualização explícita da situação.
- [x] Correção solicitada e recusa com motivo, sem liberar negociações. Reenvio apenas pelo responsável e nos estados permitidos.
- [x] Portal administrativo com dados para análise e ações compatíveis com cada estado.
- [x] Entrada direta quando houver uma única atuação comercial ativa; primeira ação no painel.
- [x] Testes de transições, isolamento, persistência, navegação e interface nos dois temas; publicação das regras após validação.

## Responsabilidades

`organization-application.js`: validação dos dados e transições. Serviços Firebase: persistência e espelhamento de situação nos vínculos. `database.rules.json`: autorização efetiva, inclusive contra autoaprovação. Páginas `public` e `context`: apresentação e formulário guiado. Administração: leitura da solicitação, decisão e motivo.

Cadastros anteriores continuam legíveis; não inventar dados ausentes. Aprovação cadastral não representa certificação industrial. CNPJ informado é identificação declarada, sem consulta automática a órgão oficial. Não criar empresas de apresentação no banco remoto.

A decisão administrativa inclui a versão temporal que o administrador consultou. Serviço e regras recusam aprovação de dados alterados desde a consulta, inclusive quando a alteração ocorre entre leitura e gravação. Solicitações de correção preservam o último motivo após reenvio. Somente a administração pode alterar decisões; o responsável edita dados e reenvia cadastros pendentes ou em correção.

Skills aplicadas: stop-slop, ui-ux-pro-max, minimalist-ui e anti-ui-slop (playbook operate), com prioridade para o design industrial existente. Os scripts de ui-ux-pro-max continuam indisponíveis na instalação local; foram usadas as instruções escritas. Nenhuma dependência nova.

## Verificação

Testar cadastro → correção → reenvio → aprovação em duas sessões, recusa com motivo, bloqueio, negação de autoaprovação e de edição por terceiros. Verificar página pública, retorno ao login, seleção de papéis e ausência de transbordamento horizontal.


## Entrega e evidências

- Suíte completa: 83 testes unitários e 65 testes de navegador aprovados.
- Após os ajustes da revisão de código: 83 testes unitários e os quatro testes de onboarding, regras e cadastro administrativo aprovados novamente.
- 8 telas capturadas nos temas claro/escuro, em 390 e 1440px; 64 verificações em 360, 390, 768 e 1440px, sem transbordamento horizontal.
- Capturas e backups históricos das regras foram mantidos fora do repositório. As capturas podem ser recriadas pelos testes, conforme `COMO_ABRIR.md`.
- Regras publicadas em `sivi-org` em 18/09/2026; leitura após publicação confirmou igualdade com `database.rules.json`. Nenhuma empresa de teste foi criada no banco remoto.
- Frontend continua local, servido por HTTP. Esta entrega não publicou hospedagem.
- A atualização da situação é explícita pelos botões do responsável e do administrador; não há envio de notificação por e-mail nesta etapa.

Para apresentação, consulte o roteiro em `COMO_ABRIR.md`. Cadastro já pendente pode ser consultado e editado; dados ausentes dos cadastros anteriores aparecem como não informados. A administração existente continua acessível pela mesma conta autorizada.

## Refinamento público — 20/09/2026

Por solicitação do usuário, a página pública apresenta o produto sem referências a TCC/SENAI. Foram removidos números decorativos, reduzidos os rótulos em caixa alta e reescritos os textos de apresentação. O rodapé grafite reúne identidade, navegação para as seções da página, conta e dúvidas de cadastro. Os links internos preservam a rota pública e movem o foco ao destino; as respostas podem ser abertas por teclado. Não foram adicionados contatos, selos, redes sociais ou páginas legais fictícios.

A [orientação de rodapés da NN/g](https://www.nngroup.com/articles/footers/) fundamentou seu uso como navegação complementar. A interpretação para o SIVI foi retirar a decoração repetitiva e priorizar suas tarefas e objetos reais.

O formulário continua indicando progresso funcional (“Etapa 1 de 2”); os painéis perderam os prefixos numéricos decorativos. O contexto acadêmico permanece apenas na documentação.

### Correção de largura e referência BarberFlow

O rodapé estava dentro de `.public-page`, limitada a 1440px: uma janela de 1920px exibia margens vazias de 240px em cada lado. O teste de regressão reproduziu essa falha antes da correção. Agora as superfícies ocupam a largura da janela e `.public-shell` limita apenas o conteúdo. A landing do projeto BarberFlow orientou os títulos de maior escala e menor peso, o ritmo das seções, a chamada final de cadastro e as proporções do rodapé. O projeto BarberFlow foi consultado sem alterações.

O teste `public-page.spec.js` verifica as bordas do rodapé em 360, 768, 1440, 1920 e 2560px nos dois temas, além de navegação, teclado, FAQ e entrada na conta. A captura opcional inclui 1920px para revisão visual de monitores maiores.
