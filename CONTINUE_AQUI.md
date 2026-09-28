# Retomar o SIVI — 27/09/2026

Comece por [32 — Evolução funcional e continuidade](docs/32-evolucao-e-continuidade.md) e [33 — Transferência e limpeza](docs/33-transferencia-e-limpeza.md). Eles descrevem a entrega mais recente, as funções aplicadas e o que permanece pendente. Os documentos 26 a 31 conservam as revisões anteriores.

## Executar

O ponto de entrada é index.html, com HTML/CSS/JavaScript e Firebase Authentication/Realtime Database. Não há build, React ou Vite. Use Node.js 22+; execute npm ci e npm start na raiz, depois abra http://127.0.0.1:4173/#/.

Para os testes: npm test. Playwright inicia servidor e emuladores locais. É necessário JDK 21+; SIVI_JAVA_HOME pode apontar para um JDK instalado. Na máquina de origem foi usado C:/Program Files/Android/Android Studio/jbr. Esse caminho deve ser conferido no destino.

Verificação final: 155 testes unitários e 124 de navegador/emuladores aprovados, 180 verificações de largura em 22 telas/estados sem transbordamento. Os resultados ficam em docs/reviews/2026-09-27-evolucao-final.json. Capturas desta entrega: exports/evolucao-final-2026-09-27. Não houve implantação remota, commit ou push nesta entrega.

## Funções atuais

- Landing industrial com explicação interativa da compra e papéis de comprador/fornecedor. Temas, teclado e texto ampliado continuam disponíveis.
- Autenticação, confirmação de e-mail, cadastro de empresas com revisão, aprovação, correção/reenvio e bloqueio. Uma empresa pode comprar e fornecer.
- Administração com cadastro para responsáveis verificados; perfil industrial dos fornecedores; navegação por empresa e atuação.
- Demandas multiitem, objetivo separado, edição transacional do rascunho, recuperação de preenchimento na mesma aba, busca e filtros.
- Reutilização de uma demanda como novo rascunho independente, revisável antes de gravar. Prazos vencidos não são reaproveitados.
- Match explicado por requisitos e capacidade, sem comparar metros com unidades ou somar unidades distintas.
- Propostas versionadas, validade pelo dia de São Paulo, comparação e pedido com cópia das condições aceitas.
- Filtros e ordenação de negociações/pedidos por situação, empresa, referência, descrição, atualização, data desejada e valor. Preferências isoladas por contexto.
- Avisos no painel para validade próxima, propostas vencidas e data desejada pelo comprador. Essa data não equivale à promessa de entrega.
- Inspeção e reinspeção por item, liberação integral, expedição, confirmação de recebimento e avaliação.
- CSV da lista filtrada de pedidos, com uma linha por item e totais sem duplicação. Resumo imprimível do pedido e dos registros operacionais.
- Proteção de preenchimento e envio, confirmação de gravação distinguida de erro na leitura seguinte, atualização explícita e estados de erro recuperáveis.

## Consistência e limites

A publicação agora leva o token da versão do rascunho. As regras locais rejeitam o PATCH inteiro se essa versão mudar entre leitura e publicação. O token de edição avança mesmo com relógios repetidos. Demandas desta versão guardam os destinatários na projeção privada do comprador; o aceite encerra as oportunidades desses fornecedores no mesmo PATCH.

**As regras comerciais e a precondição de publicação ainda não foram implantadas no Firebase remoto.** Os resultados são locais, verificados com emuladores. Não afirmar proteção remota sem atualização coordenada. Clientes antigos sem o marcador permanecem compatíveis e não recebem a mesma garantia.

O bloco 1B do [roteiro 28](docs/28-proximos-passos.md) está parcialmente atendido. Continuam prioritários: criação/aceite autoritativos, repetição segura de escritas de resultado desconhecido e reconciliação de projeções antigas. Sem lista de destinatários, o fechamento legado alcança apenas fornecedores conhecidos pelas propostas. A inspeção e a avaliação ainda precisam de validação completa e histórico imutável nas regras.

Propostas por item, anexos, atendimento por estoque/produção, lotes, QR, dados detalhados de transporte, notificações persistidas e gestão de convites/membros continuam pendentes. A jornada real mostra apenas as etapas implementadas. Não colocar métricas fictícias, estoque, QR ou rastreio como se já existissem.

O SIVI é intermediador B2B industrial; não é ERP/MES/WMS e não fabrica, transporta ou processa pagamentos. Simulações ficam somente em tests/fixtures.

## Direção visual

Preservar Archivo e IBM Plex Mono, grafite, superfícies planas, laranja nas ações e cores semânticas suaves. Aplicar minimalist-ui quando ajudar a leitura industrial, sem impor serifas, animações decorativas ou cartões desnecessários. Consulte design-system/MASTER.md e as referências públicas registradas na revisão 32. Não inventar outra versão da raposa; a marca gráfica final continua pendente.

## Arquivos centrais

- src/repositories/firebase-marketplace-repository.js e database.rules.json: persistência, transições e projeções.
- src/pages/operations/: demandas, propostas, pedidos, filtros, reutilização, CSV e impressão.
- src/domain/next-actions.js, deadline.js, calendar-date.js, quantity.js e inspection.js: prioridades, datas, unidades e qualidade.
- src/pages/public/: landing e fluxo público.
- src/core/unsaved-changes.js: proteção de formulários ao sair.
- src/layouts/app-shell/ e src/theme/: navegação, aparência e acessibilidade.
- scripts/export-project.ps1 e verify-transfer.mjs: cópia portátil e integridade.

## Transferência e Git

O exportador preserva toda a pasta docs e os arquivos atuais, inclusive alterações não commitadas. Omite dependências, caches, logs, credenciais privadas e .git; o histórico é opcional, em bundle separado, com HEAD e todas as branches locais. A pasta gerada permanece ao lado do ZIP. Não apagar a origem antes de verificar o destino.

Leia o documento 25 para restaurar o bundle sobre o snapshot sem substituir os arquivos. Leia o documento 33 para a lista de remoções manuais possíveis; nenhum arquivo antigo foi excluído nesta entrega. O inventário classifica separadamente backups e anotações ambíguos.

Repositório de continuidade: https://github.com/kauanoIiveira/sivi. Branch do trabalho atual: codex/proteger-condicoes-aceitas. Há alterações locais ainda sem commit. A referência publicada continua main; confirmar git status, git branch e git remote -v antes de enviar qualquer coisa.

Preservar a autoria de Kauan Oliveira e o histórico limpo já adotado. Novos commits devem ter mensagens naturais em português. Não importar o bundle de histórico antigo para o repositório atual sem uma decisão específica do responsável. Os dados e usuários continuam no Firebase; não recriar administração nem publicar regras só por mudar de máquina.

## Próxima sessão

1. Verificar o manifesto da cópia, Git e dependências; iniciar a aplicação.
2. Ler a revisão 32 e seus limites, depois incorporar a análise manual do responsável.
3. Priorizar o restante do bloco 1B antes de ampliar negociação e rastreabilidade.
4. Preservar autorização por empresa, condições aceitas, acessibilidade e toda a documentação.
