import { expect, test } from "@playwright/test";
import { createVerifiedUser, resetAuthEmulator, resetDatabaseEmulator, seedDatabaseEmulator } from "../helpers/auth-emulator.js";
import { createMarketplaceRuleFixture } from "../helpers/marketplace-rule-fixture.js";

test("chat history and writing are restricted to the two participating companies", async () => {
  await resetAuthEmulator();
  await resetDatabaseEmulator();
  const password = "SiviChatFixture2026";
  async function setup(id, role) {
    const email = `${id}@sivi.test`;
    const { uid } = await createVerifiedUser({ email, password, displayName: id });
    await seedDatabaseEmulator(`organizations/${id}`, { name: id, status: "active", roles: { [role]: true } });
    await seedDatabaseEmulator(`membershipsByUser/${uid}/${id}`, { status: "active", organizationRoles: { [role]: true } });
    const response = await fetch("http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    return (await response.json()).idToken;
  }
  const buyer = await setup("chat-buyer", "buyer");
  const supplier = await setup("chat-supplier", "supplier");
  const outsider = await setup("chat-outsider", "buyer");
  await seedDatabaseEmulator("supplierProfiles/chat-supplier", { organizationName: "chat-supplier", organizationStatus: "active" });

  const threadId = "chat-buyer:chat-supplier";
  const inbox = "chatThreads";
  const transcript = `chatMessages/${threadId}`;
  const key = index => String(index).padStart(20, "-");
  const timestamp = { ".sv": "timestamp" };
  const first = { body: "Consulta de prazo", senderRole: "buyer", sentAt: timestamp };
  const thread = { buyerId: "chat-buyer", supplierId: "chat-supplier", buyerName: "chat-buyer",
    supplierName: "chat-supplier", createdAt: timestamp, firstMessageId: key(1) };
  const request = (path, auth, { method = "GET", body, filters = {} } = {}) => {
    const query = new URLSearchParams({ ns: "sivi-org-default-rtdb", auth, ...filters });
    return fetch(`http://127.0.0.1:9000/${path}.json?${query}`, {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
  };
  const write = (path, auth, body) => request(path, auth, { method: "PUT", body });
  const creation = { [`${inbox}/${threadId}`]: thread, [`${transcript}/${key(1)}`]: first };
  expect((await write(`${inbox}/${threadId}`, buyer, thread)).status).toBe(401);
  expect((await request("", supplier, { method: "PATCH", body: creation })).status).toBe(401);
  expect((await request("", buyer, { method: "PATCH", body: creation })).status).toBe(200);

  for (const [token, role] of [[buyer, "buyer"], [supplier, "supplier"]]) {
    const result = await request(inbox, token, { filters: {
      orderBy: JSON.stringify(`${role}Id`), equalTo: JSON.stringify(`chat-${role}`),
    } });
    expect(result.status).toBe(200);
    expect(Object.keys(await result.json())).toEqual([threadId]);
  }
  expect((await request(inbox, buyer)).status).toBe(401);
  expect((await request(inbox, outsider, { filters: { orderBy: '"buyerId"', equalTo: '"chat-buyer"' } })).status).toBe(401);
  expect((await request(transcript, outsider)).status).toBe(401);
  expect((await write(`${transcript}/${key(2)}`, outsider, first)).status).toBe(401);
  expect((await write(`${transcript}/${key(2)}`, supplier, first)).status).toBe(401);
  const reply = { body: "Prazo de 18 dias", senderRole: "supplier", sentAt: timestamp };
  expect((await write(`${transcript}/${key(2)}`, supplier, { ...reply, body: "x".repeat(2001) })).status).toBe(401);
  expect((await write(`${transcript}/${key(2)}`, supplier, reply)).status).toBe(200);
  expect((await write(`${transcript}/${key(2)}`, supplier, { ...reply, body: "alteração" })).status).toBe(401);
  expect((await write(`${transcript}/${key(2)}`, supplier, null)).status).toBe(401);

  const recent = await request(transcript, buyer, { filters: { orderBy: '"$key"', limitToLast: "1" } });
  expect(recent.status).toBe(200);
  expect((await recent.json())[key(2)]).toMatchObject({ body: reply.body, senderRole: "supplier" });
  await seedDatabaseEmulator("organizations/chat-supplier/status", "blocked");
  expect((await request(transcript, supplier)).status).toBe(401);
  expect((await write(`${transcript}/${key(3)}`, buyer, first)).status).toBe(401);
});

test('the supplier can start a conversation from its own order and publish activity', async () => {
  const { buyer, supplier, competitor, request, order } = await createMarketplaceRuleFixture();
  const threadId = `${buyer.organizationId}:${supplier.organizationId}`;
  const threadPath = `chatThreads/${threadId}`;
  const transcript = `chatMessages/${threadId}`;
  const id = '-------------------1';
  const sentAt = { '.sv': 'timestamp' };
  const first = { body: 'Pedido em produção', senderRole: 'supplier', sentAt };
  const thread = {
    buyerId: buyer.organizationId, supplierId: supplier.organizationId, buyerName: order.buyerName,
    supplierName: 'supplier', createdAt: sentAt, firstMessageId: id, reference: { kind: 'pedido', id: order.id },
    lastMessage: { id, senderRole: 'supplier', sentAt },
  };
  const creation = { [threadPath]: thread, [`${transcript}/${id}`]: first };
  expect((await request('', competitor, 'PATCH', creation)).status).toBe(401);
  expect((await request('', supplier, 'PATCH', creation)).status).toBe(200);
  const replyId = '-------------------2';
  const reply = { [`${transcript}/${replyId}`]: { body: 'Recebido', senderRole: 'buyer', sentAt },
    [`${threadPath}/lastMessage`]: { id: replyId, senderRole: 'buyer', sentAt } };
  expect((await request('', buyer, 'PATCH', reply)).status).toBe(200);
  expect((await (await request(threadPath, supplier)).json()).lastMessage.id).toBe(replyId);
});
