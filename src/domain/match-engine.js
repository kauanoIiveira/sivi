import { quantitiesByUnit } from './quantity.js';

const normalize = (value) => String(value ?? "").trim().toLocaleLowerCase("pt-BR");
const list = (value) => (Array.isArray(value) ? value : String(value ?? "").split(","))
  .map(normalize)
  .filter(Boolean);

function listCriterion(id, label, requiredValues, offeredValues, { required = false } = {}) {
  const expected = list(requiredValues);
  const offered = new Set(list(offeredValues));
  if (!expected.length) return { id, label, state: "not_informed", explanation: "A demanda não informou este critério." };
  if (!offered.size) return { id, label, state: required ? "unmet" : "not_informed", requiresConfirmation: true, explanation: "O fornecedor ainda não informou este critério solicitado pela demanda." };
  const missing = expected.filter((value) => !offered.has(value));
  return missing.length
    ? { id, label, state: "unmet", explanation: `Não atende: ${missing.join(", ")}.` }
    : { id, label, state: "met", explanation: `Atende: ${expected.join(", ")}.` };
}
export function normalizeSupplierProfile(input, { organizationId, organizationName }) {
  const capacity = Number(input?.capacity);
  if (!Number.isSafeInteger(capacity) || capacity < 1) throw new Error("Informe uma capacidade máxima válida.");
  const description = String(input?.description ?? "").trim();
  if (description.length < 10 || description.length > 1000) throw new Error("Descreva a capacidade industrial em 10 a 1000 caracteres.");
  const requiredLists = ["categories", "materials", "processes", "regions"];
  const normalized = Object.fromEntries(requiredLists.map((key) => [key, list(input?.[key])]));
  if (requiredLists.some((key) => normalized[key].length === 0)) {
    throw new Error("Informe categorias, materiais, processos e regiões atendidas.");
  }
  return {
    organizationId,
    organizationName,
    ...normalized,
    certifications: list(input?.certifications),
    capacity,
    leadTimeDays: Number.isSafeInteger(Number(input?.leadTimeDays)) && Number(input.leadTimeDays) > 0
      ? Number(input.leadTimeDays)
      : null,
    description,
  };
}

export function matchSupplierToDemand(demand, profile) {
  const items = Array.isArray(demand?.items) && demand.items.length
    ? demand.items
    : [{
        category: demand?.category,
        material: demand?.material,
        process: demand?.process,
        certification: demand?.certification,
        quantity: demand?.quantity,
      }];
  const requiredCategories = items.map((item) => item.category);
  const requiredMaterials = items.map((item) => item.material).filter(Boolean);
  const requiredProcesses = items.map((item) => item.process);
  const requiredCertifications = items.flatMap((item) => list(item.certifications ?? item.certification));
  const quantities = quantitiesByUnit([{ items }]);
  const comparableCapacity = quantities.length === 1 && quantities[0].unit === 'un' && Number(profile?.capacity) > 0;
  const totalQuantity = quantities[0]?.quantity ?? 0;
  const criteria = [
    listCriterion("category", "Categoria", requiredCategories, profile?.categories, { required: true }),
    listCriterion("process", "Processo", requiredProcesses, profile?.processes, { required: true }),
    listCriterion("material", "Material", requiredMaterials, profile?.materials),
    listCriterion("certification", "Certificação", requiredCertifications, profile?.certifications),
    listCriterion("region", "Região", demand?.region ?? demand?.destination, profile?.regions),
    !comparableCapacity
      ? { id: 'capacity', label: 'Capacidade', state: 'not_informed', explanation: 'Confirme a capacidade para os itens solicitados. O perfil informa capacidade em unidades.' }
      : Number(profile?.capacity) >= totalQuantity
      ? { id: "capacity", label: "Capacidade", state: "met", explanation: `Capacidade declarada de ${profile.capacity} unidades.` }
      : { id: "capacity", label: "Capacidade", state: "unmet", explanation: `Capacidade declarada abaixo das ${totalQuantity} unidades solicitadas.` },
  ];
  const mandatoryFailed = criteria.some((criterion) => ["category", "process"].includes(criterion.id) && criterion.state !== "met");
  const allMet = comparableCapacity && criteria.every((criterion) => ["met", "not_informed"].includes(criterion.state) && !criterion.requiresConfirmation);
  const status = mandatoryFailed ? "ineligible" : allMet ? "compatible" : "partial";
  return Object.freeze({
    supplierId: profile?.organizationId,
    supplierName: profile?.organizationName,
    demandId: demand?.id,
    status,
    eligible: status !== "ineligible",
    criteria: Object.freeze(criteria.map(Object.freeze)),
  });
}
