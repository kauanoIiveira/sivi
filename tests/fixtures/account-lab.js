import { createAccountDialog } from '/src/components/account-dialog.js';
let user = { uid: 'account-lab', email: 'conta@sivi.demo', displayName: 'Conta de teste', providerData: [{ providerId: 'password' }] };
let saves = 0;
let releaseSave;
const params = new URLSearchParams(location.search);
if (params.has('social')) user.providerData = [{ providerId: 'google.com' }];
const dialog = createAccountDialog({
  getUser: () => user,
  onUpdated: next => { user = next; document.body.dataset.savedName = next.displayName; },
  loadService: async () => ({
    getCurrentAccount: () => user,
    async updateAccountProfile({ displayName }) {
      saves += 1; document.body.dataset.saveCalls = String(saves);
      if (params.has('slow')) await new Promise(resolve => { releaseSave = resolve; });
      const saved = { ...user, displayName };
      if (params.has('switch')) { user = { ...user, uid: 'other-account' }; return { user: saved, profileSaved: false, sessionChanged: true }; }
      user = saved;
      return { user, profileSaved: !params.has('partial') || saves > 1, sessionChanged: false };
    },
    async requestPasswordReset() { document.body.dataset.resetRequested = 'true'; },
  }),
});
window.accountLab = { releaseSave: () => releaseSave?.() };
document.querySelector('[data-account-trigger]').addEventListener('click', event => { void dialog.open(event.currentTarget); });
