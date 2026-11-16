import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { proposalExpiry } from '../src/domain/proposal-expiry.js';

const terms = ['id','description','category','material','process','quantity','unit'];
const demandTerms = ['id','buyerId','buyerName','title','description','quantity','requiredBy','destination','region','status','createdAt'];
const proposalTerms = ['id','demandId','buyerId','buyerName','supplierId','supplierName','updatedAt'];
const versionTerms = ['id','revision','totalCents','freightCents','leadTimeDays','manufacturer','payment','warranty','technical','validUntil','createdAt'];
const values = value => Array.isArray(value) ? value : Object.values(value ?? {});
const indexed = value => {
  const keys = Object.keys(value ?? {});
  if (keys.some((key, index) => key !== String(index))) throw Error('Coleção de itens ou certificações sem índices contínuos; exige revisão.');
  return values(value);
};
const equal = (left, right, fields) => fields.every(field => left?.[field] === right?.[field]);
const certificates = item => values(item?.certifications);
const sameItems = (left, right) => {
  const a = values(left?.items), b = values(right?.items);
  return a.length === b.length && a.every((item, index) => equal(item, b[index], terms) && JSON.stringify(certificates(item)) === JSON.stringify(certificates(b[index])));
};

// Offline preparation only. Never connects to Firebase or applies the patch.
// Divergent projections and ambiguous revision histories require human review.
export function prepareFlowMigration(root) {
  const updates = {}, blocked = [];
  const reject = (path, reason) => blocked.push({ path, reason });
  const add = (batch, path, original, next) => {
    if (original !== undefined && JSON.stringify(original) !== JSON.stringify(next)) throw Error(`Metadado existente divergente: ${path}`);
    if (original === undefined) batch[path] = next;
  };
  const itemMetadata = (record, path) => {
    const batch = {}, items = indexed(record.items);
    if (!items.length) throw Error('A demanda não possui itens identificados.');
    let total = 0;
    if (new Set(items.map(item => item?.id)).size !== items.length) throw Error('Há identificações de itens repetidas.');
    items.forEach((item, position) => {
      if (!item.id || !Number.isSafeInteger(item.quantity) || item.quantity < 1) throw Error('Há item sem identificação ou quantidade válida.');
      total += item.quantity;
      const certs = indexed(item.certifications);
      if (certs.some(value => typeof value !== 'string' || !value.trim() || value.length > 120)) throw Error('Há certificação sem descrição válida.');
      const base = `${path}/items/${position}`;
      add(batch, `${base}/position`, item.position, position);
      add(batch, `${base}/cumulativeQuantity`, item.cumulativeQuantity, total);
      add(batch, `${base}/certificationCount`, item.certificationCount, certs.length);
      if (certs.length) add(batch, `${base}/certificationPositions`, item.certificationPositions === undefined ? undefined : values(item.certificationPositions), certs.map((_, index) => index));
    });
    if (record.quantity !== total) throw Error('O total diverge das quantidades dos itens.');
    add(batch, `${path}/itemCount`, record.itemCount, items.length);
    return batch;
  };
  for (const [id, source] of Object.entries(root.publishedDemands ?? {})) {
    if (source.status !== 'published') continue;
    const buyerPath = `demandsByBuyer/${source.buyerId}/${id}`;
    const buyer = root.demandsByBuyer?.[source.buyerId]?.[id];
    if (source.id !== id || !buyer || !equal(source, buyer, demandTerms) || !sameItems(source, buyer)) {
      reject(`publishedDemands/${id}`, 'Demanda publicada e projeção do comprador divergem.'); continue;
    }
    try { Object.assign(updates, itemMetadata(source, `publishedDemands/${id}`), itemMetadata(buyer, buyerPath)); }
    catch (error) { reject(`publishedDemands/${id}`, error.message); continue; }
    for (const [supplierId, records] of Object.entries(root.opportunitiesBySupplier ?? {})) {
      const opportunity = records[id];
      if (!opportunity) continue;
      const path = `opportunitiesBySupplier/${supplierId}/${id}`;
      if (!equal(source, opportunity, demandTerms) || !sameItems(source, opportunity)) { reject(path, 'A oportunidade diverge da especificação publicada.'); continue; }
      try { Object.assign(updates, itemMetadata(opportunity, path)); }
      catch (error) { reject(path, error.message); }
    }
  }
  for (const [buyerId, records] of Object.entries(root.proposalsByBuyer ?? {})) {
    for (const [id, proposal] of Object.entries(records)) {
      if (root.publishedDemands?.[proposal.demandId]?.status !== 'published') continue;
      const buyerPath = `proposalsByBuyer/${buyerId}/${id}`;
      const supplierPath = `proposalsBySupplier/${proposal.supplierId}/${id}`;
      const mirror = root.proposalsBySupplier?.[proposal.supplierId]?.[id];
      const versions = values(proposal.versions), mirrorVersions = values(mirror?.versions);
      if (proposal.buyerId !== buyerId || proposal.id !== id || !equal(proposal, mirror, proposalTerms) || versions.length !== mirrorVersions.length || versions.some(version => !equal(version, mirror?.versions?.[version.id], versionTerms))) {
        reject(buyerPath, 'As projeções da proposta ou suas versões divergem.'); continue;
      }
      if (!versions.length || versions.some(version => !Number.isSafeInteger(version.revision) || version.revision < 1 || proposal.versions?.[version.id]?.id !== version.id) || new Set(versions.map(version => version.revision)).size !== versions.length) {
        reject(buyerPath, 'Histórico sem revisão única: não é seguro escolher automaticamente a versão atual.'); continue;
      }
      const latest = [...versions].sort((a,b) => b.revision - a.revision)[0];
      const batch = {};
      try {
        for (const [path, record] of [[buyerPath, proposal], [supplierPath, mirror]]) {
          add(batch, `${path}/latestVersionId`, record.latestVersionId, latest.id);
          add(batch, `${path}/revision`, record.revision, latest.revision);
          for (const version of versions) {
            const expiry = proposalExpiry(version.validUntil);
            const existing = record.versions[version.id].expiry;
            if (existing && !equal(existing, expiry, ['year','month','day','until'])) throw Error('A validade existente diverge da data declarada.');
            if (!existing) batch[`${path}/versions/${version.id}/expiry`] = expiry;
          }
        }
        Object.assign(updates, batch);
      } catch (error) { reject(buyerPath, error.message); }
    }
  }
  return { updates, blocked };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (args.length !== 4 || args[0] !== '--input' || args[2] !== '--output') throw Error('Uso: node scripts/prepare-flow-migration.mjs --input exportacao.json --output migracao-revisar.json');
  const result = prepareFlowMigration(JSON.parse(fs.readFileSync(args[1], 'utf8')));
  fs.writeFileSync(args[3], JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  console.log(`Preparação local: ${Object.keys(result.updates).length} campos; ${result.blocked.length} registros exigem revisão. Nenhum dado aplicado.`);
  if (result.blocked.length) process.exitCode = 1;
}
