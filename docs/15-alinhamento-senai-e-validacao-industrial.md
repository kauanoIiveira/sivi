# Alinhamento ao SENAI e validação industrial

**Data da auditoria:** 16/08/2026  
**Estado:** diagnóstico de aderência e preparação para validação  
**Efeito sobre decisões:** este documento não aprova mudanças sozinho; ele registra evidências, lacunas e decisões que precisam ser fechadas antes de wireframes ou código.

## Objetivo

Verificar se o SIVI está associado de forma substantiva à indústria e se pode ser defendido como projeto acadêmico do SENAI, sem depender apenas do nome, da estética ou de termos industriais.

Foram revisados todos os arquivos Markdown do diretório. O referencial institucional foi formado por fontes oficiais do SENAI e do Sistema Indústria.

## Referencial institucional

A missão do SENAI associa educação profissional e tecnológica, inovação e transferência de tecnologias industriais ao aumento da competitividade da indústria brasileira. Sua metodologia enfatiza casos reais, aprendizagem prática, competências profissionais e integração entre teoria e prática.

Fontes oficiais consultadas:

- [Missão, visão e valor gerado pelo SENAI](https://senai.portaldaindustria.com.br/institucional/relatorio/qual-valor-geramos);
- [Metodologia de ensino do SENAI](https://senai.portaldaindustria.com.br/pt/institucional/metodologia);
- [Institutos SENAI de Tecnologia](https://www.senai.portaldaindustria.com.br/institucional/institutos-de-tecnologia);
- [Objetivos e resultados estratégicos do SENAI](https://www.portaldaindustria.com.br/senai/canais/transparencia/demonstracao-de-resultados/);
- [Banco de Fornecedores da Jornada de Transformação Digital do SENAI-SP](https://jornadadigital.sp.senai.br/cadastro-fornecedores.html);
- [Programa de Desenvolvimento de Fornecedores do IEL](https://www.cni.portaldaindustria.com.br/web/iel/para-sua-empresa/capacitacao-de-fornecedores);
- [Smart Factory BNDES–SENAI 2026](https://www.portaldaindustria.com.br/canais/plataforma-inovacao-para-industria/categoria/smart-factory-bndes-senai/).

O vínculo esperado pode ser resumido assim:

```text
problema industrial real
→ processo e profissionais envolvidos
→ solução digital aplicável
→ resultado operacional mensurável
→ competências profissionais demonstradas
→ validação
```

## Veredito da auditoria

O SIVI possui uma **espinha industrial real**, especialmente na continuidade entre especificação, atendimento, qualidade, lote e rastreabilidade. Ele não é apenas um marketplace genérico renomeado.

Entretanto, a associação acadêmica ao SENAI ainda não está firmemente comprovada porque faltam:

- delimitação e validação empírica do problema industrial;
- vínculo com curso, unidades curriculares e competências profissionais;
- caso demonstrativo com dados técnicos completos;
- indicadores com baseline e meta;
- validação com profissionais, docente técnico ou empresa;
- redução do plano atual para um MVP acadêmico executável.

Síntese:

| Dimensão | Situação atual |
|---|---|
| Domínio e fluxo industrial | forte |
| Qualidade, lote e rastreabilidade | muito forte |
| Qualificação técnica de fornecedores | boa, ainda dependente de dados declarados |
| Problema industrial comprovado | insuficiente |
| Resultado mensurável para a indústria | insuficiente |
| Relação com competências do curso | ausente na documentação |
| Validação com usuários industriais | ausente na documentação |
| Viabilidade do MVP atual | em risco por excesso de escopo |

## Forças que devem ser preservadas

- demanda com material, dimensões, tolerâncias, acabamento, resistência, quantidade, unidade e anexos técnicos;
- perfil de fornecedor com processos, materiais, máquinas, tecnologias, capacidades e certificações;
- match explicado por requisitos, sem vencedor automático;
- proposta técnica e comercial versionada;
- pedido que preserva a versão aceita;
- atendimento por estoque, produção ou modelo misto;
- plano de inspeção versionado;
- medição, não conformidade, bloqueio, retrabalho e reinspeção;
- lote vinculado ao pedido e à entrega;
- QR emitido somente após liberação e com exposição controlada;
- separação entre responsabilidade do SIVI e responsabilidade técnica das empresas;
- isolamento entre organizações concorrentes.

O diferencial industrial deve ser demonstrado por esta cadeia:

```text
requisito técnico aceito
→ execução
→ inspeção do mesmo requisito
→ lote liberado
→ entrega rastreável
```

## P0 — Lacunas antes de wireframes ou código

### 1. Problema industrial e validação

A dor descrita é plausível, mas ainda não possui fonte, entrevista, frequência, impacto, baseline ou empresa de referência. É necessário validar ao menos com perfis de:

- compras ou suprimentos industriais;
- engenharia ou solicitante técnico;
- comercial de fornecedor/fabricante;
- produção, PCP ou operação;
- qualidade ou recebimento.

Não inventar empresa parceira, entrevista ou ganho de produtividade. Caso não exista parceiro real, declarar honestamente que o cenário é simulado e validá-lo com docente ou especialista técnico.

### 2. Vertical e tipo de item do MVP

O MVP deve priorizar **componentes industriais físicos, padronizados ou fabricados sob encomenda**. Serviços industriais possuem ciclos diferentes e devem ficar fora da primeira demonstração ou receber fluxo próprio no futuro.

A engrenagem pode continuar como referência, desde que seus parâmetros sejam fechados com alguém tecnicamente habilitado.

### 3. Dossiê técnico das 500 engrenagens

Definir com docente ou especialista, sem inventar valores:

- código e revisão do desenho;
- material e norma aplicável;
- geometria, dimensões e características críticas;
- tolerâncias;
- processo de fabricação;
- tratamento e acabamento, quando aplicáveis;
- quantidade, unidade e prazo;
- certificado ou evidência de material, quando aplicável;
- método, instrumento e critério de medição;
- amostragem;
- critérios objetivos de aprovação;
- exemplo de falha, não conformidade, disposição e reinspeção.

### 4. Cadeia de evidência técnica

O modelo precisa ligar explicitamente:

```text
requisito e desenho/revisão da demanda
→ resposta e ressalva da proposta
→ snapshot aceito no pedido
→ controle do plano de inspeção
→ resultado medido
→ decisão de liberação
→ projeção permitida no QR
```

Também deve ser definido quem cria e aprova o plano de inspeção, qual fonte prevalece e como mudanças posteriores ao aceite são tratadas.

### 5. Papéis técnicos do comprador

Compras não deve assumir sozinho toda decisão técnica. Avaliar no MVP papéis ou permissões acumuláveis para:

- solicitante ou engenharia do comprador;
- aprovador comercial;
- qualidade de recebimento.

### 6. Limite do estoque e da produção

Sem integração, o SIVI não pode prometer representar o saldo físico global do fornecedor nem impedir uso fora da plataforma. O núcleo deve acompanhar:

- quantidade declarada para o pedido SIVI;
- quantidade comprometida dentro do SIVI;
- origem, responsável e data da informação;
- marcos compartilháveis de produção;
- quantidade concluída e formada em lote.

ERP, WMS e MES continuam como fontes internas do fornecedor.

### 7. Estados e regras canônicos

Resolver antes da implementação:

- estados oficiais da demanda;
- estado comercial do pedido versus fase operacional resumida;
- regra para fornecedor elegível, convidado ou ambos;
- demanda com vários itens e um único fornecedor vencedor;
- site institucional dentro ou fora do MVP técnico;
- autoridade e versionamento do plano de inspeção.

## Tamanho atual e risco de escopo

Na data desta auditoria, a documentação contém:

- 103 requisitos funcionais, sendo 93 marcados como MVP;
- 25 requisitos não funcionais;
- 101 regras de negócio;
- 69 linhas de entidades no dicionário conceitual de dados;
- aproximadamente 37 telas no inventário do MVP;
- 13 pacotes funcionais no núcleo obrigatório da demonstração.

Esse tamanho representa uma visão inicial de produto, não um MVP acadêmico pequeno. JavaScript vanilla não prejudica a associação industrial; o risco é tentar entregar todos os domínios simultaneamente e demonstrá-los superficialmente.

## MVP acadêmico executável recomendado

Preservar a visão escalável nos documentos, mas implementar primeiro:

1. organizações e permissões mínimas para demonstrar isolamento;
2. uma demanda de um componente físico com especificação revisionada;
3. dois fornecedores com capacidades distintas;
4. match explicado por material, processo, capacidade e certificação;
5. duas propostas, sendo uma revisada;
6. comparador e aceite da versão correta;
7. pedido com requisitos e anexos preservados;
8. declaração de 320 unidades por estoque e 180 por produção;
9. dois lotes;
10. plano de inspeção derivado dos requisitos aceitos;
11. uma falha obrigatória, não conformidade, correção e reinspeção;
12. QR somente para lote liberado;
13. entrega, avaliação e indicadores mínimos reproduzíveis.

Adiar na implementação inicial, sem apagar da visão futura:

- ledger geral de estoque;
- motor genérico de produção;
- construtor universal de planos de inspeção;
- administração e moderação completas;
- mensagens, notas internas e atividades manuais;
- reputação e dashboards avançados;
- site institucional completo;
- suporte simultâneo a várias categorias e serviços;
- integrações, pagamentos, fiscal, assinatura e IA.

## AS-IS, TO-BE e indicadores

A comparação “Como seria sem a SIVI × Como seria com a SIVI” deve também servir como avaliação acadêmica.

Documentar:

- **AS-IS:** como a demanda, busca, comparação, revisão, qualidade e rastreabilidade ocorreriam sem o SIVI;
- **TO-BE:** como os mesmos passos ficam conectados pelo SIVI;
- **baseline:** situação inicial medida ou premissas explícitas de simulação;
- **meta:** melhoria esperada, sem apresentá-la como resultado alcançado antes do teste;
- **resultado:** valor observado na demonstração ou validação.

Indicadores candidatos:

- tempo para localizar fornecedor tecnicamente compatível;
- tempo até a primeira proposta válida;
- percentual de propostas tecnicamente aderentes;
- tempo de comparação e decisão;
- quantidade de revisões ambíguas ou perdidas;
- tempo para recuperar a especificação aceita;
- entrega no prazo;
- taxa de não conformidade;
- tempo de resolução da não conformidade;
- tempo para localizar lote e resultado da inspeção;
- retrabalho ou refugo, somente quando houver dados válidos.

## Evidências acadêmicas necessárias

- curso e perfil profissional;
- unidades curriculares participantes;
- capacidades técnicas e socioemocionais mobilizadas;
- situação-problema;
- processo AS-IS e processo TO-BE;
- requisitos e decisões justificadas;
- caso industrial e massa de dados;
- critérios de aceite e testes;
- indicadores, baseline e metas;
- registro de entrevista, validação ou revisão técnica;
- limitações e itens simulados declarados;
- roteiro e evidências da demonstração.

## Informações ainda necessárias do responsável pelo projeto

Antes de declarar aderência formal ao SENAI, registrar:

1. curso;
2. unidades curriculares envolvidas;
3. competências ou perfil profissional avaliados;
4. prazo final;
5. tamanho e papéis da equipe;
6. rubrica, modelo ou exigências fornecidas pela unidade SENAI;
7. disponibilidade de docente técnico ou profissional industrial para validar o caso.

## Ordem para a próxima retomada

1. obter as informações acadêmicas acima;
2. escolher a vertical e confirmar o tipo de item do MVP;
3. validar o problema industrial;
4. fechar o dossiê técnico das engrenagens;
5. ligar requisito, pedido, inspeção, lote e QR;
6. resolver estados e regras contraditórias;
7. separar visão futura de MVP acadêmico executável;
8. somente depois criar wireframes;
9. então comparar Firebase e Supabase com a fatia reduzida;
10. iniciar código apenas mediante decisão explícita.

## Formulação recomendada para apresentação

> O SIVI é uma plataforma web de integração da cadeia de fornecimento industrial que transforma uma necessidade técnica em fornecedor qualificado, proposta comparável, execução rastreável e desempenho verificável.

