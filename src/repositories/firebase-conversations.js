import { isSupplierIdentifier } from "../domain/match-engine.js";

export const MESSAGE_MAX_LENGTH = 2000;
export const MESSAGE_PAGE_SIZE = 50;

export function createFirebaseConversations(client, getWorkspace) {
  function context(id, peerId) {
    const { organizationId, organizationRole } = getWorkspace(id);
    if (!["buyer", "supplier"].includes(organizationRole) || !isSupplierIdentifier(organizationId)) {
      throw new Error("Atuação indisponível para conversas.");
    }
    if (peerId === undefined) return { organizationId, organizationRole };
    if (!isSupplierIdentifier(peerId) || peerId === organizationId) {
      throw new Error("Empresa indisponível para esta conversa.");
    }
    const [buyerId, supplierId] = organizationRole === "buyer" ? [organizationId, peerId] : [peerId, organizationId];
    if (buyerId.includes(":")) throw new Error("Identificação da empresa indisponível.");
    const key = `${buyerId}:${supplierId}`;
    return { buyerId, supplierId, organizationRole, threadPath: `chatThreads/${key}`, messagePath: `chatMessages/${key}` };
  }

  function messages(records) {
    return Object.keys(records ?? {}).sort().map(id => ({ ...records[id], id }));
  }
  async function supplierContact(workspaceId, peerId, reference) {
    const { buyerId, supplierId, organizationRole } = context(workspaceId, peerId);
    const source = { pedido: 'ordersBySupplier', proposta: 'proposalsBySupplier' }[reference?.kind];
    if (organizationRole !== 'supplier' || !source || !isSupplierIdentifier(reference?.id)) return null;
    const record = await client.read(`${source}/${supplierId}/${reference.id}`);
    return record?.buyerId === buyerId && record?.supplierId === supplierId && record.buyerName ? record : null;
  }

  return Object.freeze({
    watchConnection: onData => client.watchConnection(onData),
    async getSupplierContact(workspaceId, peerId, reference) {
      return (await supplierContact(workspaceId, peerId, reference))?.buyerName ?? null;
    },
    watchInbox(workspaceId, onData, onError) {
      const { organizationId, organizationRole } = context(workspaceId);
      const isBuyer = organizationRole === "buyer";
      return client.watchByChild("chatThreads", isBuyer ? "buyerId" : "supplierId", organizationId, records => {
        const activity = thread => thread.lastMessage?.sentAt ?? thread.createdAt;
        const threads = Object.values(records ?? {}).sort((left, right) => activity(right) - activity(left));
        onData(threads.map(thread => ({
          peerId: isBuyer ? thread.supplierId : thread.buyerId,
          name: isBuyer ? thread.supplierName : thread.buyerName,
          ...(thread.lastMessage ? { lastMessage: thread.lastMessage } : {}),
        })));
      }, onError);
    },
    watchMessages(workspaceId, peerId, onData, onError) {
      const { messagePath } = context(workspaceId, peerId);
      return client.watchLatest(messagePath, MESSAGE_PAGE_SIZE, records => onData(messages(records)), onError);
    },
    async readOlderMessages(workspaceId, peerId, cursor) {
      const { messagePath } = context(workspaceId, peerId);
      return messages(await client.readBefore(messagePath, cursor, MESSAGE_PAGE_SIZE));
    },
    async sendMessage(workspaceId, peerId, input, { isNew = false, reference } = {}) {
      const { buyerId, supplierId, organizationRole, threadPath, messagePath } = context(workspaceId, peerId);
      const body = typeof input === "string" ? input.trim() : "";
      if (!body || body.length > MESSAGE_MAX_LENGTH) throw new Error("Mensagem inválida.");

      const messageId = client.newKey(messagePath);
      const path = `${messagePath}/${messageId}`;
      const message = { body, senderRole: organizationRole, sentAt: client.timestamp() };
      const lastMessage = { id: messageId, senderRole: organizationRole, sentAt: message.sentAt };
      const append = { [path]: message, [`${threadPath}/lastMessage`]: lastMessage };
      if (!isNew) {
        await client.patch(append);
        return;
      }

      let names;
      if (organizationRole === 'buyer') {
        const [buyer, supplier] = await Promise.all([
          client.read(`organizations/${buyerId}`), client.read(`supplierProfiles/${supplierId}`),
        ]);
        if (buyer?.status === 'active' && supplier?.organizationStatus === 'active' && supplier.organizationId === supplierId) {
          names = { buyerName: buyer.name, supplierName: supplier.organizationName };
        }
      } else {
        const [record, supplier] = await Promise.all([
          supplierContact(workspaceId, peerId, reference), client.read(`organizations/${supplierId}`),
        ]);
        if (record && supplier?.status === 'active') names = { buyerName: record.buyerName, supplierName: supplier.name, reference };
      }
      if (!names) throw new Error('Empresa indisponível para esta conversa.');
      const thread = {
        buyerId, supplierId, ...names, createdAt: message.sentAt, firstMessageId: messageId, lastMessage,
      };
      getWorkspace(workspaceId, organizationRole);
      try {
        await client.patch({ [threadPath]: thread, [path]: message });
      } catch (error) {
        // Another member may have created this conversation during the first send.
        if (!/permission[_ -]?denied/i.test(`${error?.code} ${error?.message}`)) throw error;
        getWorkspace(workspaceId, organizationRole);
        await client.patch(append);
      }
    },
  });
}
