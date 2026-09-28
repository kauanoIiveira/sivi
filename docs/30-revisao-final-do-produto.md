# Revisão final do produto — 27/09/2026

Pedido: revisar e aplicar melhorias diretamente, com foco no TCC, lógica dos fluxos, clareza para o usuário, acessibilidade e remoção de excessos visuais.

## Direção

Manter a identidade industrial existente: Archivo, superfícies claras/grafite e laranja nas ações. Reduzir rótulos decorativos, repetição de títulos, setas sem função e cartões dentro de cartões. Dar prioridade ao registro e à ação que o usuário precisa executar.

## Melhorias aplicadas

| Área | Resultado para quem usa |
|---|---|
| Quantidades | `10 un` e `20 m` aparecem separados. Grafias equivalentes de unidades são agrupadas; símbolos que diferem por maiúsculas, como `MW` e `mW`, permanecem distintos. |
| Capacidade e compatibilidade | A capacidade declarada em unidades não é comparada com metros ou misturas de unidades. Critérios exigidos pela demanda e ausentes do perfil pedem conferência, sem afirmar compatibilidade completa. |
| Inspeção | Pedidos com vários itens exigem a quantidade aprovada de cada item. Um item excedente não compensa a reprovação de outro. A liberação exige aprovação integral de todos. Pedidos e inspeções antigos continuam legíveis. |
| Propostas no painel | Cada proposta identifica sua demanda e abre a negociação correspondente. Diferencia vencida, aguardando decisão, aceita e não selecionada. A versão aceita usa as condições preservadas no pedido. |
| Painel do fornecedor | Conta pedidos em execução e aguardando reinspeção; lista pedidos reais com comprador, situação, quantidades e link. Elimina somas de quantidades incompatíveis apresentadas como um único indicador. |
| Acompanhamento | Prioriza pedido em execução e destaca qualidade bloqueada. Os registros vinculados abrem a demanda, a negociação ou o pedido. Não mostra jornada inventada para empresa vazia nem etapa QR ainda indisponível. |
| Datas | Validade considera o dia civil de São Paulo, inclusive depois da meia-noite UTC. Datas impossíveis e propostas já vencidas são recusadas; ações do painel seguem a mesma regra. |
| Pedido | Preserva destino, região e data solicitada no aceite. Prazo contratado, pagamento e garantia aparecem identificados separadamente. Referências mantêm as maiúsculas/minúsculas do registro real. |
| Perfil industrial | Carrega o perfil antes de permitir alterações. Falha de leitura oferece nova tentativa, sem sobrescrever dados com formulário vazio. Falha ao salvar mantém o preenchimento; envio repetido é bloqueado. Nome da empresa é renderizado como texto. |
| Navegação | Avisa ao sair com mudanças não salvas e impede troca de página/empresa ou saída da conta durante envio. Recarregamento também recebe a proteção nativa do navegador. Armazenamento de sessão bloqueado não impede a inicialização. |
| Cadastro de empresas | Preserva o formulário quando o usuário cancela a saída, impede atualização destrutiva e envios duplicados. O reenvio confirmado não vira falso erro de gravação quando a atualização posterior falha. |
| Administração | Conserva motivos digitados ao atualizar a lista. Falha de leitura mantém empresas visíveis. Cadastro e decisões evitam envios repetidos; motivo em edição e decisão pendente participam da proteção de navegação. |
| Interface | Página pública mais direta, menos slogans e chamadas repetidas. Retiradas setas decorativas, etiquetas redundantes, pulso contínuo e grade ornamental. Estados vazios, indisponibilidade e erros usam mensagens simples. |

Foram mantidas as preferências de tema, contraste, texto, espaçamento e redução de movimento, a navegação por teclado e a recuperação de novas demandas da revisão 29. A recuperação em armazenamento continua restrita à nova demanda na mesma aba; o aviso de saída não equivale a salvar automaticamente outros formulários.

## Validação

`npm test` final: **133 testes unitários e 112 testes de navegador/emuladores aprovados**, sem falhas ou testes ignorados. Os testes usam dados sintéticos e Firebase Authentication/Realtime Database locais. `git -c core.safecrlf=false diff --check` também aprovado.

Para repetir no ambiente atual:

```powershell
$env:SIVI_JAVA_HOME = 'C:/Program Files/Android/Android Studio/jbr'
npm test
```

Para capturas opcionais, definir `SIVI_CAPTURE_UI=exports/revisao-final-2026-09-27` e `SIVI_CAPTURE_APPEARANCE=exports/revisao-final-2026-09-27/aparencia` antes do comando. O caminho Java é específico desta máquina; o iniciador também procura instalações compatíveis. O [registro estruturado](reviews/2026-09-27-final-product-review.json) contém resultados, limites e hashes dos arquivos centrais.

- Casos novos reproduzem inspeção mista, capacidade incompatível, critério de perfil ausente, validade na mudança de dia, edição durante carregamento, falha e duplicação de envio, proteção de navegação e motivos administrativos.
- A jornada persistida cobre cadastro, aprovação, demanda, edição, publicação, proposta, aceite, inspeção parcial, reinspeção, expedição, recebimento e avaliação após recarregar.
- Capturas atuais em `exports/revisao-final-2026-09-27`: 90 imagens principais e 180 verificações de largura em 22 telas/estados, todas sem transbordamento horizontal. Claro/escuro e 360, 390, 768 e 1440px; página pública também em 1920 e 2560px. O relatório `ui-checks.json` registra refluxo por tela, tema e largura. Edição de demanda também verificada com texto ampliado e contraste maior.
- Inspeção visual de página pública, painéis, perfil industrial, pedidos, administração e edição de rascunho. As capturas autenticadas usam as páginas reais com contas de emulador; fixtures permanecem apenas nos testes.
- `scripts/review-marketplace.mjs` foi atualizado para continuar após a rejeição da data inválida, repetir somente operações que retornam erro e salvar uma nova caracterização em `exports`, preservando a evidência histórica. A alteração foi verificada por sintaxe; o script completo não foi reexecutado nesta rodada.

## Limites que permanecem

1. Publicação e aceite concorrentes, novas versões simultâneas, repetição após escrita de resultado desconhecido e fechamento das oportunidades de concorrentes ainda pertencem ao bloco 1B do roteiro 28.
2. A validação por item está nos comandos da aplicação. As regras do banco ainda não comprovam toda a qualidade por item, não tornam inspeções imutáveis nem garantem a coerência de clientes arbitrários nas duas projeções. Não houve implantação remota nesta rodada.
3. O campo legado `quantity` e o total legado `approved` ainda existem para compatibilidade. A interface e o match usam itens/unidades; esses totais não são prova de uma quantidade física homogênea. Inspeções antigas de vários itens não ganham detalhamento inventado.
4. Propostas têm preço agregado. Atendimento por estoque/produção, lotes, QR, anexos, auditoria, convites e gestão de membros continuam pendentes. Inspeção por item não implementa inspeção por requisito ou por lote.
5. A comparação de regiões usa os nomes declarados; `SP` não significa automaticamente todas as cidades de São Paulo. A interface explica esse limite.
6. A verificação de navegador foi local em Chromium. Não representa certificação WCAG, uso com leitor de tela, teste de carga ou validação das regras e dados do Firebase remoto.

## Limpeza e continuidade

Estilos e elementos sem uso nas telas alteradas foram retirados. Código, testes, documentos, evidências históricas e alterações anteriores foram preservados. Não foram criados commit, publicação ou implantação remota.

A exclusão de logs, saídas transitórias e pacotes antigos continua pendente: a revisão automática de aprovação recusou a tentativa anterior com `blocked by policy`, sem outra justificativa. Nenhum arquivo foi removido por aquela operação, e a recusa não foi contornada. O inventário está no [registro da revisão 29](reviews/2026-09-26-integrated-review.json).

Para retomar, consultar este documento e [CONTINUE_AQUI.md](../CONTINUE_AQUI.md). O roteiro 28 mantém a ordem arquitetural; os resultados desta revisão substituem as pendências antigas de quantidades, capacidade, datas, inspeção por item e proteção local de formulários.
