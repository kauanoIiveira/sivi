import { mountIndustrialRail } from '../../visualizations/industrial-rail/industrial-rail.js';

export function mountBuyerJourney({ container, workspace, repository }) {
  if (!repository.getIndustrialJourney) return () => {};
  let disposed = false;
  let clearRail = () => {};
  const section = document.createElement('section');
  section.className = 'buyer-panel buyer-journey';
  const heading = document.createElement('h2');
  heading.textContent = 'Acompanhamento da compra';
  const slot = document.createElement('div');
  slot.dataset.industrialRailSlot = 'true';
  section.append(heading, slot);
  async function load() {
    let result;
    try { result = await repository.getIndustrialJourney(workspace.id); }
    catch { result = { status: 'error' }; }
    if (disposed) return;
    clearRail();
    slot.replaceChildren();
    if (result.status === 'ready' && Array.isArray(result.data)) {
      if (!result.data.length) { section.remove(); return; }
      container.append(section);
      heading.textContent = `Acompanhamento da compra: ${result.data.find(step => step.id === 'order' && step.status !== 'locked')?.summary ?? result.data.find(step => step.id === 'demand')?.summary ?? 'compra atual'}`;
      clearRail = mountIndustrialRail(slot, result.data, result.meta) ?? (() => {});
      return;
    }
    container.append(section);
    const message = document.createElement('p');
    message.textContent = 'Não foi possível carregar o acompanhamento da compra.';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'buyer-button buyer-button--outline';
    retry.textContent = 'Atualizar acompanhamento';
    retry.addEventListener('click', () => { retry.disabled = true; void load(); });
    slot.append(message, retry);
  }
  void load();
  return () => { disposed = true; clearRail(); section.remove(); };
}
