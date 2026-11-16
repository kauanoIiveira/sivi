import { element, emptyState } from './workflow-components.js';
import { filterRecords, recordSorts, recordStatuses } from './record-filters.js';

export function recordCollection({ section, entries, data, filters, selectedRecordId, canFilter, onExport, headerActions }) {
  const region = element('div', undefined, 'workflow-collection');
  const list = element('div', undefined, 'workflow-record-list');
  const noun = section === 'orders' ? 'pedidos' : 'negociações';
  const count = element('p', undefined, 'workflow-result-count');
  count.dataset.resultCount = ''; count.setAttribute('role', 'status'); count.setAttribute('aria-atomic', 'true');
  const actions = element('div', undefined, 'workflow-collection-actions');
  let visible = entries.map(entry => entry.record);
  let exportButton;
  if (onExport && entries.length) {
    exportButton = element('button', 'Exportar pedidos em CSV', 'workflow-secondary-action'); exportButton.type = 'button';
    exportButton.addEventListener('click', () => onExport(visible));
    const note = element('span', 'Dados salvos. Uma linha por item; valores do pedido na primeira linha.', 'workflow-export-note');
    if (headerActions) {
      note.id = 'workflow-export-note';
      note.classList.add('workflow-export-note--accessible');
      exportButton.setAttribute('aria-describedby', note.id);
      headerActions.append(exportButton, note);
    } else actions.append(exportButton, note);
  }
  if (selectedRecordId || !entries.length) {
    list.append(...entries.map(entry => entry.node)); region.append(actions, list); return region;
  }
  const toolbar = element('div', undefined, 'workflow-toolbar workflow-collection-toolbar');
  const searchLabel = element('label', section === 'orders' ? 'Buscar pedidos' : 'Buscar propostas');
  const search = element('input'); search.type = 'search'; search.maxLength = 200;
  search.placeholder = 'Título, empresa ou referência'; searchLabel.append(search); toolbar.append(searchLabel);
  const select = (label, options) => {
    const field = element('label', label); const control = element('select');
    options.forEach(([value, title]) => { const option = element('option', title); option.value = value; control.append(option); });
    field.append(control); toolbar.append(field); return control;
  };
  const status = select('Situação', recordStatuses[section]);
  const sort = select('Ordenar por', recordSorts);
  const clear = element('button', 'Limpar filtros', 'workflow-secondary-action'); clear.type = 'button';
  toolbar.append(clear);
  const hint = section === 'proposals'
    ? element('p', 'A ordem por valor usa a menor oferta na versão mais recente, inclusive ofertas vencidas.', 'workflow-filter-hint')
    : null;
  const noResults = emptyState('Nenhum resultado encontrado', 'Tente outro termo ou limpe os filtros para ver todos os registros.');
  let applied = filters.read();
  const setControls = () => { search.value = applied.search; status.value = applied.status; sort.value = applied.sort; };
  const show = () => {
    visible = filterRecords(entries.map(entry => entry.record), applied, section, data);
    const byId = new Map(entries.map(entry => [entry.record.id, entry.node]));
    // Reuse the record nodes: filtering and sorting must not reset forms or
    // collapse the proposal history the user already opened.
    list.replaceChildren(...visible.map(record => byId.get(record.id)));
    count.textContent = `${visible.length} de ${entries.length} ${noun}`;
    noResults.hidden = visible.length > 0;
    clear.disabled = !applied.search && !applied.status && applied.sort === 'recent';
    if (exportButton) exportButton.disabled = !visible.length;
    if (hint) hint.hidden = !applied.sort.startsWith('total');
  };
  const update = () => {
    if (!canFilter()) { setControls(); return; }
    applied = { search: search.value, status: status.value, sort: sort.value };
    filters.save(applied); show();
  };
  clear.addEventListener('click', () => {
    if (!canFilter()) return;
    filters.clear(); applied = filters.read(); setControls(); show(); search.focus();
  });
  search.addEventListener('input', update); status.addEventListener('change', update); sort.addEventListener('change', update);
  setControls(); show();
  region.append(toolbar);
  if (hint) region.append(hint);
  region.append(count, actions, noResults, list);
  return region;
}
