import {
  createVerifiedUser,
  resetAuthEmulator,
  resetDatabaseEmulator,
  seedDatabaseEmulator,
} from "./auth-emulator.js";

// Fixed local endpoints: these tests must never write to a remote project.
export async function createMarketplaceRuleFixture() {
  await resetAuthEmulator();
  await resetDatabaseEmulator();
  const password = "SiviIntegrity2026";
  async function account(name, role) {
    const email = `integrity-${name}@sivi.test`;
    const user = await createVerifiedUser({ email, password, displayName: name });
    const response = await fetch("http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    if (!response.ok) throw new Error(`Fixture sign-in failed: ${response.status}`);
    const { idToken: token } = await response.json();
    const organizationId = `integrity-${name}`;
    await seedDatabaseEmulator(`membershipsByUser/${user.uid}/${organizationId}`, {
      organizationName: name, organizationRoles: { [role]: true }, status: "active",
      userRoles: ["owner"], permissions: { [role]: ["orders:write"] }, createdAt: 1,
    });
    return { uid: user.uid, organizationId, token };
  }
  const buyer = await account("buyer", "buyer");
  const supplier = await account("supplier", "supplier");
  const competitor = await account("competitor", "supplier");
  const demand = {
    id: "demand-1", buyerId: buyer.organizationId, buyerName: "Comprador",
    title: "Eixos de aço", description: "Usinagem conforme desenho",
    items: [{ id: "item-1", description: "Eixo", quantity: 10, unit: "un" }],
    quantity: 10, requiredBy: "2027-12-01", destination: "Diadema", region: "SP",
    status: "ordered", createdAt: 1, updatedAt: 1,
  };
  const order = {
    id: "order-1", demandId: demand.id, buyerId: buyer.organizationId,
    buyerName: demand.buyerName, supplierId: supplier.organizationId,
    supplierName: "Fornecedor", sourceProposalId: "proposal-1",
    title: demand.title, description: demand.description, items: demand.items,
    quantity: 10, version: {
      id: "version-1", revision: 1, totalCents: 10000, freightCents: 500,
      leadTimeDays: 10, manufacturer: "Fornecedor", payment: "30 dias",
      warranty: "12 meses", technical: "Conforme desenho", validUntil: "2027-11-01", createdAt: 1,
    },
    status: "accepted", createdAt: 1, updatedAt: 1,
  };
  const buyerOrderPath = `ordersByBuyer/${buyer.organizationId}/${order.id}`;
  const supplierOrderPath = `ordersBySupplier/${supplier.organizationId}/${order.id}`;
  const demandPath = `demandsByBuyer/${buyer.organizationId}/${demand.id}`;
  await seedDatabaseEmulator(buyerOrderPath, order);
  await seedDatabaseEmulator(supplierOrderPath, order);
  await seedDatabaseEmulator(demandPath, demand);
  const request = (path, actor, method = "GET", body) => fetch(
    `http://127.0.0.1:9000/${path}.json?ns=sivi-org-default-rtdb&auth=${actor.token}`,
    { method, headers: { "Content-Type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) },
  );
  return { buyer, supplier, competitor, buyerOrderPath, supplierOrderPath, demandPath, demand, order, request };
}
