# SIVI

**Sistema Integrado de Vendas Industriais**. Plataforma B2B que aproxima empresas compradoras, fornecedores e fabricantes, da demanda à entrega.

O sistema funciona em `index.html`, com Firebase Authentication e Realtime Database. A apresentação, o acesso e os gráficos operacionais usam React/TypeScript, Motion e componentes adaptados das referências 21st.dev. As páginas operacionais preservam seus serviços JavaScript, com a nova aparência compartilhada. O build já fica em `src/generated/public/` para uso com Live Server; `npm start` o recompila. Tem interface responsiva, temas e preferências de acessibilidade na área operacional. Consulte [a repaginação interna](docs/36-repaginacao-interna.md) para os novos painéis e a prévia com dados ilustrativos.

## Executar

Repositório de referência: [kauanoIiveira/sivi](https://github.com/kauanoIiveira/sivi). Esta entrega está na cópia local Desktop/sivi, sem Git e sem publicação remota. Em outra máquina, extraia o pacote de transferência e entre na pasta antes dos comandos abaixo. Use Node.js 22.12 ou superior.

Abra `index.html` pelo Live Server, ou execute:

```powershell
npm ci
npm start
```

Acesse `http://127.0.0.1:4173`. Escolha um plano, informe acesso e empresa e conclua o pagamento demonstrativo com os dados de teste indicados. A conta é criada sem cobrança. Confirme o e-mail, entre e revise a empresa para análise. Consulte [COMO_ABRIR.md](COMO_ABRIR.md) e [a entrega pública](docs/35-repaginacao-publica.md).

## O que já funciona

- Página pública, cadastro empresarial guiado, acompanhamento da análise e correção/reenvio com motivo.
- Cadastro, autenticação e seleção de empresa compradora, fornecedora ou com ambas as atuações.
- Cadastro de empresas pelo administrador para responsáveis com conta verificada, aprovação, solicitação de correção, recusa e bloqueio.
- Próximas ações nos painéis e navegação direta entre demanda, proposta e pedido.
- Perfil industrial, demandas com vários itens e compatibilidade explicada sem misturar unidades de capacidade.
- Edição de rascunhos com cancelamento e verificação de conflito antes de salvar.
- Recuperação do preenchimento de novas demandas na mesma aba, busca por referência/material e atualização dos registros com preservação de alterações abertas.
- Reutilização de demandas como novos rascunhos e filtros/ordenação de negociações e pedidos.
- Avisos de validade e data desejada pelo comprador, CSV dos pedidos filtrados e resumo imprimível com condições aceitas e inspeções.
- Propostas versionadas, comparação e aceite que gera um pedido.
- Inspeção e reinspeção com aprovação por item do pedido, expedição, recebimento e avaliação.
- Proteção de formulários ao navegar e durante envio, com preservação do preenchimento em falhas.
- Persistência e indicadores calculados pelos registros autorizados da empresa.

O SIVI faz a intermediação. As empresas negociam e executam; a plataforma não fabrica, transporta nem processa pagamentos.

## Organização

| Pasta/arquivo | Responsabilidade |
|---|---|
| `index.html`, `src/main.js` | Entrada do sistema |
| `src/app`, `src/core` | Rotas, sessão, empresa ativa e ciclo das páginas |
| `src/pages`, `src/layouts`, `src/components` | Interface e formulários |
| `src/domain` | Regras e indicadores de negócio |
| `src/repositories`, `src/services` | Operações persistidas e integração Firebase |
| `src/styles`, `src/theme` | Tokens e preferência de tema |
| `src/assets`, `src/vendor` | Imagem industrial, identidade e Anime.js com licença |
| `tests` | Testes automatizados e massas de dados isoladas |
| `database.rules.json` | Autorização no Realtime Database |
| `docs`, `design-system` | Produto, próximos passos e padrões da interface |
| `scripts` | Emuladores e exportação do projeto |

## Continuidade

A [repaginação pública de 23/10/2026](docs/35-repaginacao-publica.md) atualiza apresentação, planos, cadastro e páginas institucionais. A pesquisa aplicada e as decisões estão em `docs/superpowers/`. O responsável autorizou uma identidade demonstrativa; CNPJ e contato fictícios permanecem sinalizados.

Comece pela [34 — Fluxo, empresas e integridade](docs/34-fluxo-empresas-e-integridade.md), com a entrada por empresa e atuação, continuidade das operações, validação e preparação dos registros antigos. A [32 — Evolução funcional e continuidade](docs/32-evolucao-e-continuidade.md) conserva a análise anterior. A pasta portátil e a lista de arquivos dispensáveis estão em [33 — Transferência e limpeza](docs/33-transferencia-e-limpeza.md).

O refinamento visual mais recente está em [31 — Minimalismo industrial](docs/31-minimalismo-industrial.md): painéis planos, menos caixas aninhadas, hierarquia de leitura e cores semânticas suaves, preservando a identidade do SIVI.

A [30 — Revisão final do produto](docs/30-revisao-final-do-produto.md) conserva a entrega anterior, que passou com 133 testes unitários e 112 de navegador/emuladores. A validação da entrega atual está no documento 32 e no registro de evidências referenciado nele.

A ordem das próximas entregas e as lacunas reproduzidas localmente estão em [28 — Próximos passos](docs/28-proximos-passos.md).

No sistema, use a **engrenagem de preferências** para tema, tamanho do texto, contraste, modo para daltonismo e VLibras. A página pública e o acesso permanecem claros. Minha conta reúne os dados pessoais. O documento [Conforto de uso e acessibilidade](docs/27-conforto-e-acessibilidade.md) conserva a versão anterior dessas opções.

Comece por [CONTINUE_AQUI.md](CONTINUE_AQUI.md). A preparação para outra máquina e o uso do repositório estão em [Transferência e retomada](docs/25-transferencia-e-retomada.md), e os padrões para as próximas telas em [Design System](design-system/MASTER.md).

A página demonstrativa foi removida. Cenários fictícios existem somente nos testes e não fazem parte da entrada do sistema. Lotes, QR, anexos e propostas detalhadas por item seguem pendentes. A publicação histórica de regras de 18/09/2026 está documentada em [Portal administrativo e jornada](docs/23-jornada-e-proximas-acoes.md); as proteções comerciais locais posteriores ainda não foram publicadas. Os testes de jornada usam emuladores locais.
