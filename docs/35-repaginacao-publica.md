# Repaginação pública — 23/10/2026

Continuação do SIVI em `C:\Users\Kauan\Desktop\sivi`. Direção **Acordo em movimento** aprovada pelo responsável, com liberdade para reformular composição, fontes e controles. Pesquisa de apresentação comercial em [pesquisa aplicada](superpowers/research/2026-10-23-conversao-publica.md), decisões na [spec](superpowers/specs/2026-10-23-repaginacao-publica-design.md), execução no [plano](superpowers/plans/2026-10-23-repaginacao-publica.md).

## O que mudou

- Home com vídeo CNC real, abertura curta na primeira visita, controle de reprodução e respeito à redução de movimento.
- Demonstração industrial com curva, comparação de valores, distribuição por etapa, período e alternância comprador/fornecedor. Todos os números são ilustrativos; não representam resultados reais da plataforma.
- Planos Compras, Fornecimento e Integrado com preço mensal, equivalente mensal anual e total anual explícito. Interesse em plano e periodicidade acompanha o cadastro.
- Cadastro em três etapas: acesso pessoal → empresa → revisão e pagamento de teste. O botão final cria a conta real; não cria assinatura, não cobra e não envia cartão/CVV.
- Login, senha visível, recuperação, provedores Google/GitHub e mensagens de falha ou sucesso parcial integrados aos serviços existentes.
- Retomada empresarial depois da confirmação do e-mail: rascunho local por até sete dias, associado ao UID/e-mail, revisão antes do envio e tentativa estável para evitar duplicação ao repetir um envio incerto.
- Sobre, Ajuda, Segurança e dados, Privacidade, Condições de uso e Créditos, com cabeçalho e rodapé navegáveis. Sem clientes, depoimentos, certificações ou canais de atendimento inventados.

## Oferta proposta

| Plano | Mensal | Equivalente anual por mês | Total anual |
| --- | ---: | ---: | ---: |
| Compras | R$99 | R$79 | R$948 |
| Fornecimento | R$149 | R$119 | R$1.428 |
| Integrado | R$199 | R$159 | R$1.908 |

Não há cobrança, renovação automática, fatura, gateway ou restrição de assinatura implementados. O pagamento dos pedidos industriais continua combinado entre as empresas. A análise do cadastro não representa certificação técnica ou garantia de entrega.

## Estrutura e desenvolvimento

`src/public/`: experiência pública React. `src/components/ui/`: adaptações dos dois modelos 21st.dev fornecidos, sem importar terminologia Web3 nem recursos de outra categoria. `src/generated/public/`: biblioteca JS/CSS pronta para servir. `vite.public.config.ts` e `tsconfig.public.json`: compilação isolada. CSS prefixado, sem preflight global; Firebase continua fora do bundle e usa a instância existente.

Use Node >=22.12, `npm ci`, `npm run check:public`, `npm run build:public`, `npm start`. Live Server pode servir os arquivos compilados incluídos. O exportador inclui mídia, fonte, configurações React/Vite e build. Não transferir apenas `src/public/` sem seus arquivos gerados e dependências de projeto.

## Identidade e publicação

Por autorização expressa, a identificação é demonstrativa: **SIVI Tecnologia · São Paulo/SP · CNPJ fictício 00.000.000/0000-00**. **contato@sivi.example** não recebe mensagens. Esses avisos aparecem junto dos dados. A ajuda disponível é a página de orientações. A operação comercial futura precisa de responsável e canais reais; nenhuma identidade ou disponibilidade de suporte foi alegada.

Título, descrição, favicon e metadados básicos estão presentes. O domínio público não foi definido e as rotas continuam baseadas em hash: não foi inventada URL canônica nem declarada validação de SEO de produção. Nenhuma publicação de regras, site ou dados de teste ocorreu no Firebase remoto.

## Mídia e verificação

Fontes e licenças ficam em `assets/stock-provenance.json`, `assets/credits.json`, `assets/fonts/OFL-Manrope.txt` e na página Créditos. Os três rasters de entrega possuem origem incorporada; o vídeo é atribuído a Vandurit inserti, CC BY3.0, e as fotos a Tima Miroshnichenko/Pexels. A raposa original foi preservada.

Evidências locais: `.checks/public-redesign-20261023/` e `.impeccable/review/`. As capturas cobrem 360, 390, 768, 1265, 1440, 1920 e 2560px; o script `scripts/capture-public-review.mjs` permite repetir a inspeção. Não houve transbordamento nem erros JavaScript nas dez combinações de home/pagamento registradas em `capture-results.json`.

Verificação final em 23/10/2026: **203 testes unitários e 174 testes de navegador aprovados**, typecheck e build aprovados; auditoria das dependências de execução sem vulnerabilidades reportadas. Testes exercitam criação emulada de conta, confirmação, revisão da empresa, ausência de segredos no armazenamento, recuperação e repetição segura. Testes estáticos ligados à marcação antiga foram substituídos por verificações da interface e do fluxo real. As dependências de ferramentas de desenvolvimento não receberam uma atualização geral nesta entrega.

Revisões independentes de código e acabamento foram realizadas por revisores equivalentes, pois os tipos especializados não estavam disponíveis. A revisão de código confirmou a resolução dos três achados; a revisão visual confirmou os oito ajustes solicitados, sem regressões materiais decorrentes desse lote. Movimento foi exercitado nos testes de navegador; a revisão visual por capturas não o avaliou em tempo real. Identidade, conteúdo e oferta foram conferidos contra a spec. SHA-256 da raposa e dos dois favicons coincide com o snapshot anterior.

`DESIGN.md` e `.impeccable/design.json` registram a direção e os valores efetivamente usados no CSS. O ledger preserva as decisões, evidências e limites desta cópia sem Git.
