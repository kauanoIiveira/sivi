# Como abrir o SIVI

## Usar o sistema

Abra esta pasta no VS Code e abra `index.html` com Live Server. A configuração local usa `localhost:5500`. Alternativamente, com Node.js 22+:

```powershell
npm ci
npm start
```

Abra `http://127.0.0.1:4173`. A interface usa Firebase Authentication e Realtime Database. O domínio local precisa estar autorizado no Firebase. Os módulos Firebase e as fontes dependem de conexão com a internet.

Crie uma conta, confirme o e-mail e cadastre uma empresa. A administração aprova o cadastro. Para configurar o primeiro administrador, consulte [a entrega funcional](docs/21-entrega-firebase-empresas-perfil-match.md).

A abertura sem rota leva à página pública (`#/`). O login permanece em `#/acesso`. No cadastro empresarial, preencha os dados, revise e clique em **Solicitar acesso**. Consulte a solicitação em **Empresas e atuação** e use **Atualizar situação** para buscar a decisão da administração.

Se houver correção solicitada, abra **Consultar cadastro**, leia o motivo e use **Corrigir e reenviar**. Uma solicitação recusada continua visível com seu motivo, mas não libera negociações.

Abrir o HTML por duplo clique não executa os módulos corretamente. Não há build, React ou Vite.

## Portal administrativo

A conta `kauanbarboza2305@gmail.com` já tem permissão administrativa no projeto `sivi-org`. Depois do login, escolha **Administração SIVI** e **Cadastrar empresa**. O responsável informado precisa ter conta com e-mail confirmado e já ter entrado no SIVI. A empresa nasce ativa para esse responsável. A administração também pode aprovar ou bloquear empresas cadastradas pelos próprios usuários.

Para analisar solicitações dos usuários, abra **Administração SIVI** e clique em **Atualizar solicitações**. Os cadastros pendentes aparecem primeiro. Você pode aprovar, solicitar correção ou recusar; as duas últimas decisões exigem motivo. Bloqueio e reativação continuam disponíveis para empresas já aprovadas.

Para apresentar o fluxo, use dois perfis de navegador: um do responsável e outro da administração. Envie a solicitação, solicite uma correção, reenvie e aprove. Atualize a situação na sessão do responsável. Após aprovação, ele pode entrar como comprador ou fornecedor; no próximo login, uma única atuação comercial ativa abre o painel diretamente.

## Testes

```powershell
npm run test:unit
# Com npm start em outro terminal:
npm run test:operations
# Auth e Database Emulator são iniciados pelo Playwright:
npm run test:e2e
```

Os testes de navegador exigem Chromium instalado pelo Playwright (`npx playwright install chromium`) ou o Edge local:

```powershell
$env:SIVI_BROWSER_CHANNEL = 'msedge'
```

Os emuladores exigem JDK compatível. Nesta máquina, o runtime do Android Studio foi usado sem alterar o Java do sistema:

```powershell
$env:SIVI_JAVA_HOME = 'C:/Program Files/Android/Android Studio/jbr'
npm run test:e2e
```

Em outra máquina, aponte `SIVI_JAVA_HOME` para seu JDK 21+. A URL `/?authEmulator=1` usa os emuladores somente em HTTP local. Os testes nunca publicam regras ou criam dados no projeto remoto.

Para capturar as páginas reais com registros criados nos emuladores, defina uma pasta de saída e execute a jornada:

```powershell
$env:SIVI_CAPTURE_UI = "$env:TEMP/sivi-ui-review"
npx playwright test tests/e2e/firebase-marketplace.spec.js
Remove-Item Env:SIVI_CAPTURE_UI
```

O teste salva capturas dos dois temas em 390 e 1440px e verifica também as larguras de 360 e 768px. Para revisar a página pública, use `npx playwright test tests/e2e/public-page.spec.js`; ela também verifica 1920 e 2560px e salva a captura de 1920px quando `SIVI_CAPTURE_UI` estiver definida.

## Transferir

```powershell
.\scripts\export-project.ps1
```

O ZIP em `exports/` inclui código, testes, documentação, configurações compartilháveis e um manifesto SHA-256. Ele funciona sem a pasta original e sem Git. Exclui dependências, resultados de testes, logs, credenciais locais e `.git`. Extraia a pasta `SIVI`, abra um terminal nela e execute `npm ci` e `npm start`.

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
- Regras: `database.rules.json`.
- Configuração pública Firebase: `src/config/firebase.js`.

Nunca inclua credenciais administrativas no frontend. Para retomar o trabalho, leia [CONTINUE_AQUI.md](CONTINUE_AQUI.md).
