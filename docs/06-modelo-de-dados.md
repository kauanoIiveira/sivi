# Modelo de dados

## Princípios

O modelo deve representar o SIVI como plataforma multiempresa, e não como uma indústria central. A entidade **organização** representa qualquer empresa participante. Seu papel define se ela pode comprar, fornecer ou exercer as duas funções.

Princípios obrigatórios:

- um único cadastro de organização, sem duplicar a mesma empresa em tabelas de cliente e fornecedor;
- dados privados isolados por organização;
- relações B2B compartilhadas somente entre comprador e fornecedor participantes;
- proposta e demanda versionadas;
- pedido como fotografia imutável da versão aceita;
- estados separados para demanda, proposta, pedido, atendimento, produção, qualidade e entrega;
- estoque e produção pertencentes ao fornecedor;
- QR Code baseado em token seguro;
- escopos global, privado, bilateral e público controlado declarados explicitamente;
- acesso negado por padrão, sem tornar um registro visível por ausência de regra;
- histórico, atividades e auditoria separados desde o início;
- estrutura capaz de crescer sem transformar o MVP em ERP completo.

Convenções transversais não são repetidas em todas as entidades abaixo: registros expostos ao navegador devem possuir identificador público não previsível, versão quando houver edição concorrente, data de criação e atualização quando aplicável. QR Codes não recebem chaves sequenciais previsíveis.

Os nomes em português deste documento são conceituais. Depois da comparação entre Firebase e Supabase, cada entidade poderá virar tabela, coleção, documento ou outra estrutura adequada sem alterar seu significado funcional.

## Visão por domínios

| Domínio | Entidades principais |
|---|---|
| Identidade e tenancy | organizacoes, organizacao_papeis, usuarios, membresias, papeis_membresia, convites_usuario, sessoes |
| Curadoria | validacoes_organizacao, documentos_organizacao, moderacoes |
| Catálogo industrial | categorias, ofertas, capacidades_fornecimento, certificacoes_organizacao, regioes_atendimento |
| Demandas | demandas, versoes_demanda, itens_demanda, requisitos_tecnicos, anexos_demanda, convites_demanda |
| Match | execucoes_match, resultados_match, criterios_resultado_match |
| Negociação | propostas, versoes_proposta, itens_versao_proposta, aderencias_tecnicas, eventos_negociacao |
| Comercial | aceites_proposta, pedidos, itens_pedido, historicos_pedido |
| Estoque do fornecedor | locais_estoque, itens_internos, saldos_estoque, reservas_estoque, movimentacoes_estoque |
| Produção do fornecedor | planos_atendimento, ordens_producao, apontamentos_producao |
| Qualidade e rastreabilidade | planos_inspecao, versoes_plano_inspecao, itens_plano_inspecao, lotes, inspecoes, resultados_inspecao, nao_conformidades, identificadores_qr |
| Logística | entregas, itens_entrega, eventos_entrega, confirmacoes_recebimento |
| Confiança | avaliacoes, reputacoes |
| Coordenação e governança | mensagens_compartilhadas, notas_internas, atividades, notificacoes, eventos_auditoria |
| Suporte técnico conceitual | arquivos, tarefas_pendentes, controles_de_repeticao |

## Relacionamentos conceituais

~~~mermaid
erDiagram
    ORGANIZACAO ||--o{ ORGANIZACAO_PAPEL : exerce
    ORGANIZACAO ||--o{ MEMBRESIA : possui
    USUARIO ||--o{ MEMBRESIA : participa
    MEMBRESIA ||--o{ MEMBRESIA_PAPEL : recebe

    ORGANIZACAO ||--o{ OFERTA : publica
    ORGANIZACAO ||--o{ CAPACIDADE_FORNECIMENTO : declara
    CATEGORIA ||--o{ OFERTA : classifica
    CATEGORIA ||--o{ CAPACIDADE_FORNECIMENTO : agrupa

    ORGANIZACAO ||--o{ DEMANDA : publica_como_compradora
    DEMANDA ||--|{ VERSAO_DEMANDA : versiona
    VERSAO_DEMANDA ||--|{ ITEM_DEMANDA : contem
    ITEM_DEMANDA ||--o{ REQUISITO_TECNICO : especifica

    VERSAO_DEMANDA ||--o{ EXECUCAO_MATCH : processa
    EXECUCAO_MATCH ||--o{ RESULTADO_MATCH : produz
    ORGANIZACAO ||--o{ RESULTADO_MATCH : recebe_como_fornecedora
    RESULTADO_MATCH ||--o{ CRITERIO_RESULTADO_MATCH : explica

    DEMANDA ||--o{ PROPOSTA : recebe
    ORGANIZACAO ||--o{ PROPOSTA : envia_como_fornecedora
    PROPOSTA ||--|{ VERSAO_PROPOSTA : versiona
    VERSAO_PROPOSTA ||--|{ ITEM_VERSAO_PROPOSTA : detalha
    VERSAO_PROPOSTA ||--o| ACEITE_PROPOSTA : pode_gerar
    ACEITE_PROPOSTA ||--|| PEDIDO : cria

    PEDIDO ||--|{ ITEM_PEDIDO : contem
    ITEM_PEDIDO ||--|| PLANO_ATENDIMENTO : planeja
    PLANO_ATENDIMENTO ||--o{ RESERVA_ESTOQUE : reserva
    PLANO_ATENDIMENTO ||--o{ ORDEM_PRODUCAO : produz
    ORDEM_PRODUCAO ||--o{ APONTAMENTO_PRODUCAO : registra

    PLANO_INSPECAO ||--|{ VERSAO_PLANO_INSPECAO : versiona
    VERSAO_PLANO_INSPECAO ||--|{ ITEM_PLANO_INSPECAO : define
    ITEM_PEDIDO ||--o{ LOTE : rastreia
    VERSAO_PLANO_INSPECAO ||--o{ INSPECAO : orienta
    LOTE ||--o{ INSPECAO : inspeciona
    INSPECAO ||--o{ RESULTADO_INSPECAO : mede
    INSPECAO ||--o{ NAO_CONFORMIDADE : pode_gerar
    LOTE ||--o{ IDENTIFICADOR_QR : identifica

    PEDIDO ||--o{ ENTREGA : possui
    ENTREGA ||--|{ ITEM_ENTREGA : transporta
    LOTE ||--o{ ITEM_ENTREGA : compoe
    ENTREGA ||--o{ EVENTO_ENTREGA : acompanha
    PEDIDO ||--o| AVALIACAO : recebe
~~~

O diagrama omite algumas entidades auxiliares para preservar legibilidade. Comprador e fornecedor são chaves estrangeiras para **organizacoes**, e não tabelas independentes.

## Dicionário inicial

### Identidade, organizações e curadoria

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **organizacoes** | Empresa participante do marketplace | id, razao_social, nome_fantasia, cnpj_normalizado, status, criado_em, atualizado_em |
| **organizacao_papeis** | Habilitação da empresa | organizacao_id, papel_compradora_ou_fornecedora, status, aprovado_em |
| **usuarios** | Identidade global de acesso | id, nome, email_normalizado, status, criado_em |
| **membresias** | Participação do usuário em uma organização | id, usuario_id, organizacao_id, status, ultimo_acesso_em |
| **papeis_membresia** | Papéis internos daquela participação | membresia_id, papel |
| **convites_usuario** | Convite para entrar em organização | id, organizacao_id, email, token_hash, validade, status |
| **sessoes** | Sessão autenticada e organização ativa validada | id, usuario_id, membresia_ativa_id, contexto_ativo, refresh_token_hash, expira_em, revogada_em, ultimo_uso_em |
| **validacoes_organizacao** | Processo de curadoria | id, organizacao_id, status, analista_id, motivo, decidido_em |
| **documentos_organizacao** | Evidências jurídicas ou industriais | id, organizacao_id, arquivo_id, tipo, validade, visibilidade, status_validacao |
| **enderecos_organizacao** | Endereços reutilizáveis | id, organizacao_id, tipo, campos_postais, latitude_opcional, longitude_opcional, status |

O papel da organização não substitui o papel do usuário. Uma empresa pode ser compradora e fornecedora, enquanto um usuário pode atuar apenas no comercial ou na qualidade.

### Catálogo e capacidade industrial

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **categorias** | Taxonomia global e hierárquica | id, categoria_pai_id, nome, status |
| **ofertas** | Produto ou serviço divulgado pelo fornecedor | id, organizacao_fornecedora_id, categoria_id, codigo_interno, nome, descricao, marca_opcional, fabricante_nome_opcional, codigo_fabricante_opcional, papel_fornecedor, unidade, status |
| **capacidades_fornecimento** | Competência usada no match | id, organizacao_fornecedora_id, categoria_id, tipo, valor, unidade, limite_minimo, limite_maximo, status |
| **processos_industriais** | Vocabulário de processos | id, nome, categoria_id, status |
| **organizacao_processos** | Processos declarados pela empresa | organizacao_id, processo_id, detalhes, status_validacao |
| **certificacoes_organizacao** | Certificação declarada ou validada | id, organizacao_id, tipo, emissor, validade, arquivo_id, status_validacao |
| **regioes_atendimento** | Cobertura logística declarada | id, organizacao_id, tipo_regiao, codigo_regiao, prazo_indicativo, status |

Capacidade declarada deve guardar unidade e contexto. Um único campo de texto não é suficiente para comparar quantidade, dimensão ou prazo de forma explicável.

### Demandas e requisitos

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **demandas** | Agrupador da oportunidade | id, organizacao_compradora_id, codigo, status, visibilidade, versao_atual_id, publicada_em, expira_em |
| **versoes_demanda** | Fotografia dos requisitos em cada revisão | id, demanda_id, numero, titulo, descricao, moeda, prazo_desejado, endereco_destino_id, pagamento_esperado, criada_por, criada_em |
| **itens_demanda** | Produtos ou soluções solicitados | id, versao_demanda_id, categoria_id, descricao, marca_preferida_opcional, aceita_equivalente, quantidade, unidade |
| **requisitos_tecnicos** | Atributos configuráveis por item | id, item_demanda_id, chave, tipo_dado, valor_texto, valor_numero, unidade, obrigatorio, peso |
| **anexos_demanda** | Desenhos e memoriais | id, versao_demanda_id, item_demanda_id_opcional, arquivo_id, tipo, visibilidade |
| **convites_demanda** | Convite explícito a fornecedor | id, demanda_id, organizacao_fornecedora_id, enviado_em, visualizado_em, status |
| **historicos_demanda** | Transições e decisões | id, demanda_id, estado_anterior, estado_novo, autor_id, organizacao_id, motivo, criado_em |

Requisitos configuráveis permitem atender categorias diferentes sem redesenhar o modelo a cada novo tipo de produto. Para campos críticos, **tipo_dado**, unidade e validação devem ser definidos por modelos de categoria; conteúdo livre pode complementar, mas não substituir os atributos que participam do match.

### Match explicável

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **execucoes_match** | Uma rodada de cálculo | id, versao_demanda_id, versao_regras, status, iniciada_em, concluida_em |
| **resultados_match** | Resultado por fornecedor | id, execucao_id, organizacao_fornecedora_id, elegivel, pontuacao, posicao_opcional |
| **criterios_resultado_match** | Explicação de cada regra | id, resultado_id, criterio, resultado, peso, valor_demanda, valor_fornecedor, explicacao |

Uma nova execução não sobrescreve a anterior. Assim, é possível explicar por que um fornecedor recebeu acesso ou determinada posição quando a negociação começou.

### Propostas, versões e negociação

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **propostas** | Negociação de um fornecedor em uma demanda | id, demanda_id, organizacao_fornecedora_id, status, versao_vigente_id, criada_em |
| **versoes_proposta** | Fotografia técnica e comercial enviada | id, proposta_id, numero, moeda, subtotal, frete, impostos_informados, desconto, custo_total, prazo_fabricacao, previsao_entrega, validade, pagamento, garantia_responsavel, garantia_prazo, garantia_inicio, garantia_cobertura, garantia_exclusoes, capacidade_declarada_fornecedor, status, criada_por, enviada_em |
| **itens_versao_proposta** | Resposta financeira e identificação do item ofertado | id, versao_proposta_id, item_demanda_id, quantidade, unidade, marca_snapshot_opcional, fabricante_snapshot_opcional, codigo_fabricante_snapshot_opcional, papel_fornecedor_snapshot, preco_unitario, total, observacao |
| **aderencias_tecnicas** | Resposta a requisito técnico | id, versao_proposta_id, requisito_id, situacao, valor_ofertado, unidade, observacao |
| **eventos_negociacao** | Solicitações, observações e decisões | id, proposta_id, versao_id_opcional, tipo, autor_id, organizacao_id, texto, criado_em |
| **aceites_proposta** | Decisão formal do comprador | id, demanda_id, versao_proposta_id, organizacao_compradora_id, aceito_por, justificativa, pesos_comparacao, criado_em |

Uma versão enviada é imutável. Correção ou contraproposta cria novo número. Totais são recalculados no servidor e gravados como fotografia, com moeda e regra de arredondamento.

### Pedido e fotografia comercial

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **pedidos** | Compromisso entre duas organizações | id, codigo, organizacao_compradora_id, organizacao_fornecedora_id, demanda_id, versao_proposta_aceita_id, aceite_id, status, moeda, subtotal, frete, impostos_informados, desconto, total, previsao_entrega, criado_em |
| **itens_pedido** | Fotografia dos itens aceitos | id, pedido_id, item_demanda_origem_id, descricao_snapshot, especificacao_snapshot, marca_snapshot_opcional, fabricante_snapshot_opcional, codigo_fabricante_snapshot_opcional, papel_fornecedor_snapshot, quantidade, unidade, preco_unitario, total |
| **termos_pedido** | Condições aceitas | pedido_id, pagamento_snapshot, garantia_responsavel_snapshot, garantia_prazo_snapshot, garantia_inicio_snapshot, garantia_cobertura_snapshot, garantia_exclusoes_snapshot, prazo_snapshot, observacoes_snapshot |
| **historicos_pedido** | Transições do pedido | id, pedido_id, estado_anterior, estado_novo, autor_id, organizacao_id, motivo, criado_em |
| **ocorrencias_pedido** | Exceção entre as partes | id, pedido_id, tipo, descricao, aberto_por, status, resolucao, criado_em, encerrado_em |

O pedido não depende do catálogo atual. Mesmo que oferta, nome ou preço sejam alterados depois, os snapshots mantêm o que foi aceito.

### Estoque privado do fornecedor

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **locais_estoque** | Local físico do fornecedor | id, organizacao_fornecedora_id, nome, endereco_id, status |
| **itens_internos** | Item controlado pelo fornecedor | id, organizacao_fornecedora_id, oferta_id_opcional, codigo, nome, unidade, modo_rastreio, status |
| **saldos_estoque** | Projeção do saldo por item e local | id, organizacao_fornecedora_id, item_interno_id, local_id, saldo_fisico, saldo_reservado, origem_ultima_informacao, atualizado_em |
| **reservas_estoque** | Quantidade comprometida | id, organizacao_fornecedora_id, plano_atendimento_id, item_interno_id, local_id, quantidade, origem, responsavel_id, status, criada_em, liberada_em |
| **movimentacoes_estoque** | Livro append-only de entradas e saídas | id, organizacao_fornecedora_id, item_interno_id, local_id, tipo, quantidade, origem_tipo, origem_id, origem_informacao, credencial_integracao_id_opcional, autor_id_opcional, ocorrido_em, recebido_em |

Saldo disponível é derivado de saldo físico menos saldo reservado. Uma correção manual, importação ou integração gera movimento identificado; não existe edição silenciosa do saldo. Toda informação registra origem (`MANUAL`, `IMPORTACAO` ou `INTEGRACAO`) e instante da fonte. O comprador recebe apenas estados resumidos do plano, não acesso a essas tabelas.

### Atendimento e produção

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **planos_atendimento** | Origem da quantidade de um item | id, item_pedido_id, organizacao_fornecedora_id, quantidade_estoque, quantidade_producao, quantidade_aprovada, quantidade_expedida, origem_informacao, atualizado_por, atualizado_em, status |
| **ordens_producao** | Produção simplificada ligada ao pedido | id, plano_atendimento_id, organizacao_fornecedora_id, codigo, quantidade_planejada, quantidade_concluida, status, previsao_inicio, previsao_fim, responsavel_id |
| **etapas_producao** | Etapas configuradas da ordem | id, ordem_id, nome, sequencia, status, inicio_em, fim_em |
| **apontamentos_producao** | Histórico operacional | id, ordem_id, etapa_id_opcional, tipo, quantidade, problema, autor_id, criado_em |

O MVP não precisa modelar toda a engenharia fabril. Fichas técnicas, materiais, centros de trabalho e capacidade finita podem ser adicionados futuramente sem mudar a relação entre pedido e plano de atendimento.

### Lotes, inspeções e QR Code

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **planos_inspecao** | Identidade estável de um plano de qualidade por categoria ou requisito | id, organizacao_proprietaria_id_opcional, categoria_id_opcional, nome, status, versao_vigente_id |
| **versoes_plano_inspecao** | Fotografia imutável das regras de inspeção | id, plano_id, numero, origem, criada_por, criada_em, efetiva_em |
| **itens_plano_inspecao** | Controle exigido pelo plano | id, versao_plano_id, sequencia, criterio, tipo_resultado, especificacao, unidade_opcional, obrigatorio, amostragem, evidencia_exigida |
| **lotes** | Unidade rastreável do atendimento | id, organizacao_fornecedora_id, item_pedido_id, codigo, tipo_rastreio, origem_tipo, origem_id, quantidade, fabricado_em, validade_opcional, responsavel_id, status |
| **inspecoes** | Evento de controle de qualidade orientado por plano | id, lote_id, versao_plano_inspecao_id, numero, status, quantidade_inspecionada, quantidade_aprovada, quantidade_reprovada, quantidade_retrabalho, inspetor_id, iniciada_em, concluida_em |
| **resultados_inspecao** | Critério, medição e evidência | id, inspecao_id, item_plano_inspecao_id, resultado, unidade, conforme, observacao, arquivo_id_opcional |
| **nao_conformidades** | Falha que bloqueia quantidade afetada e exige tratamento | id, inspecao_id, lote_id, item_plano_inspecao_id, severidade, quantidade_bloqueada, descricao, disposicao, responsavel_id, prazo, status, encerrada_em |
| **identificadores_qr** | Token rastreável | id, lote_id, item_entrega_id_opcional, token_hash, identificador_publico, escopo_publico, status, emitido_em, expira_em_opcional, revogado_em |

Uma inspeção sempre referencia a versão imutável do plano que a orientou. Falha em controle obrigatório abre não conformidade e bloqueia a quantidade afetada até decisão registrada. `tipo_rastreio` permite `LOTE` no MVP e `SERIE` futuramente; quando for série, a quantidade rastreada é uma unidade. O valor bruto do token não deve ser armazenado quando um hash for suficiente para a consulta. Revogar um token não apaga lote ou inspeção.

### Entrega e recebimento

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **entregas** | Processo logístico do pedido | id, pedido_id, organizacao_fornecedora_id, organizacao_compradora_id, status, previsao, transportadora_informada, codigo_rastreio, expedida_em, entregue_em |
| **itens_entrega** | Quantidades e lotes expedidos | id, entrega_id, item_pedido_id, lote_id, quantidade, volume |
| **eventos_entrega** | Linha do tempo logística | id, entrega_id, tipo, descricao, local_informado, autor_id, organizacao_id, ocorrido_em |
| **confirmacoes_recebimento** | Aceite físico pelo comprador | id, entrega_id, recebido_por, recebido_em, com_ressalva, observacao |

O modelo admite mais de uma entrega por pedido, embora o MVP possa limitar a interface a uma entrega principal.

### Avaliação e reputação

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **avaliacoes** | Opinião verificável após pedido | id, pedido_id, organizacao_compradora_id, organizacao_fornecedora_id, qualidade, prazo, atendimento, conformidade, custo_beneficio, nota_final, comentario, status, criada_em |
| **reputacoes** | Agregado reproduzível | organizacao_fornecedora_id, periodo, media, quantidade_avaliacoes, quantidade_pedidos_concluidos, percentual_entregas_no_prazo, pesos, calculada_em |

Reputação não substitui avaliações. É uma projeção calculada que pode ser reconstruída a partir de transações verificadas. Visualizações, cliques ou seguidores não compõem a nota; se forem exibidos, são métricas de alcance separadas. A reputação pertence à organização fornecedora, enquanto marca e fabricante pertencem ao item ofertado.

### Coordenação, comunicação e governança

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **mensagens_compartilhadas** | Comunicação visível às organizações participantes de um registro | id, agregado_tipo, agregado_id, organizacao_autora_id, autor_id, texto, arquivo_id_opcional, criada_em |
| **notas_internas** | Observação restrita à organização autora | id, agregado_tipo, agregado_id, organizacao_id, autor_id, texto, criada_em, removida_em_opcional |
| **atividades** | Próxima ação com responsável e prazo | id, agregado_tipo, agregado_id, organizacao_id, tipo, responsavel_membresia_id, prazo, origem_evento_id_opcional, status, concluida_em |
| **notificacoes** | Projeção de alerta direcionado | id, usuario_id, organizacao_id, tipo, referencia_tipo, referencia_id, mensagem, lida_em, criada_em |
| **eventos_auditoria** | Registro imutável de ação crítica | id, ator_id_opcional, organizacao_contexto_id_opcional, contexto_ativo, acao, agregado_tipo, agregado_id, estado_anterior, estado_novo, motivo, request_id, correlation_id, origem, metadados_minimos, criado_em |

Mensagem compartilhada, nota interna, atividade, evento do sistema, notificação e auditoria não são intercambiáveis. Notificações podem ser recriadas; eventos de auditoria não são editáveis ou removíveis pela aplicação comum. No MVP, atividades automáticas cobrem prazos e pendências essenciais; notas internas livres e atividades manuais podem entrar depois.

### Arquivos e processamento pendente

| Entidade | Responsabilidade | Campos essenciais sugeridos |
|---|---|---|
| **arquivos** | Metadados de conteúdo privado | id, organizacao_proprietaria_id, nome, tipo_mime, tamanho, referencia_armazenamento, hash_conteudo_opcional, status, criado_em |
| **tarefas_pendentes** | Efeito que pode precisar ocorrer depois de uma ação | id, tipo, referencia_tipo, referencia_id, status, tentativas, executar_apos, ultimo_erro, concluido_em |
| **controles_de_repeticao** | Evitar criação duplicada em ações críticas | chave, usuario_id, organizacao_id, operacao, resposta_referencia, expira_em |

Arquivos devem permanecer privados e vinculados à autorização do registro. A forma exata de armazenamento e processamento dependerá de Firebase ou Supabase. `tarefas_pendentes` e `controles_de_repeticao` são necessidades funcionais possíveis, não uma decisão de infraestrutura.

## Escopo e visibilidade dos dados

### Dados de uma organização

Possuem **organizacao_id** proprietária e são acessíveis apenas a seus membros autorizados:

- usuários e papéis;
- ofertas e capacidades;
- estoque e reservas;
- ordens e detalhes internos de produção;
- documentos privados e indicadores internos.

### Dados de uma relação B2B

Possuem **organizacao_compradora_id** e **organizacao_fornecedora_id**:

- proposta enviada;
- pedido;
- marcos compartilhados da produção;
- lote e inspeção na visão autorizada;
- entrega, ocorrência e avaliação.

As duas partes não recebem necessariamente a mesma profundidade. A camada de serviço aplica uma projeção adequada a cada papel.

### Dados da plataforma

Categorias, parâmetros, regras de match e agregados administrativos pertencem à plataforma. Informações agregadas não devem revelar preço, capacidade ou desempenho privado de uma empresa sem base e política de visibilidade.

### Dados públicos controlados

Somente projeções explicitamente permitidas podem ser expostas sem sessão, como a consulta de rastreabilidade por token opaco. A projeção usa lista positiva de campos, pode expirar ou ser revogada e nunca devolve diretamente o registro privado de lote, pedido ou empresa.

## Decisões de modelagem para escala

- **Organização como entidade central:** evita duplicidade e permite que a mesma empresa compre e forneça.
- **Membresia contextual:** um usuário pode atuar em várias empresas sem duplicar credencial.
- **Versionamento:** demanda e proposta preservam negociação e permitem auditoria.
- **Requisitos tipados:** categorias novas podem criar atributos sem alterar tabelas centrais.
- **Match materializado por execução:** resultados são explicáveis e reproduzíveis.
- **Pedido por snapshot:** operação histórica não depende de cadastros mutáveis.
- **Estados por domínio:** processos paralelos não são comprimidos em um único campo.
- **Quantidades por item e lote:** suporta atendimento misto, aprovação parcial e entregas futuras sem redesenho.
- **Mesmo motor B2B:** uma fornecedora habilitada como compradora poderá publicar demanda de insumo no futuro.
- **Processamento posterior opcional:** notificações, geração de arquivos ou integrações podem exigir tarefas recuperáveis conforme a solução escolhida.
- **Implementação ainda aberta:** Firebase e Supabase devem ser comparados usando este modelo e as consultas reais; Python só entra se alguma feature justificar.
- **Concorrência otimista:** agregados editáveis usam versão esperada para evitar sobrescrita silenciosa.
- **Coordenação separada:** atividades orientam trabalho; mensagens comunicam; auditoria comprova ações críticas.

## Restrições de integridade recomendadas

- CNPJ normalizado e único por organização ativa na plataforma;
- e-mail normalizado e único por identidade de usuário;
- uma membresia ativa por usuário e organização;
- papéis de usuário válidos somente para membresia ativa;
- publicação permitida apenas a organização compradora aprovada;
- proposta permitida apenas a organização fornecedora aprovada e autorizada à demanda;
- uma proposta agregadora por demanda e fornecedor no MVP;
- número de versão único e crescente dentro da demanda ou proposta;
- somente uma versão vigente por proposta;
- no máximo uma versão aceita por demanda no MVP;
- comprador e fornecedor do pedido devem ser organizações distintas e habilitadas;
- pedido deve referenciar a versão aceita e copiar seus valores;
- quantidades e valores não negativos, com quantidades de item maiores que zero;
- totais financeiros recalculados no servidor;
- soma de estoque e produção no plano coerente com a quantidade do item;
- reserva não pode exceder saldo disponível;
- quantidades aprovada, reprovada e em retrabalho coerentes com a inspeção;
- item de entrega não pode exceder quantidade aprovada ainda não expedida;
- uma avaliação ativa por pedido concluído;
- token e identificador público do QR únicos;
- versão do plano de inspeção imutável depois de usada;
- inspeção sempre ligada a uma versão de plano;
- falha obrigatória mantém a quantidade afetada bloqueada enquanto a não conformidade estiver aberta;
- atividade pertence a uma organização e só referencia responsável com membresia válida nela;
- `public_id` único por tipo de agregado e versão de concorrência não negativa;
- exclusão lógica para registros já usados em transações;
- datas de criação e atualização em entidades persistentes;
- chaves estrangeiras e índices compostos incluindo o escopo da organização quando aplicável.

## Índices iniciais sugeridos

- demandas por organização compradora, status e data;
- demandas publicadas por categoria, visibilidade e expiração;
- capacidades por organização fornecedora, categoria e status;
- resultados de match por execução, elegibilidade e pontuação;
- propostas por demanda, fornecedor e status;
- versões por proposta e número;
- pedidos por comprador, fornecedor, status e previsão;
- ordens por fornecedor, status e previsão;
- lotes por fornecedor, código e item de pedido;
- não conformidades por fornecedor, status, severidade e prazo;
- atividades por organização, responsável, status e prazo;
- entregas por pedido, status e previsão;
- avaliações por fornecedor, status e data;
- auditoria por organização, agregado e data;
- tarefas pendentes por status e próxima tentativa, caso sejam necessárias.

Índices devem ser confirmados com consultas reais. Campos flexíveis usados frequentemente em filtros podem exigir estrutura tipada ou índice específico; não se deve indexar indiscriminadamente um documento inteiro.

## Critérios para comparar Firebase e Supabase

A escolha deve ser feita com uma pequena prova usando as consultas e permissões mais difíceis do SIVI, não apenas por preferência. Comparar:

| Dimensão | Prova necessária no SIVI |
|---|---|
| Organizações e papéis | impedir acesso cruzado entre Alfa, Beta e Gama |
| Relações bilaterais | permitir que comprador e fornecedor vejam projeções diferentes do mesmo pedido |
| Propostas concorrentes | garantir que fornecedores não consultem proposta alheia |
| Versionamento | preservar demanda e proposta sem sobrescrita silenciosa |
| Aceite único | impedir dois pedidos para a mesma demanda sob repetição ou concorrência |
| Consultas e filtros | buscar oportunidades, propostas, pedidos, atividades e indicadores sem duplicação excessiva |
| Dados configuráveis | representar requisitos técnicos por categoria sem perder validação |
| Arquivos | proteger desenhos, certificados e evidências por organização e registro |
| Autenticação | suportar convite, recuperação, organização ativa e futura MFA |
| Processamento | executar match, notificações, QR e relatórios demorados quando necessário |
| Python opcional | permitir integração segura se algum algoritmo ou processamento usar Python |
| Desenvolvimento e operação | medir facilidade, custo, limites gratuitos, observabilidade, backup e migração |

O resultado deve ser registrado somente após uma prova funcional do cenário das 500 engrenagens.

## Segurança, auditoria e LGPD no modelo

- identificadores públicos devem ser não sequenciais quando a enumeração representar risco;
- a organização ativa é derivada da membresia autenticada, não apenas do corpo da requisição;
- autorização combina capacidade, organização, participação, estado e visibilidade; ausência de política significa negação;
- regras da camada de dados devem reforçar o isolamento, sem substituir testes da aplicação;
- anexos herdam a visibilidade da entidade relacionada;
- tokens de convite, redefinição e QR são guardados como hash quando possível;
- dados sensíveis em contexto de auditoria devem ser minimizados ou mascarados;
- exportação, anonimização e retenção devem considerar vínculos legais do pedido;
- exclusão de usuário não remove autoria histórica; a identidade pode ser desativada ou pseudonimizada conforme a política;
- eventos críticos são append-only ou possuem mecanismo equivalente de detecção de alteração;
- dashboards consultam projeções autorizadas, nunca tabelas de outros tenants diretamente.

## Evoluções que não bloqueiam o MVP

O modelo pode receber posteriormente:

- ficha técnica, matéria-prima e centros de trabalho;
- demanda de insumos publicada por organização que também compra;
- múltiplas moedas, impostos e países;
- pedido dividido entre fornecedores;
- contratos e assinaturas;
- pagamentos, repasses e conciliação;
- integrações fiscais, ERP, WMS, MES e transportadoras;
- modelos estatísticos de previsão e recomendação.

Essas extensões devem reutilizar organizações, demandas, propostas, pedidos e eventos existentes, evitando um segundo núcleo comercial paralelo.
