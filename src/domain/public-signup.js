import { applicationDetails } from "./organization-application.js";
import {
  cleanOrganizationName,
  normalizeOrganizationRoles,
} from "./organization-model.js";
import {
  evaluatePassword,
  isValidEmail,
} from "../pages/auth/auth-validation.js";

export const SIGNUP_ACTIVITIES = Object.freeze([
  { id: "buyer", label: "Compradora", roles: ["buyer"] },
  { id: "supplier", label: "Fornecedora", roles: ["supplier"] },
  { id: "both", label: "Compradora e fornecedora", roles: ["buyer", "supplier"] },
]);

const legacyActivities = new Map([
  ["compras", "buyer"],
  ["fornecimento", "supplier"],
  ["integrado", "both"],
]);

export function resolveSignupActivity(id, legacyPlan) {
  const activity = id ?? legacyActivities.get(legacyPlan);
  return SIGNUP_ACTIVITIES.find((option) => option.id === activity) ?? SIGNUP_ACTIVITIES[0];
}

export const money = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
export function exampleSeries(period, role = "buyer") {
  const records =
    role === "supplier"
      ? [3, 5, 4, 7, 5, 8, 6, 9, 11, 8, 13, 10]
      : [4, 7, 5, 9, 6, 12, 8, 10, 14, 11, 16, 13];
  const values = records.slice(period === "30" ? -4 : period === "60" ? -8 : 0);
  return { values, total: values.reduce((a, b) => a + b, 0) };
}
export function exampleOperations(period, role = "buyer") {
  const series = exampleSeries(period, role),
    names = ["Em execução", "Em inspeção", "Expedido", "Recebido"];
  const orders = Array.from({ length: 24 }, (_, i) => ({
    id: `example-${role}-${i}`,
    week: Math.floor(i / 2),
    stage: (i + (role === "supplier" ? 1 : 0)) % 4,
  })).filter((order) => order.week >= 12 - series.values.length);
  const stages = names.map((name, index) => ({
    name,
    count: orders.filter((order) => order.stage === index).length,
  }));
  const quotes =
    role === "supplier"
      ? [
          { label: "Versão 1", amount: 21120, days: 18 },
          { label: "Versão 2", amount: 20160, days: 16 },
          { label: "Versão 3", amount: 19680, days: 14 },
        ]
      : [
          { label: "Fornecedor A", amount: 18600, days: 18 },
          { label: "Fornecedor B", amount: 19800, days: 14 },
          { label: "Fornecedor C", amount: 20400, days: 12 },
        ];
  return { series, orders, stages, quotes };
}
export function validateSignup(values, step) {
  const errors = {};
  if (step === 0) {
    if (
      String(values.firstName ?? "").trim().length < 2 ||
      String(values.firstName).length > 60
    )
      errors.firstName = "Informe seu nome (2 a 60 caracteres).";
    if (
      String(values.lastName ?? "").trim().length < 2 ||
      String(values.lastName).length > 80
    )
      errors.lastName = "Informe seu sobrenome (2 a 80 caracteres).";
    if (!isValidEmail(String(values.email ?? "").trim()))
      errors.email = "Informe um e-mail válido.";
    if (
      evaluatePassword(String(values.password ?? "")).score !== 4 ||
      String(values.password).length > 128
    )
      errors.password =
        "Use de 8 a 128 caracteres, com maiúscula, minúscula e número.";
    if (values.password !== values.confirmPassword)
      errors.confirmPassword = "As senhas precisam ser iguais.";
  }
  if (step === 1) {
    try {
      cleanOrganizationName(values.name);
    } catch (error) {
      errors.name = error.message;
    }
    try {
      normalizeOrganizationRoles(values.roles);
    } catch (error) {
      errors.roles = error.message;
    }
    Object.assign(errors, applicationDetails(values).errors);
  }
  return errors;
}
