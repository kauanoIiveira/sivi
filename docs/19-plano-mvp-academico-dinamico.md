# Plano do MVP acadêmico dinâmico do SIVI

> O recorte funcional deste documento continua como referência. A tabela “O que existe hoje” retrata a revisão original; consulte [28 — Próximos passos](28-proximos-passos.md) para o estado verificado e a sequência atual de implementação.

**Atualização:** 14/09/2026

**Estado:** recorte recomendado para execução

**Escopo:** acadêmico

**Objetivo:** entregar uma aplicação acadêmica dinâmica, persistente e demonstrável de ponta a ponta, sem tentar construir um produto comercial completo.

## Direção

O `index.html` é o sistema conectado ao Firebase. Em 16/09/2026, a página demo foi removida e as massas de teste foram isoladas em `tests/`. Continuar a implementação no sistema em funcionamento, com a UI definida em `design-system/MASTER.md`.

O SIVI será considerado um **MVP acadêmico funcional** quando pessoas diferentes conseguirem percorrer a jornada com contas de comprador, fornecedor e administrador, gravar dados no Firebase, recarregar a aplicação e continuar do mesmo ponto.

Não usaremos como critério de conclusão a segurança, disponibilidade ou operação exigida de um SaaS comercial. Ainda assim, o sistema deve impedir os acessos cruzados mais importantes e não pode depender apenas de dados locais ou telas estáticas.

## Escopo funcional

O cenário usado nos testes não limita o uso do sistema. Não haverá limites fixos codificados para a quantidade de usuários, empresas, demandas, fornecedores, propostas, pedidos ou lotes. A quantidade suportada na prática será a adequada ao Firebase e ao contexto acadêmico, sem trabalho específico de escala massiva.

### O que entra

1. qualquer pessoa pode criar a própria conta com e-mail e senha;
2. depois do login, o usuário pode cadastrar sua empresa como compradora, fornecedora ou ambas;
3. uma conta pode cadastrar ou participar de mais de uma empresa e escolher a empresa ativa;
4. fornecedores também fazem o próprio cadastro, sem depender de registros fixos preparados no código;
5. empresa cadastrada aparece para aprovação ou bloqueio simples por um administrador acadêmico;
6. cada empresa mantém perfil e, quando fornecedora, suas capacidades industriais;
7. compradores podem criar várias demandas, com um ou mais itens e requisitos técnicos;
8. fornecedores compatíveis recebem oportunidades por match explicado;
9. qualquer quantidade de fornecedores elegíveis pode enviar sua própria proposta privada;
10. propostas podem receber várias revisões sem apagar versões anteriores;
11. cada demanda pode gerar um pedido vencedor, preservando a versão aceita;
12. cada pedido registra atendimento por estoque, produção ou modo misto;
13. o fornecedor cria os lotes necessários para cobrir as quantidades do pedido;
14. lotes passam por inspeção, reprovação, bloqueio, correção e reinspeção;
15. QR Code é gerado somente para lote liberado;
16. expedição, confirmação de recebimento e avaliação são registradas dinamicamente;
17. indicadores são calculados a partir de todos os registros da empresa ativa;
18. os dados persistem no Firebase e continuam disponíveis após recarregar ou acessar por outra sessão autorizada.

### Limites acadêmicos

Os limites são de complexidade, infraestrutura e responsabilidade, não de quantidade artificial de cadastros:

- autenticação somente por e-mail e senha;
- cadastro de empresa e proprietário, sem gestão completa de equipes e convites nesta etapa;
- papéis internos resumidos, sem dezenas de níveis de aprovação;
- match determinístico por critérios conhecidos, sem IA;
- produção resumida ao compromisso do pedido, sem administrar máquinas, matéria-prima ou chão de fábrica;
- estoque informado somente para atendimento do pedido SIVI, sem depósitos, inventário ou contabilidade de estoque;
- um fornecedor vencedor por demanda;
- uma entrega consolidada por pedido, sem entregas parciais;
- logística atualizada manualmente, sem GPS ou transportadora integrada;
- BRL, português do Brasil e operação nacional no MVP;
- anexos técnicos simples, com tipo e tamanho limitados, sem gestão documental avançada;
- painel administrativo básico, sem central completa de moderação e suporte;
- sem chat, pagamentos, fiscal, assinatura jurídica ou contratos completos;
- sem integração com ERP, MES, WMS ou sistemas financeiros;
- sem aplicativo móvel nativo;
- sem alta disponibilidade, SLA, escala massiva, observabilidade avançada ou recuperação de desastre de nível comercial;
- sem auditoria de segurança profissional, MFA, pentest, certificações ou adequação jurídica completa para operação pública real.

Manteremos somente a segurança básica indispensável ao funcionamento: autenticação, validação de dados, regras do Firebase e isolamento entre empresas. Esses controles evitam que o projeto acadêmico misture dados ou funcione apenas pela aparência, mas não serão tratados como uma implantação corporativa certificada.

## Cenário de validação

O sistema aceitará cadastros e registros livres. Para testes automatizados e apresentação, manteremos um cenário de referência reproduzível:

1. a empresa compradora publica uma demanda de 500 engrenagens;
2. dois fornecedores cadastrados possuem capacidades diferentes;
3. o match explica por que cada fornecedor é compatível ou parcialmente compatível;
4. os dois fornecedores enviam propostas privadas;
5. um deles envia uma segunda versão;
6. o comprador compara e aceita a versão correta;
7. o sistema cria apenas um pedido;
8. o fornecedor escolhido declara 320 unidades por estoque e 180 por produção;
9. as quantidades formam dois lotes;
10. um lote é aprovado e outro apresenta uma não conformidade;
11. o lote reprovado fica bloqueado, recebe correção e passa por reinspeção;
12. somente lotes liberados recebem QR Code;
13. o fornecedor registra a expedição;
14. o comprador confirma o recebimento e avalia o pedido;
15. os painéis e o trilho da jornada refletem os dados gravados.

Uma compradora, duas fornecedoras, uma demanda, 500 engrenagens e dois lotes são somente a massa mínima dessa validação. Outros usuários devem conseguir cadastrar novas empresas e repetir a jornada com seus próprios dados. O conteúdo técnico da engrenagem pode usar dados acadêmicos identificados como cenário de referência e não será apresentado como especificação industrial certificada.

## O que existe hoje

| Área | Estado atual | Próximo ajuste limitado |
|---|---|---|
| Cadastro e login | conectado ao Firebase | corrigir configuração remota e mensagens de erro |
| Empresas | empresa simples nasce ativa | adicionar estado pendente e aprovação acadêmica |
| Demandas | rascunho e publicação persistidos | acrescentar os requisitos usados pelo match |
| Oportunidades | toda demanda publicada aparece | filtrar pelos quatro critérios do match |
| Propostas | versões básicas persistidas | completar campos comparados e preservar revisão |
| Aceite e pedido | fluxo básico persistido | reforçar aceite único e snapshot do pedido |
| Operação | inspeção resumida no pedido | criar plano de atendimento e lotes dinâmicos |
| Qualidade | aprovação/bloqueio simplificados | registrar não conformidade e reinspeção por lote |
| QR | somente exemplo visual | gerar QR dinâmico do lote liberado |
| Entrega e avaliação | fluxo básico persistido | ligar aos lotes e calcular indicadores essenciais |
| Administração | apenas referência visual | criar uma página simples de aprovação/bloqueio |

Os 67 testes unitários passaram em 14/09/2026. A suíte E2E não foi revalidada nessa data porque esta máquina não possui JDK 11+ configurado para o Firebase Emulator.

## Decisões técnicas proporcionais ao trabalho acadêmico

- manter HTML, CSS e JavaScript puro;
- manter Firebase Authentication e Realtime Database;
- não migrar para Supabase nesta entrega;
- não tornar Cloud Functions obrigatórias para o MVP;
- usar operações atômicas do Realtime Database e regras mais restritas para aceite e mudanças de estado;
- manter a duplicação de leitura por comprador e fornecedor somente quando a atualização ocorrer no mesmo `update` atômico;
- usar Firebase Storage para anexos técnicos simples, com limite de tipo, tamanho e quantidade adequado ao projeto;
- usar um administrador previamente configurado no banco para a demonstração;
- testar o isolamento com uma compradora, uma fornecedora escolhida e uma concorrente como amostra representativa, sem limitar novos cadastros;
- publicar somente um ambiente acadêmico, além dos emuladores locais;
- documentar limitações conhecidas em vez de construir infraestrutura empresarial.

Se uma regra crítica não puder ser garantida adequadamente no cliente e nas regras do Realtime Database, será criada uma Function pequena somente para essa operação. Isso é exceção, não uma nova camada obrigatória para todo o sistema.

## Ordem de execução

### Etapa 1 — Estabilizar Firebase e empresas

- corrigir e publicar `database.rules.json` no projeto correto;
- confirmar cadastro, login, verificação e recuperação de senha;
- permitir que cada usuário cadastre a própria empresa e escolha sua atuação;
- permitir vários cadastros independentes de compradores e fornecedores;
- empresa nova inicia como `pending`;
- administrador acadêmico aprova ou bloqueia;
- comprador e fornecedor só operam quando a empresa estiver ativa;
- testar leitura e escrita cruzadas entre três contas.

**Pronto quando:** o erro `PERMISSION_DENIED` indevido deixa de ocorrer e uma empresa não aprovada não acessa a jornada.

### Etapa 2 — Demanda, perfil industrial e match

- cadastrar no fornecedor material, processo, capacidade e certificação;
- permitir demandas com itens e os critérios necessários ao match;
- calcular match simples e reproduzível;
- mostrar critérios atendidos, não atendidos e não informados;
- liberar a oportunidade apenas para fornecedores ativos que passarem pela regra mínima.

**Pronto quando:** os dois fornecedores recebem resultados diferentes e a interface explica o motivo.

### Etapa 3 — Propostas, comparação e pedido

- completar campos técnicos e comerciais da proposta;
- permitir uma ou mais revisões sem apagar versões anteriores;
- impedir que concorrentes vejam propostas alheias;
- comparar somente a última versão válida de cada fornecedor;
- aceitar uma única versão e gerar um único pedido;
- preservar no pedido a demanda e a proposta aceitas.

**Pronto quando:** repetir o aceite não cria outro pedido e recarregar conserva todo o histórico.

### Etapa 4 — Atendimento, lotes, qualidade e QR

- registrar quantidades de estoque e produção para cada pedido;
- exigir que a soma cubra a quantidade contratada;
- permitir a criação dos lotes necessários, com origem em estoque ou produção;
- inspecionar cada lote;
- bloquear quantidade reprovada;
- registrar não conformidade, correção e reinspeção;
- liberar o lote aprovado;
- gerar QR com identificador opaco e uma página de consulta resumida.

**Pronto quando:** quantidade reprovada não pode ser expedida e lote sem liberação não recebe QR.

### Etapa 5 — Entrega, avaliação e painéis

- expedir somente os lotes liberados;
- confirmar recebimento pelo comprador;
- avaliar uma única vez com os critérios definidos;
- atualizar os indicadores e o trilho da jornada;
- exibir origem e período dos números principais.

**Pronto quando:** comprador e fornecedor concluem a jornada em contas separadas e os painéis refletem os mesmos registros.

### Etapa 6 — Preparar a apresentação

- executar o fluxo completo no navegador;
- testar larguras de 360, 768 e 1440 px;
- corrigir bloqueios de teclado, foco, contraste e mensagens;
- publicar o sistema acadêmico em HTTPS;
- preparar contas e massa inicial reproduzíveis;
- documentar AS-IS, TO-BE, limitações e roteiro de demonstração;
- registrar quais dados e resultados são simulados.

**Pronto quando:** a jornada pode ser demonstrada do início ao fim sem editar o banco manualmente durante a apresentação.

## O que faremos primeiro

O próximo desenvolvimento será a **Etapa 1 — Estabilizar Firebase e empresas**. Ela deve ser pequena:

1. resolver definitivamente a publicação das regras;
2. criar `pending`, `active` e `blocked`;
3. criar a página administrativa mínima;
4. impedir operação de empresa não aprovada;
5. validar com uma conta administradora, uma compradora e duas fornecedoras como cenário mínimo, mantendo o cadastro aberto a novas empresas.

Não serão feitos agora convite de membros, papéis internos detalhados, Cloud Functions gerais, staging separado, monitoramento, backup corporativo ou redesenho visual amplo.

## Definição de concluído

Uma etapa acadêmica será chamada de concluída quando:

- estiver integrada ao `index.html`;
- usar dados do Firebase, e não uma fixture;
- continuar após recarregar;
- funcionar com as contas certas e negar as contas erradas;
- tratar erro e falta de permissão com mensagem compreensível;
- possuir teste do fluxo principal;
- estiver documentada para a apresentação.

Isso torna o SIVI dinâmico e convincente sem fingir que o projeto acadêmico já possui a infraestrutura de um produto comercial.
