import { normalizeApplication, states } from '../../domain/organization-application.js';

export function mountApplicationForm({ container, initial = {}, onSubmit, onCancel }) {
  container.innerHTML = `<form data-create-organization class="application-form">
    <p class="context-page__eyebrow" data-step-label>Etapa 1 de 2 · Dados da empresa</p>
    <h2 tabindex="-1">${initial.id ? 'Corrigir cadastro' : 'Cadastrar empresa'}</h2>
    <p>O acesso é gratuito nesta fase. A administração analisará o cadastro antes de liberar as negociações.</p>
    <div data-fields class="application-fields">
      <label>Nome da empresa<input name="name" maxlength="120" required autocomplete="organization"></label>
      <label>CNPJ<input name="cnpj" aria-label="CNPJ" aria-describedby="cnpj-help" maxlength="18" required placeholder="00.000.000/0000-00"><small id="cnpj-help">Identificação declarada, sem consulta automática à Receita Federal.</small></label>
      <label>Cidade<input name="city" maxlength="100" required autocomplete="address-level2"></label>
      <label>UF<select name="state" aria-label="UF" required autocomplete="address-level1"><option value="">Selecione</option>${states.map(state => `<option>${state}</option>`).join('')}</select></label>
      <label class="application-wide">Telefone ou e-mail de contato<input name="contact" maxlength="120" required></label>
      <fieldset class="application-wide"><legend>Como esta empresa atuará?</legend><label><input type="checkbox" name="roles" value="buyer"> Compradora</label><label><input type="checkbox" name="roles" value="supplier"> Fornecedora</label></fieldset>
    </div>
    <div data-review hidden><h3>Confira antes de enviar</h3><dl></dl><p>Ao enviar, você confirma que é responsável pelo cadastro desta empresa.</p></div>
    <p role="alert" data-create-error></p>
    <div class="application-actions"><button type="button" data-back hidden>Voltar e editar</button><button type="button" data-cancel>Cancelar</button><button type="submit">Revisar cadastro</button></div>
  </form>`;
  const form = container.querySelector('form');
  for (const field of ['name', 'cnpj', 'city', 'state', 'contact']) form.elements[field].value = initial[field] ?? '';
  for (const check of form.querySelectorAll('[name="roles"]')) check.checked = initial.roles?.[check.value] === true;
  const error = form.querySelector('[role="alert"]');
  const submit = form.querySelector('[type="submit"]');
  let values, reviewing = false, disposed = false;
  const setStep = value => {
    reviewing = value;
    form.querySelector('[data-fields]').hidden = value;
    form.querySelector('[data-review]').hidden = !value;
    form.querySelector('[data-back]').hidden = !value;
    form.querySelector('[data-step-label]').textContent = value ? 'Etapa 2 de 2 · Revisão e envio' : 'Etapa 1 de 2 · Dados da empresa';
    submit.textContent = value ? (initial.id ? 'Corrigir e reenviar' : 'Solicitar acesso') : 'Revisar cadastro';
    form.querySelector('h2').focus();
  };
  form.querySelector('[data-back]').addEventListener('click', () => setStep(false));
  form.querySelector('[data-cancel]').addEventListener('click', onCancel);
  form.addEventListener('input', () => { error.textContent = ''; });
  form.addEventListener('submit', async event => {
    event.preventDefault(); error.textContent = '';
    try {
      if (!reviewing) {
        const data = new FormData(form);
        values = normalizeApplication({ ...Object.fromEntries(data), roles: data.getAll('roles') });
        const dl = form.querySelector('[data-review] dl'); dl.replaceChildren();
        for (const [label, value] of [['Empresa', values.name], ['CNPJ', values.cnpj], ['Localização', `${values.city}/${values.state}`], ['Contato', values.contact], ['Atuação', values.roles.map(role => role === 'buyer' ? 'Compradora' : 'Fornecedora').join(' e ')]]) {
          const dt = document.createElement('dt'); dt.textContent = label;
          const dd = document.createElement('dd'); dd.textContent = value; dl.append(dt, dd);
        }
        setStep(true); return;
      }
      for (const control of form.querySelectorAll('button')) control.disabled = true;
      submit.textContent = 'Enviando cadastro…';
      await onSubmit(values);
    } catch (cause) { if (!disposed) error.textContent = cause?.message ?? 'Não foi possível enviar o cadastro. Tente novamente.'; }
    finally {
      if (!disposed) {
        for (const control of form.querySelectorAll('button')) control.disabled = false;
        submit.textContent = reviewing ? (initial.id ? 'Corrigir e reenviar' : 'Solicitar acesso') : 'Revisar cadastro';
      }
    }
  });
  return () => { disposed = true; container.replaceChildren(); };
}
