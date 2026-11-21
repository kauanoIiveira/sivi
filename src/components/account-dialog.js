function errorMessage(error) {
  if (error?.code === 'auth/network-request-failed') return 'Não foi possível conectar. Confira sua conexão e tente novamente.';
  if (error?.code === 'auth/too-many-requests') return 'Aguarde um pouco antes de tentar novamente.';
  if (error?.code === 'auth/invalid-display-name') return error.message;
  return 'Não foi possível salvar. Tente novamente.';
}

export function createAccountDialog({ getUser, onUpdated = () => {}, loadService = () => import('../services/auth-service.js') }) {
  let dialog;
  let returnFocus;
  let account;
  let service;
  let revision = 0;
  let busy = false;
  let baseline = '';
  let pendingSync = false;
  let disposed = false;

  const sameSession = () => Boolean(account?.uid && getUser()?.uid === account.uid);
  const dirty = () => dialog && dialog.querySelector('[name=displayName]').value.trim() !== baseline;
  const onBeforeUnload = event => {
    if (!dialog?.open || (!dirty() && !busy)) return;
    event.preventDefault();
    event.returnValue = '';
  };
  window.addEventListener('beforeunload', onBeforeUnload);
  const status = message => { dialog.querySelector('[role=status]').textContent = message; };
  const syncControls = () => {
    dialog.querySelectorAll('button, input[name=displayName]').forEach(el => { el.disabled = busy || !sameSession(); });
    dialog.querySelector('[data-close-account]').disabled = busy;
    const form = dialog.querySelector('form');
    form.setAttribute('aria-busy', String(busy));
    const save = dialog.querySelector('[type=submit]');
    save.disabled = busy || !sameSession() || (!dirty() && !pendingSync);
    save.textContent = busy ? 'Aguarde…' : pendingSync ? 'Tentar sincronizar' : 'Salvar alterações';
  };

  const requestClose = () => {
    if (busy) return;
    if (dirty() && !window.confirm('Descartar a alteração de nome que ainda não foi salva?')) return;
    dialog.close();
  };

  const saveName = async event => {
    event.preventDefault();
    if (busy || !sameSession()) return;
    const input = dialog.querySelector('[name=displayName]');
    const name = input.value.trim();
    if (name.length < 2 || name.length > 120 || /[\u0000-\u001f\u007f]/u.test(name)) {
      input.setCustomValidity('Informe um nome entre 2 e 120 caracteres.');
      input.reportValidity();
      return;
    }
    const activeRevision = revision;
    busy = true;
    status('Salvando nome…');
    syncControls();
    try {
      const result = await service.updateAccountProfile({ displayName: name });
      if (disposed || activeRevision !== revision) return;
      if (result.sessionChanged || !sameSession()) {
        status('A sessão mudou. Abra Minha conta novamente.');
        return;
      }
      account = result.user;
      baseline = result.user.displayName ?? name;
      input.value = baseline;
      pendingSync = !result.profileSaved;
      onUpdated(result.user);
      status(pendingSync ? 'Nome salvo na conta. A sincronização está pendente; tente novamente.' : 'Nome atualizado.');
    } catch (error) {
      if (!disposed && activeRevision === revision) status(errorMessage(error));
    } finally {
      if (!disposed && activeRevision === revision) { busy = false; syncControls(); }
    }
  };

  const resetPassword = async () => {
    if (busy || !sameSession()) return;
    const activeRevision = revision;
    busy = true;
    status('Enviando e-mail…');
    syncControls();
    try {
      await service.requestPasswordReset(account.email);
      if (!disposed && activeRevision === revision && sameSession()) status('Enviamos um e-mail com as instruções para redefinir sua senha.');
    } catch (error) {
      if (!disposed && activeRevision === revision && sameSession()) status(error?.code === 'auth/too-many-requests' ? errorMessage(error) : 'Não foi possível enviar o e-mail. Tente novamente.');
    } finally {
      if (!disposed && activeRevision === revision) { busy = false; syncControls(); }
    }
  };

  const createDialog = () => {
    const node = document.createElement('dialog');
    node.className = 'account-dialog';
    node.setAttribute('aria-labelledby', 'account-dialog-title');
    node.innerHTML = `<header><h2 id="account-dialog-title">Minha conta</h2><button type="button" data-close-account aria-label="Fechar minha conta">Fechar</button></header>
      <p class="account-dialog__intro">Seus dados de acesso ao SIVI.</p>
      <form><label for="account-display-name">Nome exibido</label><input id="account-display-name" name="displayName" autocomplete="name" minlength="2" maxlength="120" required aria-describedby="account-name-help" /><p id="account-name-help">Nome usado para identificar você no sistema.</p>
      <label for="account-email">E-mail</label><input id="account-email" name="email" type="email" readonly aria-describedby="account-email-help" /><p id="account-email-help" data-account-method></p>
      <div class="account-dialog__security" data-account-security hidden><h3>Senha</h3><p>Receba um link para escolher uma nova senha.</p><button type="button" data-reset-account-password>Enviar e-mail de redefinição</button></div>
      <footer><p role="status" aria-live="polite" aria-atomic="true">Carregando sua conta…</p><button type="submit">Salvar alterações</button></footer></form>`;
    node.querySelector('[data-close-account]').addEventListener('click', requestClose);
    node.querySelector('[name=displayName]').addEventListener('input', event => { event.target.setCustomValidity(''); syncControls(); });
    node.querySelector('form').addEventListener('submit', saveName);
    node.querySelector('[data-reset-account-password]').addEventListener('click', resetPassword);
    node.addEventListener('cancel', event => { event.preventDefault(); requestClose(); });
    node.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...node.querySelectorAll('button:not([disabled]), input:not([disabled])')].filter(el => el.checkVisibility());
      const first = controls[0]; const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    node.addEventListener('close', () => { revision += 1; if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true }); });
    document.body.append(node);
    return node;
  };

  return {
    async open(trigger) {
      if (disposed) return;
      dialog ??= createDialog();
      if (dialog.open) return;
      returnFocus = trigger;
      const activeRevision = ++revision;
      account = null; pendingSync = false; baseline = ''; busy = false;
      dialog.querySelector('[name=displayName]').value = '';
      dialog.querySelector('[name=email]').value = '';
      dialog.querySelector('[data-account-method]').textContent = '';
      dialog.querySelector('[data-account-security]').hidden = true;
      status('Carregando sua conta…');
      syncControls();
      dialog.showModal();
      try {
        service = await loadService();
        if (disposed || activeRevision !== revision) return;
        account = service.getCurrentAccount();
        if (!sameSession()) { account = null; status('Entre na sua conta para editar o perfil.'); syncControls(); return; }
        baseline = account.displayName ?? '';
        dialog.querySelector('[name=displayName]').value = baseline;
        dialog.querySelector('[name=email]').value = account.email ?? '';
        const providers = (account.providerData ?? []).map(provider => provider.providerId);
        const password = providers.includes('password') && Boolean(account.email);
        const methods = providers.map(id => ({ password: 'E-mail e senha', 'google.com': 'Google', 'github.com': 'GitHub', 'apple.com': 'Apple' })[id] ?? id);
        dialog.querySelector('[data-account-method]').textContent = methods.length ? `Acesso: ${methods.join(', ')}.` : 'Endereço usado para entrar na sua conta.';
        dialog.querySelector('[data-account-security]').hidden = !password;
        syncControls();
        status('');
        dialog.querySelector('[name=displayName]').focus();
      } catch {
        if (!disposed && activeRevision === revision) { account = null; status('Não foi possível carregar a conta. Feche e tente novamente.'); syncControls(); }
      }
    },
    syncSession() {
      if (dialog?.open && account && !sameSession()) { revision += 1; busy = false; dialog.close(); }
    },
    destroy() { disposed = true; revision += 1; window.removeEventListener('beforeunload', onBeforeUnload); dialog?.remove(); },
  };
}
