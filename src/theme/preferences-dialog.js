import { getAppearancePreferences, setAppearancePreference, resetAppearancePreferences } from './appearance-controller.js';

let dialog;
let returnFocus;
const definitions = [
  ['theme', 'Tema', 'Use a aparência do dispositivo ou escolha um tema.', [['system', 'Seguir o sistema'], ['light', 'Claro'], ['dark', 'Escuro']]],
  ['textSize', 'Tamanho do texto', 'Aumente o texto em todas as telas.', [['standard', 'Padrão'], ['large', 'Maior (125%)']]],
  ['contrast', 'Contraste', 'Reforce textos secundários e contornos dos campos.', [['standard', 'Padrão'], ['more', 'Reforçado']]],
  ['motion', 'Movimento', 'A preferência por menos movimento do dispositivo é sempre respeitada.', [['system', 'Seguir o sistema'], ['reduce', 'Reduzir movimento']]],
  ['density', 'Espaçamento', 'Ajuste o espaço entre os registros nas telas de trabalho.', [['comfortable', 'Confortável'], ['compact', 'Compacto']]],
];

function sync() {
  if (!dialog) return;
  const values = getAppearancePreferences();
  dialog.querySelectorAll('select').forEach(select => { select.value = values[select.name]; });
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
  }
  node.querySelector('[data-close-preferences]').addEventListener('click', () => node.close());
  node.querySelector('[data-reset-preferences]').addEventListener('click', () => { announce(resetAppearancePreferences()); sync(); });
  node.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...node.querySelectorAll('button, select')];
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
  if (!trigger) return;
  const menu = trigger.closest('[data-account-menu]');
  returnFocus = menu?.querySelector('summary') ?? trigger;
  if (menu) menu.open = false;
  dialog ??= createDialog();
  sync();
  dialog.showModal();
});
window.addEventListener('sivi:themechange', sync);
window.addEventListener('sivi:appearancechange', sync);
