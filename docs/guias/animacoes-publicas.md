# Animações das páginas públicas

Implementadas em `C:/Users/Aluno/Documents/sivi-master`.

- **React Bits SplitText**: introdução da página inicial (palavras com máscara), título de soluções (onda de letras e resposta ao cursor), propósito do SIVI (palavras em perspectiva) e título da jornada (entrada inclinada).
- **React Bits ScrollReveal**: frase da faixa laranja, com as palavras ganhando intensidade conforme a rolagem.
- **Transitions.dev Tabs sliding**: indicador dos controles Comprador/Fornecedor e período do gráfico.
- **Transitions.dev Panel reveal**: troca de conteúdo nas etapas da compra, com deslocamento curto e desfoque.
- **Transitions.dev Learn more hover**: setas dos botões e links, com resposta ao cursor e ao foco do teclado.
- **SIVI**: recorte progressivo das fotografias, abertura circular da imagem de introdução e entrada dos registros com campos escalonados.

A abertura mantém Texts reveal e Shimmer text; o número da etapa mantém Number pop-in. Títulos e parágrafos intermediários têm menos entradas genéricas para criar pausas entre os efeitos.

## Ajustar

Os componentes do React Bits ficam em `src/public/motion/`. As chamadas em `home.tsx`, `platform.tsx` e `site-pages.tsx` definem efeito, duração e intervalo. Os tokens de painéis, indicadores e setas estão em `motion-variety.css`. O comportamento comum de entrada e cabeçalho continua em `landing-motion.ts` e `landing-motion.css`.

Os efeitos respeitam a preferência de movimento reduzido, inclusive quando ela muda com a página aberta. O foco em um título revela seu texto imediatamente. As seleções continuam manuais; as animações não alternam os dados sozinhas.

Referências: https://reactbits.dev/text-animations/split-text, https://reactbits.dev/text-animations/scroll-reveal e https://transitions.dev/. As licenças originais estão junto dos componentes.

## Conferir

`npm run check:public` e `npm run build:public`.

Os cenários de foco, movimento reduzido e reposicionamento dos indicadores estão em `tests/e2e/public-motion.spec.js`.
