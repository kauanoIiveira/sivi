# Como abrir o SIVI

## Usar o sistema

Abra esta pasta no VS Code e abra `index.html` com Live Server. O build público compilado está incluído. A configuração local usa `localhost:5500`. Alternativamente, com Node.js 22.12+:

```powershell
npm ci
npm start
```

Abra `http://127.0.0.1:4173`. A interface usa Firebase Authentication e Realtime Database. O domínio local precisa estar autorizado no Firebase. Os módulos Firebase e as fontes dependem de conexão com a internet.

Crie sua conta e informe os dados da empresa e a atuação desejada. Confirme o e-mail e entre no mesmo navegador para retomar os dados empresariais por até sete dias. Revise e solicite a análise. Para configurar o primeiro administrador, consulte [a entrega funcional](docs/21-entrega-firebase-empresas-perfil-match.md).

A abertura sem rota leva à página pública (`#/`). O login permanece em `#/acesso`. No cadastro empresarial, preencha os dados, revise e clique em **Solicitar acesso**. Consulte a solicitação em **Empresas e atuação** e use **Atualizar situação** para buscar a decisão da administração.

Se houver correção solicitada, abra **Consultar cadastro**, leia o motivo e use **Corrigir e reenviar**. Uma solicitação recusada continua visível com seu motivo, mas não libera negociações.

Abrir o HTML por duplo clique não executa os módulos corretamente. Para alterar os componentes React em `src/public/`, `src/components/ui/` ou `src/workspace/`, execute `npm run check:public` e `npm run build:public`. O build Vite atualiza os arquivos portáteis em `src/generated/public/`, incluindo os gráficos operacionais. Páginas e serviços operacionais JavaScript permanecem na estrutura existente; a nova fonte Manrope é local. Os módulos Firebase dependem de internet.

## Portal administrativo

A conta `kauanbarboza2305@gmail.com` já tem permissão administrativa no projeto `sivi-org`. Depois do login, escolha **Administração SIVI** e **Cadastrar empresa**. O responsável informado precisa ter conta com e-mail confirmado e já ter entrado no SIVI. A empresa nasce ativa para esse responsável. A administração também pode aprovar ou bloquear empresas cadastradas pelos próprios usuários.

Para analisar solicitações dos usuários, abra **Administração SIVI** e clique em **Atualizar solicitações**. Os cadastros pendentes aparecem primeiro. Você pode aprovar, solicitar correção ou recusar; as duas últimas decisões exigem motivo. Bloqueio e reativação continuam disponíveis para empresas já aprovadas.

Para apresentar o fluxo, use dois perfis de navegador: um do responsável e outro da administração. Envie a solicitação, solicite uma correção, reenvie e aprove. Atualize a situação na sessão do responsável. Após aprovação, ele pode entrar como comprador ou fornecedor; no próximo login, uma única atuação comercial ativa abre o painel diretamente.

## Verificações locais

```powershell
npm test
```

O comando executa a checagem de tipos e recompila a interface pública.

## Transferir

```powershell
.\scripts\export-project.ps1
```

O ZIP em `exports/` inclui código, documentação, configurações compartilháveis e um manifesto SHA-256. Ele funciona sem a pasta original e sem Git. Exclui dependências, resultados de testes, logs, credenciais locais e `.git`. Extraia a pasta `SIVI`, abra um terminal nela e execute `npm ci` e `npm start`.

O histórico é opcional. Para levá-lo junto:

```powershell
.\scripts\export-project.ps1 -IncludeGitHistory
```

Para consultar o histórico de um pacote que o inclua:

```powershell
git clone .\SIVI-history.bundle SIVI-com-git
```

O snapshot inclui alterações ainda não commitadas. O bundle contém apenas o histórico commitado.

Consulte [Transferência e retomada](docs/25-transferencia-e-retomada.md) para os requisitos da outra máquina, conferência do pacote e preparação do novo repositório. Não é necessário copiar `node_modules`; `npm ci` reconstrói as dependências do `package-lock.json`.

## Editar

- Interface comum: `src/layouts/app-shell/`, `src/styles/` e `design-system/MASTER.md`.
- Páginas: `src/pages/`.
- Persistência: `src/repositories/` e `src/services/`.
- Regras: `scripts/refresh-commercial-rules.mjs` e `scripts/database-rules.base.json`; gerar `database.rules.json` e validar em emuladores antes de publicar. A migração dos registros antigos está em [Fluxo, empresas e integridade](docs/34-fluxo-empresas-e-integridade.md).
- Configuração pública Firebase: `src/config/firebase.js`.

Nunca inclua credenciais administrativas no frontend. Para retomar o trabalho, leia [CONTINUE_AQUI.md](CONTINUE_AQUI.md).
