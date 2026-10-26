# Produto — SIVI

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Responsáveis por empresas compradoras e fornecedoras industriais. Uma empresa pode exercer as duas atuações. A administração SIVI analisa os cadastros e controla a aprovação das empresas.

## Product Purpose

O Sistema Integrado de Vendas Industriais conecta necessidades de compra à capacidade de fornecimento, organizando a negociação e os registros da demanda ao recebimento e à avaliação.

Em 23/10/2026, o responsável confirmou que o SIVI deve continuar como produto comercial real, com planos pagos. A origem acadêmica é contexto histórico e não limita a evolução do produto. Esta é uma continuação do sistema existente.

## Operating Context

O fluxo implementado compreende demanda com vários itens, compatibilidade explicada, propostas versionadas, comparação e aceite, pedido com condições preservadas, inspeção por item, expedição, recebimento e avaliação. Conta pessoal, vínculo empresarial e atuação comercial são conceitos separados.

## Capabilities and Constraints

- A pasta efetiva do trabalho é `C:\Users\Kauan\Desktop\sivi`. Ela não contém `.git`; a cópia em Documents é distinta.
- A implementação combina módulos JavaScript/Firebase com React/TypeScript/Motion compilados para apresentação, acesso e gráficos operacionais. A operação preserva seus serviços e regras existentes.
- O escopo inicialmente público foi ampliado expressamente em23/10/2026 para a área interna: painéis, gráficos, demandas, propostas, pedidos e demais superfícies autenticadas. O usuário pediu para prosseguir considerando o modelo de dashboard fornecido; deseja facilidade de uso, apresentação e venda do próprio sistema.
- Planos pagos são uma direção comercial confirmada. O usuário delegou a proposta de preços e benefícios; esses valores são uma proposta comercial, não uma validação de mercado.
- Nesta entrega, o pagamento será somente demonstrativo, integrado ao cadastro da empresa e da pessoa. Com os campos válidos, a ação final deverá criar uma conta real. O usuário explicitamente dispensou cobrança funcional e integração com provedor de pagamento.
- A confirmação de e-mail e a análise empresarial já existem. A proposta deve explicar a continuidade entre a conta criada, os dados empresariais coletados e a liberação operacional, sem apresentar pagamento demonstrativo como confirmação financeira.
- Dados de cartão demonstrativo não são credenciais de pagamento nem devem ser enviados ao Firebase, guardados em armazenamento persistente ou incluídos em registros de diagnóstico.
- A entrada pública apresenta Compras (R$99/mês), Fornecimento (R$149/mês) e Integrado (R$199/mês), com propostas anuais de R$948, R$1.428 e R$1.908. Os preços são uma oferta proposta; a versão atual não cobra, não ativa assinatura financeira e não impõe limites por pagamento.
- A identidade pública SIVI Tecnologia, São Paulo/SP, o CNPJ 00.000.000/0000-00 e contato@sivi.example foram definidos como dados demonstrativos por delegação do usuário. Não apresentar como empresa registrada ou atendimento existente.
- Cobrar pelo acesso à plataforma é uma decisão distinta de processar o pagamento dos pedidos industriais. O sistema atual organiza as condições comerciais entre as empresas e não fabrica nem transporta os produtos.
- Recursos pendentes, como anexos, propostas por item, equipes, lotes, QR e rastreio de transporte, não podem ser apresentados como já disponíveis. A documentação mais recente prevalece sobre o roteiro histórico de MVP.
- As proteções comerciais descritas na revisão de 01/10 foram verificadas localmente; esta repaginação não comprova implantação dessas regras no ambiente remoto.

## Brand Commitments

Preservar o nome SIVI, a identidade industrial e a marca da raposa autorizada, cuja origem está em `src/assets/brand/README.md`. O usuário pede uma apresentação marcante, gráficos com acabamento comparável às referências fornecidas, seção de planos e uma abertura animada na primeira visita à página inicial. Fotografias e vídeos devem ser reais e pertinentes ao contexto industrial; o usuário rejeitou imagens artificiais produzidas por IA.

Em 23/10/2026, o usuário escolheu a proposta recomendada, **Acordo em movimento**, e explicitou liberdade para mudar layout, botões, fontes e composição. A prévia orienta a intenção cinematográfica; sua geometria e sua tipografia não são limites da repaginação. Em dúvidas visuais, priorizar a 21st.dev e os dois componentes fornecidos pelo usuário. A liberdade estética não altera o domínio industrial nem autoriza inventar capacidades ou resultados do produto.

## Evidence on Hand

O comportamento atual é documentado em `CONTINUE_AQUI.md`, `docs/34-fluxo-empresas-e-integridade.md` e nos documentos de revisão visual e acessibilidade de 30/09. A navegação pública está em `src/app/routes.js`; a página inicial em `src/pages/public/`; o acesso em `index.html` e `src/pages/auth/`.

Foram fornecidos dois componentes de referência: um painel Web3 com gráficos interativos e uma seção de preços animada. Seus dados financeiros, recursos e valores são exemplos de outra categoria, não fatos comerciais do SIVI. A inspeção visual inicial foi registrada em `.taste-skill/before-home/` e `.taste-skill/before-access/`.

## Product Principles

- Preservar as funções reais e a continuidade da jornada entre comprador e fornecedor.
- Apresentar capacidades, preços e condições com correspondência ao que será efetivamente entregue.
- Distinguir indicadores comprovados, exemplos ilustrativos e recursos futuros.
- Manter o isolamento dos dados e as permissões por empresa.
- Usar a apresentação pública para explicar o produto e encaminhar à contratação e ao acesso conforme o modelo aprovado.

## Accessibility & Inclusion

Preservar navegação por teclado, foco visível, rótulos de formulário, mensagens de erro e redução de movimento do dispositivo. O acesso deve permanecer utilizável no celular. A animação de abertura e os gráficos precisam de alternativas acessíveis e não podem impedir o uso da página.
