# Atores e permissões

## Modelo de acesso

O SIVI é multiempresa. A autorização combina três dimensões:

1. **organização:** a qual empresa o dado pertence;
2. **papel da organização:** compradora, fornecedora ou ambas;
3. **papel do usuário:** quais ações ele pode executar dentro daquela organização.

Um mesmo usuário pode pertencer a mais de uma organização e ter papéis diferentes em cada uma. Toda operação deve ser avaliada no contexto da organização ativa.

## Atores

### Administrador da organização

- mantém dados, endereços e usuários da própria organização;
- concede e revoga papéis internos;
- configura se a organização atua como compradora, fornecedora ou ambas, sujeito à aprovação da plataforma;
- consulta auditoria e indicadores da própria organização;
- não acessa dados privados de outras empresas fora das relações autorizadas.

### Comprador/Solicitante

- cria, publica, altera e cancela demandas da própria organização;
- convida fornecedores aprovados;
- recebe e compara propostas;
- registra dúvidas e solicita revisões;
- escolhe e aceita uma proposta quando autorizado;
- acompanha pedidos e confirma o recebimento;
- avalia o fornecedor após a conclusão.

### Comercial do fornecedor

- mantém ofertas e capacidades comerciais da própria organização;
- consulta demandas compatíveis ou recebidas por convite;
- envia, revisa, retira e acompanha propostas próprias;
- reconhece e acompanha o pedido gerado a partir da proposta aceita pelo comprador;
- acompanha conversão e carteira de pedidos;
- não visualiza propostas concorrentes.

### Estoque do fornecedor

- consulta os itens dos pedidos da própria organização;
- informa disponibilidade;
- registra reservas, entradas, saídas e separação;
- associa quantidades separadas a lotes;
- não expõe o saldo interno completo ao comprador.

### Produção do fornecedor

- consulta ordens da própria organização;
- planeja e atualiza etapas de fabricação;
- registra quantidade produzida, problemas e atrasos;
- encaminha lotes para inspeção;
- visualiza somente dados comerciais necessários à execução.

### Qualidade do fornecedor

- define ou aplica critérios de inspeção;
- registra medições, conformidade, evidências e observações;
- aprova, reprova ou solicita retrabalho;
- libera somente quantidades conformes;
- mantém a rastreabilidade do lote.

### Logística do fornecedor

- prepara volumes e expedições;
- associa lote, QR Code e pedido;
- registra transportadora e código de rastreio informativos;
- atualiza eventos e ocorrências da entrega;
- confirma a expedição, sem poder alterar condições comerciais.

### Gestor da organização

- acompanha dashboards e relatórios da própria empresa;
- visualiza demandas, propostas e pedidos conforme o papel da organização;
- aprova escolhas ou exceções quando a política interna exigir;
- consulta desempenho, prazo, qualidade e reputação;
- não recebe automaticamente permissão para operar estoque, produção ou qualidade.

### Administrador da plataforma SIVI

- valida, aprova, suspende e reativa organizações;
- gerencia categorias, critérios globais, pesos padrão e parâmetros;
- modera denúncias e conteúdo;
- consulta auditoria e indicadores de saúde do marketplace;
- presta suporte com acesso excepcional, justificado e auditado;
- não escolhe propostas, não produz, não vende e não confirma entregas em nome das empresas.

Os papéis são permissões combináveis, não uma exigência de nove contas diferentes. Na demonstração do MVP, uma conta de operações do fornecedor pode acumular estoque, produção, qualidade e logística, enquanto o modelo preserva a separação para organizações maiores.

## Matriz inicial de permissões

Legenda: G = gerencia; O = opera/atualiza; L = somente leitura; P = dados próprios ou da relação comercial; — = sem acesso.

| Recurso | Comprador | Comercial forn. | Estoque | Produção | Qualidade | Logística | Gestor org. | Admin. org. | Admin. SIVI |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Organização e usuários | — | — | — | — | — | — | L | G | validação |
| Ofertas e capacidades | L | G | L | L | L | — | G | G | moderação |
| Demandas | G | P | L | L | L | L | G | L | moderação |
| Matches | G | P | — | — | — | — | G | L | regra/auditoria |
| Propostas | G | P | L | L | L | L | G | L | auditoria |
| Comparação e aceite | G | própria | — | — | — | — | G | conforme papel | auditoria |
| Pedidos | G | P | P | P | P | P | G | L | auditoria |
| Estoque do fornecedor | — | L | G | L | L | L | G | L | suporte auditado |
| Ordens de produção | andamento | L | L | G | L | L | G | L | suporte auditado |
| Lotes e inspeções | resultado | L | L | O | G | L | G | L | auditoria |
| QR e rastreabilidade | P | P | O | O | G | G | G | L | moderação |
| Entregas e ocorrências | G | L | L | L | L | G | G | L | auditoria |
| Avaliações | G | resultado | — | — | — | — | G | L | moderação |
| Dashboards | próprios | próprios | estoque | produção | qualidade | logística | G | G | plataforma |
| Auditoria | — | — | — | — | — | — | L | própria org. | G |

“Andamento” significa que o comprador vê apenas o estado e as evidências compartilhadas do atendimento, sem acesso à operação fabril interna.

## Regras de visibilidade entre organizações

- uma organização compradora acessa somente suas demandas, propostas recebidas, pedidos e entregas;
- um fornecedor acessa demandas compatíveis publicadas ou recebidas por convite;
- um fornecedor acessa apenas suas próprias propostas e nunca preços ou documentos de concorrentes;
- após o aceite, comprador e fornecedor acessam a fotografia comercial compartilhada do pedido;
- estoque, capacidade detalhada, custo interno, produção e documentos privados continuam no contexto do fornecedor;
- avaliações públicas exibem somente os dados definidos pela política de reputação;
- documentos e anexos respeitam a mesma autorização do registro ao qual pertencem;
- dados agregados da plataforma não podem permitir a reidentificação indevida de outra organização;
- alternar a organização ativa exige nova validação de escopo em cada requisição.

## Regras de segregação e controle

- permissões são validadas pela camada de dados/serviços e reforçadas pelos mecanismos da solução escolhida;
- o identificador da organização não pode ser aceito cegamente da interface;
- autorização combina papel, organização, participação, estado e visibilidade; ausência de política significa negação;
- dados declaram escopo global, privado, bilateral ou público controlado;
- o usuário recebe o menor privilégio necessário;
- ações críticas guardam autor, organização, data, motivo e contexto;
- aceite de proposta, mudança de preço, inspeção, liberação de lote, suspensão e suporte excepcional são auditados;
- ajustes de estoque exigem permissão e justificativa;
- o acesso a dashboard não concede permissão de alteração;
- um administrador de organização não se torna administrador da plataforma;
- a administração SIVI não pode modificar silenciosamente dados comerciais;
- suspensão de organização preserva o histórico e define como pedidos em andamento serão tratados.

## LGPD e privacidade

- dados pessoais são coletados somente para finalidades definidas;
- contatos pessoais não devem ser expostos a participantes sem relação autorizada;
- a organização controla os próprios usuários e solicitações relativas a seus dados;
- exportação, retenção, anonimização e exclusão seguem política e obrigações legais;
- logs de auditoria preservam o mínimo necessário para segurança e responsabilização;
- a página pública do QR Code exibe somente informações não sensíveis.
