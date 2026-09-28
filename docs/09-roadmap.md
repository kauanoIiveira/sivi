# Roadmap sugerido

> Registro histórico. Para a ordem atual, consulte [28 — Próximos passos](28-proximos-passos.md), baseado no código e nas verificações de 26/09/2026. A stack e vários fluxos descritos aqui já foram definidos ou implementados.

O roadmap entrega uma fatia vertical do marketplace B2B industrial antes de ampliar automações. O [benchmark funcional da Odoo](14-arquitetura-escalavel.md) organiza as features; banco, serviços complementares, hospedagem e identidade visual ainda serão definidos pela equipe.

## Etapa 0 — Validação acadêmica, industrial e preparação funcional

**Objetivo:** transformar a visão documentada em um desafio industrial validado e em um recorte acadêmico viável antes de qualquer decisão visual ou técnica.

- registrar curso, unidades curriculares, competências, prazo, equipe e rubrica da unidade SENAI;
- escolher a vertical e confirmar componentes industriais físicos como primeiro ciclo do MVP;
- validar o problema com profissionais industriais ou declarar e revisar tecnicamente o cenário simulado;
- fechar com docente ou especialista o dossiê técnico das 500 engrenagens;
- ligar requisito e desenho aceitos ao plano de inspeção, medição, lote, liberação e QR;
- resolver estados, elegibilidade, demanda multi-item e autoridade do plano de inspeção;
- separar a visão futura do MVP acadêmico implementável conforme a [auditoria SENAI](15-alinhamento-senai-e-validacao-industrial.md);
- revisar o [escopo do MVP](02-escopo-e-mvp.md), as [decisões finais](10-decisoes-em-aberto.md) e o catálogo funcional;
- mapear a jornada completa do comprador e do fornecedor;
- desenhar wireframes de baixa fidelidade para as telas críticas;
- comparar Firebase e Supabase contra autenticação, isolamento multiempresa, consultas, arquivos, tempo de desenvolvimento e custo;
- decidir se alguma responsabilidade realmente exige Python;
- definir a estrutura mínima dos módulos de JavaScript vanilla depois dos wireframes;
- definir autenticação, arquivos, hospedagem, testes e navegadores suportados;
- preparar empresas, demandas, propostas e lotes fictícios para demonstração.

**Saída:** alinhamento acadêmico registrado, problema e caso industrial validados, MVP reduzido, estados canônicos, fluxo aprovado, mapa de telas validado, Firebase ou Supabase escolhido com justificativa e eventual papel de Python decidido.

A interface será web em HTML, CSS e JavaScript puro (vanilla), sem framework de interface nesta fase. A organização técnica e a camada de dados só devem ser fechadas depois da comparação acima; cada tela entra em desenvolvimento quando seu fluxo ou wireframe mínimo estiver validado.

## Etapa 1 — Fundação multiempresa e marketplace curado

- autenticação, recuperação de acesso e sessões seguras;
- organizações, usuários, associações e permissões;
- atuação da organização como compradora, fornecedora ou ambas;
- seletor seguro de organização e contexto;
- convite/solicitação, validação, aprovação, suspensão e reativação de empresas;
- perfil industrial do fornecedor: categorias, materiais, processos, máquinas/capacidades, certificações e regiões atendidas;
- catálogos administráveis e trilha de auditoria;
- atividades automáticas de aprovação e pendências com responsável e prazo;
- isolamento de dados por organização na camada de dados e serviços.

**Validação:** uma empresa aprovada atua nos contextos permitidos; um usuário não acessa dados de outra organização alterando URL, filtro ou requisição.

## Etapa 2 — Demanda industrial e match explicável

- criação, edição e publicação de demanda;
- especificações configuráveis por categoria;
- quantidades, unidades, prazo, destino e anexos;
- versionamento de mudança técnica;
- regras de elegibilidade por capacidade, material, processo, certificação, região e prazo;
- resultado de match com motivos de compatibilidade e impedimentos;
- convite de fornecedores compatíveis;
- lista de oportunidades limitada a cada fornecedor.

**Validação:** a empresa compradora publica uma demanda e o sistema apresenta fornecedores elegíveis com justificativas verificáveis, sem expor a demanda a empresas não autorizadas.

## Etapa 3 — Propostas, comparação e contratação

- editor de proposta com marca/fabricante quando aplicáveis, preço, frete, prazo, pagamento, validade, garantia estruturada e resposta técnica;
- versões imutáveis e solicitação de revisão;
- privacidade entre fornecedores concorrentes;
- comparador por fornecedor, marca/fabricante, custo total, prazo, aderência, garantia, reputação com amostra, pedidos concluídos, pontualidade e condições;
- filtros e ordenação sem escolha automática;
- aceite atômico da versão vencedora;
- geração de um pedido ligado à demanda e à proposta;
- histórico da decisão e encerramento das demais propostas.

**Validação:** pelo menos dois fornecedores enviam propostas diferentes; o comprador compara os mesmos critérios, pede uma revisão e aceita uma única versão sem duplicar o pedido.

## Etapa 4 — Atendimento, qualidade, lotes e QR Code

- fornecedor declara atendimento por estoque, produção ou modelo misto;
- registro simplificado de quantidade disponível, quantidade a produzir, responsável, previsão, origem e data da informação;
- marcos de preparação/fabricação e comunicação de mudança de prazo;
- lotes vinculados ao pedido;
- plano de inspeção versionado, controles obrigatórios e evidências;
- inspeção de qualidade, aprovação, rejeição, retrabalho e não conformidade;
- bloqueio de lote não liberado;
- geração de QR Code seguro por lote;
- consulta autorizada à rastreabilidade.

**Validação:** demonstrar um pedido atendido parcialmente por estoque e parcialmente por produção, liberar apenas o lote aprovado e consultar sua origem por QR Code.

## Etapa 5 — Entrega, avaliação e dashboards

- preparação para envio e expedição;
- atualização manual de transportadora, previsão, transporte e ocorrência;
- confirmação de recebimento pela empresa compradora;
- avaliação vinculada a pedido entregue;
- reputação com nota, amostra e percentual de entregas no prazo;
- dashboards modernos por contexto;
- alertas internos de prazo, revisão, inspeção e entrega;
- relatórios e filtros do MVP.

**Validação:** concluir a linha do tempo até a entrega, registrar uma avaliação válida e explicar a origem de cada indicador exibido.

## Etapa 6 — Segurança, qualidade e apresentação

- testes de regras de negócio, estados e idempotência;
- testes automatizados de autorização e isolamento multiempresa;
- revisão de upload e acesso a anexos;
- revisão de segurança, privacidade e LGPD;
- acessibilidade por teclado, foco, contraste, rótulos e mensagens;
- responsividade em 360, 768, 1280 e 1440 px;
- testes nas versões suportadas dos navegadores;
- backup, restauração, observabilidade e tratamento de falhas;
- documentação de instalação, operação e demonstração;
- ensaio do fluxo completo com dados fictícios.

**Validação:** um avaliador consegue percorrer o cenário ponta a ponta e identificar claramente o papel de intermediador do SIVI.

## Cenário obrigatório de demonstração do MVP

1. Uma empresa compradora aprovada publica uma demanda industrial personalizada.
2. O SIVI apresenta fornecedores compatíveis e explica os critérios do match.
3. Dois ou mais fornecedores enviam propostas versionadas.
4. O comprador compara fornecedor, marca/fabricante, custo total, prazo, aderência, garantia, reputação com amostra, pedidos concluídos, pontualidade e condições.
5. A proposta escolhida gera um único pedido.
6. O fornecedor informa atendimento por estoque, produção ou ambos.
7. O fornecedor registra lote e a inspeção do pedido atual, separada da qualidade histórica usada no comparador.
8. O QR Code permite consultar a rastreabilidade autorizada.
9. A entrega é atualizada manualmente e confirmada pelo comprador.
10. O comprador avalia a transação e os dashboards refletem os novos dados.

### Massa de dados de referência

Para que testes, telas e apresentação contem a mesma história, usar como cenário inicial:

- **compradora:** Empresa Alfa Manutenção Industrial;
- **demanda:** 500 engrenagens de aço com especificação técnica e entrega em 30 dias;
- **concorrência:** ao menos dois fornecedores com preço, prazo, aderência e reputação diferentes;
- **fornecedor escolhido:** possui 320 unidades disponíveis e registra produção simplificada de 180;
- **qualidade:** os lotes são inspecionados; ao menos uma reprovação ou reinspeção pode demonstrar o bloqueio de expedição;
- **rastreabilidade:** cada lote liberado recebe QR Code seguro;
- **encerramento:** uma entrega consolidada é confirmada e gera avaliação vinculada ao pedido entregue.

O cenário é massa de demonstração, não uma limitação de categoria do produto.

## Decisões de escalabilidade desde a fundação

- todas as entidades de negócio carregam a organização proprietária e suas relações de comprador/fornecedor;
- atuação é uma capacidade da organização, não um tipo fixo de conta;
- estados e eventos são separados por processo, evitando um campo único para toda a jornada;
- versões preservam especificação e condições comerciais históricas;
- catálogos de categoria, capacidade, unidade e critério são configuráveis;
- anexos e QR Codes usam identificadores seguros, não caminhos públicos previsíveis;
- histórico e auditoria permitem integrações futuras sem perder a origem;
- notificações são modeladas por evento, mesmo que o MVP entregue apenas alertas internos;
- entregas, avaliações e propostas possuem entidades próprias para permitir expansão;
- a interface usa JavaScript vanilla com módulos e componentes reutilizáveis; Firebase, Supabase e eventual Python serão escolhidos pelas necessidades das features, sem antecipar complexidade.

## Evoluções após o MVP

### Inteligência e recomendação

- previsão de demanda baseada em histórico suficiente;
- recomendação de produtos, serviços ou fornecedores;
- sugestão de preço, prazo e capacidade;
- detecção de risco e atraso;
- ranking personalizado, sempre com critérios explicáveis.

### Transação e conformidade

- pagamentos online, split e escrow;
- conciliação financeira;
- emissão e integração fiscal;
- assinatura eletrônica de contratos;
- políticas avançadas de disputa e mediação.

### Logística e comunicação

- integração com transportadoras;
- cotação de frete e rastreamento automático;
- entregas parciais;
- notificações externas por e-mail, SMS ou mensageria;
- chat em tempo real com retenção e moderação.

### Marketplace ampliado

- múltiplos fornecedores vencedores por demanda;
- leilão reverso ou rodadas de negociação, se aprovados;
- atuação em múltiplas moedas, idiomas e regiões;
- APIs e integrações com ERP/MES/WMS;
- certificados digitais e rastreabilidade avançada;
- catálogo recorrente para itens padronizados.

### Compras industriais pelo mesmo motor

Quando uma empresa fornecedora precisar de matéria-prima, poderá alternar para o contexto comprador e publicar uma demanda de insumo no mesmo marketplace. Essa evolução reutiliza organizações, match, propostas, comparador, pedido e avaliação; não cria uma Central de Cotações separada como tese principal.

## Critério de pronto por funcionalidade

Uma funcionalidade só é concluída quando:

- regra e critérios de aceite estão documentados;
- autorização e isolamento existem na camada de dados/serviços, não apenas na interface;
- interface trata sucesso, vazio, carregamento, erro, conflito e falta de permissão;
- ações críticas são idempotentes e auditadas;
- validações essenciais possuem testes;
- comportamento responsivo e acessível foi verificado;
- dados de demonstração foram preparados;
- documentação afetada foi atualizada;
- outra pessoa da equipe revisou o resultado.
