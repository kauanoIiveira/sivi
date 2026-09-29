const purchaseSteps = [
  { label: 'Demanda', context: '01 / O ponto de partida', title: 'Especifique o que sua empresa precisa.', description: 'Reúna os itens em uma demanda. Material, processo, quantidade, unidade e prazo deixam a necessidade clara para quem vai fornecer.', buyer: 'Prepare os requisitos, revise o rascunho e publique a demanda.', supplier: 'Consulte as especificações antes de preparar uma proposta.', record: 'Objetivo da compra e requisitos de cada item.' },
  { label: 'Compatibilidade', context: '02 / Requisitos e capacidade', title: 'Encontre capacidade para atender aos requisitos.', description: 'A compatibilidade considera o perfil industrial e os critérios da demanda. Os detalhes mostram o que atende e o que precisa de confirmação.', buyer: 'Consulte fornecedores e confira os critérios de compatibilidade.', supplier: 'Mantenha materiais, processos, regiões e capacidade atualizados.', record: 'Critérios atendidos, pendências e informações declaradas.' },
  { label: 'Propostas', context: '03 / A decisão comercial', title: 'Compare condições antes de decidir.', description: 'Compare preços, prazo, frete e pagamento. Uma revisão gera outra versão, para que a negociação mantenha seu histórico.', buyer: 'Compare as propostas recebidas e escolha as condições da compra.', supplier: 'Envie sua proposta e revise as condições quando necessário.', record: 'As versões anteriores continuam no histórico da proposta.' },
  { label: 'Pedido', context: '04 / O acordo registrado', title: 'Transforme o acordo em pedido.', description: 'Ao aceitar uma proposta, as especificações e condições acordadas ficam preservadas no pedido. Comprador e fornecedor acompanham a mesma referência.', buyer: 'Aceite a proposta escolhida e consulte o pedido gerado.', supplier: 'Acompanhe o pedido com os itens e condições aceitos.', record: 'Itens, preços, prazo, frete e pagamento acordados.' },
  { label: 'Inspeção', context: '05 / A conferência dos itens', title: 'Registre a qualidade de cada item.', description: 'A inspeção registra quantidades aprovadas por item, plano e evidências. Pendências de qualidade precisam ser resolvidas antes da liberação.', buyer: 'Acompanhe os registros de qualidade do pedido.', supplier: 'Registre a inspeção e as quantidades aprovadas de cada item.', record: 'Resultado, plano de inspeção e evidências informadas.' },
  { label: 'Expedição', context: '06 / A saída do pedido', title: 'Acompanhe a saída do pedido.', description: 'Depois da liberação da qualidade, o fornecedor registra a saída. O pedido passa a aguardar a confirmação do recebimento pelo comprador.', buyer: 'Acompanhe a situação do pedido até receber os itens.', supplier: 'Registre a expedição quando o pedido sair para entrega.', record: 'Data da expedição e atualização da situação do pedido.' },
  { label: 'Recebimento', context: '07 / O fechamento da compra', title: 'Confirme a entrega e avalie o fornecedor.', description: 'A compra termina com o registro de recebimento e a avaliação do fornecimento. O histórico da negociação continua disponível para consulta.', buyer: 'Confirme o recebimento e registre nota e comentário.', supplier: 'Consulte a confirmação de entrega e a avaliação recebida.', record: 'Recebimento, avaliação e histórico do pedido.' },
];

const arrow = '<span class="public-button-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h15M13 5l7 7-7 7"/></svg></span>';

export function mountPublicPage({ container }) {
  container.innerHTML = `<div class="public-page">
    <a class="public-skip" href="#/?secao=topo">Ir para o conteúdo</a>
    <header class="public-header"><div class="public-nav public-shell">
      <a class="public-brand" href="#/" aria-label="SIVI, início">SIVI<span>VENDAS INDUSTRIAIS</span></a>
      <nav aria-label="Navegação pública"><a class="public-nav__section" href="#/?secao=funcionamento">Como funciona</a><a class="public-nav__section" href="#/?secao=compras">Para sua empresa</a><a href="#/acesso?modo=login">Entrar</a><button type="button" data-theme-toggle aria-label="Alternar tema"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4v16"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none"/></svg></button></nav>
    </div></header>
    <div class="public-content">
      <section class="public-hero public-shell" aria-labelledby="public-title">
        <div class="public-hero__copy">
          <p class="public-eyebrow"><span class="public-brand-mark" aria-hidden="true"></span>Compras e fornecimento entre empresas</p>
          <h1 id="public-title" tabindex="-1">Sua próxima compra industrial começa aqui.</h1>
          <p class="public-hero__intro">Da especificação ao recebimento. Conecte a necessidade da sua empresa a fornecedores, compare propostas e acompanhe cada etapa do pedido.</p>
          <div class="public-hero__actions"><a class="public-primary" href="#/acesso?modo=register">Cadastrar empresa ${arrow}</a><a class="public-text-link" href="#/?secao=funcionamento">Conhecer o fluxo ${arrow}</a></div>
          <p class="public-note">Para comprar, fornecer ou atuar dos dois lados.</p>
        </div>
        <figure class="public-hero__image"><img src="./src/assets/auth-industrial-placeholder.webp" alt="Inspeção dimensional de uma peça metálica" width="1536" height="1024" fetchpriority="high"><figcaption><span class="public-image-index">SIVI / CONEXÃO INDUSTRIAL</span><span>Requisitos claros.<br>Decisões registradas.</span></figcaption></figure>
      </section>
      <div class="public-principles public-shell" aria-label="O que acompanha a compra"><p><span aria-hidden="true">01</span> Especificações por item</p><p><span aria-hidden="true">02</span> Histórico de propostas</p><p><span aria-hidden="true">03</span> Condições preservadas no pedido</p></div>
      <section class="public-workflow public-shell" aria-labelledby="funcionamento">
        <div class="public-section-heading"><div><p class="public-eyebrow">Como funciona</p><h2 id="funcionamento" tabindex="-1">Uma compra.<br>Cada etapa registrada.</h2></div><p>Veja o que comprador e fornecedor fazem ao longo da negociação. Selecione uma etapa para conhecer o fluxo.</p></div>
        <div class="public-workflow__body">
          <ol class="public-workflow__steps" aria-label="Etapas da compra">${purchaseSteps.map((step, index) => `<li><button type="button" data-public-step="${index}" aria-pressed="${index === 0}" aria-controls="public-step-${index}"><span class="public-step-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span>${step.label}</span><span class="public-step-arrow" aria-hidden="true">↗</span></button></li>`).join('')}</ol>
          <div class="public-workflow__content">${purchaseSteps.map((step, index) => `<section class="public-workflow__detail" id="public-step-${index}" aria-labelledby="public-step-title-${index}" ${index === 0 ? '' : 'hidden'}>
            <p class="public-eyebrow">${step.context}</p><h3 id="public-step-title-${index}">${step.title}</h3><p class="public-workflow__description">${step.description}</p>
            <dl class="public-workflow__responsibilities"><div><dt>Comprador</dt><dd>${step.buyer}</dd></div><div><dt>Fornecedor</dt><dd>${step.supplier}</dd></div></dl>
            <div class="public-workflow__record"><span>Fica registrado</span><p>${step.record}</p></div>
          </section>`).join('')}</div>
        </div><p class="sr-only" role="status" data-public-step-status></p>
      </section>
      <section class="public-roles-band" aria-label="Atuações no SIVI"><div class="public-roles public-shell">
        <article><div><p class="public-eyebrow">Para compradores</p><h2 id="compras" tabindex="-1">Sua necessidade.<br>Uma compra bem definida.</h2></div><div><p>Descreva o que precisa, reúna as propostas e decida com as condições à vista. Acompanhe o pedido até confirmar o recebimento.</p><ul><li>Demandas com vários itens e requisitos técnicos.</li><li>Comparação de preço, prazo, frete e pagamento.</li><li>Histórico da negociação e avaliação do fornecimento.</li></ul><a class="public-text-link" href="#/acesso?modo=register">Cadastrar minha empresa ${arrow}</a></div></article>
        <article><div><p class="public-eyebrow">Para fornecedores</p><h2 id="fornecimento" tabindex="-1">Sua capacidade.<br>Novas demandas para atender.</h2></div><div><p>Apresente o que sua empresa fornece. Consulte os requisitos das demandas, prepare suas condições e acompanhe os pedidos recebidos.</p><ul><li>Perfil com materiais, processos e regiões atendidas.</li><li>Propostas com revisões e histórico de versões.</li><li>Registro de inspeção e expedição por pedido.</li></ul><a class="public-text-link" href="#/acesso?modo=register">Começar a fornecer ${arrow}</a></div></article>
      </div></section>
      <section class="public-entry public-shell" aria-labelledby="cadastro">
        <div><p class="public-eyebrow">Sua empresa no SIVI</p><h2 id="cadastro" tabindex="-1">Comece com um cadastro.</h2><p>Sua empresa pode comprar, fornecer ou exercer as duas atuações.</p><a class="public-primary" href="#/acesso?modo=register">Solicitar cadastro ${arrow}</a></div>
        <ol class="public-entry__steps"><li><span aria-hidden="true">01</span><div><h3>Crie sua conta</h3><p>Cadastre seu acesso e confirme o endereço de e-mail.</p></div></li><li><span aria-hidden="true">02</span><div><h3>Apresente sua empresa</h3><p>Informe CNPJ, localização, contato e a atuação desejada.</p></div></li><li><span aria-hidden="true">03</span><div><h3>Acompanhe a análise</h3><p>Consulte o retorno pela sua conta. Se houver uma correção, ajuste os dados e reenvie. Após a aprovação, comece a negociar.</p></div></li></ol>
      </section>
      <section class="public-faq public-shell" aria-labelledby="duvidas"><div><p class="public-eyebrow">Antes de começar</p><h2 id="duvidas" tabindex="-1">Dúvidas sobre o cadastro</h2><p>O essencial para dar o próximo passo.</p></div><div>
        <details><summary>Quem pode se cadastrar?</summary><p>O responsável por uma empresa compradora ou fornecedora. Você informa o CNPJ, a localização, um contato e a atuação da empresa para a análise cadastral.</p></details>
        <details><summary>Minha empresa pode comprar e fornecer?</summary><p>Sim. Selecione as duas atuações no cadastro. Depois da aprovação, escolha compras ou fornecimento ao entrar na empresa.</p></details>
        <details><summary>Existe cobrança para acessar?</summary><p>O acesso está disponível sem cobrança. Não é necessário informar cartão ou realizar pagamento para solicitar o cadastro.</p></details>
        <details><summary>Onde acompanho a aprovação?</summary><p>Entre na sua conta e abra Empresas e atuação. Use Atualizar situação para consultar a decisão. Em Consultar cadastro, você encontra os dados enviados e o retorno da administração.</p></details>
        <details><summary>O SIVI fabrica ou transporta os produtos?</summary><p>O SIVI organiza a negociação e os registros do pedido entre as empresas. O fornecimento, o transporte e o pagamento são combinados entre comprador e fornecedor.</p></details>
      </div></section>
    </div>
    <footer class="public-footer">
      <div class="public-shell"><div class="public-footer__main"><div class="public-footer__identity"><a class="public-brand" href="#/" aria-label="SIVI, início">SIVI<span>Sistema Integrado de Vendas Industriais</span></a><p>Da necessidade industrial<br>ao recebimento registrado.</p></div>
        <nav aria-label="Plataforma"><h2>Plataforma</h2><a href="#/?secao=compras">Para compradores</a><a href="#/?secao=fornecimento">Para fornecedores</a><a href="#/?secao=funcionamento">Como funciona</a></nav>
        <nav aria-label="Conta e acesso"><h2>Conta e acesso</h2><a href="#/acesso?modo=login">Entrar na minha conta</a><a href="#/acesso?modo=register">Cadastrar empresa</a><a href="#/?secao=duvidas">Dúvidas sobre o cadastro</a><button class="preferences-link" type="button" data-open-preferences>Aparência e acessibilidade</button></nav>
      </div><div class="public-footer__bottom"><small>© ${new Date().getFullYear()} SIVI. Todos os direitos reservados.</small><span>Brasil · Português</span><a href="#/?secao=topo">Voltar ao início <span aria-hidden="true">↑</span></a></div></div>
    </footer>
  </div>`;

  const workflow = container.querySelector('.public-workflow');
  const stepButtons = [...workflow.querySelectorAll('[data-public-step]')];
  const stepPanels = [...workflow.querySelectorAll('.public-workflow__detail')];
  const onStepClick = (event) => {
    const button = event.target.closest('[data-public-step]');
    if (!button || !workflow.contains(button) || button.getAttribute('aria-pressed') === 'true') return;
    const selected = Number(button.dataset.publicStep);
    stepButtons.forEach((control, index) => control.setAttribute('aria-pressed', String(index === selected)));
    stepPanels.forEach((panel, index) => { panel.hidden = index !== selected; });
    workflow.querySelector('[data-public-step-status]').textContent = `Etapa ${selected + 1} de ${purchaseSteps.length}: ${purchaseSteps[selected].title}`;
  };
  workflow.addEventListener('click', onStepClick);

  const revealTargets = [...container.querySelectorAll('.public-hero, .public-principles, .public-section-heading, .public-workflow__body, .public-roles article, .public-entry > div, .public-entry__steps, .public-faq > div')];
  let revealObserver;
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && document.documentElement.dataset.motion !== 'reduce') {
    revealTargets.forEach((target) => { target.dataset.reveal = 'pending'; });
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.dataset.reveal = 'visible';
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  const section = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('secao');
  let frame;
  if (['compras', 'fornecimento', 'funcionamento', 'cadastro', 'duvidas', 'topo'].includes(section)) {
    frame = requestAnimationFrame(() => {
      const target = container.querySelector(section === 'topo' ? '#public-title' : `#${section}`);
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ block: 'start' });
    });
  }
  return () => {
    cancelAnimationFrame(frame);
    revealObserver?.disconnect();
    workflow.removeEventListener('click', onStepClick);
    container.replaceChildren();
  };
}
