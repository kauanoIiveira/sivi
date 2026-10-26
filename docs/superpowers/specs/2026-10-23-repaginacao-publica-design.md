# SIVI — Repaginação pública e cadastro integrado

Data: 23/10/2026. Projeto efetivo: `C:\Users\Kauan\Desktop\sivi`.

Revisão de planejamento: um revisor independente leu este documento e não identificou decisões importantes faltando. O responsável aprovou a direção e autorizou a implementação após a pesquisa de conversão, em 23/10/2026.

Complemento autorizado: navegação, páginas institucionais e rodapé completos, com conteúdo verificável. Identificação demonstrativa definida pelo agente a pedido do usuário: SIVI Tecnologia, São Paulo/SP, CNPJ 00.000.000/0000-00 e contato@sivi.example, todos explicitamente fictícios e sem atendimento real. Nenhum desses dados representa pessoa jurídica registrada. Ver pesquisa em `../research/2026-10-23-conversao-publica.md`.

## Intenção

Reposicionar a entrada do SIVI como apresentação de um produto B2B industrial real, em continuidade. A página deve despertar interesse em poucos segundos, explicar a conexão entre comprador e fornecedor e levar à escolha de um plano e ao cadastro.

O usuário escolheu **Acordo em movimento**, a proposta recomendada, com abertura cinematográfica e mídia industrial real. Também delegou alterações de layout, fontes, botões e composição. A prévia é um estudo de intenção, não uma composição a copiar literalmente.

O usuário delegou os preços e os benefícios propostos. O pagamento desta entrega é demonstrativo. Com todos os campos válidos, o botão final deve criar uma conta real, sem realizar cobrança.

## O que foi decidido e o que é proposta do agente

Confirmado pelo usuário: superfícies anteriores ao login; ambição visual marcante; uso de fotografias/vídeos reais; React autorizado quando ajudar; 21st.dev como referência prioritária em dúvidas; os dois componentes enviados como referências centrais; escolha de Acordo em movimento; planos propostos pelo agente; formulário de pessoa, empresa e pagamento demonstrativo; criação real de conta na conclusão.

Propostas do agente neste documento: planos por atuação, preços e periodicidades abaixo; uma única jornada de cadastro em etapas; confirmação de e-mail e aprovação empresarial preservadas; React concentrado nas superfícies públicas; fonte Manrope; recuperação local dos dados empresariais por até sete dias; revisão compacta do cadastro empresarial após a confirmação do e-mail.

## Objetivos

- Home cinematográfica, legível e utilizável em celular e computador.
- Gráficos e composição de dados com o acabamento do modelo `web3-bento.tsx`, usando conteúdo industrial.
- Planos e alternância mensal/anual com a apresentação e a transição numérica do modelo `pricing-section.tsx`.
- Login, criação de conta, recuperação de senha e mensagens de acesso com o mesmo cuidado visual.
- Escolha do plano transportada ao cadastro; dados pessoais, empresariais e pagamento demonstrativo apresentados em um só fluxo.
- Conta efetivamente criada no Authentication após validação integral, com mensagens verdadeiras sobre o que foi concluído e o que está pendente.
- Continuidade dos dados empresariais depois da confirmação do e-mail, sem novo preenchimento quando o rascunho estiver disponível.

## Limites e antiobjetivos

Não integrar gateway, capturar pagamentos, criar assinatura financeira, salvar cartão/CVV, emitir fatura ou condicionar permissões comerciais a uma cobrança simulada. Os planos representam uma proposta de oferta, sem enforcement de assinatura nesta entrega.

Não remodelar os painéis e operações autenticados. São permitidas as alterações pontuais de integração necessárias para retomar o cadastro empresarial e preservar a navegação. Não alterar a lógica de demandas, propostas, pedidos, inspeções ou avaliações.

Não apresentar o SIVI como fabricante, transportador, ERP, MES, WMS ou processador do pagamento dos pedidos. Não inventar clientes, depoimentos, economias, notas ou volume de negócios. Estoque, produção, equipes, anexos, QR, lotes e rastreio pendentes não aparecem como benefícios disponíveis.

Não redesenhar a raposa original, publicar Firebase, importar histórico Git nem criar um repositório nesta cópia sem `.git`.

## Abordagens consideradas

| Abordagem visual | Efeito e compromisso | Decisão |
| --- | --- | --- |
| Peça em perspectiva | Tipografia editorial e comparação em destaque; menos impacto de abertura. | Considerada, não escolhida. |
| Acordo em movimento | Vídeo real em grande escala, revelação curta e continuidade entre apresentação e registros da compra. Exige atenção ao peso da mídia e à clareza B2B. | Escolhida pelo usuário. |
| Força industrial | Grandes campos de laranja e fotografia do trabalho; presença forte, com maior intensidade cromática. | Considerada, não escolhida. |

Para a construção, o agente propõe React nas superfícies públicas, integrado ao roteador e aos serviços existentes. A adaptação integral dos exemplos para JavaScript puro permitiria movimento, mas exigiria reescrever os componentes de referência. A migração de todo o sistema para React ampliaria o trabalho além das páginas solicitadas.

## Direção visual

Modo da home e dos planos: Persuade. Modo dos formulários: Operate. A expressão se concentra na apresentação; preencher e corrigir um formulário exige leitura e controles familiares.

Ideia: **o acordo que conecta duas empresas é o fio contínuo da página, da peça e seus requisitos até o recebimento**. A indústria real ocupa a imagem; o SIVI explica a relação comercial e mostra os registros que a sustentam.

- Grafite profundo, branco de alto contraste e laranja da marca. Grandes mudanças de superfície, em vez de um bloco repetido de cartões.
- Manrope para a nova superfície pública, com escala e pesos definidos em tokens próprios. O agente pode ajustar a fonte durante a prova visual se houver um motivo documentado de legibilidade ou composição. A tipografia da área autenticada permanece isolada.
- Título principal curto: **O próximo acordo começa aqui.** Texto de apoio: **Conecte a necessidade da sua empresa à capacidade de quem fornece. Da demanda ao recebimento, com cada condição registrada.**
- Navegação com SIVI, Como funciona, Planos e Entrar. Ação principal da home: **Encontre seu plano**.
- Botões com forma definida para esta apresentação, hierarquia de ação clara, área mínima de 44 × 44 px e estados de foco, hover, pressão e espera. A geometria anterior do projeto não limita a nova direção.
- A composição pode ser refeita; preservar a clareza do título, do apoio e da ação na primeira tela. Sem conteúdo essencial atrás de uma espera ou de um efeito de rolagem.
- Usar os gráficos e os cartões do modelo fornecido dentro de fragmentos de interface identificados como exemplo. As regras de uma interface de dados valem dentro deles; evitar ornamentos sem função nas demais seções.

## Estrutura e argumento da home

| Parte | O que precisa comunicar | Evidência e interação |
| --- | --- | --- |
| Abertura | O SIVI conecta demanda industrial e capacidade de fornecimento. | Vídeo real, título, apoio e ação visíveis. |
| Comparação e visão da operação | As condições ficam comparáveis e o pedido preserva o aceite. | Bento com curva, barras e distribuição por etapa; alternância comprador/fornecedor e informação acessível. Valores ilustrativos explícitos. |
| Jornada | Cada lado sabe o que faz da demanda ao recebimento. | As sete etapas já implementadas, selecionáveis por teclado e toque, com responsabilidade por atuação. |
| Atuações e planos | Uma empresa pode comprar, fornecer ou exercer as duas atuações. | Três ofertas completas, periodicidade e total anual visível. |
| Entrada | É possível fornecer os dados em um único caminho. | Ações que abrem o cadastro com plano e atuação selecionados. |
| Dúvidas e rodapé | Explicar confirmação, aprovação, pagamento demonstrativo e responsabilidades. | Respostas completas, links reais e créditos de mídia. |

Alternar composição entre as partes; não repetir grades iguais como estrutura de toda a página. A home pode mostrar uma amostra do cadastro, mas o formulário completo tem uma superfície própria para manter o foco e reduzir o comprimento da apresentação.

## Referências e gráficos

Fontes fornecidas pelo usuário:

- `C:\Users\Kauan\.codex\attachments\3cea5d80-0bd4-4645-ae5e-0cdf5badcc58\Texto colado.txt`: `web3-bento.tsx`, com linhas, barras, distribuição, controle de período e estados de interação.
- `C:\Users\Kauan\.codex\attachments\1200cbf8-6d32-4f0b-b506-ceac4954ece8\Texto colado.txt`: `pricing-section.tsx`, com cartões, periodicidade, NumberFlow e revelação de conteúdo.

Integrar e adaptar as partes úteis desses códigos em componentes React/TypeScript locais. Não copiar terminologia, saldos, redes, cartões bancários, staking ou preços de outra categoria. Não instalar uma dependência não usada nem importar o painel Web3 inteiro para depois esconder seus blocos.

O exemplo industrial terá uma massa determinística local, sem consulta a dados privados. Curvas e contagens vêm dos mesmos registros: propostas por período, demandas e pedidos por etapa. Filtros alteram o conjunto exibido e os totais correspondentes. Incluir legenda, unidade, período, tabela/descrição alternativa e suporte a toque, foco e redução de movimento. Os valores são exemplos, não resultados agregados do SIVI nem promessas de desempenho.

A busca do MCP 21st.dev falhou nas tentativas de catálogo. Os componentes completos anexados permitem trabalhar sem geração hospedada. O acesso de geração 21st está desabilitado; não contornar essa condição. A implementação pode voltar ao catálogo se a busca se recuperar, priorizando essas referências e o contexto do produto.

## Movimento e mídia

- Primeira visita: uma revelação de até 1,2 segundo, com a marca e a passagem para a cena industrial. A ação e a leitura permanecem disponíveis; a animação não é um carregador obrigatório.
- Registrar a apresentação vista em `localStorage`, chave versionada `sivi.public-intro.v1`. Se o armazenamento estiver indisponível, usar memória na visita atual; não falhar nem repetir na navegação interna.
- Visitas seguintes entram diretamente no hero. A redução de movimento remove a abertura, o avanço de gráficos e o autoplay, apresentando o poster e todos os textos.
- Vídeo mudo, `playsinline`, com poster local, dimensões declaradas, controle de pausa acessível e interrupção fora da tela. Sem som automático ou captura da rolagem.
- Transições de gráficos, troca de plano e feedback de controles seguem Motion; pequenos elementos podem usar CSS. Cancelar animações e observadores ao desmontar a página.
- Toda seção recebe uma entrada coerente de suas partes, sem esconder conteúdo caso JavaScript ou mídia falhem. Animar principalmente transform e opacity.

Mídia já localizada: `assets/cnc-lathe.webm` e poster, de Vandurit inserti, CC BY 3.0; fotografias `assets/operador-torno.jpg` e `assets/detalhe-torno.jpg`, de Tima Miroshnichenko, Licença Pexels. Fontes em `assets/credits.json` e `assets/stock-provenance.json`. A fotografia CNC adicional é material de pesquisa, não escolha obrigatória para o produto.

Antes da entrega, selecionar pelo menos quatro imagens ou fragmentos reais do produto que tenham função na narrativa. Fotografias externas mostram o contexto industrial e não são apresentadas como instalações, clientes ou equipe do SIVI. Manter fontes e licenças, créditos discretos no rodapé e identificação de alterações exigida pela licença. Não gerar fotografias/vídeos com IA. A escolha final de uma tomada melhor é do construtor, dentro desse compromisso e com origem verificada.

## Planos propostos

Valores e posicionamento propostos pelo agente, sem validação de mercado. Não constituem uma cobrança ativa.

| Plano | Mensal por empresa | Equivalente mensal no anual | Total anual | Conteúdo apresentado |
| --- | --- | --- | --- | --- |
| Compras | R$ 99 | R$ 79 | R$ 948 | Demandas multiitem, compatibilidade explicada, comparação de propostas, pedidos e recebimentos. |
| Fornecimento | R$ 149 | R$ 119 | R$ 1.428 | Perfil industrial, oportunidades, propostas versionadas, inspeção e expedição. |
| Integrado | R$ 199 | R$ 159 | R$ 1.908 | As duas atuações, troca de atuação, histórico e indicadores correspondentes. |

Selecionar Mensal ou Anual atualiza os preços e o resumo sem perda de foco. No anual, sempre informar o total anual; não apresentar o equivalente mensal como se fosse uma cobrança mensal. Não usar selos de popularidade ou descontos percentuais sem correspondência exata.

A página e o pagamento informarão: **Pagamento demonstrativo. Nenhum valor será cobrado.** A seleção representa interesse no plano. Não gravar `paid`, `activeSubscription` ou semelhante e não abrir permissões por uma simulação.

As atuações de empresa devem ser compatíveis com o plano: Compras seleciona buyer, Fornecimento seleciona supplier e Integrado seleciona ambos. Alterar a intenção muda o plano/resumo coerentemente; não deixar uma combinação contraditória. Nenhum cadastro existente perde atuações por causa desses planos demonstrativos.

## Rotas e cadastro integrado

Preservar as rotas públicas atuais: `#/` e `#/acesso`. O modo `#/acesso?modo=login` abre o login redesenhado. O modo `#/acesso?modo=register` abre o cadastro integrado, com parâmetros conhecidos de plano, periodicidade e atuação. Links antigos de cadastro continuam válidos. Parâmetro inválido usa Integrado/Mensal sem quebrar o formulário.

O cadastro por e-mail tem três partes, com resumo persistente do plano e retorno para editar sem perda dos campos:

1. **Seus dados:** nome, sobrenome, e-mail, senha e confirmação. Aplicar os mesmos limites e critérios de senha já usados no projeto.
2. **Empresa:** nome, CNPJ, cidade, UF, contato e atuação derivada do plano. Reutilizar `normalizeApplication`, incluindo suporte ao formato alfanumérico de CNPJ já aceito; não prometer consulta oficial. Apresentar revisão completa antes do envio.
3. **Pagamento demonstrativo e conclusão:** nome do titular de teste, número de teste, validade e código de teste, com instrução explícita e dados de teste disponíveis. Campos de teste são editáveis, validados apenas como demonstração e separados dos objetos de pessoa/empresa. Aceitar somente os dados de teste documentados; não pedir cartão real. A ação é **Concluir cadastro**, nunca Pagar ou Pagamento aprovado.

Validar o conjunto completo novamente no envio final, inclusive etapas anteriores. Não criar usuário, perfil ou empresa ao avançar etapas. Só chamar `registerWithEmail` depois da validação integral. Desabilitar envio duplicado, manter os campos em erros recuperáveis e levar o foco ao campo/resultado relevante.

Senha, confirmação e dados de cartão ficam somente no estado transitório da página, com limpeza ao concluir/desmontar. Não entram em armazenamento, URL, logs, telemetria, Firebase ou relatório de testes. A carga de criação da conta contém somente os campos aceitos pelo serviço de autenticação atual. O plano escolhido não é prova de pagamento.

Login, recuperação de senha, mostrar senha e login Google/GitHub preservam as capacidades atuais. Os provedores permanecem no login; o novo cadastro integrado por e-mail não oferece um atalho social que crie a conta ao avançar etapas. O primeiro acesso via provedor mantém o onboarding existente e não simula pagamento realizado.

## Conta, empresa e continuidade

As regras atuais permitem a conta pessoal antes da confirmação de e-mail e exigem e-mail confirmado para criar a empresa. Preservar esse contrato. Não existe uma transação atômica entre Authentication e cadastro empresarial.

Após a criação da conta, mostrar **Conta criada**, o estado real do envio de verificação e a continuação: confirmar e-mail, entrar e enviar a empresa para análise. Um erro ao salvar perfil ou enviar e-mail não vira uma falsa mensagem de que a conta não existe; oferecer a recuperação apropriada sem chamar criação novamente.

Guardar apenas os dados empresariais normalizados, o interesse em plano/periodicidade e os identificadores de continuidade em um rascunho local, vinculado ao UID retornado e ao e-mail normalizado, com expiração de sete dias. Nunca senha/cartão. Guardar antes da chamada uma cópia empresarial transitória recuperável; após sucesso, vinculá-la ao UID. Não aplicar rascunho de outra conta.

Depois de confirmar o e-mail e entrar neste navegador, oferecer uma revisão compacta com os dados já preenchidos e **Enviar empresa para análise**. Reutilizar a criação empresarial existente. A confirmação do usuário nessa revisão pode editar os dados; não é uma repetição obrigatória do preenchimento.

Para a nova continuidade, persistir o identificador da tentativa empresarial antes de gravar. Reutilizar o mesmo identificador ao reconciliar resultado desconhecido e conferir a organização/vínculo da conta antes de tentar novamente. Isso requer uma extensão pequena e opcional da criação existente, preservando os chamadores atuais; não prometer unicidade global por CNPJ. Uma gravação confirmada com falha na releitura mantém o sucesso e permite atualizar situação, sem reenviar.

Concluir a empresa deixa o cadastro **Em análise**; somente a aprovação atual libera operação. O rascunho local é removido após confirmação da gravação. Troca de usuário não carrega dados da conta anterior. Em outro navegador, rascunho expirado ou armazenamento indisponível, a conta continua válida: explicar a ausência dos dados e oferecer o cadastro empresarial existente. Com armazenamento indisponível, a recuperação fica limitada à página atual e a mensagem precisa informá-lo.

Conta já existente: explicar e oferecer login/recuperação de senha, mantendo os campos empresariais sem vinculá-los a um UID adivinhado. Resultado desconhecido de criação: orientar a reconciliação por login/recuperação, sem alegar sucesso financeiro ou repetir automaticamente `createUserWithEmailAndPassword`.

## Arquitetura proposta

- React, React DOM, TypeScript, Tailwind e Motion para a nova superfície pública. Componentes de gráficos e planos adaptados dos anexos; NumberFlow no preço se agregar a transição pedida.
- Build de biblioteca isolada, com Vite. O controlador atual continua responsável por rotas, sessão, contextos e área autenticada. Adaptadores montam/desmontam as árvores React nos contêineres públicos existentes.
- Serviços Firebase permanecem fora do bundle React e são injetados por adaptadores JavaScript. A configuração/importmap e a instância atual do SDK continuam únicas; não inicializar outro app Firebase.
- CSS público com tokens e utilitários isolados, sem preflight global ou alteração das classes operacionais. Fonte, tema e geometria públicos não vazam para o sistema autenticado.
- Produzir arquivos JavaScript/CSS prontos para servir por HTTP; `npm start` e os comandos de teste preparam o build público. O pacote de transferência também deve levar os arquivos compilados para a abertura com Live Server.
- Pastas sugeridas: `src/public/` para a experiência React, `src/public/components/ui/` para as partes adaptadas, `src/public/signup/` para a jornada, `src/generated/public/` para a saída portátil e um módulo próprio para o rascunho/continuidade. O plano posterior fechará arquivos e interfaces exatos.
- Node 22+ continua a premissa do projeto; o plano verificará o piso exato requerido pelas versões estáveis escolhidas antes de instalar. Não instalar dependências durante esta fase de design.

## Estados e acessibilidade

Prever carregamento inicial, falha ao baixar o bundle/SDK, rede lenta, mídia indisponível, formulário incompleto, senha divergente, e-mail em uso, criação em andamento, sucesso parcial, confirmação pendente, rascunho ausente/expirado e cadastro empresarial em análise.

Textos essenciais e alternativa de carregamento continuam visíveis quando um recurso falha. Nenhuma falha de vídeo bloqueia cadastro ou login. Formulários têm rótulos persistentes, autocomplete correto, campos de 16 px no celular, regiões de estado, foco recuperável e mensagens que indiquem a correção. Contraste mínimo 4,5:1 para texto normal e 3:1 para texto grande. Tabelas e gráficos têm alternativa textual; cor não é a única indicação.

Preservar preferências de acessibilidade do dispositivo e a preferência de tema da área autenticada. A apresentação tem direção própria, sem sobrescrever a escolha salva do sistema.

## Como provar a entrega

- Cadastro por e-mail nos emuladores: dados inválidos em qualquer etapa não criam conta; envio final válido cria uma só conta; nenhuma transação de pagamento é emitida.
- Inspecionar todas as cargas gravadas e armazenamento: nenhum cartão, CVV, senha ou confirmação em dados persistidos/logs. Os dados de pessoa aparecem apenas nos serviços apropriados.
- Confirmar e-mail no emulador, entrar, revisar dados empresariais, enviar e obter Em análise. Exercitar falha parcial, resultado desconhecido, retorno a etapas e duas tentativas concorrentes.
- Provar isolamento do rascunho por UID/e-mail, expiração e indisponibilidade de armazenamento. Repetir gravação empresarial com o mesmo identificador e confirmar ausência de duplicação nessa operação.
- Login, reset de senha, provedores suportados, links antigos, retorno de rota protegida e área comercial continuam funcionando. Nenhuma alteração de regras remotas faz parte da validação.
- Imagens, vídeo, intro de primeira visita/retorno, pausa e redução de movimento verificados no navegador. Gráficos e preço têm toque/teclado, valores coerentes e total anual correto.
- Verificar home, login e cadastro em 360, 390, 768 e 1440 px; home/rodapé também em 1920 e 2560 px. Sem overflow de página, ações escondidas ou conteúdo que não aparece após a animação.
- Executar os gates visuais aplicáveis de design-taste e Impeccable, abrir as capturas finais, corrigir falhas materiais e fazer a revisão independente exigida pelas skills. Formulários seguem o critério de tarefa; não inserir fotografias apenas para atingir um contador.
- Registrar comandos, resultados, imagens e limitações reais. Não afirmar prontidão de cobrança, implantação remota ou validação de mercado.

## Entregáveis e sequência

Este documento é a definição proposta para aprovação. Depois da aprovação, criar o plano com `superpowers:writing-plans`, incluindo tarefas, interfaces, testes e estratégia de execução. A implementação do produto começa somente após essa etapa e a revisão prevista pelo fluxo solicitado.

Ao concluir a implementação: páginas públicas redesenhadas, cadastro real com pagamento demonstrativo, continuidade empresarial, assets/licenças, instruções de execução/transferência e documentação visual atualizada no escopo público. Manter os protótipos separados do produto e excluir seus controles de estudo da entrega.
