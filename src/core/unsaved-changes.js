export function createUnsavedChangesGuard({ container, windowObject }) {
  const pending = () => container.querySelector('form[data-dirty=true], form[aria-busy=true]');
  const beforeUnload = event => {
    if (!pending()) return;
    event.preventDefault();
    event.returnValue = '';
  };
  windowObject.addEventListener('beforeunload', beforeUnload);
  return {
    canLeave() {
      if (!pending()) return true;
      if (container.querySelector('form[aria-busy=true]')) {
        windowObject.alert('Aguarde o envio terminar antes de sair desta página.');
        return false;
      }
      if (!windowObject.confirm('Há alterações ainda não salvas na empresa. Sair desta página?')) return false;
      container.querySelectorAll('form[data-dirty=true]').forEach(form => { delete form.dataset.dirty; });
      return true;
    },
    dispose() { windowObject.removeEventListener('beforeunload', beforeUnload); },
  };
}
