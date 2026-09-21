# Benchmark funcional da Odoo para o SIVI

**Versão:** 1.1  
**Atualização:** 16/08/2026  
**Estado:** arquitetura funcional das features; arquitetura técnica ainda não fechada  
**Escopo:** sistema web industrial acadêmico do SENAI com possibilidade de evolução real

## 1. Objetivo deste documento

Este documento responde a uma pergunta funcional:

> Quais ideias e funcionalidades comprovadas da Odoo tornam o SIVI mais completo, fluido e escalável como produto industrial, sem transformá-lo em um ERP genérico?

Ele **não escolhe banco, backend, hospedagem ou infraestrutura**.

### Direção técnica já informada

- sistema exclusivamente web;
- interface construída com HTML, CSS e JavaScript puro (vanilla), sem framework de interface nesta fase;
- banco e serviços de backend ainda serão comparados entre Firebase e Supabase;
- Python pode ser usado futuramente em processamento, automação, relatórios ou algoritmos, somente se houver benefício claro;
- framework complementar, autenticação, armazenamento de arquivos e hospedagem ainda não foram decididos.

Essas decisões devem ser tomadas depois de validar fluxos, features, modelo conceitual de dados e wireframes. Este documento não pressupõe Next.js, TypeScript, NestJS, PostgreSQL direto, Prisma, microserviços ou qualquer outra stack não aprovada.

## 2. Tese funcional do SIVI

O SIVI é um marketplace B2B industrial curado que preserva a continuidade de uma negociação desde a necessidade até a entrega rastreável:

```text
Empresa compradora publica demanda
→ SIVI encontra fornecedores compatíveis e explica o match
→ fornecedores convidados enviam propostas privadas e versionadas
→ comprador compara critérios técnicos e comerciais
→ aceite gera pedido com fotografia das condições
→ fornecedor declara atendimento por estoque, produção ou ambos
→ lotes passam por inspeção e liberação
→ QR permite rastreabilidade autorizada
→ entrega é confirmada
→ avaliação alimenta a reputação
```

O SIVI não fabrica, vende, transporta ou processa o pagamento. Ele organiza a relação, os registros, as evidências e as decisões entre empresas.

## 3. O melhor princípio da Odoo

O maior valor da Odoo para o SIVI não é sua grade de aplicativos. É a continuidade entre registros:

- uma informação nasce uma vez e acompanha o processo;
- uma cotação aceita vira pedido sem redigitação;
- cada registro possui estado, responsável, próxima ação e histórico;
- estoque ou produção preservam a origem no pedido;
- lotes conectam fabricação, inspeção e entrega;
- o usuário consegue navegar para os registros anteriores e posteriores da jornada;
- dashboards priorizam o que precisa de ação.

A documentação oficial descreve a continuidade entre [cotação e pedido](https://www.odoo.com/documentation/19.0/applications/sales/sales/sales_quotations.html), o [rastreio por lotes e séries](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory/product_management/product_tracking.html), os [pontos de controle da qualidade](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/quality/quality_management/quality_control_points.html) e as [atividades ligadas aos registros](https://www.odoo.com/documentation/19.0/applications/essentials/activities.html).

## 4. Regra de inspiração e propriedade intelectual

A Odoo é referência de pesquisa, não base do produto. O SIVI terá implementação, interface, textos, ícones e identidade próprios.

- conceitos e padrões de fluxo podem ser reinterpretados;
- código, telas, assets e identidade não serão copiados;
- o SIVI não será apresentado como edição, parceiro ou produto derivado da Odoo;
- uma futura integração com Odoo será apenas uma integração entre sistemas.

O [Odoo Community 19.0](https://github.com/odoo/odoo/blob/19.0/LICENSE) usa LGPLv3, enquanto a própria empresa distingue as edições [Community e Enterprise](https://www.odoo.com/page/editions). Documentação pública de uma feature não autoriza copiar implementação proprietária.

## 5. Matriz adotar, adaptar ou rejeitar

| Recurso observado na Odoo | Decisão no SIVI | Aplicação funcional |
|---|---|---|
| Usuário em várias empresas | **Adaptar** | Uma conta pode participar de organizações diferentes e alternar organização e contexto autorizados. |
| CRM e pipeline | **Adaptar** | Oportunidades, etapas, responsável e próxima ação; sem construir CRM de leads e campanhas. |
| Cotação que vira pedido | **Adotar fortemente** | A versão aceita da proposta gera o pedido sem redigitação e permanece preservada. |
| RFQs alternativas/call for tenders | **Adotar fortemente** | Uma demanda recebe propostas privadas de vários fornecedores e permite comparação uniforme. |
| Templates de cotação ou compra | **Adaptar** | Modelos de demanda por categoria industrial ajudam a não esquecer especificações. |
| Origem documental e atalhos entre registros | **Adotar** | Demanda, proposta, pedido, lote, inspeção e entrega permanecem navegáveis entre si. |
| Chatter | **Adaptar** | Timeline com eventos e observações, distinguindo conteúdo compartilhado, interno e automático. |
| Atividades | **Adotar** | Próxima ação, responsável, prazo, prioridade e conclusão ligadas ao registro correto. |
| Aprovações | **Adaptar** | Aprovação contextual para aceite, mudança relevante, liberação de lote e ação administrativa. |
| Estoque e reservas | **Adaptar** | Quantidade informada, comprometida, reservada e expedida, com origem e data; sem WMS completo. |
| Make to Order | **Adaptar** | Pedido aceito gera compromisso de atendimento; falta pode originar produção simplificada. |
| MRP | **Reduzir bastante** | Quantidade, etapas, responsável, previsão, problema e conclusão; sem engenharia fabril completa. |
| Subcontratação | **Preparar para futuro** | Registrar responsabilidades e evidências quando terceiro participar, sem gerir toda a cadeia no MVP. |
| Lotes e séries | **Adotar o conceito** | Lote no MVP e possibilidade futura de rastreio unitário por número de série. |
| Pontos e verificações de qualidade | **Adotar e simplificar** | Plano de inspeção, controles obrigatórios, resultado, evidência, não conformidade e liberação. |
| PLM e controle de versão | **Adaptar** | Versões de demanda e proposta; futura emenda de pedido com histórico de diferenças. |
| Portal | **Adaptar** | Compradores e fornecedores são usuários completos, não apenas visitantes de leitura. |
| Dashboards | **Adaptar** | Visões por contexto focadas em pendências, risco, prazos e registros de origem. |
| Manutenção de máquinas | **Rejeitar no núcleo** | Pode virar informação de indisponibilidade ou integração futura, não módulo completo. |
| Contabilidade e faturamento | **Rejeitar no núcleo** | Condição de pagamento é informativa; SIVI não faz contabilidade nem emite cobrança no MVP. |
| POS, loja e checkout | **Rejeitar** | Negociação industrial ocorre por demanda e proposta, não por compra imediata de varejo. |
| Marketing e automação de campanhas | **Rejeitar** | Não pertence à tese do marketplace industrial inicial. |
| Grade de aplicativos independentes | **Rejeitar na experiência** | Para o usuário, tudo forma uma jornada; não haverá sensação de vários mini-ERPs. |
| Studio/no-code genérico | **Rejeitar no MVP** | Categorias e critérios podem ser configuráveis sem criar um construtor universal de sistemas. |

Referências oficiais adicionais: [call for tenders](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/purchase/manage_deals/calls_for_tenders.html), [reabastecimento sob pedido](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory/warehouses_storage/replenishment/mto.html), [produção](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/manufacturing.html), [quality checks](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/quality/quality_management/quality_checks.html) e [portal](https://www.odoo.com/documentation/19.0/applications/general/users/user_portals/portal_access.html).

## 6. Arquitetura funcional

Arquitetura funcional significa separar responsabilidades do produto, sem decidir como elas serão implementadas no código ou no banco.

| Área funcional | Responsabilidade no SIVI |
|---|---|
| Acesso e organizações | contas, empresas, membros, papéis, convite, aprovação e contexto ativo |
| Perfil industrial | ofertas, capacidades, processos, materiais, certificações e regiões |
| Demandas | necessidade do comprador, itens, requisitos, anexos, versão e publicação |
| Match | elegibilidade, aderência e explicação dos resultados |
| Oportunidades | demandas liberadas para cada fornecedor e prazo de resposta |
| Propostas | resposta técnica/comercial, versões, validade, revisão e privacidade |
| Comparação e aceite | critérios normalizados, decisão humana e registro da versão escolhida |
| Pedidos | compromisso comercial, condições congeladas, estados e ocorrências |
| Execução industrial | estoque informado, reserva, produção simplificada e marcos |
| Qualidade e rastreabilidade | plano, lote, inspeção, não conformidade, liberação e QR |
| Entrega | expedição, eventos manuais, ocorrência e recebimento |
| Confiança | avaliações por pedido e reputação reproduzível |
| Coordenação | atividades, notificações, timeline e observações |
| Administração da plataforma | curadoria, validação, moderação, suporte e indicadores |

Essas áreas podem virar componentes, páginas, serviços ou coleções diferentes conforme Firebase ou Supabase. A separação funcional não obriga uma arquitetura técnica específica.

## 7. Feature transversal: registro central conectado

Demanda, proposta e pedido devem funcionar como registros centrais, semelhantes à continuidade documental observada na Odoo.

Toda página de detalhe relevante deve mostrar:

- código e estado atual;
- organização e contexto ativos;
- responsável atual;
- prazo e próxima atividade;
- versão consultada;
- alertas ou bloqueios;
- documentos de origem;
- registros gerados posteriormente;
- timeline de eventos;
- ações permitidas naquele momento.

Exemplo no pedido:

```text
Demanda de origem
Proposta e versão aceita
Plano de atendimento
Reservas ou produção
Lotes
Inspeções e não conformidades
QR Codes
Entrega
Avaliação
```

O usuário não deve procurar manualmente a mesma operação em vários módulos desconectados.

## 8. Acesso, organizações e contexto

### MVP de acesso e organizações

- cadastro ou convite de usuário;
- solicitação e validação de organização;
- organização habilitada como compradora, fornecedora ou ambas;
- membros e papéis internos;
- alternância explícita de organização e contexto;
- organização/contexto sempre visíveis;
- suspensão sem apagar histórico;
- recuperação de acesso e controle de sessão;
- acesso restrito aos dados autorizados.

### Evolução de acesso

- autenticação multifator;
- login corporativo;
- delegação temporária;
- aprovação em múltiplos níveis;
- políticas diferentes por organização.

### Limite de contexto

Não reproduzir o conceito de várias empresas marcadas simultaneamente para escrita. Cada ação ocorre em um contexto claramente ativo para evitar publicar, aceitar ou alterar pelo lado errado.

## 9. Perfil e capacidade industrial do fornecedor

### MVP do perfil industrial

- dados cadastrais e situação de aprovação;
- atuação como fabricante, distribuidor ou revendedor;
- categorias de produtos e serviços;
- processos, materiais e capacidades declaradas;
- faixas quantitativas e unidades;
- marcas ou fabricantes atendidos, quando aplicável;
- certificações com validade e situação de verificação;
- regiões atendidas e prazo indicativo;
- anexos autorizados;
- data da última atualização;
- reputação com período e amostra.

### Adaptação inspirada na Odoo

Capacidade e disponibilidade não são apenas campos de texto. Devem possuir contexto, unidade, origem, validade e responsável para que o match seja explicável.

### Fora do MVP do perfil industrial

- calendário detalhado de máquinas;
- OEE, MTBF e MTTR;
- manutenção preventiva;
- capacidade finita por centro de trabalho;
- sincronização automática com ERP ou MES.

## 10. Demandas industriais e templates

### MVP de demandas

- rascunho e salvamento progressivo;
- título, descrição, categoria e tipo de necessidade;
- um ou mais itens;
- quantidade e unidade;
- prazo desejado e destino;
- especificações técnicas por categoria;
- requisito obrigatório, desejável ou informativo;
- peso opcional para comparação;
- marca preferida e aceitação de equivalente;
- anexos técnicos;
- condição de pagamento esperada;
- convite a fornecedores;
- publicação e expiração;
- versão imutável depois da publicação;
- histórico de alterações.

### Templates adaptados

Modelos por categoria podem sugerir campos, unidades, documentos e controles de qualidade, por exemplo:

- usinagem;
- caldeiraria;
- componentes mecânicos;
- manutenção industrial;
- equipamentos elétricos;
- peças seriadas;
- solução sob medida.

O template acelera o preenchimento, mas não cria um catálogo rígido incapaz de atender demandas personalizadas.

## 11. Match e oportunidades

### MVP de match e oportunidades

- elegibilidade por categoria, processo, material, região, certificação e prazo;
- comparação entre requisitos da demanda e dados do fornecedor;
- resultado atendido, parcial, não informado ou impeditivo;
- explicação por critério;
- pontuação opcional, sempre acompanhada dos fatores;
- fornecedor recebe apenas oportunidades liberadas para sua organização;
- prazo para responder;
- atividade automática de resposta;
- histórico da rodada de match.

### Regra essencial

Match não significa vencedor. Ele identifica compatibilidade e ajuda a formar a concorrência. A escolha final continua humana.

### Evolução do match

- recomendação baseada em histórico suficiente;
- previsão de risco;
- aprendizado com resultados anteriores;
- pesos personalizados pelo comprador;
- sugestão de fornecedores alternativos.

Essas evoluções só podem usar o rótulo de inteligência artificial quando realmente utilizarem modelo ou técnica compatível, com explicação e controle humano.

## 12. Propostas e negociação versionada

### MVP de propostas

- uma negociação por fornecedor e demanda;
- rascunho de proposta;
- resposta por item;
- preço unitário e total;
- frete e custo total;
- impostos apenas informados quando aplicável;
- prazo de fabricação/preparação;
- previsão de entrega;
- condição de pagamento;
- validade;
- garantia estruturada;
- marca, fabricante real e organização fornecedora separados;
- resposta a cada requisito técnico;
- ressalvas e alternativas;
- anexos;
- envio de versão imutável;
- pedido de revisão pelo comprador;
- nova versão sem apagar a anterior;
- atividade de revisão;
- propostas concorrentes invisíveis entre fornecedores.

### Garantia estruturada

Uma proposta deve informar:

- quem responde pela garantia;
- quando ela começa;
- duração;
- cobertura;
- exclusões essenciais;
- procedimento inicial em caso de problema.

### Evolução da negociação

- rodadas formais de negociação;
- contraproposta estruturada;
- aprovação interna do fornecedor;
- assinatura eletrônica;
- múltiplas moedas;
- leilão reverso, somente se futuramente aprovado.

## 13. Comparador e aceite

O comparador é uma das features centrais e distintivas do SIVI.

### Critérios do MVP

- fornecedor e sua atuação na oferta;
- marca e fabricante real;
- custo dos itens;
- frete;
- custo total;
- prazo de fabricação/preparação;
- previsão de entrega;
- aderência técnica;
- ressalvas e equivalências;
- garantia;
- certificações relevantes;
- reputação, período e quantidade de avaliações;
- pedidos concluídos e pontualidade;
- condição de pagamento;
- validade e versão.

### Regras do comparador

- critérios aparecem na mesma base para todas as propostas;
- diferenças relevantes são destacadas sem esconder desvantagens;
- preço, nota ou posição não determinam vencedor automaticamente;
- fornecedor novo aparece como “sem histórico”, não nota zero;
- qualidade histórica não é confundida com inspeção do pedido futuro;
- antes do aceite existe resumo da versão e das consequências;
- aceite registra a versão exata e gera um único pedido;
- demais propostas são encerradas sem expor a proposta vencedora aos concorrentes.

### Experiência móvel

No celular, evitar tabela horizontal impossível de ler. Usar comparação por critérios, proposta a proposta ou pares selecionados.

## 14. Pedido e continuidade comercial

### MVP do pedido

- pedido criado a partir da proposta aceita;
- fotografia de itens, quantidades, valores, prazos, garantia e condições;
- comprador e fornecedor identificados;
- estados comerciais próprios;
- responsáveis e próxima atividade;
- ocorrências;
- timeline compartilhada;
- navegação para demanda e proposta de origem;
- cancelamento formal com motivo, quando permitido;
- valores negociados não são chamados de faturamento do SIVI.

### Regra de imutabilidade funcional

Preço, quantidade, requisito ou prazo aceitos não são substituídos silenciosamente. Uma alteração futura deverá usar revisão ou emenda identificável, com concordância das partes conforme sua relevância.

### Evolução do pedido

- emendas formais;
- pedido dividido entre fornecedores;
- entregas parciais;
- contratos e assinatura;
- integração financeira ou fiscal.

## 15. Atendimento por estoque ou produção

O SIVI acompanha o cumprimento do pedido. Ele não substitui o ERP, WMS ou MES do fornecedor.

### MVP do atendimento industrial

- plano de atendimento por item;
- quantidade proveniente de estoque;
- quantidade a produzir;
- combinação das duas origens;
- origem da informação: manual, importada ou integrada;
- data e responsável pela atualização;
- compromisso ou reserva simplificada;
- previsão de início e conclusão;
- etapas configuráveis de produção;
- quantidade concluída;
- problema, pausa, atraso e justificativa;
- refugo informado quando necessário;
- formação do lote;
- visão resumida para o comprador.

### Não expor ao comprador

- saldo completo do fornecedor;
- custo interno;
- margem;
- capacidade detalhada não autorizada;
- materiais consumidos;
- outros pedidos em produção;
- anotações internas.

### Fora do MVP industrial

- BoM/ficha técnica completa;
- compra automática de matéria-prima;
- centros de trabalho;
- apontamento por operador;
- custo industrial;
- MPS, OEE e planejamento finito;
- manutenção de máquinas;
- múltiplos armazéns e rotas de separação.

## 16. Qualidade, lote e não conformidade

### Plano de inspeção

- identifica quais controles são necessários;
- pode vir da categoria, demanda ou regra do fornecedor;
- possui versão preservada;
- define instrução, tipo de resultado, unidade, amostragem e evidência;
- informa quais controles são obrigatórios.

### Inspeção do MVP

- ligada ao lote e à versão do plano;
- responsável e datas;
- passa/falha;
- medição numérica;
- texto ou observação;
- foto ou documento;
- quantidade inspecionada;
- quantidade aprovada, reprovada e em retrabalho;
- reinspeção sem apagar o resultado anterior.

### Não conformidade

Falha obrigatória não vira apenas comentário. Ela registra:

- critério que falhou;
- descrição;
- gravidade;
- quantidade afetada;
- contenção ou destino;
- responsável;
- prazo;
- ação ou retrabalho;
- resultado da reinspeção;
- encerramento justificado.

Quantidade afetada permanece bloqueada até a decisão registrada. Somente quantidade liberada pode ser expedida.

### Lotes e séries

- lote identifica um grupo de unidades;
- número de série identificará uma unidade em evolução futura;
- origem, pedido, item, fornecedor, produção, inspeções e entrega permanecem conectados;
- rastreio por lote faz parte do MVP;
- rastreio serial não precisa de tela no MVP, mas não deve ser impedido pelo conceito de produto.

## 17. QR Code e consulta de rastreabilidade

### MVP do QR

- QR gerado somente para lote liberado;
- identificador seguro, não um número interno previsível;
- situação do token: ativo, expirado, substituído ou revogado;
- página pública controlada;
- detalhes adicionais para comprador e fornecedor autenticados;
- registro de emissão e revogação;
- possibilidade de reemitir sem apagar o histórico.

### Nunca expor publicamente por padrão

- preço;
- condição de pagamento;
- nome ou dados pessoais do comprador;
- endereço completo;
- proposta;
- anexo privado;
- saldo de estoque;
- observação interna;
- informação estratégica da fábrica.

Os campos exatos da consulta pública ainda precisam ser aprovados.

## 18. Expedição, entrega e recebimento

### MVP da entrega

- preparação para envio;
- lote e quantidade expedidos;
- transportadora informada;
- código de rastreio opcional;
- previsão vigente;
- expedição;
- atualização manual de transporte;
- atraso ou ocorrência;
- entrega informada;
- confirmação do comprador;
- recebimento com ou sem ressalva;
- atividade de confirmação;
- histórico cronológico.

### Evolução da entrega

- integração com transportadora;
- cotação de frete;
- rastreamento automático;
- múltiplas entregas;
- comprovante digital;
- logística reversa.

## 19. Avaliação e reputação

### MVP de avaliação e reputação

- avaliação somente após pedido entregue;
- uma avaliação válida por pedido;
- qualidade;
- prazo;
- atendimento;
- conformidade;
- custo-benefício;
- comentário moderável;
- nota final por regra conhecida;
- quantidade de avaliações;
- período analisado;
- pedidos concluídos;
- percentual de entregas no prazo;
- estado “sem histórico”.

### Regras de reputação

- reputação pertence à organização fornecedora;
- marca ou fabricante não herdam automaticamente essa reputação;
- visualizações, seguidores e curtidas não formam a nota;
- destaque pago nunca altera reputação ou posição padrão no comparador;
- indicadores devem abrir os registros autorizados que os originaram;
- conteúdo contestado ou moderado mantém estado transparente.

## 20. Atividades, notificações e timeline

Inspirado nas activities e no Chatter, mas adaptado à relação entre organizações.

### Tipos distintos

| Tipo | Finalidade | Visibilidade |
|---|---|---|
| Evento do sistema | registrar mudança objetiva de estado | partes autorizadas |
| Mensagem compartilhada | comunicação sobre demanda, proposta ou pedido | participantes autorizados |
| Observação interna | coordenação privada da empresa | somente organização autora |
| Atividade | informar responsável, prazo e ação esperada | responsável e gestores autorizados |
| Notificação | chamar atenção para evento ou atividade | usuário destinatário |
| Auditoria | responsabilização sobre ação crítica | administração autorizada |

### Atividades automáticas do MVP

- concluir cadastro da organização;
- responder oportunidade;
- revisar proposta;
- decidir proposta próxima da validade;
- planejar atendimento;
- atualizar etapa atrasada;
- inspecionar lote;
- resolver não conformidade;
- expedir lote liberado;
- confirmar recebimento;
- avaliar pedido.

### Limite de comunicação

Não construir Slack ou chat corporativo. A comunicação existe para sustentar os registros e decisões da jornada industrial.

## 21. Dashboards orientados a ação

Dashboards não devem ser apenas coleções de cartões e gráficos.

### Comprador

- demandas sem cobertura;
- propostas novas ou próximas do vencimento;
- decisões pendentes;
- pedidos com risco ou atraso;
- lotes bloqueados;
- entregas aguardando confirmação;
- atividades do usuário;
- atalho para publicar demanda.

### Fornecedor

- oportunidades com prazo;
- propostas em rascunho ou revisão;
- pedidos sem plano de atendimento;
- produção atrasada;
- inspeções pendentes;
- não conformidades abertas;
- pedidos liberados para expedição;
- reputação e pontualidade;
- atividades do usuário.

### Administração da plataforma

- organizações aguardando validação;
- cobertura de fornecedores por categoria e região;
- demandas sem match ou proposta;
- conversão entre demanda, proposta e pedido;
- tempo médio por etapa;
- ocorrências e denúncias;
- acessos excepcionais;
- integridade da operação demonstrável.

### Regras dos indicadores

- período e filtros visíveis;
- unidade e origem conhecidas;
- acesso ao registro de origem quando autorizado;
- nenhum dashboard amplia permissão;
- gráfico somente quando responde melhor que lista ou tabela;
- valores negociados não são faturamento do SIVI.

## 22. Administração e governança

### MVP de administração

- analisar solicitações de organização;
- aprovar, rejeitar, suspender e reativar;
- validar documentos e certificações;
- manter categorias, unidades e tipos de capacidade;
- configurar critérios e pesos padrão do match;
- moderar avaliações, conteúdo e denúncias;
- tratar ocorrências excepcionais;
- consultar auditoria;
- prestar suporte justificado;
- acompanhar saúde funcional da plataforma.

### Limites

- administração não escolhe proposta pelo comprador;
- suporte não altera silenciosamente preço ou condição comercial;
- suspensão não apaga histórico;
- acesso excepcional exige justificativa;
- parâmetros globais não podem revelar informações privadas.

## 23. Superfícies e navegação

### Site institucional público

- início;
- como funciona;
- para compradores;
- para fornecedores;
- confiança, qualidade e rastreabilidade;
- “Como seria sem a SIVI × Como seria com a SIVI”;
- perguntas frequentes;
- contato e solicitação de acesso;
- termos e privacidade.

Não haverá marketplace, demanda, proposta ou preço indexável publicamente no MVP.

### Autenticação e entrada

- login;
- recuperação;
- convite;
- solicitação de acesso;
- acompanhamento da aprovação;
- seleção de organização e contexto.

### Aplicação autenticada

A navegação deve girar em torno de:

- **Fornecedores**;
- **Demandas**;
- **Oportunidades e propostas**;
- **Pedidos**;
- **Execução**;
- **Reputação**;
- **Empresa**;
- **Administração da plataforma**, quando autorizada.

Estoque, produção, qualidade e logística aparecem como abas, filas e atividades relacionadas ao pedido. Não devem parecer quatro sistemas independentes.

### Consulta de rastreabilidade

- rota própria;
- experiência simples para leitura de QR;
- resumo público permitido;
- indicação clara quando o token for inválido ou revogado;
- autenticação para detalhes comerciais.

## 24. Pacotes funcionais por prioridade

### Núcleo obrigatório da demonstração

1. organizações, usuários, papéis e aprovação;
2. perfil industrial e capacidades;
3. demanda versionada;
4. match explicável;
5. oportunidades e propostas privadas;
6. comparador e aceite;
7. pedido com condições preservadas;
8. atendimento por estoque, produção ou ambos;
9. plano de inspeção, lote e qualidade;
10. QR e rastreabilidade;
11. entrega manual e recebimento;
12. avaliação e dashboards essenciais;
13. atividades, notificações e histórico indispensáveis ao fluxo.

### Importantes depois do núcleo

- templates de demanda por categoria;
- mensagens compartilhadas;
- observações internas;
- emenda formal de pedido;
- aprovação em múltiplos níveis;
- número de série;
- relatórios exportáveis;
- perfis industriais mais ricos;
- notificações por e-mail;
- API ou importação de dados.

### Futuro ou integração

- pagamentos e escrow;
- fiscal e contabilidade;
- assinatura eletrônica;
- ERP, MES e WMS;
- transportadoras;
- subcontratação detalhada;
- planejamento avançado de fábrica;
- manutenção;
- previsão e recomendação por IA;
- múltiplos vencedores;
- moedas, idiomas e países.

### Rejeitados como direção principal

- varejo com carrinho e checkout;
- rede social de fornecedores;
- popularidade por curtidas;
- ERP completo dentro do SIVI;
- escolha automática do vencedor;
- marketplace anônimo;
- dezenas de aplicativos desconectados.

## 25. Ordem funcional de produção

### Etapa 0 — Definir antes de programar

- registrar curso, competências, prazo, equipe e critérios acadêmicos;
- escolher a vertical e validar o problema industrial;
- fechar o dossiê técnico do cenário com docente ou especialista;
- conectar requisito aceito, inspeção, lote e QR;
- resolver estados e regras contraditórias;
- reduzir o MVP implementável conforme a [auditoria SENAI](15-alinhamento-senai-e-validacao-industrial.md);
- validar este catálogo de features;
- validar permissões e visibilidade;
- fechar campos mínimos do cenário de demonstração;
- desenhar wireframes de baixa fidelidade;
- testar a jornada com dados fictícios;
- comparar Firebase e Supabase contra as necessidades reais;
- decidir se alguma responsabilidade exige Python;
- somente depois fechar a organização técnica dos módulos de JavaScript vanilla.

### Etapa 1 — Acesso e empresas

- login;
- organização;
- membros e papéis;
- aprovação;
- contexto ativo;
- isolamento de dados.

### Etapa 2 — Demanda e match

- perfil industrial;
- demanda;
- requisitos e anexos;
- publicação;
- match e explicação;
- oportunidade do fornecedor.

### Etapa 3 — Proposta e pedido

- proposta e versão;
- revisão;
- comparação;
- aceite;
- pedido;
- histórico e atividades.

### Etapa 4 — Execução e qualidade

- estoque/produção;
- plano de atendimento;
- lote;
- plano de inspeção;
- resultado e não conformidade;
- liberação e QR.

### Etapa 5 — Entrega e confiança

- expedição;
- eventos manuais;
- recebimento;
- avaliação;
- reputação;
- dashboards.

### Etapa 6 — Refinamento acadêmico

- responsividade;
- acessibilidade;
- segurança;
- tratamento de erros e estados vazios;
- testes do fluxo completo;
- massa de demonstração;
- documentação e apresentação ao SENAI.

## 26. Cenário funcional obrigatório

1. Empresa Alfa Manutenção Industrial publica uma demanda por 500 engrenagens.
2. O SIVI encontra ao menos dois fornecedores e explica a compatibilidade.
3. Cada fornecedor envia uma proposta privada com diferenças reais.
4. O comprador compara técnica, custo, prazo, garantia e reputação.
5. Uma versão é aceita e gera um único pedido.
6. O fornecedor escolhido informa 320 unidades por estoque e 180 por produção.
7. A produção e o estoque formam lotes.
8. O plano de inspeção gera controles; uma falha demonstra não conformidade e bloqueio.
9. Somente o lote liberado recebe QR.
10. A entrega é atualizada manualmente e confirmada.
11. A avaliação modifica a reputação e os dashboards.

Esse cenário deve orientar wireframes, dados fictícios, critérios de aceite e demonstração. Ele não limita o SIVI ao mercado de engrenagens.

## 27. Critério de pronto por feature

Uma feature está pronta para desenvolvimento quando possui:

- ator e objetivo;
- entrada e resultado esperado;
- estados e ações permitidas;
- visibilidade por organização;
- dados mínimos;
- regra de erro e conflito;
- atividade ou notificação necessária;
- histórico que precisa ser preservado;
- wireframe ou fluxo validado;
- critérios de aceite;
- impacto no cenário de demonstração.

Uma feature só está concluída quando:

- funciona no contexto comprador, fornecedor ou administração correto;
- não expõe dados de outra organização;
- trata carregamento, vazio, erro, sucesso e falta de permissão;
- preserva versões e histórico quando necessário;
- funciona em desktop, tablet e celular;
- é utilizável por teclado e não depende apenas de cor;
- possui dados demonstráveis;
- documentação afetada está atualizada.

## 28. Decisões abertas

### Produto e experiência

- quais campos o QR pode mostrar publicamente;
- se mensagens compartilhadas entram no MVP ou depois do pedido;
- quais templates de demanda entram primeiro;
- quais ações exigem aprovação adicional;
- quais indicadores são indispensáveis à apresentação;
- se o site institucional será implementado junto ao MVP operacional;
- política de emenda e cancelamento;
- moderação e prazo de edição de avaliação.

### Implementação — ainda não decidida

- Firebase ou Supabase;
- formato da autenticação;
- organização dos dados e arquivos;
- necessidade de backend complementar;
- uso ou não de Python e em quais funções;
- hospedagem;
- convenções de módulos, componentes e estado no JavaScript vanilla;
- estratégia de testes;
- estrutura final de pastas e componentes.

## 29. Estado de prontidão

- [x] papel intermediador do SIVI definido;
- [x] MVP ponta a ponta definido;
- [x] features inspiradas na Odoo classificadas;
- [x] limites para não virar ERP definidos;
- [x] áreas funcionais e ordem de produção mapeadas;
- [x] direção web com HTML, CSS e JavaScript vanilla confirmada;
- [x] aderência industrial e acadêmica auditada;
- [ ] curso, unidades curriculares e competências registrados;
- [ ] problema industrial validado;
- [ ] dossiê técnico das engrenagens revisado por especialista;
- [ ] cadeia requisito → inspeção → lote → QR fechada;
- [ ] estados e regras contraditórias resolvidos;
- [ ] MVP acadêmico implementável reduzido;
- [ ] Firebase e Supabase comparados contra os requisitos;
- [ ] necessidade de Python avaliada;
- [ ] wireframes mínimos validados;
- [ ] identidade visual aprovada;
- [ ] arquitetura técnica de implementação definida;

O SIVI está pronto para continuar a validação acadêmica e industrial. Wireframes vêm depois do caso técnico, dos estados canônicos e do MVP reduzido. A implementação deve começar somente após essas validações, a comparação entre Firebase e Supabase e a definição da estrutura técnica mínima compatível com a fatia aprovada.
