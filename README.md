# SIVI

**Sistema Integrado de Vendas Industriais** — plataforma B2B que conecta empresas compradoras, fornecedores e fabricantes, da demanda à entrega.

## Abrir o projeto

Esta pasta é a raiz do projeto: `index.html`, `package.json` e `src/` ficam aqui, sem outra pasta `sivi-master` no meio.

Abra `index.html` com o Live Server do VS Code. Os arquivos compilados necessários estão em `src/generated/public/`.

Para desenvolver, use Node.js 22.12 ou superior:

```powershell
npm ci
npm start
```

Acesse `http://127.0.0.1:4173`. O cadastro e o acesso usam Firebase Authentication e Realtime Database; o pagamento apresentado no cadastro é demonstrativo. O passo a passo está no [guia de abertura](docs/guias/COMO_ABRIR.md).

## Onde encontrar cada coisa

| Caminho | Conteúdo |
|---|---|
| `index.html` | Entrada da aplicação |
| `src/` | Páginas, componentes, regras de negócio e integração com Firebase |
| `assets/` | Fotos, vídeo, fontes e licenças em uso |
| `tests/` | Testes automatizados e cenários isolados |
| `scripts/` | Emuladores, exportação, migração e capturas de revisão |
| [docs/guias](docs/guias/COMO_ABRIR.md) | Como abrir, desenvolver e retomar o trabalho |
| [docs/produto](docs/produto/PRODUCT.md) | Produto, requisitos, fluxos e regras |
| [docs/design](docs/design/DESIGN.md) | Padrões visuais e decisões de interface |
| [docs/historico](docs/historico/README.md) | Entregas anteriores, planos e evidências |
| [docs/README.md](docs/README.md) | Índice da documentação |
| [_arquivo/](docs/guias/organizacao-do-projeto.md#recuperação) | Backup local anterior à organização e instruções para recuperar arquivos |

As configurações de Firebase, Vite, TypeScript e Playwright permanecem na raiz porque são usadas pelas ferramentas.

## Comandos úteis

```powershell
npm run test:unit
npm run check:public
npm run build:public
npm run test:e2e
```

Os testes de navegador que usam Firebase precisam dos emuladores e de Java compatível. Consulte o [guia](docs/guias/COMO_ABRIR.md) antes de executá-los.

Para gerar uma cópia portátil do projeto:

```powershell
.\scripts\export-project.ps1
```

A exportação usa a estrutura organizada e não inclui o backup local nem resultados temporários. Esta cópia não contém a pasta `.git`; o repositório de referência é [kauanoIiveira/sivi](https://github.com/kauanoIiveira/sivi).

Para continuar a implementação, leia [CONTINUE_AQUI](docs/guias/CONTINUE_AQUI.md). A organização das pastas de 10/11/2026 está registrada em [Organização do projeto](docs/guias/organizacao-do-projeto.md).
