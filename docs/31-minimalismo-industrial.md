# Minimalismo industrial — 27/09/2026

Refinamento solicitado com a skill `minimalist-ui`, aplicado ao sistema existente. A direção escolhida usa superfícies planas, tipografia com hierarquia clara, divisórias leves e cor concentrada em ações e estados.

## Aplicação

- **Painéis:** indicadores em uma faixa com divisórias; seções abertas, sem uma caixa externa para cada bloco; data de atualização junto ao resumo; títulos sem etiquetas redundantes.
- **Navegação:** marca e rótulos mais discretos, ícones com traço consistente, controles do cabeçalho sem contornos permanentes e alvos de pelo menos 44px. A navegação grafite permanece.
- **Demandas e propostas:** menos bordas aninhadas em formulários, itens, especificações e histórico. Abertura de detalhes usa sinais `+` e `−`; a comparação mantém rolagem interna e acesso por teclado.
- **Perfil industrial:** formulário aberto sobre a página, com espaçamento entre campos, pesos tipográficos mais leves e texto de entrada de 16px em telas pequenas.
- **Empresas e administração:** títulos e controles consistentes; estados das empresas em pequenas etiquetas semânticas; retirada de faixas coloridas decorativas nos cartões administrativos.
- **Jornada:** linha e marcadores mais leves, legenda sem círculos repetidos, detalhes e links com acabamento neutro. Seleção, foco, estado textual e tabela alternativa continuam disponíveis.
- **Cores:** fundos suaves para sucesso, alerta e erro no tema claro. Sombras de botões e painéis removidas também dos tokens do tema escuro.

A adaptação preserva Archivo, IBM Plex Mono para números, grafite e laranja do SIVI. Serifas de apresentação, fundos animados, grandes espaços vazios e grades decorativas não se adequam às telas de trabalho deste sistema. A página pública conserva a composição já revisada. Não foram adicionadas dependências, animações de entrada ou funcionalidades comerciais.

## Verificação

- `npm test`: **133 unitários e 112 testes de navegador/emuladores aprovados**, sem falhas ou testes ignorados.
- **90 capturas principais e 180 verificações de largura em 22 telas/estados**, sem transbordamento horizontal da página. Tabelas e trilho têm rolagem interna intencional no celular.
- Temas claro/escuro em 360, 390, 768 e 1440px; página pública também em 1920 e 2560px. Edição de demanda com texto ampliado e contraste maior; menu também coberto a 200% pelos testes existentes.
- Inspeção visual das capturas atuais em `exports/minimalismo-industrial-2026-09-27`. Relatório de larguras: `ui-checks.json` nessa pasta.
- `git -c core.safecrlf=false diff --check`: aprovado.

Testes existentes foram ajustados onde exigiam a etiqueta decorativa removida ou o uso anterior de laranja em metadados. Os testes continuam verificando títulos, datas, informações dos indicadores, navegação, formulários e a jornada persistida.

Validação local em Chromium e emuladores Firebase. Sem implantação remota ou publicação Git. Limites funcionais e a pendência anterior de limpeza de artefatos permanecem documentados na [revisão 30](30-revisao-final-do-produto.md). Documentos e alterações anteriores foram preservados.
