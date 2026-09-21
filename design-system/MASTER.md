# SIVI · Design System

Atualizado em 16/09/2026. Referência para a interface existente e as próximas páginas. O produto é um intermediador B2B industrial desenvolvido como TCC do SENAI, com dados persistidos e ações reais.

## Direção

Uma central de compras e fornecimento industrial: navegação grafite, hierarquia técnica, leitura de dados e laranja nas decisões principais. O acabamento é sóbrio, com densidade suficiente para comparar especificações, valores, quantidades e prazos. Evitar transformar telas operacionais em páginas de apresentação.

O nome SIVI identifica o sistema. A arte final da marca e da raposa permanece pendente; não mostrar placeholders de identidade ao usuário e não inventar poses ou outro mascote.

## Cores

Os valores vivem em `src/styles/theme-tokens.css`. Usar tokens nos componentes.

| Uso | Claro | Escuro |
|---|---|---|
| Fundo | `#F3F4F4` | `#111315` |
| Superfície | `#FFFFFF` | `#181A1D` |
| Superfície secundária | `#ECEFF0` | `#1D2024` |
| Texto principal | `#18232B` | `#F5F5F7` |
| Texto secundário | `#52616B` | `#A1A1A6` |
| Ação preenchida | `#FE7F2D` com texto preto | Igual |
| Link ou ação em texto | `#A54100` | `#FE7F2D` |
| Navegação | `#18252D` | Igual |

Laranja claro sobre branco não serve para texto pequeno. Verde indica aprovação ou conclusão; amarelo indica atenção; vermelho indica erro ou bloqueio operacional. Uma etapa futura dependente de outra usa cor neutra, sem parecer uma falha. Estado sempre inclui texto.

## Tipografia e geometria

- Archivo para títulos, controles e leitura.
- IBM Plex Mono para métricas, códigos e marcadores técnicos.
- Título da página: 26–36px, peso 650, linha 1.15–1.2.
- Corpo e dados: 14–16px; rótulos: 12–14px; metadados curtos: 11–12px.
- Campos no celular: pelo menos 16px.
- Números comparáveis usam algarismos tabulares.
- Espaçamento: 4, 8, 12, 16, 20, 24, 32, 48px.
- Controles com altura mínima de 44px, raios de 4–6px; painel de acesso com 12px.
- Bordas leves separam dados. Evitar sombras em cartões, excesso de caixas e gradientes decorativos.

## Estrutura das telas

1. Navegação persistente com empresa e papel ativos.
2. Cabeçalho compacto, localização, conta e tema.
3. Título, descrição operacional curta e ação principal ligada à tarefa.
4. Indicadores compactos quando ajudarem a decidir.
5. Filtros, registros e detalhes técnicos.

Desktop: sidebar de 248px, conteúdo com 32px de margem. Abaixo de 900px: menu lateral recolhível com foco contido e fechamento por Escape. No celular, formulários e detalhes passam para uma coluna. Tabelas comparativas conservam rolagem interna com acesso por teclado, sem ampliar a página inteira.

O trilho industrial usa uma sequência horizontal compacta, estados textuais, seleção por teclado e alternativa em tabela. Não substituir informação operacional por animação.

## Conteúdo e estados

- A interface se apresenta como produto em produção: não exibir TCC ou SENAI no sistema. O contexto acadêmico permanece na documentação.
- Evitar numeração decorativa de seções, rótulos em caixa alta repetidos e blocos simétricos sem função. Indicar números apenas quando comunicam progresso real, como “Etapa 1 de 2”.
- Rodapé público: identidade e navegação útil para seções existentes, dúvidas de cadastro e conta. Não inventar contatos, redes sociais, selos ou políticas para preencher espaço.
- Superfícies públicas: cabeçalho, faixa de entrada e rodapé ocupam toda a largura da janela; apenas o conteúdo interno usa `.public-shell` (até 1240px). Não colocar fundos de seção dentro de um contêiner com largura máxima nem compensar com margens negativas. A landing do BarberFlow é referência de escala tipográfica, respiro e proporção do rodapé, preservando a identidade industrial do SIVI.
- Usar “empresa”, “demanda”, “proposta”, “pedido”, “inspeção” e “entrega”. Evitar linguagem de laboratório ou detalhes de implementação.
- Empresa nova: mostrar o estado vazio e indicar a primeira ação.
- Falta de histórico: “Sem histórico”, nunca uma nota zero inventada.
- Proposta sem decisão: “Aguardando decisão”. Somente marcar como não selecionada quando existir uma decisão para aquela demanda.
- Quantidades contratadas não equivalem a um plano de produção. Não inferir estoque, produção ou qualidade sem registro.
- Manter carregamento, erro, permissão, conflito e tentativa novamente.
- Não oferecer controles de funcionalidades ainda não conectadas, como notificações.
- Longos nomes de empresa, IDs e descrições precisam quebrar linha sem esconder ações.

## Verificação

Inspecionar claro/escuro em 360, 390, 768 e 1440px; verificar teclado, foco, menu, formulários, rolagem das tabelas, feedback e ausência de erros no console. Os testes com massa de dados ficam em `tests/`; a aplicação não importa fixtures.

Na página pública, incluir 1920 e 2560px e conferir as duas bordas do rodapé contra a largura útil da janela, além de verificar ausência de transbordamento. Um teste limitado a 1440px não detecta fundos presos a esse limite.

## Referências aplicadas

Os princípios adotados são organização da informação, redução de ruído, acessibilidade, texto direto e inspeção da interface renderizada. A identidade industrial do projeto prevalece sobre minimalismo extremo.

A documentação de [tabelas do Carbon Design System](https://carbondesignsystem.com/components/data-table/usage/) orientou a separação entre cabeçalhos, dados e ações. O projeto não depende de ferramentas de assistência ao desenvolvimento para executar, testar ou transferir os arquivos.
