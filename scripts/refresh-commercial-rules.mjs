import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

// The rules compare primitive fields. RuleDataSnapshot.val() does not perform
// deep object equality. Keep the mirrored records and append-only history
// explicit here so their constraints can be reviewed without duplicated rules.
const child = (snapshot, path) => `${snapshot}.child('${path}')`;
const value = (snapshot, path) => `${child(snapshot, path)}.val()`;
const candidateRoot = depth => 'newData' + '.parent()'.repeat(depth);
const and = (...parts) => parts.filter(Boolean).map(part => `(${part})`).join(' && ');
const active = (id, role) => and('auth != null', 'auth.token.email_verified === true', `root.child('membershipsByUser').child(auth.uid).child(${id}).child('status').val() === 'active'`, `root.child('organizations').child(${id}).child('status').val() === 'active'`, `(root.child('membershipsByUser').child(auth.uid).child(${id}).child('organizationRoles/${role}').val() === true || root.child('membershipsByUser').child(auth.uid).child(${id}).child('organizationRole').val() === '${role}')`);
const equalFields = (left, right, fields) => and(...fields.map(field => `${value(left, field)} === ${value(right, field)}`));
const integer = (snapshot, min = 0) => `${snapshot}.isNumber() && ${snapshot}.val() >= ${min} && ${snapshot}.val() <= 1000000000 && ${snapshot}.val() % 1 === 0`;
const versionFields = ['id', 'revision', 'totalCents', 'freightCents', 'leadTimeDays', 'manufacturer', 'payment', 'warranty', 'technical', 'validUntil', 'createdAt'];
const orderFields = ['id', 'demandId', 'buyerId', 'buyerName', 'supplierId', 'supplierName', 'sourceProposalId', 'title', 'description', 'quantity', 'destination', 'region', 'requiredBy', 'itemCount', 'status', 'createdAt', 'updatedAt', 'operationRevision', 'latestInspectionId', 'dispatchedAt', 'deliveredAt'];
const expiryFields = ['expiry/year','expiry/month','expiry/day','expiry/until'];
const itemFields = ['id','position','cumulativeQuantity','description','category','material','process','quantity','unit','certificationCount'];

function addConversationRules(rules) {
  const organization = id => `root.child('organizations').child(${id})`;
  const profile = id => `root.child('supplierProfiles').child(${id})`;
  const activeOrganization = id => `${value(organization(id), 'status')} === 'active'`;
  const participant = snapshot => `${active(value(snapshot, 'buyerId'), 'buyer')} || ${active(value(snapshot, 'supplierId'), 'supplier')}`;
  const closedShape = fields => ({
    ...Object.fromEntries(fields.map(field => [field, { '.validate': true }])), '$other': { '.validate': false },
  });
  const threadFields = ['buyerId', 'supplierId', 'buyerName', 'supplierName', 'createdAt', 'firstMessageId'];
  const buyer = value('newData', 'buyerId');
  const supplier = value('newData', 'supplierId');
  const sender = value('newData', 'senderRole');
  const existing = "root.child('chatThreads').child($threadId)";
  const next = `${candidateRoot(3)}.child('chatThreads').child($threadId)`;
  const first = `${candidateRoot(2)}.child('chatMessages').child($threadId).child(${value('newData', 'firstMessageId')})`;
  const source = collection => `root.child('${collection}').child(${supplier}).child(${value('newData', 'reference/id')})`;
  const related = (collection, kind) => and(`${value('newData','reference/kind')} === '${kind}'`,
    `${value(source(collection),'buyerId')} === ${buyer}`, `${value(source(collection),'supplierId')} === ${supplier}`,
    `${value(source(collection),'buyerName')} === ${value('newData','buyerName')}`);
  const buyerOrigin = and(active(buyer, 'buyer'), "!newData.child('reference').exists()",
    `${value(organization(supplier), 'roles/supplier')} === true`, `${value(profile(supplier), 'organizationStatus')} === 'active'`,
    `${value('newData', 'buyerName')} === ${value(organization(buyer), 'name')}`,
    `${value('newData', 'supplierName')} === ${value(profile(supplier), 'organizationName')}`);
  const supplierOrigin = and(active(supplier, 'supplier'), "newData.child('reference/id').isString()",
    `(${related('ordersBySupplier','pedido')}) || (${related('proposalsBySupplier','proposta')})`,
    `${value('newData', 'supplierName')} === ${value(organization(supplier), 'name')}`);
  const latestId = value('newData','id');
  const latestMessage = `${candidateRoot(3)}.child('chatMessages').child($threadId).child(${latestId})`;
  const optedRole = (snapshot, actor) => `(${actor} === 'buyer' && ${active(value(snapshot,'buyerId'),'buyer')}) || (${actor} === 'supplier' && ${active(value(snapshot,'supplierId'),'supplier')})`;

  rules.chatThreads = {
    '.indexOn': ['buyerId', 'supplierId'],
    '.read': and('query.equalTo != null', `(query.orderByChild === 'buyerId' && ${active('query.equalTo', 'buyer')}) || (query.orderByChild === 'supplierId' && ${active('query.equalTo', 'supplier')})`),
    '$threadId': {
      '.read': and('data.exists()', participant('data')),
      '.write': and('!data.exists()', 'newData.exists()', "newData.child('buyerId').isString()", "newData.child('supplierId').isString()",
        `${buyer} !== ${supplier}`, activeOrganization(buyer), activeOrganization(supplier),
        `(${buyerOrigin}) || (${supplierOrigin})`),
      '.validate': and(`newData.hasChildren(${JSON.stringify(threadFields)})`, `${buyer}.matches(/^[^:]+$/)`,
        `$threadId === ${buyer} + ':' + ${supplier}`,
        "newData.child('createdAt').isNumber() && newData.child('createdAt').val() >= 0 && newData.child('createdAt').val() <= now",
        "newData.child('firstMessageId').isString()",
        `data.exists() || ${value(first, 'senderRole')} === (newData.child('reference').exists() ? 'supplier' : 'buyer')`),
      ...closedShape(threadFields),
      reference: { '.validate': "newData.hasChildren(['id', 'kind'])", ...closedShape(['id', 'kind']) },
      lastMessage: {
        '.write': and('data.parent().exists()', 'newData.exists()', "newData.child('id').isString()",
          optedRole('data.parent()', sender),
          `!root.child('chatMessages').child($threadId).child(${latestId}).exists()`),
        '.validate': and("newData.hasChildren(['id', 'senderRole', 'sentAt'])", "newData.child('id').isString()",
          `${latestMessage}.exists()`, equalFields('newData', latestMessage, ['senderRole', 'sentAt']),
          "!data.exists() || newData.child('sentAt').val() >= data.child('sentAt').val()"),
        ...closedShape(['id', 'senderRole', 'sentAt']),
      },
    },
  };
  rules.chatMessages = {
    '$threadId': {
      '.read': and(`${existing}.exists()`, participant(existing)),
      '$messageId': {
        '.write': and('!data.exists()', 'newData.exists()', `${next}.exists()`,
          activeOrganization(value(next, 'buyerId')), activeOrganization(value(next, 'supplierId')),
          optedRole(next, sender),
          `${existing}.exists() || ${sender} === (${next}.child('reference').exists() ? 'supplier' : 'buyer')`),
        '.validate': and('$messageId.matches(/^[-0-9A-Z_a-z]{20}$/)', "newData.hasChildren(['body', 'senderRole', 'sentAt'])",
          "newData.child('body').isString() && newData.child('body').val().length > 0 && newData.child('body').val().length <= 2000",
          "newData.child('sentAt').isNumber() && newData.child('sentAt').val() >= 0 && newData.child('sentAt').val() <= now"),
        ...closedShape(['body', 'senderRole', 'sentAt']),
      },
    },
  };
}

function certificationSchema(source = null) {
  const count = "newData.child('certificationCount')";
  const last = `'' + (${count}.val() - 1)`;
  const record = {
    '.validate': `(!${count}.exists() && !newData.child('certifications').exists() && !newData.child('certificationPositions').exists()) || (${integer(count)} && (${count}.val() === 0 ? (!newData.child('certifications').exists() && !newData.child('certificationPositions').exists()) : (newData.child('certifications').child(${last}).exists() && newData.child('certificationPositions').child(${last}).exists())))`,
    certificationCount: { '.validate': integer('newData') },
    certifications: { '$certIndex': { '.validate': "newData.isString() && newData.val().length > 0 && newData.val().length <= 120 && $certIndex === '' + newData.parent().parent().child('certificationPositions').child($certIndex).val()" } },
    certificationPositions: { '$certIndex': { '.validate': `${integer('newData')} && $certIndex === '' + newData.val() && newData.val() < newData.parent().parent().child('certificationCount').val() && newData.parent().parent().child('certifications').child($certIndex).exists() && ($certIndex === '0' || newData.parent().child('' + (newData.val() - 1)).exists())` } },
  };
  if (source) {
    record['.validate'] = and(record['.validate'], equalFields('newData', source, ['certificationCount']), `!${source}.child('certifications').exists() || ${source}.child('certificationCount').exists()`);
    for (const field of ['certifications','certificationPositions']) record[field].$certIndex['.validate'] = and(record[field].$certIndex['.validate'], `newData.val() === ${source.replaceAll('newData.', 'newData.parent().parent().')}.child('${field}').child($certIndex).val()`);
  }
  return record;
}
function expiryValidation() {
  const y = value('newData', 'year'), m = value('newData','month'), d = value('newData','day');
  const leap = `((${y} % 4 === 0 && ${y} % 100 !== 0) || ${y} % 400 === 0)`;
  const floor = (n, divisor) => `((${n} - ${n} % ${divisor}) / ${divisor})`;
  const prior = `(${y} - 1)`;
  const offset = `(${m} === 1 ? 0 : ${m} === 2 ? 31 : ${m} === 3 ? 59 : ${m} === 4 ? 90 : ${m} === 5 ? 120 : ${m} === 6 ? 151 : ${m} === 7 ? 181 : ${m} === 8 ? 212 : ${m} === 9 ? 243 : ${m} === 10 ? 273 : ${m} === 11 ? 304 : 334)`;
  const days = `(365 * (${y} - 1970) + ${floor(prior,4)} - 492 - ${floor(prior,100)} + 19 + ${floor(prior,400)} - 4 + ${offset} + (${m} > 2 && ${leap} ? 1 : 0) + ${d})`;
  const maxDay = `(${m} === 2 ? (${leap} ? 29 : 28) : (${m} === 4 || ${m} === 6 || ${m} === 9 || ${m} === 11 ? 30 : 31))`;
  return and(`newData.hasChildren(['year','month','day','until'])`, `${y} >= 1970 && ${y} <= 9999 && ${y} % 1 === 0`, `${m} >= 1 && ${m} <= 12 && ${m} % 1 === 0`, `${d} >= 1 && ${d} <= ${maxDay} && ${d} % 1 === 0`, `newData.parent().child('validUntil').val() === '' + ${y} + '-' + (${m} < 10 ? '0' : '') + ${m} + '-' + (${d} < 10 ? '0' : '') + ${d}`, `newData.child('until').val() === ${days} * 86400000 + 10800000 - 1`);
}

export function buildCommercialRules(base) {
  const rules = structuredClone(base);
  addConversationRules(rules);
  const organization = rules.organizations.$organizationId;
  const verified = "auth != null && auth.token.email_verified === true";
  organization.status = { '.read': verified };
  const specificationFields = ['id','buyerId','buyerName','createdBy','title','description','quantity','itemCount','requiredBy','destination','region','status','createdAt','updatedAt','revision','publicationSourceUpdatedAt','publicationSourceRevision'];
  const specification = () => {
    const isDraft = `newData.child('status').val() === 'draft'`;
    const lastItem = `newData.child('items').child('' + (newData.child('itemCount').val() - 1))`;
    const record = { '.validate': and(`newData.hasChildren(['id','buyerId','buyerName','title','description','quantity','itemCount','items','requiredBy','destination','region','status','createdAt','updatedAt'])`, integer(child('newData','itemCount'),1), `${lastItem}.exists()`, `!newData.child('items').child('' + newData.child('itemCount').val()).exists()`, `${lastItem}.child('cumulativeQuantity').val() === newData.child('quantity').val()`), items: { '$index': {} } };
    for (const [field,max] of [['title',160],['description',2000],['destination',160],['region',160]]) record[field] = { '.validate': `newData.isString() && newData.val().length <= ${max} && (${field === 'title' ? 'false' : `newData.parent().child('status').val() === 'draft'`} || newData.val().length > 0)` };
    record.requiredBy = { '.validate': `newData.isString() && (newData.parent().child('status').val() === 'draft' && newData.val() === '' || newData.val().matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/))` };
    const item = record.items.$index;
    item['.validate'] = and(`newData.hasChildren(['id','position','cumulativeQuantity','description','category','material','process','quantity','unit'])`, `$index === '' + newData.child('position').val()`, `$index === '0' || newData.parent().child('' + (newData.child('position').val() - 1)).exists()`, `newData.child('position').val() < newData.parent().parent().child('itemCount').val()`, `newData.child('cumulativeQuantity').val() === newData.child('quantity').val() + ($index === '0' ? 0 : newData.parent().child('' + (newData.child('position').val() - 1)).child('cumulativeQuantity').val())`);
    for (const [field,max] of [['id',120],['description',500],['category',120],['material',120],['process',120],['unit',20]]) item[field] = { '.validate': `newData.isString() && newData.val().length <= ${max} && (${field === 'id' ? 'false' : `newData.parent().parent().parent().child('status').val() === 'draft'`} || newData.val().length > 0)` };
    item.position = { '.validate': integer('newData') };
    item.quantity = { '.validate': and(integer('newData'), `newData.parent().parent().parent().child('status').val() === 'draft' || newData.val() > 0`) };
    item.cumulativeQuantity = { '.validate': integer('newData') };
    const certificates = certificationSchema();
    item['.validate'] = and(item['.validate'], certificates['.validate']);
    for (const [key, rule] of Object.entries(certificates)) if (!key.startsWith('.')) item[key] = rule;
    return record;
  };
  const demands = rules.demandsByBuyer.$buyerId;
  demands['.read'] = active('$buyerId','buyer');
  const demand = demands.$demandId;
  // Keep the existing publication revision guard and draft/ordered transitions.
  const priorValidation = demand['.validate'].replace("newData.child('quantity').val() > 0", "newData.child('quantity').val() >= 0");
  demand['.write'] = and(active('$buyerId','buyer'), 'newData.exists()', "!data.exists() || data.child('status').val() === 'draft'");
  const draftSchema = specification();
  demand['.validate'] = and(priorValidation, `data.exists() && data.child('status').val() !== 'draft' || (${draftSchema['.validate']})`);
  demand['.validate'] = and(demand['.validate'], `!data.exists() ? newData.child('revision').val() === 1 : (data.child('status').val() === 'draft' && newData.child('status').val() === 'draft' ? newData.child('revision').val() === (data.child('revision').exists() ? data.child('revision').val() + 1 : 1) : newData.child('revision').val() === data.child('revision').val())`);
  for (const [key, rule] of Object.entries(draftSchema)) if (!key.startsWith('.')) demand[key] = rule;
  demand.createdBy = { '.validate': 'newData.isString() && (!data.exists() ? newData.val() === auth.uid : newData.val() === data.val())' };
  const candidateBuyerOrder = `${candidateRoot(4)}.child('ordersByBuyer').child($buyerId).child('order_' + $demandId)`;
  for (const field of ['status','updatedAt']) demand[field] = { '.write': and(active('$buyerId','buyer'), 'data.parent().exists()', "data.parent().child('status').val() === 'published'", "newData.parent().child('status').val() === 'ordered'", `${candidateBuyerOrder}.exists()`), '.validate': field === 'status' ? "newData.val() === 'draft' || newData.val() === 'published' || newData.val() === 'ordered'" : 'newData.isNumber()' };
  const published = specification();
  const buyerCandidate = `${candidateRoot(2)}.child('demandsByBuyer').child(newData.child('buyerId').val()).child($demandId)`;
  const closureFields = ['closedAt', 'closedBy', 'closedReason'];
  published['.write'] = and('!data.exists()', 'newData.exists()', active(value('newData','buyerId'),'buyer'), `root.child('demandsByBuyer').child(newData.child('buyerId').val()).child($demandId).child('status').val() === 'draft'`);
  published['.validate'] = and(`data.exists() || (${published['.validate']})`, `newData.child('id').val() === $demandId`, equalFields('newData', buyerCandidate, [...specificationFields, ...closureFields]));
  for (const field of ['status','updatedAt']) published[field] = { '.write': and(active(value('data.parent()','buyerId'),'buyer'), 'data.parent().exists()', "data.parent().child('status').val() === 'published'", "newData.parent().child('status').val() === 'ordered'"), '.validate': field === 'status' ? "newData.val() === 'published' || newData.val() === 'ordered'" : 'newData.isNumber()' };
  const validClosure = and(`newData.hasChildren(${JSON.stringify(closureFields)})`,
    "newData.child('closedBy').val() === auth.uid",
    "newData.child('closedAt').isNumber() && newData.child('closedAt').val() === newData.child('updatedAt').val() && newData.child('closedAt').val() <= now",
    "newData.child('closedReason').isString() && newData.child('closedReason').val().length >= 3 && newData.child('closedReason').val().length <= 300");
  const isClosed = "newData.child('status').val() === 'closed'";
  const publicCounterpart = `${candidateRoot(3)}.child('publishedDemands').child($demandId)`;
  demand['.validate'] = and(`(${isClosed} ? (data.child('status').val() === 'published' && ${validClosure} && ${equalFields('newData', publicCounterpart, ['status', 'updatedAt', ...closureFields])}) : (${demand['.validate']}))`);
  published['.validate'] = and(published['.validate'], `!(${isClosed}) || (data.child('status').val() === 'published' && ${validClosure})`);
  for (const [record, actor] of [[demand, active('$buyerId','buyer')], [published, active(value('data.parent()','buyerId'),'buyer')]]) {
    const closing = and(actor, "data.parent().child('status').val() === 'published'", "newData.parent().child('status').val() === 'closed'");
    for (const field of ['status', 'updatedAt', ...closureFields]) {
      const prior = record[field]?.['.write'];
      record[field] = { ...record[field], '.write': prior ? `(${prior}) || (${closing})` : closing };
    }
    record.status['.validate'] += " || newData.val() === 'closed'";
  }
  published.status['.read'] = verified;
  const publishedItem = published.items.$index;
  const itemMirror = `${candidateRoot(4)}.child('demandsByBuyer').child(newData.parent().parent().child('buyerId').val()).child($demandId).child('items').child($index)`;
  publishedItem['.validate'] = and(publishedItem['.validate'], equalFields('newData',itemMirror,['id','position','cumulativeQuantity','description','category','material','process','quantity','unit']));
  rules.publishedDemands.$demandId = published;
  rules.supplierProfiles.$supplierId['.write'] = and('auth != null', 'newData.exists()', `(${active('$supplierId','supplier')}) || root.child('platformAdmins').child(auth.uid).val() === true`);
  const invitations = rules.invitedSuppliersByBuyer.$buyerId;
  invitations['.read'] = active('$buyerId','buyer');
  invitations.$demandId.$supplierId['.write'] = and(invitations.$demandId.$supplierId['.write'], active('$buyerId','buyer'), "root.child('organizations').child($supplierId).child('status').val() === 'active'", '$supplierId !== $buyerId');
  rules.opportunitiesBySupplier.$supplierId['.read'] = active('$supplierId','supplier');
  const match = rules.matchesByDemand.$demandId.$supplierId;
  match['.write'] = and(active(value('newData','buyerId'),'buyer'), 'newData.exists()', "newData.child('buyerId').val() !== $supplierId", `${candidateRoot(3)}.child('publishedDemands').child($demandId).child('buyerId').val() === newData.child('buyerId').val()`, `${candidateRoot(3)}.child('publishedDemands').child($demandId).child('status').val() === 'published'`);
  match['.read'] = `(${active('$supplierId','supplier')}) || (${active(value('data','buyerId'),'buyer')})`;
  const opportunity = rules.opportunitiesBySupplier.$supplierId.$demandId;
  opportunity['.write'] = and(active(value('newData','buyerId'),'buyer'), 'newData.exists()', '$supplierId !== newData.child(\'buyerId\').val()');
  const publishedCandidate = `${candidateRoot(3)}.child('publishedDemands').child($demandId)`;
  opportunity['.validate'] = and("newData.child('id').val() === $demandId", "newData.child('match/supplierId').val() === $supplierId && newData.child('match/eligible').isBoolean()", `${publishedCandidate}.exists()`, equalFields('newData', publishedCandidate, specificationFields.filter(field => !['createdBy','publicationSourceUpdatedAt','publicationSourceRevision'].includes(field))));
  const opportunitySchema = specification();
  opportunity['.validate'] = and(opportunity['.validate'], opportunitySchema['.validate']);
  opportunity.items = opportunitySchema.items;
  for (const item of [publishedItem, opportunity.items.$index]) {
    const source = item === publishedItem ? itemMirror : `${candidateRoot(5)}.child('publishedDemands').child($demandId).child('items').child($index)`;
    item['.validate'] = and(item['.validate'], equalFields('newData', source, itemFields));
    const certificates = certificationSchema(source);
    item['.validate'] = and(item['.validate'], certificates['.validate']);
    for (const [key, rule] of Object.entries(certificates)) if (!key.startsWith('.')) item[key] = rule;
  }
  for (const [collection, tenant, other] of [['proposalsByBuyer', '$buyerId', 'proposalsBySupplier'], ['proposalsBySupplier', '$supplierId', 'proposalsByBuyer']]) {
    const proposal = 'newData';
    const supplierId = value(proposal, 'supplierId');
    const demandId = value(proposal, 'demandId');
    const permitted = and(active(supplierId, 'supplier'), `root.child('publishedDemands').child(${demandId}).child('status').val() === 'published'`, `root.child('publishedDemands').child(${demandId}).child('buyerId').val() === ${value(proposal, 'buyerId')}`, `root.child('organizations').child(${value(proposal, 'buyerId')}).child('status').val() === 'active'`, `root.child('opportunitiesBySupplier').child(${supplierId}).child(${demandId}).child('match/eligible').val() === true`, `${value(proposal, 'buyerId')} !== ${supplierId}`);
    const mirror = `${candidateRoot(3)}.child('${other}').child(${value(proposal, other.endsWith('Supplier') ? 'supplierId' : 'buyerId')}).child($proposalId)`;
    const record = {
      '.write': and('!data.exists()', 'newData.exists()', permitted),
      '.validate': and(`newData.hasChildren(['id','demandId','buyerId','buyerName','supplierId','supplierName','updatedAt','versions','revision','latestVersionId'])`, `${value(proposal, 'id')} === $proposalId`, `${value(proposal, collection.endsWith('Buyer') ? 'buyerId' : 'supplierId')} === ${tenant}`, integer(child(proposal, 'revision'), 1), `${value(proposal, 'versions')}` && `newData.child('versions').child(${value(proposal, 'latestVersionId')}).child('revision').val() === ${value(proposal, 'revision')}`, `!data.exists() || (!data.child('versions').child(${value(proposal, 'latestVersionId')}).exists() && (!data.child('revision').exists() || ${value(proposal, 'revision')} === data.child('revision').val() + 1))`, equalFields(proposal, mirror, ['id','demandId','buyerId','buyerName','supplierId','supplierName','updatedAt','revision','latestVersionId'])),
      versions: { '$versionId': {} },
      '$other': { '.validate': false },
    };
    record['.validate'] = and(record['.validate'], `data.exists() || (newData.child('revision').val() === 1 && $proposalId === newData.child('demandId').val() + '_' + newData.child('supplierId').val())`);
    for (const field of ['id','demandId','buyerId','buyerName','supplierId','supplierName']) record[field] = { '.validate': `newData.isString() && (!data.exists() || newData.val() === data.val())` };
    for (const field of ['updatedAt', 'revision', 'latestVersionId']) record[field] = { '.write': and('data.parent().exists()', permitted.replaceAll('newData.', 'newData.parent().')), '.validate': field === 'latestVersionId' ? 'newData.isString()' : 'newData.isNumber()' };
    const version = record.versions.$versionId;
    const parent = 'newData.parent().parent()';
    const versionMirror = `${candidateRoot(5)}.child('${other}').child(${value(parent, other.endsWith('Supplier') ? 'supplierId' : 'buyerId')}).child($proposalId).child('versions').child($versionId)`;
    version['.write'] = and('!data.exists()', 'newData.exists()', permitted.replaceAll('newData.', `${parent}.`));
    version['.validate'] = and(`newData.hasChildren(${JSON.stringify(versionFields)})`, `newData.child('id').val() === $versionId`, `${value(parent, 'latestVersionId')} === $versionId`, `${value(parent, 'revision')} === newData.child('revision').val()`, equalFields('newData', versionMirror, versionFields));
    for (const field of versionFields) version[field] = { '.validate': ['revision','totalCents','leadTimeDays'].includes(field) ? integer('newData', 1) : field === 'freightCents' ? integer('newData') : field === 'createdAt' ? 'newData.isNumber()' : `newData.isString() && newData.val().length > 0 && newData.val().length <= 2000` };
    version.$other = { '.validate': false };
    version['.validate'] = and(version['.validate'], `newData.hasChild('expiry')`, equalFields('newData', versionMirror, expiryFields));
    version.expiry = { '.validate': expiryValidation(), year: { '.validate': 'newData.isNumber()' }, month: { '.validate': 'newData.isNumber()' }, day: { '.validate': 'newData.isNumber()' }, until: { '.validate': 'newData.isNumber()' }, '$other': { '.validate': false } };
    rules[collection][tenant].$proposalId = record;
    rules[collection][tenant]['.read'] = active(tenant, collection.endsWith('Buyer') ? 'buyer' : 'supplier');
  }

  for (const [collection, tenant, other] of [['ordersByBuyer','$buyerId','ordersBySupplier'], ['ordersBySupplier','$supplierId','ordersByBuyer']]) {
    const order = 'newData';
    const source = `root.child('publishedDemands').child(${value(order, 'demandId')})`;
    const proposal = `root.child('proposalsByBuyer').child(${value(order, 'buyerId')}).child(${value(order, 'sourceProposalId')})`;
    const mirror = `${candidateRoot(3)}.child('${other}').child(${value(order, other.endsWith('Supplier') ? 'supplierId' : 'buyerId')}).child($orderId)`;
    const record = {
      '.write': and('!data.exists()', 'newData.exists()', active(value(order, 'buyerId'), 'buyer'), `root.child('organizations').child(${value(order, 'supplierId')}).child('status').val() === 'active'`, `${value(order, 'status')} === 'accepted'`, `!newData.child('evaluation').exists() && !newData.child('inspections').exists()`, `$orderId === 'order_' + ${value(order, 'demandId')}`, `${value(source, 'status')} === 'published'`, equalFields(order, source, ['demandId'].filter(() => false)), `${value(source, 'buyerId')} === ${value(order, 'buyerId')}`, equalFields(order, proposal, ['buyerId','supplierId','demandId']), `${value(proposal, 'latestVersionId')} === ${value(order, 'version/id')}`, `${value(proposal, 'versions')}` && `${proposal}.child('versions').child(${value(order, 'version/id')}).exists()`, `${candidateRoot(3)}.child('demandsByBuyer').child(${value(order,'buyerId')}).child(${value(order,'demandId')}).child('status').val() === 'ordered'`),
      '.validate': and(`newData.hasChildren(['id','demandId','buyerId','buyerName','supplierId','supplierName','sourceProposalId','title','quantity','version','status','createdAt','updatedAt'])`, `${value(order, 'id')} === $orderId`, `${value(order, collection.endsWith('Buyer') ? 'buyerId' : 'supplierId')} === ${tenant}`, equalFields(order, mirror, orderFields), `newData.child('evaluation').exists() === ${mirror}.child('evaluation').exists()`, `!data.child('operationRevision').exists() || newData.child('operationRevision').val() === data.child('operationRevision').val() + 1`),
      version: {}, items: { '$index': {} }, '$other': { '.validate': false },
    };
    record['.validate'] = and(record['.validate'], `data.exists() || newData.hasChildren(['itemCount','operationRevision'])`);
    record['.validate'] = and(record['.validate'], `data.exists() || (newData.child('operationRevision').val() === 0 && newData.child('createdAt').isNumber() && newData.child('updatedAt').isNumber())`);
    for (const field of orderFields.filter(field => !['status','updatedAt','operationRevision','latestInspectionId','dispatchedAt','deliveredAt'].includes(field))) record[field] = { '.validate': `!data.parent().exists() || newData.val() === data.val()` };
    for (const field of ['title','description','quantity','destination','region','requiredBy']) record[field]['.validate'] = and(record[field]['.validate'], `data.parent().exists() || newData.val() === root.child('publishedDemands').child(newData.parent().child('demandId').val()).child('${field}').val()`);
    const sourceVersion = `root.child('proposalsByBuyer').child(newData.parent().parent().child('buyerId').val()).child(newData.parent().parent().child('sourceProposalId').val()).child('versions').child(newData.parent().parent().child('version/id').val())`;
    for (const field of versionFields) record.version[field] = { '.validate': `data.parent().parent().exists() || newData.val() === ${sourceVersion}.child('${field}').val()` };
    record.version.$other = { '.validate': false };
    record.version.expiry = Object.fromEntries(['year','month','day','until'].map(field => [field, { '.validate': `data.parent().parent().parent().exists() || newData.val() === root.child('proposalsByBuyer').child(newData.parent().parent().parent().child('buyerId').val()).child(newData.parent().parent().parent().child('sourceProposalId').val()).child('versions').child(newData.parent().parent().parent().child('version/id').val()).child('expiry/${field}').val()` }]));
    record['.write'] = and(record['.write'], `${proposal}.child('versions').child(${value(order, 'version/id')}).child('expiry/until').isNumber()`, `${proposal}.child('versions').child(${value(order, 'version/id')}).child('expiry/until').val() >= now`);
    record.version['.validate'] = `newData.hasChildren(${JSON.stringify(versionFields)})`;
    record.version['.validate'] = and(record.version['.validate'], `data.parent().exists() || newData.hasChild('expiry')`);
    record.version.expiry['.validate'] = `data.parent().parent().exists() || newData.hasChildren(['year','month','day','until'])`;
    const itemSource = `root.child('publishedDemands').child(newData.parent().parent().child('demandId').val()).child('items').child($index)`;
    record.items.$index['.validate'] = `data.parent().parent().exists() || (newData.hasChildren(['id','description','quantity','unit']) && ${itemSource}.exists() && newData.child('position').isNumber() && $index === '' + newData.child('position').val() && ($index === '0' || newData.parent().child('' + (newData.child('position').val() - 1)).exists()))`;
    record.items.$index['.validate'] = and(record.items.$index['.validate'], `data.parent().parent().exists() || (${equalFields('newData', itemSource, itemFields.filter(field => field !== 'position'))})`);
    record.items.$index.position = { '.validate': integer('newData') };
    for (const field of ['id','description','category','material','process','quantity','unit']) record.items.$index[field] = { '.validate': `data.parent().parent().parent().exists() || newData.val() === root.child('publishedDemands').child(newData.parent().parent().parent().child('demandId').val()).child('items').child($index).child('${field}').val()` };
    record.items.$index.certifications = { '$certIndex': { '.validate': `data.parent().parent().parent().parent().exists() || newData.val() === root.child('publishedDemands').child(newData.parent().parent().parent().parent().child('demandId').val()).child('items').child($index).child('certifications').child($certIndex).val()` } };
    const certificates = certificationSchema(itemSource);
    record.items.$index['.validate'] = and(record.items.$index['.validate'], `data.parent().parent().exists() || (${certificates['.validate']})`);
    for (const [key, rule] of Object.entries(certificates)) if (!key.startsWith('.')) record.items.$index[key] = rule;
    record.items.$index.cumulativeQuantity = { '.validate': `data.parent().parent().parent().exists() || newData.val() === ${itemSource.replaceAll('newData.', 'newData.parent().')}.child('cumulativeQuantity').val()` };
    // The immutable item list defines the length of the inspection proof chain.
    record.itemCount['.validate'] = and(integer('newData'), `data.parent().exists() || (newData.val() === 0 ? !${source.replaceAll('newData.', 'newData.parent().')}.child('items').exists() : (newData.parent().child('items').child('' + (newData.val() - 1)).exists() && !${source.replaceAll('newData.', 'newData.parent().')}.child('items').child('' + newData.val()).exists()))`);
    const existingOrder = 'data.parent()';
    const nextOrder = 'newData.parent()';
    const supplier = active(value(existingOrder, 'supplierId'), 'supplier');
    const buyer = active(value(existingOrder, 'buyerId'), 'buyer');
    const inspection = `${nextOrder}.child('inspections').child(${value(nextOrder,'latestInspectionId')})`;
    const inspectionTransition = and(`(${value(existingOrder,'status')} === 'accepted' || ${value(existingOrder,'status')} === 'blocked')`, `(${value(nextOrder,'status')} === 'blocked' || ${value(nextOrder,'status')} === 'released')`, `${inspection}.exists()`, `${inspection}.child('complete').val() === (${value(nextOrder,'status')} === 'released')`);
    const dispatch = and(`${value(existingOrder,'status')} === 'released'`, `${value(nextOrder,'status')} === 'dispatched'`, `${child(nextOrder,'dispatchedAt')}.isNumber()`);
    const delivery = and(`${value(existingOrder,'status')} === 'dispatched'`, `${value(nextOrder,'status')} === 'delivered'`, `${child(nextOrder,'deliveredAt')}.isNumber()`);
    const review = and(`${value(existingOrder,'status')} === 'delivered'`, `${value(nextOrder,'status')} === 'delivered'`);
    const transition = `(${supplier} && (${inspectionTransition} || ${dispatch})) || (${buyer} && (${delivery} || ${review}))`;
    for (const field of ['status','updatedAt','operationRevision','latestInspectionId']) record[field] = { '.write': and('data.parent().exists()', 'newData.exists()', transition), '.validate': field === 'operationRevision' ? integer('newData') : field === 'status' || field === 'latestInspectionId' ? 'newData.isString()' : 'newData.isNumber()' };
    record.dispatchedAt = { '.write': and('data.parent().exists()', 'newData.exists()', supplier, dispatch), '.validate': 'newData.isNumber() && (!data.exists() || newData.val() === data.val())' };
    record.deliveredAt = { '.write': and('data.parent().exists()', 'newData.exists()', buyer, delivery), '.validate': 'newData.isNumber() && (!data.exists() || newData.val() === data.val())' };
    const evaluationMirror = `${candidateRoot(4)}.child('${other}').child(${value(nextOrder, other.endsWith('Supplier') ? 'supplierId' : 'buyerId')}).child($orderId).child('evaluation')`;
    record.evaluation = { '.write': and('!data.exists()', 'data.parent().exists()', 'newData.exists()', buyer, review), '.validate': and(`newData.hasChild('score')`, `newData.child('score').isNumber() && newData.child('score').val() >= 1 && newData.child('score').val() <= 5`, equalFields('newData', evaluationMirror, ['score','comment','evaluatedAt','criteria/quality','criteria/punctuality','criteria/communication','criteria/documentation'])) };
    const inspectOrder = 'newData.parent().parent()';
    const inspectMirror = `${candidateRoot(5)}.child('${other}').child(${value(inspectOrder, other.endsWith('Supplier') ? 'supplierId' : 'buyerId')}).child($orderId).child('inspections').child($inspectionId)`;
    const last = `newData.child('itemApprovals').child('' + newData.child('lastItemIndex').val())`;
    record.inspections = { '$inspectionId': {
      '.write': and('!data.exists()', 'newData.exists()', 'data.parent().parent().exists()', active(value('data.parent().parent()','supplierId'), 'supplier'), `(${value('data.parent().parent()','status')} === 'accepted' || ${value('data.parent().parent()','status')} === 'blocked')`),
      '.validate': and(`newData.hasChildren(['id','approved','plan','evidence','createdAt','complete','lastItemIndex','itemApprovals'])`, `newData.child('id').val() === $inspectionId`, integer(child('newData','approved')), integer(child('newData','lastItemIndex')), `newData.child('complete').isBoolean()`, `${last}.exists()`, `${last}.child('completeThrough').val() === newData.child('complete').val()`, `${last}.child('runningApproved').val() === newData.child('approved').val()`, `(${inspectOrder}.child('items').exists() ? (${inspectOrder}.child('items').child('' + newData.child('lastItemIndex').val()).exists() && !${inspectOrder}.child('items').child('' + (newData.child('lastItemIndex').val() + 1)).exists()) : newData.child('lastItemIndex').val() === 0)`, equalFields('newData', inspectMirror, ['id','approved','plan','evidence','createdAt','complete','lastItemIndex'])),
      itemApprovals: { '$index': {} },
    } };
    const proof = record.inspections.$inspectionId.itemApprovals.$index;
    const proofOrder = 'newData.parent().parent().parent().parent()';
    const previous = `newData.parent().child('' + (newData.child('position').val() - 1))`;
    const requiredQuantity = `(${proofOrder}.child('items').exists() ? ${proofOrder}.child('items').child($index).child('quantity').val() : ${proofOrder}.child('quantity').val())`;
    proof['.validate'] = and(`newData.hasChildren(['itemId','position','approved','runningApproved','completeThrough'])`, integer(child('newData','position')), `$index === '' + newData.child('position').val()`, integer(child('newData','approved')), `newData.child('approved').val() <= ${requiredQuantity}`, `(${proofOrder}.child('items').exists() ? newData.child('itemId').val() === ${proofOrder}.child('items').child($index).child('id').val() : ($index === '0' && newData.child('itemId').val() === 'total'))`, `$index === '0' || ${previous}.exists()`, `newData.child('runningApproved').val() === newData.child('approved').val() + ($index === '0' ? 0 : ${previous}.child('runningApproved').val())`, `newData.child('completeThrough').val() === (newData.child('approved').val() === ${requiredQuantity} && ($index === '0' || ${previous}.child('completeThrough').val() === true))`);
    const proofMirror = `${candidateRoot(7)}.child('${other}').child(${value(proofOrder, other.endsWith('Supplier') ? 'supplierId' : 'buyerId')}).child($orderId).child('inspections').child($inspectionId).child('itemApprovals').child($index)`;
    proof['.validate'] = and(proof['.validate'], equalFields('newData', proofMirror, ['itemId','position','approved','runningApproved','completeThrough']));
    record.inspections.$inspectionId.plan = { '.validate': 'newData.isString() && newData.val().length > 0 && newData.val().length <= 160' };
    record.inspections.$inspectionId.evidence = { '.validate': 'newData.isString() && newData.val().length > 0 && newData.val().length <= 2000' };
    record.inspections.$inspectionId.createdAt = { '.validate': 'newData.isNumber()' };
    record.evaluation.comment = { '.validate': 'newData.isString() && newData.val().length <= 1000' };
    record.evaluation.criteria = { '.validate': `newData.hasChildren(['quality','punctuality','communication','documentation'])` };
    record.evaluation.$other = { '.validate': false };
    record.evaluation.score = { '.validate': 'newData.isNumber() && newData.val() >= 1 && newData.val() <= 5' };
    record.evaluation.evaluatedAt = { '.validate': 'newData.isNumber()' };
    record.evaluation.criteria.$other = { '.validate': false };
    for (const key of ['quality','punctuality','communication','documentation']) record.evaluation.criteria[key] = { '.validate': and(integer('newData',1), 'newData.val() <= 5') };
    const sum = ['quality','punctuality','communication','documentation'].map(key => `newData.child('criteria/${key}').val()`).join(' + ');
    const scaled = `((${sum}) * 10 / 4 + 0.5)`;
    record.evaluation['.validate'] = and(record.evaluation['.validate'], `!newData.child('criteria').exists() || newData.child('score').val() * 10 === ${scaled} - ${scaled} % 1`);
    rules[collection][tenant].$orderId = record;
    rules[collection][tenant]['.read'] = active(tenant, collection.endsWith('Buyer') ? 'buyer' : 'supplier');
  }
  return rules;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const path = new URL('../database.rules.json', import.meta.url);
  const source = JSON.parse(fs.readFileSync(new URL('./database-rules.base.json', import.meta.url), 'utf8'));
  source.rules = buildCommercialRules(source.rules);
  fs.writeFileSync(path, JSON.stringify(source, null, 2) + '\n');
}
