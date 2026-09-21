import { cleanOrganizationName, normalizeOrganizationRoles } from './organization-model.js';

export const applicationLabels = Object.freeze({ pending: 'Em análise', changes_requested: 'Correção solicitada', rejected: 'Cadastro recusado', active: 'Empresa ativa', blocked: 'Acesso suspenso' });
export const states = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ');
export const canResubmitApplication = status => ['pending', 'changes_requested'].includes(status);

export function normalizeApplication(input) {
  const name = cleanOrganizationName(input?.name);
  const roles = normalizeOrganizationRoles(input?.roles);
  const cnpj = String(input?.cnpj ?? '').replace(/[.\s/\-]/g, '').toUpperCase();
  const city = String(input?.city ?? '').trim();
  const state = String(input?.state ?? '').trim().toUpperCase();
  const contact = String(input?.contact ?? '').trim();
  if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(cnpj)) throw new Error('Informe o CNPJ com 14 caracteres.');
  if (city.length < 2 || city.length > 100) throw new Error('Informe a cidade (2 a 100 caracteres).');
  if (!states.includes(state)) throw new Error('Selecione a UF da empresa.');
  if (contact.length < 8 || contact.length > 120) throw new Error('Informe um telefone ou e-mail de contato (8 a 120 caracteres).');
  return { name, roles, cnpj, city, state, contact, onboardingVersion: 1 };
}
