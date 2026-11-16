# Fluxo, empresas e integridade — 01/10/2026

Entrega autorizada após a análise funcional, com prioridade em **Empresas e atuação**. Pasta efetiva: `C:\Users\Kauan\Desktop\sivi`. Esta cópia não contém `.git`; nenhum histórico foi criado ou importado. O backup anterior à execução é `C:\Users\Kauan\Desktop\sivi-backup-fluxo-20260930-212351.zip`.

## Como entrar e trocar de empresa

A conta identifica a pessoa; o vínculo autoriza a empresa; a atuação determina o trabalho de comprador ou fornecedor. Administração é um acesso à plataforma, separado das empresas comerciais. Uma mesma empresa pode comprar e fornecer com a mesma conta.

- A consulta de vínculos termina antes de decidir se é necessário cadastrar uma empresa. Carregamento e erro têm mensagens e nova tentativa; erro de leitura não significa conta sem empresa.
- Uma única atuação comercial autorizada entra diretamente após o login. Mais opções pedem seleção. **Trocar empresa** abre e mantém o seletor, inclusive ao recarregar, mostrando a atuação em uso.
- A seleção é guardada por conta, empresa e atuação. Sair ou mudar de identidade limpa imediatamente o contexto anterior; uma consulta atrasada de outra conta não pode recuperá-lo.
- Links protegidos retomam o registro ou a criação de demanda depois do acesso e da resolução dos vínculos. Somente rotas e parâmetros conhecidos são retomados; a página continua sujeita às permissões da empresa selecionada.
- A intenção comprador/fornecedor da entrada pública sugere a atuação no cadastro empresarial. A pessoa ainda revisa e confirma o cadastro.
- Cadastro confirmado seguido de erro na consulta aparece como **enviado para análise**, com aviso e atualização da situação. Isso evita solicitar novamente uma empresa que já foi criada.
- E-mail não confirmado permanece fora do sistema; as mensagens de confirmação no acesso são preservadas.

O administrador pode cadastrar uma empresa para um responsável verificado, com CNPJ, cidade, UF e contato. Aprovar, pedir correção, recusar, bloquear e reativar conservam comportamentos distintos. Não há associação automática de usuários por CNPJ ou domínio, nem gestão nova de equipes.

## Continuidade entre páginas

O painel encaminha à demanda, proposta ou pedido correspondente à ação. O mapa industrial permanece e identifica o assunto exibido; falhas em recomendações ou no mapa têm tratamento localizado. A própria empresa não aparece como fornecedor recomendado para si.

Oportunidades levam ao envio da primeira proposta. **Minhas propostas** reúne negociações já iniciadas e suas versões. O convite continua vinculado à demanda original mesmo que o usuário consulte outra enquanto o envio termina. A avaliação começa por um link do pedido entregue e utiliza a página única de Avaliações, com os quatro critérios existentes. Preenchimentos pendentes sobrevivem à troca de pedido e aos filtros do histórico; uma gravação confirmada não volta a ser enviada porque a releitura falhou.

Rascunhos exigem título, mas podem conservar especificações ainda incompletas. A publicação exige os dados completos e quantidades positivas. Revisões protegem a edição e a publicação contra outra sessão. A compatibilidade tolera diferenças textuais de acento, caixa e espaços, mantendo materiais e requisitos técnicos distintos. Demandas abertas têm **Atualizar compatibilidade** para consultar os perfis atuais; pedidos já contratados conservam suas condições.

## Proteções comerciais

O modelo continua com um vencedor para todos os itens, preço global, inspeção integral, uma entrega principal e avaliação após o recebimento.

- Novas versões são acrescentadas ao histórico; a revisão avança uma vez. O aceite usa a versão atual e ainda válida pelo dia comercial de São Paulo.
- O pedido tem origem determinística e conserva todos os itens, certificações e condições da versão aceita. As duas projeções são gravadas em atualização atômica.
- Inspeções são acrescentadas por identificação. A liberação exige prova de aprovação integral de cada item; expedição e recebimento seguem a sequência operacional.
- A primeira avaliação é exclusiva e imutável. Comandos concorrentes de versão e avaliação têm um vencedor no servidor.
- Empresa bloqueada não opera mesmo que exista um vínculo antigo ainda marcado como ativo. Regras também verificam e-mail, vínculo, atuação, origem e transição.
- Escritas de resultado desconhecido guardam a identificação pendente na mesma aba, permitindo reconciliar após recarga. A indisponibilidade do armazenamento usa memória e reduz essa recuperação à sessão atual. Isso não estabelece unicidade global de empresas por CNPJ nem deduplica cadastros independentes em outras abas.

`database.rules.json` é gerado por `scripts/refresh-commercial-rules.mjs`, a partir de `scripts/database-rules.base.json`. Alterações comerciais devem ocorrer no gerador; execute `node scripts/refresh-commercial-rules.mjs` e valide nos emuladores. O teste unitário confere que o arquivo gerado reproduz exatamente a fonte.

## Atualização remota ainda necessária

**Esta entrega não alterou dados nem regras no Firebase remoto.** A aplicação e as regras foram verificadas somente nos emuladores locais. Executar a interface contra o projeto remoto não comprova que essas proteções já estão ativas.

Antes de publicar as regras, coordenar a versão dos clientes e revisar uma exportação atual do banco. Demandas publicadas abertas e propostas antigas precisam dos metadados de estrutura, revisão atual e validade. O preparador é local e não conecta ao Firebase:

```powershell
node scripts/prepare-flow-migration.mjs --input exportacao.json --output migracao-revisar.json
```

O relatório contém `updates` e `blocked`. Apenas metadados são propostos; preços, prazos, materiais, certificações e pedidos aceitos permanecem intactos. Índices esparsos, projeções divergentes e revisões ambíguas exigem revisão e produzem saída de erro. **Não aplicar parcialmente um relatório com bloqueios.** O arquivo de saída não sobrescreve outro arquivo existente.

A aplicação do patch deve ser feita separadamente, com backup e acesso administrativo autorizado, em uma janela que impeça escritas de clientes desatualizados. Depois, verificar projeções, publicar o cliente e as regras de forma coordenada e testar com contas reais dos dois papéis. Uma atualização de interface isolada não conclui essa migração. O teste local de migração demonstra reavaliação e aceite de uma proposta antiga preservando duas certificações e todos os termos comerciais.

Pedidos legados não são reescritos pelo preparador. As regras mantêm sua operação, exigindo inspeção integral para liberar, inclusive quando a referência antiga contém apenas a quantidade total. Clientes antigos que não enviam os novos metadados podem ter comandos recusados após a atualização das regras.

## Validação e preservação

**195 testes unitários e 170 testes de navegador/emuladores passaram, sem falhas ou testes ignorados.** Os testes cobrem entrada pública, confirmação de e-mail, contextos de empresa, atrasos e falhas de consulta, troca de identidade, aprovação, perfil industrial, demandas, propostas, concorrência, inspeção, entrega, avaliação e migração local. A migração também foi testada como comando offline, preservando a entrada e recusando sobrescrever um relatório existente.

Foram geradas **87 capturas e 174 verificações de largura em 23 telas/estados**, sem transbordamento horizontal da página. Houve inspeção visual de empresas, administração, propostas, avaliações e do mapa no painel. O comparador foi reproduzido com falha no celular antes da correção e passou depois, conservando a rolagem por teclado e todas as colunas. Consulte [o registro de evidências](reviews/2026-10-01-fluxo-final.json) para comandos, hashes e caminhos.

A composição visual e o mapa foram preservados. Os ajustes de CSS estendem o estilo existente dos campos administrativos ao seletor de UF e permitem que o contêiner do comparador encolha no celular: a tabela conserva suas colunas e a rolagem fica dentro dela. A marca e os favicons são conferidos contra o backup. Evidências visuais e de largura ficam em `.checks/fluxo-final`.

Fora desta entrega: gestão de equipes, anexos, propostas por item, atendimento parcial, produção/estoque, lotes, QR novo, notificações persistidas e rastreio de transporte. Os documentos anteriores conservam o histórico; este documento substitui suas pendências sobre contexto e integridade já atendidas nesta execução.
