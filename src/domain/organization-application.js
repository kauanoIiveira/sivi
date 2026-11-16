import { cleanOrganizationName, normalizeOrganizationRoles } from './organization-model.js';

export const applicationLabels = Object.freeze({ pending: 'Em análise', changes_requested: 'Correção solicitada', rejected: 'Cadastro recusado', active: 'Empresa ativa', blocked: 'Acesso suspenso' });
export const states = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ');
export const canResubmitApplication = status => ['pending', 'changes_requested'].includes(status);

export function applicationDetails(input) {
  const fields = Object.fromEntries(['cnpj', 'city', 'state', 'contact']
    .map(key => [key, String(input?.[key] ?? '').trim()]));
  fields.cnpj = fields.cnpj.replace(/[.\s/\-]/g, '').toUpperCase();
  fields.state = fields.state.toUpperCase();
  const errors = {};
  for (const [key, label, max] of [['cnpj', 'CNPJ', 18], ['city', 'Cidade', 100], ['contact', 'Contato', 120]]) {
    if (fields[key].length > max) errors[key] = `${label} deve ter até ${max} caracteres.`;
  }
  if (fields.state && !states.includes(fields.state)) errors.state = 'Selecione uma UF válida.';
  return { fields, errors };
}

export function normalizeApplication(input) {
  const name = cleanOrganizationName(input?.name);
  const roles = normalizeOrganizationRoles(input?.roles);
  const { fields, errors } = applicationDetails(input);
  const error = Object.values(errors)[0];
  if (error) throw new Error(error);
  return { name, roles, ...fields, onboardingVersion: 1 };
}
