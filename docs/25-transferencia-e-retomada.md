# Transferência e retomada

Atualizado em 20/09/2026. Leia junto com [CONTINUE_AQUI.md](../CONTINUE_AQUI.md) para o estado funcional e [COMO_ABRIR.md](../COMO_ABRIR.md) para os fluxos de acesso.

## Ambiente em outra máquina

- Node.js 22 ou superior, com npm. A interface é HTML/CSS/JavaScript, sem etapa de build.
- Internet para os módulos Firebase, as fontes e o acesso ao projeto remoto `sivi-org`.
- Para testes de navegador: Chromium do Playwright ou Microsoft Edge instalado.
- Para testes com emuladores: JDK 21 ou superior. Java não é necessário para usar a aplicação com Firebase remoto.
- Git somente para versionar; PowerShell para gerar o pacote automatizado.

Depois de extrair a pasta `SIVI`, execute nela:

```sh
npm ci
npm start
```

Abra `http://127.0.0.1:4173/#/`. O servidor escuta apenas na própria máquina. Os dados continuam no Firebase; copiar a pasta não copia usuários nem banco de dados. Use as contas existentes. O login exige que o domínio usado esteja autorizado no Firebase Authentication. Não publique regras nem recrie a administração apenas por trocar de computador.

Não abra o HTML por duplo clique. O Firebase e os módulos precisam de HTTP. A configuração pública está em `src/config/firebase.js`; arquivos de credenciais administrativas não pertencem ao frontend nem ao pacote.

## Verificar a cópia

```sh
npm run test:unit
npx playwright install chromium
npm run test:e2e
```

O Playwright inicia o servidor e os emuladores. No Windows, o Edge pode substituir o Chromium:

```powershell
$env:SIVI_BROWSER_CHANNEL = 'msedge'
npm run test:e2e
```

Se o Java não estiver no PATH, aponte `SIVI_JAVA_HOME` para a pasta do JDK instalado na nova máquina. Não copie caminhos de outra instalação. Em macOS/Linux, use `export SIVI_JAVA_HOME=/caminho/do/jdk`. `/?authEmulator=1` seleciona os emuladores somente em HTTP local. As rotas comuns usam o Firebase remoto.

## Pacote portátil

```powershell
.\scripts\export-project.ps1
```

O comando gera em `exports/` um ZIP e seu arquivo `.sha256`. O ZIP contém a pasta `SIVI` com os arquivos atuais e um texto de transferência. `SIVI/SHA256SUMS.txt` registra a integridade individual dos arquivos. O snapshot inclui alterações ainda não commitadas e toda a documentação.

Não acompanham o pacote: `node_modules`, `.git`, caches, logs, relatórios de testes, diretórios auxiliares locais e credenciais privadas. Na pasta de trabalho atual, as dependências permanecem instaladas para permitir a retomada imediata. Novas dependências devem ser registradas no `package.json` e no lockfile.

O exportador funciona também na cópia extraída, sem Git. Ele inclui as pastas de código, testes, scripts, design e documentação e os arquivos de configuração listados no próprio script; ao criar uma nova pasta na raiz, revise essa lista.

Para conferir o ZIP no PowerShell, compare a saída com o conteúdo do `.sha256`:

```powershell
Get-FileHash .\exports\SIVI-transferencia-DATA.zip -Algorithm SHA256
```

Se precisar levar o histórico atual, gere outro pacote com `-IncludeGitHistory`. O bundle fica fora da pasta de código e contém somente a branch `main` e seus commits, sem referências internas de ferramentas. Restaure-o com `git clone .\SIVI-history.bundle SIVI-com-git`; as alterações ainda não commitadas estão somente no snapshot `SIVI/` e devem ser copiadas por cima do clone, preservando a pasta `.git` do clone.

## Repositório de continuidade

O destino é `https://github.com/kauanoIiveira/sivi`, branch `main`. `origin` aponta para esse repositório. A publicação começa com um único commit contendo o estado completo do projeto, sem importar commits de repositórios anteriores. A autoria dos novos commits é de Kauan Oliveira, com o e-mail `kauanbarboza2305@gmail.com`.

Para continuar com o histórico em outra máquina:

```sh
git clone https://github.com/kauanoIiveira/sivi.git
cd sivi
npm ci
npm start
```

O ZIP é uma alternativa para transportar os arquivos atuais. Seu snapshot não contém `.git`; para continuar os commits, prefira o clone ou restaure o bundle opcional. O arquivo `SHA256SUMS.txt` serve à conferência da transferência; pode ser retirado após essa conferência, pois deixa de representar o conteúdo assim que os arquivos forem editados.

Depois de clonar, configure a autoria local antes de criar commits:

```sh
git config user.name "Kauan Oliveira"
git config user.email "kauanbarboza2305@gmail.com"
git status
```

Confira `git remote -v` antes do envio e use `origin`. Escreva títulos e descrições dos commits em português, com frases naturais que expliquem a mudança. As licenças de bibliotecas de terceiros permanecem nos arquivos correspondentes. A autoria local não autentica o GitHub: a nova máquina precisa ter acesso à conta para enviar alterações. Backups do histórico anterior são arquivos locais e não devem ser importados para este repositório.

## Ponto de continuidade

A página pública aprovada está em `src/pages/public/`. O rodapé e as faixas de fundo ocupam a largura da janela; `.public-shell` limita apenas o conteúdo. A revisão visual cobre os temas claro/escuro e monitores de até 2560px.

Próximas funções devem ser escolhidas antes da implementação. As pendências atuais incluem propostas por item, lotes, QR, anexos e gestão de membros. A base de entrada, aprovação, demandas, propostas e pedidos já existe; evitar reconstruí-la ou introduzir dados fictícios na aplicação.
