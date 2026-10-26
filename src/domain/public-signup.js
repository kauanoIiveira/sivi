import { states } from "./organization-application.js";
import {
  cleanOrganizationName,
  normalizeOrganizationRoles,
} from "./organization-model.js";
import {
  evaluatePassword,
  isValidEmail,
} from "../pages/auth/auth-validation.js";

export const PUBLIC_PLANS = Object.freeze([
  {
    id: "compras",
    name: "Compras",
    price: 99,
    annual: 79,
    roles: ["buyer"],
    subtitle: "Encontre quem atende à sua necessidade.",
    features: [
      "Demandas com requisitos por item",
      "Comparação de propostas e revisões",
      "Pedidos, recebimentos e avaliações",
    ],
  },
  {
    id: "fornecimento",
    name: "Fornecimento",
    price: 149,
    annual: 119,
    roles: ["supplier"],
    subtitle: "Transforme sua capacidade em novos acordos.",
    features: [
      "Perfil de capacidade industrial",
      "Propostas com histórico de versões",
      "Inspeção e expedição dos pedidos",
    ],
  },
  {
    id: "integrado",
    name: "Integrado",
    price: 199,
    annual: 159,
    roles: ["buyer", "supplier"],
    subtitle: "Compre e forneça no mesmo lugar.",
    features: [
      "Todos os recursos de Compras",
      "Todos os recursos de Fornecimento",
      "Alternância entre as duas atuações",
    ],
  },
]);
export const resolvePlan = (id) =>
  PUBLIC_PLANS.find((plan) => plan.id === id) ?? PUBLIC_PLANS[2];
export function planQuote(id, period) {
  const plan = resolvePlan(id);
  const annual = period === "anual";
  return {
    monthly: annual ? plan.annual : plan.price,
    total: annual ? plan.annual * 12 : plan.price,
    period: annual ? "anual" : "mensal",
  };
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
    if (
      !/^[A-Z0-9]{12}[0-9]{2}$/.test(
        String(values.cnpj ?? "")
          .replace(/[.\s/\-]/g, "")
          .toUpperCase(),
      )
    )
      errors.cnpj = "Informe o CNPJ com 14 caracteres.";
    const city = String(values.city ?? "").trim(),
      contact = String(values.contact ?? "").trim();
    if (city.length < 2 || city.length > 100)
      errors.city = "Informe a cidade (2 a 100 caracteres).";
    if (!states.includes(String(values.state ?? "").toUpperCase()))
      errors.state = "Selecione a UF da empresa.";
    if (contact.length < 8 || contact.length > 120)
      errors.contact =
        "Informe um telefone ou e-mail de contato (8 a 120 caracteres).";
  }
  if (step === 2) {
    if (String(values.card ?? "").replace(/\s/g, "") !== "4242424242424242")
      errors.card = "Use somente o cartão de teste 4242 4242 4242 4242.";
    if (values.expiry !== "12/30")
      errors.expiry = "Use a validade de teste 12/30.";
    if (values.cvv !== "123") errors.cvv = "Use o código de teste 123.";
    if (String(values.holder ?? "").trim().length < 2)
      errors.holder = "Informe um nome demonstrativo.";
    if (!values.consent)
      errors.consent =
        "Confirme que entendeu a criação da conta e o uso de dados de teste.";
  }
  return errors;
}
