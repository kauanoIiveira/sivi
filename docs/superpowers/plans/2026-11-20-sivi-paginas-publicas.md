# Páginas públicas do SIVI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Objetivo.** Redesenhar Quem somos, O que fazemos e Perguntas frequentes na direção editorial industrial aprovada.

**Arquitetura.** As três páginas reutilizam a estrutura pública React e ativam uma aparência editorial compartilhada. A autoria de cada página fica no seu componente. Rotas, entradas dos formulários e links de seção continuam usando as funções do projeto.

**Tecnologias.** React, TypeScript, Vite, CSS, GSAP para a fotografia, Motion para a demonstração e Playwright para verificação.

**Design aprovado.** [Direção editorial para as páginas públicas](../specs/2026-11-20-sivi-paginas-publicas-design.md)

## Restrições

- Aplicar o desenho somente em `#/quem-somos`, `#/plataforma` e `#/duvidas`. Usar Manrope, branco, cinza-claro, grafite e laranja `#ff9000`. Os links do menu continuam como **Quem somos**, **Plataforma** e **Dúvidas**.
- Preservar as rotas abaixo e os atalhos da home. Reutilizar a aparência do header e do footer da home via uma opção específica para as três páginas.
- Usar fotografias autorizadas ou licenciadas e conteúdo verificável. Com equipe ou origem pendente, publicar a versão centrada no propósito. Identificar os dados fictícios da demonstração.
- A navegação e os controles funcionam por toque e teclado. Com movimento reduzido, o conteúdo aparece no estado final. A rolagem permanece nativa. Usar as dependências atuais.
- Este plano fica aguardando autorização para execução. As três entregas têm pontos de revisão em que a direção local pode ser ajustada.

## Arquivos e responsabilidades

| Arquivo | Responsabilidade |
| --- | --- |
| `src/public/public-layout.tsx` | Ativar a aparência editorial nas páginas que pedirem e manter os comportamentos da estrutura pública. |
| `src/public/components.tsx` | Adaptar a aparência compartilhada de Header e Footer, com estado ativo e navegação apropriados à página. |
| `src/public/public-editorial.css` | Margens, tipografia, header, footer e composições editoriais restritas às três páginas. |
| `src/public/site-pages.tsx` | Composição de Quem somos e do FAQ. Preservar o componente Casos de uso. |
| `src/public/platform.tsx` | Composição de O que fazemos, demonstração por perspectiva e compatibilidade dos links. |
| `src/public/entry.tsx` | Títulos de navegador e reconhecimento dos atalhos públicos. |
| `src/generated/public/entry.js` e `src/generated/public/style.css` | Saída de `npm run build:public`. |

## Pontos de revisão

1. Um link antigo de compatibilidade ou expedição deve mostrar a informação correspondente no painel agrupado. Entrega 2.
2. A troca entre comprador e fornecedor deve manter a etapa, e **Cadastrar empresa** deve levar à atuação escolhida. Entrega 2.
3. Sem material autorizado sobre a equipe, Quem somos deve abrir com uma chamada e uma fotografia que descrevam o propósito. Entrega 1.
4. O menu, o recorte e a troca de painéis devem funcionar com teclado e preferência de movimento reduzido. Entregas 1 e 2.
5. Links antigos do FAQ devem chegar ao tema equivalente. A expansão precisa manter o foco na pergunta e oferecer leitura fluida em 320 px. Entrega 3.

## Verificação compartilhada

Usar o servidor estático que já exibe o site e o Playwright CLI instalado no ambiente. Após cada alteração, rodar `npm run build:public` e `git diff --check`. Fazer as verificações de navegador em uma sessão isolada com `playwright-cli.cmd -s=sivi-editorial --raw run-code --filename="<arquivo temporário>"`. Usar a mesma verificação antes e depois de cada entrega para confirmar as diferenças. As verificações abaixo não precisam de conta nem de Firebase autenticado.

Rodar `npm run check:public` para detectar erros novos. A última checagem observada encontrou `TS2554` em `src/components/ui/pricing-section.tsx:96`. Confirmar a situação de partida antes de editar a interface.

## Entrega 1 — Quem somos e aparência pública

**Arquivos.** `public-layout.tsx`, `components.tsx`, `public-editorial.css` e `site-pages.tsx`, dentro de `src/public`.

**Interface.** `PublicLayout({ page, lightHeader, editorial = false, children })` encaminha `editorial` a `Header({ current, editorial = false })` e `Footer({ home = false, editorial = false })`. A identificação da home continua separada da aparência editorial para que a logo das outras rotas navegue para a home.

- [ ] Verificar `#/quem-somos` em 1440 × 900 e 390 × 844. A versão nova deve mostrar **Por que o SIVI existe** enquanto o material de equipe estiver pendente, foto carregada e ação **Ver como o SIVI funciona** apontando a `#/plataforma`. Registrar o estado atual também em `#/` para comparar header, logo e botão.
- [ ] Ativar a opção editorial no layout, com escala de Manrope e margens da home. Aplicar a composição de header e footer da home às páginas editoriais, com **Acessar sistema** em cinza-claro sobre fundo branco e indicação da página atual. O mesmo componente atende o menu por teclado e no celular.
- [ ] Redesenhar `AboutPage()` com texto à esquerda e fotografia ampla à direita no desktop. Apresentar propósito e problema de compras industriais com texto e imagem. Usar o título **Quem está por trás do SIVI** e o bloco da equipe quando houver conteúdo confirmado. Manter o destino de `?secao=visao-geral`. Fazer o recorte de uma foto com GSAP e disponibilizar a imagem imediatamente sob movimento reduzido.
- [ ] Confirmar as verificações iniciais e fazer Tab até o menu e a ação final. Em movimento reduzido, verificar visibilidade de título, foto e CTA. Conferir `#/` e `#/acesso?modo=login` como regressão. Apresentar os dois tamanhos para revisão visual.

## Entrega 2 — O que fazemos

**Arquivos.** `src/public/platform.tsx`, `src/public/public-editorial.css` e `src/public/entry.tsx`.

**Interface.** `PlatformPage()` usa `PublicLayout page="platform" lightHeader editorial`. Em `platform.tsx`, `resolveDemoSelection(params: URLSearchParams): { role: "buyer" | "supplier"; step: "demand" | "proposals" | "order" | "inspection" | "receipt" }` define a entrada. O CTA usa `signupLink(role)`. O painel é uma única demonstração com os dados de uma negociação coerente nas duas perspectivas.

- [ ] Exercitar `#/plataforma?secao=funcionamento&etapa=N` antes da edição. Na nova página, `1,2 → demand`, `3 → proposals`, `4 → order`, `5,6 → inspection` e `7 → receipt`. Para `2`, verificar os critérios de compatibilidade. Para `6`, verificar o registro de expedição. `etapa=0`, `etapa=8` e valor inválido abrem Demanda. `?secao=compras` abre comprador e `?secao=fornecimento` abre fornecedor.
- [ ] Montar a abertura **Uma compra industrial, da demanda ao recebimento** com o painel de demonstração e os controles **Quero comprar** e **Quero fornecer**. Apresentar Demanda, Propostas, Pedido, Inspeção e expedição e Recebimento. Reutilizar `purchaseExamples` como ponto de partida e adaptar os exemplos ao que a interface confirmada mostra.
- [ ] Ligar os controles de etapa e perspectiva ao painel. Preservar a etapa ao alternar o papel, mover apenas a área visual com Motion e manter os focos de seção para `funcionamento`, `compras` e `fornecimento`. Atualizar o título do navegador para **O que fazemos — SIVI**.
- [ ] Confirmar a matriz de links, a abertura com comprador e Demanda e a troca por teclado até **Inspeção e expedição**. Trocar para fornecedor e conferir a mesma etapa, suas informações e o destino `#/acesso?modo=register&atuacao=supplier`. Em 390 px, verificar a ordem dos seletores acima do painel. Repetir a troca com movimento reduzido e apresentar os dois tamanhos para revisão.

## Entrega 3 — Perguntas frequentes

**Arquivos.** `src/public/site-pages.tsx`, `src/public/public-editorial.css` e `src/public/entry.tsx`.

**Interface.** `FaqPage()` usa `PublicLayout page="faq" lightHeader editorial`. Cada assunto tem um identificador estável. `duvidas-cadastro` leva a Conta e cadastro. `duvidas-compras` leva a Compras, a entrada do agrupamento anterior. Manter `duvidas` como destino do atalho já publicado.

- [ ] Verificar em 1440 × 900 e 320 px que o FAQ novo mostra **Perguntas frequentes** e a primeira pergunta da página. Testar os links antigos `?secao=duvidas-cadastro` e `?secao=duvidas-compras`. O foco deve pousar no título correspondente.
- [ ] Organizar as perguntas em **Conta e cadastro**, **Compras**, **Fornecimento** e **Pedidos e inspeção**. Fazer o índice lateral no desktop e movê-lo para cima das perguntas no celular. Conferir a resposta de campos exigidos com a validação atual em `src/domain/public-signup.js`.
- [ ] Usar `details/summary` para respostas abertas sob cada pergunta, com divisórias, indicação de estado e expansão curta. Quando necessário, usar os links atuais para cadastro, demonstração ou guias. Atualizar o título do navegador para **Perguntas frequentes — SIVI**.
- [ ] Repetir as verificações iniciais. Abrir e fechar por Enter e Espaço, confirmar foco no `summary` e ausência de rolagem horizontal a 320 px. Conferir movimento reduzido, navegação da home para as três páginas e a rota Casos de uso. Apresentar os tamanhos para revisão.

## Encerramento após autorização

Após a revisão de cada página, registrar em commit separado somente as mudanças correspondentes, preservando alterações locais de outras entregas. Ao final, conferir as três rotas, os links de seção e o acesso em 1440, 1024, 768, 390 e 320 px. As decisões editoriais sobre origem e retratos dependem dos materiais que o usuário aprovar durante a execução.
