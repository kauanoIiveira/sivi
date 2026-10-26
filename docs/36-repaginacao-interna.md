# Repaginação interna — 23/10/2026

Continuação da entrega pública em [35](35-repaginacao-publica.md), agora incluindo expressamente a área autenticada por solicitação do responsável. A pasta efetiva permanece `C:\Users\Kauan\Desktop\sivi`; a cópia em Documents não recebeu estas alterações. Direção: interface de operação ligada à marca pública, com gráficos derivados dos registros reais e ações claras.

## Uso e apresentação

- Moldura de navegação, empresa/atuação, caminho e título visíveis, folha de trabalho clara, Manrope, contornos discretos e ações em laranja.
- Comprador: resumo, movimento de demandas/propostas/pedidos, carteira atual, demandas recentes e próximos passos, recomendações e acompanhamento com registros vinculados.
- Fornecedor: indicadores e gráficos antes das listas extensas, acesso a oportunidades, propostas próprias e execução. Pendências e inspeções permanecem disponíveis.
- Administração: contagens calculadas da lista de empresas e controles anteriores de cadastro/análise, sem alteração das permissões.
- Demandas, propostas, pedidos, fornecedores, avaliações, perfil industrial e contexto recebem o tratamento visual compartilhado; formulários, filtros, exportação, comparação e ações conservam seus contratos.
- Tema escuro, texto de 125%, contraste, alternativas cromáticas e redução de movimento preservados. Formulários e menus permanecem acessíveis por teclado e em telas estreitas.

Para ver o sistema com atividade ilustrativa sem criar contas, abra `http://127.0.0.1:4173/tests/fixtures/workspace-preview.html?role=buyer#/app/comprador/inicio` após `npm start`. Esta é uma fixture identificada, com componentes reais e dados exclusivamente em memória. O seletor permite comprador, fornecedor e administração; o estado simula atividade, vazio ou erro. A área normal continua exigindo autenticação, vínculos e permissões reais. A fixture não fornece autorização nem escreve no Firebase.

## O que os gráficos medem

`src/domain/workspace-insights.js` gera seis intervalos para 30/60/90 dias, incluindo o dia atual de São Paulo. A série conta criações de demandas, propostas e pedidos, e não alterações de status. Uma proposta com várias versões conta uma vez: usa o timestamp principal quando disponível ou a primeira data válida das versões, conforme o contrato do serviço existente. Registros sem data válida são explicitados; datas futuras e fora do período não entram.

A carteira segmentada mostra os estados atuais de todos os pedidos carregados para a empresa, independente do filtro temporal da curva. Outros estados têm categoria própria. O valor registrado soma itens e frete em centavos das versões aceitas; registros monetários incompletos ou sem precisão segura são identificados fora da soma. Não representa faturamento, pagamento recebido, previsão ou comparação com período anterior.

Controles de período/tipo, inspeção dos seis pontos por mouse ou teclado e tabela textual usam os mesmos agregados. Sem atividade, os números permanecem zero e a interface orienta o próximo passo. Não há mistura de unidades físicas ou séries fictícias no uso autenticado.

## Estrutura técnica

Páginas e serviços JavaScript preservados; `src/workspace/analytics.tsx` é montado pelos adaptadores dos dois painéis e desmontado em recargas/saídas. `activityRecords` contém somente os registros já autorizados pelo repositório. O módulo é exportado pela biblioteca compilada existente em `src/generated/public/`, sem Firebase ou dependência nova. `src/styles/workspace-redesign.css` tem escopo `.app-shell`, depois dos estilos operacionais anteriores; alternativas cromáticas são herdadas do body. Os tamanhos novos usam rem e a escala existente nos termos fluidos.

Compilar com `npm run check:public` e `npm run build:public`; `npm start` compila antes de abrir. O build pronto acompanha a exportação. As regras remotas, autenticação, aprovação, cobrança e persistência comercial não foram alteradas nem publicadas.

## Evidências e revisão

Snapshot anterior: `.checks/workspace-redesign-20261023/source-before.zip`. Capturas: `.impeccable/review/workspace/`; script repetível `scripts/capture-workspace-review.mjs`. Foram registradas 28 combinações de página/viewport/estado/tema, sem transbordamento da página ou erro JavaScript; larguras de 360, 390, 768, 1265, 1440 e 1920px. Os cenários ilustrativos não substituem os testes funcionais em emuladores.

Revisão independente de código encontrou três pontos importantes e um localizado de contraste: timestamp das propostas, escala de 125%, herança das alternativas cromáticas e botão administrativo escuro. Todos foram corrigidos e reconferidos: título de 31,68 para 39,6px, navegação de 13 para 16,25px, gráfico de 17 para 21,25px; contraste do botão de 1,63 para 7,30:1. O teste de versões confirmou uma criação por proposta.

O detector não encontrou achados primários nos três arquivos novos de interface; os 50 avisos consultivos apontaram extensões de cores/tamanhos ainda não registradas no documento público anterior. A documentação visual da operação registra os valores atuais; não se declarou uma nova execução do detector.

Verificação final: **208 testes unitários e 177 testes de navegador aprovados**, typecheck e build aprovados. A primeira execução completa identificou três seletores ambíguos por repetição de “Criar primeira demanda”; o link secundário passou a “Ver minhas demandas”, sem alterar o teste legado, e a suite completa foi executada novamente com 177 aprovações.

Na revisão visual, os três ajustes solicitados foram reconferidos: eixo Y em HTML sem compressão, primeiro pedido visível no viewport móvel e unificação de fornecedores/avaliações. Parecer `ship` restrito a esses ajustes; restou observação pequena e não bloqueante sobre textos selecionados abreviados pelo espaço dos selects móveis. Não equivale a certificação de acessibilidade. As revisões foram realizadas por agentes independentes equivalentes, pois os tipos especializados não estavam expostos neste ambiente.

Resultados completos e pacote portátil estão no ledger `.superpowers/sdd/2026-10-23-repaginacao-interna/progress.md` e nas evidências da entrega. Sem Git nesta pasta: não houve commit, push ou implantação.
