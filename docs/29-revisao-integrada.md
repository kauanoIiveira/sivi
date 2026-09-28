# Revisão integrada para uso manual — 26/09/2026

Registro histórico. A [revisão final 30](30-revisao-final-do-produto.md), de 27/09, atualiza unidades nos indicadores e no match, inspeção por item, proteção de saída dos formulários e refinamento visual. Consulte-a para o estado e a validação mais recentes.

## Intenção e escolha

Melhorar o sistema existente para uma revisão manual de comprador, fornecedor e administrador. O pedido autoriza aplicar as melhorias antes dessa revisão. Preservar a identidade industrial, Firebase, HTML/CSS/JavaScript, dados por empresa, temas e documentos existentes.

Foram consideradas três direções: redesenhar toda a interface; expandir o fluxo com preços por item, lotes e QR; ou consolidar a experiência e a confiabilidade já disponíveis. A terceira foi escolhida: resolve problemas reproduzíveis sem impor decisões comerciais novas. As demais dependem da revisão de produto e das etapas do documento 28.

## Escopo de implementação

- Recuperar o preenchimento de uma nova demanda na mesma aba, com escolha de retomar ou descartar; separar esse conteúdo do rascunho efetivamente salvo para a empresa.
- Melhorar busca, contagem de resultados, datas, apresentação das unidades e orientação depois das ações.
- Impedir que atualizar a lista ou concluir outra ação apague um formulário alterado.
- Distinguir gravação confirmada de erro ao atualizar a tela, preservar o snapshot confirmado e mostrar aviso de sincronização.
- Recusar datas impossíveis no domínio. Reconciliar oportunidades com pedidos do fornecedor quando a fonte autorizada permite.
- Corrigir o link para pular navegação e o fechamento/foco do menu Conta.
- Verificar desktop/celular, ambos os temas, texto ampliado, erros e a jornada persistida nos emuladores.
- Remover logs e saídas reproduzíveis obsoletas; preservar docs, testes, configurações, dependências e referências necessárias.

## Limites de arquitetura

A aceitação autoritativa, publicação concorrente, fechamento das oportunidades de todos os concorrentes e validação de qualidade por item continuam vinculados ao bloco 1B e posteriores. As regras atuais não permitem ao fornecedor ler `publishedDemands`; a interface não deve contornar essa autorização. Esta rodada não publica regras nem dados no Firebase remoto.

## Critérios para revisão

1. Digitar uma nova demanda, recarregar e retomar sem perder os itens.
2. Distinguir preenchimento local, rascunho salvo e publicação.
3. Buscar uma demanda por referência, título ou material e limpar os filtros pelo teclado.
4. Conferir demandas com unidades diferentes sem um total enganoso.
5. Salvar com falha posterior de leitura e não receber instrução para repetir uma gravação confirmada.
6. Usar o menu Conta e pular navegação sem perder a rota ou o foco.

## Referências de acessibilidade

[Mensagens de estado](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html), [ordem de foco](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html) e [refluxo do conteúdo](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), W3C. São orientação para a implementação; a verificação automatizada não substitui avaliação com leitores de tela e usuários reais.

## Resultado

Implementado localmente, preservando o trabalho que já estava sem commit. Nenhuma regra foi publicada e nenhum registro comercial remoto foi alterado.

| Área | Comportamento entregue |
|---|---|
| Nova demanda | Preenchimento guardado em `sessionStorage` por conta, empresa e atuação, com retomar/descartar; limpeza após salvamento confirmado. Armazenamento bloqueado tem mensagem própria. |
| Formulários | Salvamento bloqueia os controles durante a operação. Se dois formulários estiverem alterados, salvar um preserva o outro; o formulário confirmado fica marcado como salvo, sem repetir a ação. |
| Atualização | Botão Atualizar registros, feedback com foco, preservação da tela em erro e proteção contra apagar alterações abertas. |
| Busca | Referência, título, destino, descrição, material, categoria e processo; ignora acentos e caixa; conta resultados; limpar devolve foco à busca. |
| Leitura | Quantidades agrupadas por unidade nos resumos da demanda, pedido e confirmação de aceite; datas legíveis; comprador identificado no pedido do fornecedor; mensagens distinguem sucesso, aviso e erro. |
| Persistência | Nove comandos preservam o resultado confirmado e o snapshot local se a leitura seguinte falhar. O aviso solicita atualizar os registros. Falhas de escrita continuam erros. |
| Validação | Datas reais de calendário, inclusive bissextos; proposta de R$ 0,01 aceita pela interface; quantidade aprovada limitada ao pedido; limites de texto da demanda alinhados ao domínio. |
| Oportunidades | Um pedido do fornecedor fecha a oportunidade correspondente na sua projeção de leitura. Não lê dados sem autorização. |
| Teclado | Pular para conteúdo conserva a rota. Conta fecha por Escape, clique fora e saída do foco; Escape retorna ao acionador. Menu lateral comporta nomes longos a 125% e 200%. |

### Verificação

- `npm test`: **111 unitários e 98 testes de navegador/emuladores aprovados**, sem falhas ou testes ignorados.
- `npx playwright test tests/e2e/workflow-usability.spec.js tests/e2e/demand-draft.spec.js`: 10 testes focados aprovados. As regressões principais foram reproduzidas antes das correções.
- Jornada persistida: cadastro/aprovação, demanda, edição, publicação, proposta, aceite, inspeção parcial, reinspeção, expedição, recebimento e avaliação após recarregar.
- Capturas do aplicativo autenticado com contas sintéticas nos temas claro/escuro e 360, 390, 768 e 1440px. Fluxo de recuperação inspecionado também com texto 125%, sem transbordamento nessas oito combinações e sem erro JavaScript.
- Inspeção visual de demandas, pedidos, edição ampliada e recuperação. Capturas atuais em `exports/revisao-integrada-2026-09-26`; as três capturas de recuperação/nova demanda usam componentes reais com dados sintéticos da fixture.
- `git diff --check` aprovado. A tentativa de revisão independente final não concluiu por limite de uso; a integração foi revisada nesta sessão e validada pela suíte. As revisões dos dois domínios delegados foram concluídas.

### Limites que continuam relevantes

- A confirmação do servidor seguida de falha de leitura foi resolvida; resultado de escrita desconhecido após queda de conexão ainda exige idempotência autoritativa.
- Publicação/aceite concorrentes, versões concorrentes de proposta, revisão imutável de requisitos e fechamento de oportunidades para fornecedores concorrentes permanecem no bloco 1B.
- Unidades diferentes agora aparecem corretamente nos **resumos operacionais**, mas o campo legado `quantity`, o match por capacidade, indicadores agregados e a inspeção ainda usam o modelo anterior. Qualidade e indicadores por item/unidade precisam evoluir juntos; não interpretar a inspeção agregada como prova por item.
- Recuperação é para **nova demanda**, na mesma aba e navegador; não sincroniza dispositivos. Edição de rascunhos, propostas e inspeções não são recuperadas após sair da página. A proteção durante salvamentos, filtros e atualização vale enquanto a tela permanece aberta.
- Não foi feita certificação WCAG, avaliação com leitor de tela, carga alta nem validação do ambiente remoto. A matriz de teclado, temas e refluxo é evidência local.

### Revisão manual sugerida

1. Entre como comprador e prepare uma nova demanda com dois itens. Recarregue, retome e confira os valores antes de salvar.
2. Busque por título, referência e material sem acento. Confira o número de resultados e o retorno pelo botão Limpar filtros.
3. Edite um rascunho; tente atualizar ou filtrar a lista com mudanças abertas. Salve ou cancele e confira o foco.
4. Como fornecedor, preencha duas propostas na mesma tela e salve uma. O outro preenchimento deve permanecer intacto.
5. Compare e aceite uma proposta; confira quantidade por unidade, condições preservadas e próxima ação do pedido.
6. Use somente Tab, Shift+Tab e Escape no menu Conta, preferências e navegação; repita no celular e com texto ampliado.

### Limpeza

A exclusão foi **bloqueada pela revisão automática de aprovação**, com a mensagem `blocked by policy` e sem justificativa adicional. Nenhuma cópia, remoção ou substituição de pacote ocorreu no comando rejeitado. A limpeza continua pendente; não confundir a aprovação dos testes com a conclusão dessa etapa.

O [registro da revisão](reviews/2026-09-26-integrated-review.json) lista as saídas candidatas à limpeza: logs da raiz, resultados transitórios, a área de execução já concluída em `.superpowers`, capturas antigas substituídas e pacotes de transferência anteriores. Documentos, código, testes, dependências, configurações, capturas atuais e backup de histórico devem ser preservados. Antes de remover `.superpowers`, preservar seu `progress.md` em `docs/reviews`. Os pacotes antigos não representam o estado atual; gerar e validar um pacote atual antes de substituí-los.
