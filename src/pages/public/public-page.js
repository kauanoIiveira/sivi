export function mountPublicPage({ container }) {
  container.innerHTML = `<div class="public-page">
    <header class="public-header"><div class="public-nav public-shell">
      <a class="public-brand" href="#/" aria-label="SIVI, início">SIVI<span>VENDAS INDUSTRIAIS</span></a>
      <nav aria-label="Navegação pública"><a class="public-nav__section" href="#/?secao=funcionamento">Como funciona</a><a href="#/acesso?modo=login">Entrar</a><button type="button" data-theme-toggle><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4v16"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none"/></svg></button></nav>
    </div></header>
    <section class="public-hero public-shell" aria-labelledby="public-title">
      <p class="public-eyebrow">Compras e fornecimento entre empresas</p>
      <h1 id="public-title">Sua próxima compra industrial começa aqui.</h1>
      <div class="public-hero__detail"><div class="public-hero__copy"><p>Descreva o que sua empresa precisa, compare as propostas dos fornecedores e acompanhe o pedido até o recebimento.</p><a class="public-primary" href="#/acesso?modo=register">Cadastrar empresa <span aria-hidden="true">↗</span></a><p class="public-note">Já tem uma conta? <a href="#/acesso?modo=login">Acesse o SIVI</a></p></div>
      <figure class="public-hero__image"><img src="./src/assets/auth-industrial-placeholder.webp" alt="Inspeção dimensional de uma peça metálica"><figcaption>Especificações, propostas e pedidos no mesmo lugar.</figcaption></figure></div>
    </section>
    <section class="public-roles public-shell" aria-label="Atuações no SIVI">
      <article><div><p class="public-eyebrow">Para compradores</p><h2 id="compras" tabindex="-1">Encontre fornecedores para o que você precisa.</h2></div><div><p>Reúna os itens, materiais e prazos da compra em uma demanda. Compare as condições recebidas e mantenha os requisitos ligados ao pedido aprovado.</p><a href="#/acesso?modo=register">Cadastrar minha empresa</a></div></article>
      <article><div><p class="public-eyebrow">Para fornecedores</p><h2 id="fornecimento" tabindex="-1">Apresente sua capacidade a novos compradores.</h2></div><div><p>Informe os processos, materiais e regiões que sua empresa atende. Receba oportunidades compatíveis com esse perfil e envie suas propostas pelo sistema.</p><a href="#/acesso?modo=register">Começar a fornecer</a></div></article>
    </section>
    <section class="public-entry-band" aria-labelledby="funcionamento"><div class="public-entry public-shell"><div><p class="public-eyebrow">Acesso à plataforma</p><h2 id="funcionamento" tabindex="-1">Como entrar no SIVI</h2><p>Uma conta para sua empresa comprar, fornecer ou atuar dos dois lados.</p></div><div><p>Crie sua conta e confirme o e-mail. Depois, informe os dados da empresa e envie o cadastro para análise.</p><p>Acompanhe a solicitação pela sua conta. Se a administração pedir uma correção, você verá o motivo e poderá reenviar os dados. Com o cadastro aprovado, o acesso às negociações fica liberado.</p><a href="#/acesso?modo=register">Solicitar cadastro <span aria-hidden="true">↗</span></a></div></div></section>
    <section class="public-faq public-shell" aria-labelledby="duvidas"><div><p class="public-eyebrow">Dúvidas frequentes</p><h2 id="duvidas" tabindex="-1">Antes de cadastrar sua empresa</h2><p>O que você precisa saber sobre o acesso.</p></div><div>
      <details><summary>Quem pode se cadastrar?</summary><p>O responsável por uma empresa compradora ou fornecedora. Você informa o CNPJ, a localização, um contato e a atuação da empresa para a análise cadastral.</p></details>
      <details><summary>Minha empresa pode comprar e fornecer?</summary><p>Sim. Selecione as duas atuações no cadastro. Depois da aprovação, escolha compras ou fornecimento ao entrar na empresa.</p></details>
      <details><summary>Existe cobrança para acessar?</summary><p>O acesso está disponível sem cobrança. Não é necessário informar cartão ou realizar pagamento para solicitar o cadastro.</p></details>
      <details><summary>Onde acompanho a aprovação?</summary><p>Entre na sua conta e abra Empresas e atuação. Use Atualizar situação para consultar a decisão. Em Consultar cadastro, você encontra os dados enviados e o retorno da administração.</p></details>
    </div></section>
    <section class="public-closing public-shell" aria-labelledby="public-closing-title"><h2 id="public-closing-title">Traga sua empresa<br>para o SIVI.</h2><div><p>Cadastre sua empresa para comprar ou fornecer. Você acompanha a análise pela sua conta.</p><a class="public-primary" href="#/acesso?modo=register">Solicitar acesso <span aria-hidden="true">↗</span></a></div></section>
    <footer class="public-footer">
      <div class="public-shell"><div class="public-footer__main"><div class="public-footer__identity"><a class="public-brand" href="#/" aria-label="SIVI, início">SIVI<span>Sistema Integrado de Vendas Industriais</span></a><p>Um espaço de trabalho para empresas que compram e fornecem para a indústria.</p><a class="public-footer__login" href="#/acesso?modo=login">Acessar minha conta <span aria-hidden="true">↗</span></a></div>
        <nav aria-label="Plataforma"><h2>Plataforma</h2><a href="#/?secao=compras">Para compradores</a><a href="#/?secao=fornecimento">Para fornecedores</a><a href="#/?secao=funcionamento">Como funciona</a></nav>
        <nav aria-label="Conta e acesso"><h2>Conta e acesso</h2><a href="#/acesso?modo=login">Entrar na minha conta</a><a href="#/acesso?modo=register">Cadastrar empresa</a><a href="#/?secao=duvidas">Dúvidas sobre o cadastro</a></nav>
      </div>
      <div class="public-footer__bottom"><small>© ${new Date().getFullYear()} SIVI. Todos os direitos reservados.</small><span>Brasil · Português</span><a href="#/?secao=topo">Voltar ao início <span aria-hidden="true">↑</span></a></div></div>
    </footer>
  </div>`;
  const section = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('secao');
  let frame;
  if (['compras', 'fornecimento', 'funcionamento', 'duvidas', 'topo'].includes(section)) {
    frame = requestAnimationFrame(() => {
      const target = container.querySelector(section === 'topo' ? '#public-title' : `#${section}`);
      target?.setAttribute('tabindex', '-1');
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ block: 'start' });
    });
  }
  return () => { cancelAnimationFrame(frame); container.replaceChildren(); };
}
