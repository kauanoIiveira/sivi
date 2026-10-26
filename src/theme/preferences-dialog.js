import { getAppearancePreferences, setAppearancePreference, resetAppearancePreferences, getVLibrasState, retryVLibras } from './appearance-controller.js';

let dialog;
let returnFocus;
const definitions = [
  ['theme', 'Tema', 'Use a aparência do dispositivo ou escolha um tema.', [['system', 'Seguir o sistema'], ['light', 'Claro'], ['dark', 'Escuro']]],
  ['textSize', 'Tamanho do texto', 'Aumente o texto em todas as telas.', [['standard', 'Padrão'], ['large', 'Maior (125%)']]],
  ['contrast', 'Contraste', 'Reforce textos secundários e contornos dos campos.', [['standard', 'Padrão'], ['more', 'Reforçado']]],
  ['colorVision', 'Daltonismo', 'Ajuste as cores das situações. Textos e símbolos continuam identificando cada estado.', [['standard', 'Padrão'], ['redGreen', 'Vermelho e verde'], ['blueYellow', 'Azul e amarelo']]],
  ['vlibras', 'VLibras', 'Ative o assistente de tradução para Libras no sistema.', [['off', 'Desativado'], ['on', 'Ativado']]],
];

function syncVLibras() {
  if (!dialog) return;
  const state = getVLibrasState();
  const messages = { off: 'Desativado.', loading: 'Carregando VLibras…', ready: 'Ativado. O botão de Libras está disponível no canto da tela.', error: 'Não foi possível carregar o VLibras. Tente novamente.' };
  dialog.querySelector('[data-vlibras-status]').textContent = messages[state.status] ?? messages.off;
  dialog.querySelector('[data-retry-vlibras]').hidden = state.status !== 'error';
}

function sync() {
  if (!dialog) return;
  const values = getAppearancePreferences();
  dialog.querySelectorAll('select').forEach(select => { select.value = values[select.name]; });
  syncVLibras();
}

function announce(saved) {
  dialog.querySelector('[role="status"]').textContent = saved
    ? 'Preferências salvas neste navegador.'
    : 'Preferências aplicadas nesta aba. O navegador não permitiu salvá-las.';
}

function createDialog() {
  const node = document.createElement('dialog');
  node.className = 'preferences-dialog';
  node.setAttribute('aria-labelledby', 'preferences-title');
  node.innerHTML = `<header><h2 id="preferences-title">Aparência e acessibilidade</h2><button type="button" data-close-preferences aria-label="Fechar preferências" autofocus>Fechar</button></header>
    <p class="preferences-intro">Ajuste a leitura e o uso do SIVI. As mudanças são aplicadas na hora.</p>
    <div class="preferences-options"></div>
    <footer><p role="status">As escolhas ficam salvas neste navegador.</p><button type="button" data-reset-preferences>Restaurar padrão</button></footer>`;
  for (const [key, title, help, options] of definitions) {
    const row = document.createElement('div'); row.className = 'preferences-row';
    const copy = document.createElement('div');
    const label = document.createElement('label'); label.htmlFor = `preference-${key}`; label.textContent = title;
    const description = document.createElement('p'); description.id = `preference-${key}-help`; description.textContent = help;
    const select = document.createElement('select'); select.id = label.htmlFor; select.name = key; select.setAttribute('aria-describedby', description.id);
    options.forEach(([value, text]) => select.add(new Option(text, value)));
    select.addEventListener('change', () => announce(setAppearancePreference(key, select.value)));
    copy.append(label, description); row.append(copy, select); node.querySelector('.preferences-options').append(row);
    if (key === 'vlibras') {
      const state = document.createElement('p'); state.className = 'preferences-vlibras-status'; state.dataset.vlibrasStatus = ''; state.setAttribute('aria-live', 'polite'); state.setAttribute('aria-atomic', 'true');
      const retry = document.createElement('button'); retry.type = 'button'; retry.className = 'preferences-retry'; retry.dataset.retryVlibras = ''; retry.textContent = 'Tentar carregar VLibras novamente'; retry.hidden = true;
      retry.addEventListener('click', retryVLibras);
      copy.append(state, retry);
    }
  }
  node.querySelector('[data-close-preferences]').addEventListener('click', () => node.close());
  node.querySelector('[data-reset-preferences]').addEventListener('click', () => { announce(resetAppearancePreferences()); sync(); });
  node.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...node.querySelectorAll('button:not([disabled]), select:not([disabled])')].filter(control => control.checkVisibility());
    const first = controls[0]; const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  node.addEventListener('close', () => { if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true }); });
  document.body.append(node);
  return node;
}

document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-open-preferences]');
  if (!trigger || document.body.dataset.surface !== 'app') return;
  const menu = trigger.closest('[data-account-menu]');
  returnFocus = menu?.querySelector('summary') ?? trigger;
  if (menu) menu.open = false;
  dialog ??= createDialog();
  sync();
  dialog.showModal();
});
window.addEventListener('sivi:themechange', sync);
window.addEventListener('sivi:appearancechange', sync);
window.addEventListener('sivi:vlibraschange', syncVLibras);
const surfaceObserver = new MutationObserver(() => {
  if (document.body.dataset.surface !== 'app' && dialog?.open) dialog.close();
});
surfaceObserver.observe(document.body, { attributes: true, attributeFilter: ['data-surface'] });
