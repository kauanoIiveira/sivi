# Retomar o SIVI

## Pasta de trabalho

A raiz desta cópia é `C:\Users\Aluno\Documents\sivi-master`. Ela contém `index.html`, `package.json`, `src/`, `assets/`, `tests/` e `scripts/`. Não existe uma segunda pasta `sivi-master` dentro dela.

Esta cópia não contém `.git`. Os caminhos de outras máquinas e as referências de branch presentes nos documentos históricos descrevem entregas anteriores.

## Executar e desenvolver

Use o Live Server sobre o `index.html` da raiz ou, com Node.js 22.12 ou superior:

```powershell
npm ci
npm start
```

Acesse `http://127.0.0.1:4173`. O passo a passo e os requisitos de emuladores estão no [guia de abertura](COMO_ABRIR.md).

A apresentação, o acesso e os gráficos usam React/TypeScript. O build Vite fica em `src/generated/public/` e acompanha a cópia para uso com Live Server. A operação mantém páginas e serviços JavaScript, com autenticação e persistência Firebase.

Depois de alterar componentes React, execute `npm run check:public` e `npm run build:public`. Para as regras de banco, altere a fonte em `scripts/database-rules.base.json` e use `scripts/refresh-commercial-rules.mjs`; a validação comercial deve usar os emuladores.

## Referências

- [Produto](../produto/PRODUCT.md) e [decisões do produto](../produto/10-decisoes-em-aberto.md).
- [Design System](../design/DESIGN.md) e [direção da área operacional](../design/workspace-direction-contract.md).
- [Fluxo, empresas e integridade](../historico/34-fluxo-empresas-e-integridade.md).
- [Repaginação pública](../historico/35-repaginacao-publica.md) e [repaginação interna](../historico/36-repaginacao-interna.md).
- [Registros completos de continuidade anteriores](../historico/continuidade-anterior.md).
- [Índice da documentação](../README.md).

## Organização local — 10/11/2026

Guias, produto, design e histórico foram agrupados em `docs/`. As capturas antigas e os registros auxiliares foram guardados no [backup original](organizacao-do-projeto.md#recuperação). Novas capturas vão para `exports/revisao-visual/`.

O código da aplicação, os testes e as regras Firebase foram preservados durante essa organização. Nenhuma publicação remota foi executada. Consulte [o registro da organização](organizacao-do-projeto.md) para os detalhes e a recuperação dos arquivos.
