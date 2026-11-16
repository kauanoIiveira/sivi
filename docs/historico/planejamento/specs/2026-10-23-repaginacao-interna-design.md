# Repaginação interna — SIVI

Continuação em `C:\Users\Kauan\Desktop\sivi`. Em23/10 o responsável ampliou expressamente o escopo para a área interna e pediu para prosseguir usando o modelo de gráficos/dashboard enviado. Esta ampliação substitui o limite de aparência pública da spec anterior; as regras de produto continuam válidas. A direção visual já escolhida é estendida à operação. Não se atribui ao usuário aprovação prévia de detalhes novos: as decisões abaixo são de implementação, sob a liberdade de composição concedida.

## Intenção

O sistema deve ser fácil de entender, usar, demonstrar e vender. Presença visual vem de composição, hierarquia, números legíveis, gráficos e próximos passos claros. A superfície operacional serve ao trabalho diário: a animação não pode esconder informações, atrasar ações ou repetir o hero cinematográfico.

## Abordagem

1. Somente recolorir: pouco impacto na demonstração e não atende ao pedido de gráficos. Descartada.
2. Reconstruir toda a aplicação em React: possível, porém aumenta o risco nas regras e formulários existentes sem ganho necessário. Descartada para esta entrega.
3. Remodelar a interface compartilhada e as páginas, incorporando um módulo React/Motion para gráficos reais: escolhida pelo implementador. Mantém roteador, serviços e controles existentes, com composição nova e dados verificáveis. O usuário pediu para prosseguir, dispensando nova rodada de escolhas.

## Mundo visual e composição

Manrope, raposa original, papel claro, grafite, laranja em ações/dados e verdes de seleção ligam a operação à apresentação. Direção app `framed-sheet`: navegação em moldura clara e folha de trabalho branca, espaçamento coerente, contornos discretos e sem sombras generalizadas. Tema escuro, texto ampliado, contraste e alternativas de visão cromática permanecem. A navegação mostra a empresa e atuação; o título e caminho da página ficam visíveis. Celular conserva menu, leitura, filtros e formulários.

No comprador: título e ação principal, indicadores maiores, gráfico de movimento por período e distribuição atual dos pedidos, demandas recentes e próximos passos, recomendações e acompanhamento real. No fornecedor: oportunidades, propostas e pedidos próprios, os mesmos gráficos e ações de execução. Administração: resumo dos estados das empresas junto dos controles existentes. Demandas/propostas/pedidos, fornecedores, avaliações, perfil industrial e contexto recebem tipografia, superfícies e controles coerentes.

## Contrato dos gráficos

`buildWorkspaceInsights(records,{role,days,now})` é uma função pura. Períodos30/60/90 dias incluem o dia atual de São Paulo, com seis intervalos não sobrepostos; o último termina no dia atual. Contar criação de demandas, propostas e pedidos, sem transformar revisões em novas propostas. Datas ausentes/inválidas ficam fora da série, com quantidade omitida visível; datas futuras ficam fora do período. O gráfico não representa histórico de status.

A carteira por estado é um retrato de todos os pedidos atuais da empresa, independente do período. Estados desconhecidos têm categoria Outros. Totais e partes vêm dos mesmos registros. Valor em pedidos soma centavos e frete das versões aceitas; valor incompleto é identificado, nunca vendido como receita ou pagamento. Nenhum cálculo combina quantidades de unidades diferentes. Fornecedor só usa os registros já autorizados pelo repositório; administração não recebe registros comerciais novos.

Curva filtrável por tipo e período, inspeção por mouse/teclado, número animado, distribuição segmentada e tabela acessível adaptam o modelo fornecido. Ausência de atividade tem explicação e ação correspondente. Todos os controles possuem rótulos/foco e redução de movimento.

## Limites e aceite

Não alterar permissões, regras Firebase, etapas comerciais, condições aceitas, isolamento, cobrança, aprovação ou identidade. Sem publicação remota nem contas de teste remotas. Pasta sem Git: snapshot e ledger substituem commits/worktree. React/TS/Motion já instalados; sem dependência nova.

Aceite: testes dos agregados e do isolamento dos contratos; filtros e números coerentes no navegador; manutenção do fluxo industrial; telas em360/390/768/1265/1440/1920, tema claro/escuro e movimento reduzido; nenhuma rolagem horizontal de página. Revisão independente do código e capturas, documentação do sistema visual e pacote portátil final.
