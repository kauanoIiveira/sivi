# VLibras no sistema

A integração usa o [Widget oficial](https://vlibras.gov.br/doc/widget/installation/webpageintegration.html), carregado de `https://vlibras.gov.br/app/vlibras-plugin.js`. O carregamento só começa quando a preferência está ativada e a superfície atual é `app`. Home e acesso mantêm o widget oculto, mesmo com a preferência salva como ativada.

`createVLibrasController()` em `src/theme/vlibras-controller.js` oferece `setEnabled`, `setSurface`, `getState` e `dispose`. O callback `onStateChange` recebe `off`, `loading`, `ready` ou `error`; repetir a mesma escolha não repete notificações nem o download do SDK. Falhas ficam restritas ao recurso, com nova tentativa disponível nas preferências.

Na versão 7, o script monta o botão automaticamente. O construtor suportado `VLibras.Widget()` antecipa essa montagem e o próprio SDK impede sua duplicação. O tradutor completo é carregado pelo SDK quando o usuário abre o botão. Uma falha nesse segundo download também permite nova tentativa, usando `VLibrasWidget.open()`.

Ao desativar, os elementos do widget ficam ocultos e `inert`. O adaptador também define `#vlibras-app-root[data-active="false"]`. No SDK consultado em 30/09/2026, esse atributo fecha o tradutor, pausa o player e remove a captura de cliques para tradução. Não há método público de destruição na API documentada; portanto, o SDK já carregado permanece em cache. O fechamento pelo atributo é um ponto de compatibilidade a verificar quando o fornecedor atualizar o widget. Não se usa iframe, pois isso impediria o tradutor de ler o conteúdo da página.

Um observador acompanha os elementos carregados com atraso. Desativar, sair do sistema ou descartar o controlador durante um download impede a reaparição dos controles. A preferência interna de abertura do SDK é fechada antes do primeiro carregamento para que um uso anterior do serviço não reabra o tradutor automaticamente.

Validação: oito casos determinísticos em `tests/e2e/vlibras.spec.js` cobrem carregamento sob demanda, navegação, fechamento, estados tardios, falhas dos dois downloads, nova tentativa, descarte e chamadas repetidas. Um smoke com o SDK oficial real carregou botão e raiz do tradutor sem erro de página ou de requisição; desativar confirmou raiz fechada, oculta e inerte, com um único botão no DOM.
