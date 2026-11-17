# Organização do projeto — 10/11/2026

O projeto passou a ocupar diretamente `C:\Users\Aluno\Documents\sivi-master`. A segunda pasta `sivi-master`, que antes ficava dentro dela, foi eliminada após a transferência do conteúdo.

## O que foi organizado

- Os guias `docs/guias/COMO_ABRIR.md` e `docs/guias/CONTINUE_AQUI.md` ficam em `docs/guias/`.
- `docs/produto/PRODUCT.md` e os documentos de definição do produto ficam em `docs/produto/`.
- `docs/design/DESIGN.md`, `MASTER.md` e os contratos de direção visual ficam em `docs/design/`.
- Entregas antigas, planos e relatórios ficam em `docs/historico/`.
- As 105 capturas e registros auxiliares de `.impeccable/review/` e `.taste-skill/` foram retirados da árvore ativa e preservados no backup.
- Os links da documentação e o script de exportação foram adaptados aos novos caminhos.
- Os scripts de captura passam a gravar em `exports/revisao-visual/`.

O código em `src/`, as mídias em `assets/`, os testes, as configurações de execução e as regras Firebase foram preservados. As licenças que têm conteúdo igual continuam junto aos respectivos pacotes.

## Estrutura para os próximos trabalhos

Use a raiz para os arquivos de entrada e configuração. Coloque instruções em `docs/guias/`, definições do produto em `docs/produto/` e padrões visuais em `docs/design/`. Registros de uma entrega concluída pertencem a `docs/historico/`.

Capturas, logs, resultados de testes e pacotes de transferência devem ficar em pastas de saída já ignoradas pelo Git, como `exports/`, `test-results/` e `playwright-report/`. Evite criar novos documentos de continuidade na raiz.

## Recuperação

Na cópia local, `_arquivo/backup-antes-da-organizacao-2026-11-10.zip` preserva os 441 arquivos anteriores. `_arquivo/organizacao-2026-11-10.json` registra os hashes e o mapa dos caminhos. Abra o ZIP no Explorador e extraia os arquivos desejados para uma pasta separada; para restaurar tudo, use uma pasta vazia.

O ZIP e o manifesto são locais e não acompanham as exportações portáteis. O backup preserva o estado anterior à organização; não substitui uma cópia de segurança das alterações futuras.

Volte ao [README do projeto](../../README.md) ou ao [índice da documentação](../README.md).

## Validação da organização

- 208 testes unitários aprovados. A restrição de subprocessos do ambiente foi retirada para executar a suíte completa.
- SHA-256 dos 257 arquivos de código, recursos, testes e configurações conferido contra o backup: nenhum foi alterado.
- 164 links locais da documentação conferidos tanto na pasta atual quanto na cópia portátil, sem destinos ausentes.
- Servidor estático iniciado a partir da nova raiz; página inicial e 26 recursos locais responderam corretamente.
- Exportação executada com a estrutura nova; manifesto de 340 arquivos validado. Os pacotes criados apenas para essa conferência foram removidos ao final.

A validação não exercitou login remoto, não recompilou os arquivos React e não executou a suíte de navegador. Os arquivos da aplicação e o build incluído são idênticos aos originais.
