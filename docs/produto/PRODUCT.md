# Produto — SIVI

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Responsáveis por empresas compradoras e fornecedoras industriais. Uma empresa pode exercer as duas atuações. A administração SIVI analisa os cadastros e controla a aprovação das empresas.

## Product Purpose

O Sistema Integrado de Vendas Industriais conecta necessidades de compra à capacidade de fornecimento, organizando a negociação e os registros da demanda ao recebimento e à avaliação.

Em 17/11/2026, o responsável definiu que o SIVI operará sem planos comerciais. A atuação da empresa determina quais contextos ela pode acessar após a aprovação.

## Operating Context

O fluxo implementado compreende demanda com vários itens, compatibilidade explicada, propostas versionadas, comparação e aceite, pedido com condições preservadas, inspeção por item, expedição, recebimento e avaliação. Conta pessoal, vínculo empresarial e atuação comercial são conceitos separados.

## Capabilities and Constraints

- A pasta efetiva do trabalho é `C:\Users\Aluno\Documents\sivi-master`. Ela não contém `.git`; a cópia em Documents é distinta.
- A implementação combina módulos JavaScript/Firebase com React/TypeScript/Motion compilados para apresentação, acesso e gráficos operacionais. A operação preserva seus serviços e regras existentes.
- O escopo inicialmente público foi ampliado expressamente em23/10/2026 para a área interna: painéis, gráficos, demandas, propostas, pedidos e demais superfícies autenticadas. O usuário pediu para prosseguir considerando o modelo de dashboard fornecido; deseja facilidade de uso, apresentação e venda do próprio sistema.
- O cadastro cria a conta pessoal e registra a atuação escolhida para a empresa. As opções são Compradora, Fornecedora e Compradora e fornecedora.
- O acesso operacional requer confirmação do e-mail e aprovação do cadastro empresarial.
- A abertura apresenta o marketplace e encaminha para Quem somos (`#/quem-somos`), Plataforma (`#/plataforma`), Casos de uso (`#/casos`) e Dúvidas (`#/duvidas`).
- A identidade pública SIVI Tecnologia, São Paulo/SP, o CNPJ 00.000.000/0000-00 e contato@sivi.example foram definidos como dados demonstrativos por delegação do usuário. Não apresentar como empresa registrada ou atendimento existente.
- As empresas negociam as condições comerciais e o pagamento dos pedidos industriais. O sistema organiza os registros dessa negociação.
- Recursos pendentes, como anexos, propostas por item, equipes, lotes, QR e rastreio de transporte, não podem ser apresentados como já disponíveis. A documentação mais recente prevalece sobre o roteiro histórico de MVP.
- As proteções comerciais descritas na revisão de 01/10 foram verificadas localmente; esta repaginação não comprova implantação dessas regras no ambiente remoto.

## Brand Commitments

Preservar o nome SIVI, a identidade industrial e a marca da raposa autorizada, cuja origem está em `src/assets/brand/README.md`. A apresentação pública usa abertura animada, mídia industrial real e páginas independentes inspiradas na estrutura da Digi.

Em 23/10/2026, o usuário escolheu a proposta recomendada, **Acordo em movimento**, e explicitou liberdade para mudar layout, botões, fontes e composição. A prévia orienta a intenção cinematográfica; sua geometria e sua tipografia não são limites da repaginação. Em dúvidas visuais, priorizar a 21st.dev e os dois componentes fornecidos pelo usuário. A liberdade estética não altera o domínio industrial nem autoriza inventar capacidades ou resultados do produto.

## Evidence on Hand

O comportamento atual é documentado em `docs/guias/CONTINUE_AQUI.md`, `docs/historico/34-fluxo-empresas-e-integridade.md` e nos documentos de revisão visual e acessibilidade de 30/09. A navegação pública está em `src/app/routes.js`; a página inicial em `src/pages/public/`; o acesso em `index.html` e `src/pages/auth/`.

A demonstração da Plataforma adapta o painel Web3 com gráficos interativos. Os valores e registros exibidos ilustram condições de uma compra entre empresas.

## Product Principles

- Preservar as funções reais e a continuidade da jornada entre comprador e fornecedor.
- Apresentar capacidades e condições com correspondência ao que será efetivamente entregue.
- Distinguir indicadores comprovados, exemplos ilustrativos e recursos futuros.
- Manter o isolamento dos dados e as permissões por empresa.
- Usar a apresentação pública para explicar o produto e encaminhar ao cadastro e ao acesso da empresa.

## Accessibility & Inclusion

Preservar navegação por teclado, foco visível, rótulos de formulário, mensagens de erro e redução de movimento do dispositivo. O acesso deve permanecer utilizável no celular. A animação de abertura e os gráficos precisam de alternativas acessíveis e não podem impedir o uso da página.
