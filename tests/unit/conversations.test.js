import assert from "node:assert/strict";
import test from "node:test";
import { createFirebaseConversations, MESSAGE_PAGE_SIZE } from "../../src/repositories/firebase-conversations.js";

const identities = {
  buyer: { organizationId: "alpha", organizationRole: "buyer" },
  supplier: { organizationId: "vetor", organizationRole: "supplier" },
};
function workspace(id, role) {
  if (!identities[id] || (role && identities[id].organizationRole !== role)) throw new Error("Contexto inválido.");
  return identities[id];
}

test("a concurrent first message falls back to appending with the same key", async () => {
  const writes = [];
  const client = {
    newKey: () => "unique",
    timestamp: () => 123,
    read: async path => ({
      "organizations/alpha": { name: "Alpha", status: "active" },
      "supplierProfiles/vetor": { organizationId: "vetor", organizationName: "Vetor", organizationStatus: "active" },
    })[path],
    patch: async updates => {
      writes.push(updates);
      if (writes.length === 1) throw Object.assign(new Error("Another member created the conversation"), { code: "PERMISSION_DENIED" });
    },
  };
  const chat = createFirebaseConversations(client, workspace);
  await chat.sendMessage("buyer", "vetor", "  Olá!  ", { isNew: true });
  const path = "chatMessages/alpha:vetor/unique";
  assert.deepEqual(writes[0]["chatThreads/alpha:vetor"], {
    buyerId: "alpha", supplierId: "vetor", buyerName: "Alpha", supplierName: "Vetor", createdAt: 123, firstMessageId: "unique",
    lastMessage: { id: "unique", senderRole: "buyer", sentAt: 123 },
  });
  assert.deepEqual(writes[1], { [path]: { body: "Olá!", senderRole: "buyer", sentAt: 123 },
    "chatThreads/alpha:vetor/lastMessage": { id: "unique", senderRole: "buyer", sentAt: 123 } });
  assert.deepEqual(writes[1][path], writes[0][path]);
  await assert.rejects(chat.sendMessage("buyer", "alpha", "Olá!"), /indisponível/);
  await assert.rejects(chat.sendMessage("buyer", "vetor", "   "), /inválida/);
  assert.equal(writes.length, 2);
});

test("the supplier only queries their own inbox and replies on the shared thread", async () => {
  const calls = [];
  const stop = () => {};
  const client = {
    watchByChild: (path, field, id, onData) => {
      calls.push([path, field, id]);
      onData({ thread: { buyerId: "alpha", buyerName: "Alpha" } });
      return stop;
    },
    watchLatest: (path, count, onData) => {
      calls.push([path, count]);
      onData({ "-z": { body: "depois" }, "-A": { body: "antes" } });
      return stop;
    },
    newKey: () => "reply",
    timestamp: () => 123,
    patch: async updates => calls.push(updates),
  };
  const chat = createFirebaseConversations(client, workspace);
  assert.equal(chat.watchInbox("supplier", items => assert.deepEqual(items, [{ peerId: "alpha", name: "Alpha" }])), stop);
  chat.watchMessages("supplier", "alpha", items => assert.deepEqual(items.map(item => item.body), ["antes", "depois"]));
  await chat.sendMessage("supplier", "alpha", "Resposta");
  assert.deepEqual(calls, [
    ["chatThreads", "supplierId", "vetor"],
    ["chatMessages/alpha:vetor", MESSAGE_PAGE_SIZE],
    { "chatMessages/alpha:vetor/reply": { body: "Resposta", senderRole: "supplier", sentAt: 123 },
      "chatThreads/alpha:vetor/lastMessage": { id: "reply", senderRole: "supplier", sentAt: 123 } },
  ]);
});
