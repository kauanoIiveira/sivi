# Requisitos

Os requisitos abaixo descrevem a visão funcional aprovada para o SIVI: uma plataforma web B2B industrial, intermediadora, curada e multiempresa. Após a auditoria de 16/08/2026, os 93 requisitos marcados como **MVP** devem ser separados entre recorte acadêmico implementável e visão posterior, conforme [15 — Alinhamento ao SENAI e validação industrial](15-alinhamento-senai-e-validacao-industrial.md). Até essa decisão, a marcação atual preserva a fatia vertical planejada, mas não autoriza implementar tudo simultaneamente. Itens marcados como **Futuro** continuam fora do fluxo principal.

## Requisitos funcionais

### Autenticação, organizações e autorização

| ID | Requisito | Prioridade |
|---|---|---|
| RF-AUT-01 | O sistema deve autenticar usuários ativos por mecanismo seguro. | MVP |
| RF-AUT-02 | Toda requisição deve ser autorizada conforme organização ativa e papéis do usuário nessa organização. | MVP |
| RF-AUT-03 | Um usuário deve poder pertencer a mais de uma organização e alternar apenas entre organizações das quais seja membro ativo. | MVP |
| RF-AUT-04 | O administrador da organização deve poder convidar, ativar, desativar e atribuir papéis aos seus usuários. | MVP |
| RF-AUT-05 | O administrador SIVI deve poder aprovar, rejeitar, suspender e reativar organizações, registrando motivo. | MVP |
| RF-AUT-06 | Uma organização deve poder ser aprovada como compradora, fornecedora ou ambas. | MVP |
| RF-AUT-07 | O sistema deve registrar ações críticas em auditoria com autor, organização, data, ação e contexto. | MVP |
| RF-AUT-08 | Ações de suporte com acesso excepcional do administrador SIVI devem exigir justificativa e auditoria específica. | MVP |

### Perfil industrial, catálogo e capacidades

| ID | Requisito | Prioridade |
|---|---|---|
| RF-ORG-01 | Manter dados jurídicos, nome comercial, CNPJ, contatos e endereços da organização. | MVP |
| RF-ORG-02 | Manter categorias de produtos e soluções industriais. | MVP |
| RF-ORG-03 | O fornecedor deve poder cadastrar ofertas de produtos ou serviços industriais, informando marca, fabricante real e sua atuação como fabricante, distribuidor ou revendedor quando aplicável. | MVP |
| RF-ORG-04 | O fornecedor deve poder declarar materiais, processos, máquinas, tecnologias e faixas de capacidade que atende. | MVP |
| RF-ORG-05 | O fornecedor deve poder informar regiões atendidas, prazos indicativos e certificações. | MVP |
| RF-ORG-06 | O fornecedor deve poder anexar documentos técnicos e controlar sua visibilidade. | MVP |
| RF-ORG-07 | Alterar ou desativar uma oferta não deve modificar propostas e pedidos históricos. | MVP |
| RF-ORG-08 | A plataforma deve permitir moderação de ofertas, documentos e capacidades declaradas. | MVP |

### Demandas industriais

| ID | Requisito | Prioridade |
|---|---|---|
| RF-DEM-01 | O comprador deve poder criar uma demanda em rascunho com um ou mais itens. | MVP |
| RF-DEM-02 | Cada item deve registrar descrição, categoria, quantidade e unidade. | MVP |
| RF-DEM-03 | A demanda deve aceitar requisitos técnicos, como material, dimensões, acabamento, tolerância, resistência, embalagem ou personalização. | MVP |
| RF-DEM-04 | A demanda deve registrar prazo desejado, destino, condição de pagamento esperada e observações. | MVP |
| RF-DEM-05 | O comprador deve poder anexar desenhos, memoriais ou outros arquivos técnicos permitidos. | MVP |
| RF-DEM-06 | Somente organização compradora aprovada deve poder publicar uma demanda. | MVP |
| RF-DEM-07 | O comprador deve poder convidar fornecedores aprovados sem impedir a descoberta por outros fornecedores compatíveis, conforme a visibilidade escolhida. | MVP |
| RF-DEM-08 | O sistema deve impedir alteração silenciosa dos requisitos após o recebimento de propostas; mudanças relevantes devem gerar revisão e notificação. | MVP |
| RF-DEM-09 | O comprador deve poder encerrar, cancelar ou deixar expirar uma demanda, preservando histórico e motivo. | MVP |

### Match explicável

| ID | Requisito | Prioridade |
|---|---|---|
| RF-MAT-01 | Ao publicar uma demanda, o sistema deve identificar fornecedores aprovados compatíveis por regras cadastradas. | MVP |
| RF-MAT-02 | O match deve considerar categoria e, quando informados, material, processo, capacidade, região e prazo indicativo. | MVP |
| RF-MAT-03 | O resultado deve indicar critérios atendidos, não atendidos e sem informação. | MVP |
| RF-MAT-04 | Eventual pontuação deve usar pesos conhecidos e manter a memória do cálculo. | MVP |
| RF-MAT-05 | O match deve ser apenas apoio à descoberta e não deve selecionar automaticamente o vencedor. | MVP |
| RF-MAT-06 | Somente fornecedores aprovados, convidados ou considerados compatíveis pela regra de visibilidade devem acessar a demanda. | MVP |
| RF-MAT-07 | O sistema deve permitir recalcular o match quando a demanda ou a capacidade mudar, sem apagar o resultado anterior usado na negociação. | MVP |
| RF-MAT-08 | Previsão de sucesso e recomendação baseada em aprendizado histórico devem ser opcionais e explicáveis. | Futuro |

### Propostas e negociação

| ID | Requisito | Prioridade |
|---|---|---|
| RF-PPT-01 | Um fornecedor autorizado deve poder criar uma proposta para uma demanda acessível. | MVP |
| RF-PPT-02 | A proposta deve registrar escopo técnico, itens, quantidades, marca, fabricante real, código do fabricante e premissas de atendimento quando aplicáveis. | MVP |
| RF-PPT-03 | A proposta deve registrar preço unitário, componentes informados, frete, impostos informados e custo total. | MVP |
| RF-PPT-04 | A proposta deve registrar prazo de fabricação, previsão de entrega, validade, pagamento, responsável, duração, cobertura e exclusões essenciais da garantia, além da capacidade que o próprio fornecedor declara para atender a demanda. | MVP |
| RF-PPT-05 | O fornecedor deve poder salvar rascunho antes do envio. | MVP |
| RF-PPT-06 | Toda revisão enviada deve criar uma nova versão imutável e marcar a anterior como substituída. | MVP |
| RF-PPT-07 | O comprador deve poder solicitar revisão e registrar observações ligadas à negociação. | MVP |
| RF-PPT-08 | O histórico deve identificar autor, data e relação entre as versões. | MVP |
| RF-PPT-09 | O sistema deve impedir envio ou revisão após encerramento, cancelamento ou expiração da demanda. | MVP |
| RF-PPT-10 | O fornecedor deve poder retirar proposta ainda não aceita, preservando o histórico. | MVP |
| RF-PPT-11 | Chat síncrono, presença e anexos em tempo real devem ser oferecidos como evolução do histórico estruturado. | Futuro |

### Comparação, decisão e pedido

| ID | Requisito | Prioridade |
|---|---|---|
| RF-NEG-01 | O comprador deve poder comparar as versões vigentes das propostas lado a lado. | MVP |
| RF-NEG-02 | A comparação deve exibir fornecedor, marca e fabricante quando aplicáveis, custo total, preço unitário, prazo, aderência técnica, certificações, reputação com amostra e suas dimensões históricas de qualidade, pedidos concluídos, entregas no prazo, pagamento e garantia. | MVP |
| RF-NEG-03 | O sistema deve sinalizar dados ausentes, premissas diferentes e critérios que não sejam diretamente comparáveis, sem confundir reputação do fornecedor com marca ou fabricante do item. | MVP |
| RF-NEG-04 | O comprador deve poder ordenar ou ponderar critérios sem apagar os valores de origem e sem contabilizar duas vezes indicadores derivados da mesma avaliação. | MVP |
| RF-NEG-05 | A escolha deve registrar usuário, data e justificativa. | MVP |
| RF-NEG-06 | Somente usuário autorizado da organização compradora deve poder aceitar uma proposta. | MVP |
| RF-NEG-07 | O aceite deve, em uma única transação, validar a versão, congelar seus valores, criar o pedido e encerrar as propostas concorrentes. | MVP |
| RF-NEG-08 | O pedido deve referenciar a demanda, a versão aceita, a organização compradora e a fornecedora. | MVP |
| RF-NEG-09 | Alterações posteriores devem ocorrer por evento ou revisão formal, sem reescrever a fotografia aceita. | MVP |
| RF-NEG-10 | Cancelamentos devem respeitar o estado do pedido, exigir motivo e registrar efeitos acordados. | MVP |
| RF-NEG-11 | Divisão de uma demanda entre diversos fornecedores deve ser suportada. | Futuro |
| RF-NEG-12 | Contrato digital com assinatura jurídica deve poder usar a fotografia do pedido como fonte. | Futuro |

### Estoque e atendimento do fornecedor

| ID | Requisito | Prioridade |
|---|---|---|
| RF-EST-01 | O fornecedor deve poder manter saldo físico, reservado e disponível de seus próprios itens. | MVP |
| RF-EST-02 | O fornecedor deve informar, por item do pedido, a quantidade que será atendida pelo estoque. | MVP |
| RF-EST-03 | O sistema deve reservar o saldo informado sem permitir dupla utilização. | MVP |
| RF-EST-04 | Toda reserva e movimentação deve possuir origem rastreável. | MVP |
| RF-EST-05 | Ajustes manuais devem exigir permissão e justificativa. | MVP |
| RF-EST-06 | O comprador deve visualizar somente a situação resumida do atendimento, nunca o saldo interno completo. | MVP |
| RF-EST-08 | Toda informação de disponibilidade, reserva ou movimento deve registrar organização responsável, origem manual/importada/integrada, autor ou credencial e instante de atualização. | MVP |
| RF-EST-07 | Múltiplos depósitos, transferências e inventário avançado devem ser suportados. | Futuro |

### Produção do fornecedor

| ID | Requisito | Prioridade |
|---|---|---|
| RF-PRO-01 | O fornecedor deve poder registrar um plano ou ordem simplificada de produção para a quantidade do pedido não atendida pelo estoque. | MVP |
| RF-PRO-02 | A ordem deve registrar produto ou solução, quantidade, previsão e responsável. | MVP |
| RF-PRO-03 | O fornecedor deve poder atualizar etapas, quantidade concluída, problemas e atrasos. | MVP |
| RF-PRO-04 | O sistema deve manter histórico das mudanças da ordem. | MVP |
| RF-PRO-05 | A conclusão deve disponibilizar a quantidade produzida para formação de lote e inspeção. | MVP |
| RF-PRO-06 | O comprador deve visualizar somente marcos compartilháveis, como planejado, em produção, aguardando qualidade e concluído. | MVP |
| RF-PRO-07 | Ficha técnica, consumo de matéria-prima, capacidade finita e planejamento fabril detalhado devem integrar o fluxo. | Futuro |
| RF-PRO-08 | Uma organização fornecedora deve poder publicar demandas de insumos pelo mesmo motor B2B quando estiver habilitada como compradora. | Futuro |

### Lotes, qualidade e QR Code

| ID | Requisito | Prioridade |
|---|---|---|
| RF-QLD-01 | O fornecedor deve criar lote vinculado ao pedido, item, quantidade, origem e datas relevantes. | MVP |
| RF-QLD-02 | O lote deve possuir código único dentro da organização fornecedora. | MVP |
| RF-QLD-03 | A equipe de qualidade deve registrar critérios, resultados, observações e evidências da inspeção. | MVP |
| RF-QLD-04 | A inspeção deve resultar em aprovação, reprovação ou retrabalho por quantidade. | MVP |
| RF-QLD-05 | Somente quantidade aprovada deve ser liberada para expedição. | MVP |
| RF-QLD-06 | O sistema deve manter histórico de reinspeções e responsável por cada decisão. | MVP |
| RF-QLD-07 | O sistema deve gerar QR Code associado a lote, volume ou item liberado. | MVP |
| RF-QLD-08 | O QR Code deve conter token opaco ou assinado, sem CNPJ, preço, identificação da empresa compradora ou outro dado sensível no conteúdo bruto. | MVP |
| RF-QLD-09 | A consulta pública do QR deve exibir somente dados mínimos definidos; detalhes exigem autenticação e autorização. | MVP |
| RF-QLD-10 | Token comprometido deve poder ser revogado ou substituído sem apagar a rastreabilidade. | MVP |
| RF-QLD-12 | Critérios e instruções de inspeção devem pertencer a um plano versionado; cada inspeção deve referenciar a versão aplicada ao lote e falhas devem gerar não conformidade ou retrabalho rastreável. | MVP |
| RF-QLD-11 | Integração com dispositivos, metrologia e certificados digitais deve ser suportada. | Futuro |

### Logística, recebimento e avaliação

| ID | Requisito | Prioridade |
|---|---|---|
| RF-LOG-01 | O fornecedor deve poder preparar expedição vinculando pedido, lotes e quantidades aprovadas. | MVP |
| RF-LOG-02 | O sistema deve registrar previsão, transportadora e código de rastreio quando informados. | MVP |
| RF-LOG-03 | Usuários autorizados devem atualizar manualmente os eventos da entrega. | MVP |
| RF-LOG-04 | O sistema deve registrar ocorrência de atraso, avaria, recusa ou divergência. | MVP |
| RF-LOG-05 | O comprador deve poder confirmar o recebimento e registrar ressalvas. | MVP |
| RF-LOG-06 | A entrega confirmada deve permitir avaliação vinculada ao pedido. | MVP |
| RF-LOG-07 | A avaliação deve considerar qualidade, prazo, atendimento, conformidade e custo-benefício. | MVP |
| RF-LOG-08 | A reputação deve ser calculada por regra conhecida, mostrar quantidade de avaliações, período, pedidos concluídos e percentual de entregas no prazo, evitando duplicidade por pedido e métricas baseadas apenas em visualizações. | MVP |
| RF-LOG-09 | Integração com transportadora, rastreamento GPS e cálculo automático de frete devem ser oferecidos. | Futuro |

### Dashboards, relatórios e notificações

| ID | Requisito | Prioridade |
|---|---|---|
| RF-GES-01 | O comprador deve visualizar demandas, propostas recebidas, pedidos por etapa, atrasos e valor contratado. | MVP |
| RF-GES-02 | O fornecedor deve visualizar oportunidades, propostas enviadas, conversão, pedidos, produção e inspeções pendentes. | MVP |
| RF-GES-03 | Gestores devem visualizar prazo médio, conformidade, ocorrências, avaliações e desempenho por período. | MVP |
| RF-GES-04 | A administração SIVI deve visualizar organizações ativas, demandas, transações e saúde operacional em dados agregados. | MVP |
| RF-GES-05 | O sistema deve calcular o valor bruto negociado sem tratá-lo como receita própria do SIVI. | MVP |
| RF-GES-06 | Todo indicador deve possuir definição e permitir navegação aos registros de origem autorizados. | MVP |
| RF-GES-07 | Relatórios devem aceitar filtros por período, organização própria, categoria, situação e contraparte autorizada. | MVP |
| RF-GES-08 | O sistema deve notificar eventos relevantes dentro da aplicação. | MVP |
| RF-GES-10 | O sistema deve gerar atividades automáticas vinculadas ao registro, responsável e prazo para pendências críticas de cadastro, proposta, atendimento, inspeção, expedição, recebimento e avaliação. | MVP |
| RF-GES-09 | Previsões, recomendações e alertas preditivos devem informar método, confiança e limitações. | Futuro |

## Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF-01 | Senhas devem ser tratadas por provedor ou mecanismo de autenticação seguro e nunca armazenadas em texto puro. |
| RNF-02 | Toda comunicação publicada deve usar HTTPS e configurações atuais de segurança. |
| RNF-03 | Autorização deve ser aplicada na camada de dados/serviços e testada por organização, relação comercial e papel; ocultar elementos na interface não é suficiente. |
| RNF-04 | Toda entidade de negócio deve possuir escopo de organização direto ou derivável e nenhuma consulta deve confiar apenas no filtro enviado pela interface. |
| RNF-05 | O modelo deve suportar múltiplas organizações na mesma aplicação sem mistura de dados; controles adicionais no banco devem ser usados quando disponíveis. |
| RNF-06 | Valores monetários devem usar tipo decimal apropriado, moeda explícita e regra consistente de arredondamento. |
| RNF-07 | Aceite, reserva e operações que alterem vários registros relacionados devem ser transacionais e idempotentes. |
| RNF-08 | Versões aceitas, histórico de estados, inspeções e auditoria não podem ser sobrescritos silenciosamente. |
| RNF-09 | O sistema deve possuir backup, restauração testada e política de retenção. |
| RNF-10 | Dados pessoais devem seguir finalidade, minimização, retenção, controle de acesso e demais princípios da LGPD. |
| RNF-11 | Arquivos enviados devem ter tipo e tamanho validados, armazenamento privado e proteção contra conteúdo malicioso. |
| RNF-12 | Tokens de QR devem ser imprevisíveis, revogáveis e não revelar identificadores sequenciais ou dados sensíveis. |
| RNF-13 | Datas devem ser armazenadas de forma consistente e exibidas no fuso configurado. |
| RNF-14 | Listagens e históricos devem usar paginação ou carregamento limitado. |
| RNF-15 | Match, notificações, relatórios e geração de QR devem poder ser processados de forma desacoplada sem bloquear operações críticas. |
| RNF-16 | Logs, métricas e alertas técnicos devem permitir detectar falhas, abuso e degradação sem registrar segredos. |
| RNF-17 | O sistema deve ser web responsivo, compatível com navegadores modernos e utilizável em desktop e tablet. |
| RNF-18 | Fluxos essenciais devem permitir navegação por teclado, foco visível, rótulos acessíveis e contraste adequado. |
| RNF-19 | Mensagens de erro devem ser compreensíveis e não expor detalhes internos, dados de outro tenant ou credenciais. |
| RNF-20 | Dados da jornada não podem depender somente do estado local do navegador; o usuário deve retomar o trabalho após nova sessão autorizada. |
| RNF-21 | Identificadores expostos externamente devem evitar enumeração previsível de registros sensíveis. |
| RNF-22 | Nenhuma função do MVP deve depender de aplicativo móvel nativo, programa desktop, IA externa ou integração paga. |
| RNF-23 | Acesso deve ser negado quando não houver permissão explícita compatível com papel, organização, participação, estado e visibilidade. |
| RNF-24 | A interface será implementada para navegador com HTML, CSS e JavaScript puro (vanilla), sem framework de interface nesta fase. |
| RNF-25 | Firebase e Supabase devem ser comparados contra os requisitos reais antes da escolha; Python não pode se tornar dependência obrigatória do MVP sem uma necessidade funcional demonstrada. |

## Critérios transversais de aceite

- um usuário não acessa dados de outra organização alterando URL, filtros ou dados enviados pela interface;
- um fornecedor concorrente nunca vê valores, anexos ou versões de outra proposta;
- uma mudança relevante na demanda não invalida propostas silenciosamente;
- o aceite concorrente da mesma demanda produz no máximo um pedido vencedor no MVP;
- o pedido preserva exatamente a versão aceita, mesmo após mudanças no catálogo;
- saldos e reservas do fornecedor não são contabilizados duas vezes;
- lote reprovado não pode ser expedido como aprovado;
- a leitura do QR Code não revela dados comerciais ou pessoais sem autorização;
- cada card de dashboard possui regra reproduzível e fonte rastreável;
- ações críticas permanecem atribuíveis a usuário e organização;
- suspensão ou falha intermediária não deixa demanda, proposta e pedido em estados contraditórios.
