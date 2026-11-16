import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planQuote, validateSignup, exampleSeries, exampleOperations } from '../../src/domain/public-signup.js';
import { createPublicIntro } from '../../src/core/public-intro.js';
import { createSignupDraftStore } from '../../src/core/signup-draft-store.js';

const company = { name: 'Metal Teste', cnpj: '12345678000195', city: 'São Paulo', state: 'SP', contact: 'teste@example.com', roles: ['buyer'] };
test('public offer shows annual total and safe defaults', () => {
  assert.deepEqual(planQuote('integrado', 'anual'), { monthly: 159, total: 1908, period: 'anual' });
  assert.deepEqual(planQuote('unknown', 'bad'), { monthly: 199, total: 199, period: 'mensal' });
  assert.equal(exampleSeries('90').total, exampleSeries('90').values.reduce((a,b) => a+b, 0));
});
test('the company step accepts just a name and activity', () => {
  assert.deepEqual(validateSignup(company, 1), {});
  assert.ok(validateSignup({ ...company, roles: [] }, 1).roles);
  assert.deepEqual(validateSignup({ name: 'Metal Teste', roles: ['buyer'] }, 1), {});
  assert.ok(validateSignup({ ...company, state: 'XX' }, 1).state);
});
const memory = () => { const data = new Map(); return { setItem: (k,v) => data.set(k,v), getItem:k=>data.get(k)??null, removeItem:k=>data.delete(k), data }; };
test('draft whitelist excludes secrets and recovers only matching identity', () => {
  const storage = memory(); let now = 1000;
  const store = createSignupDraftStore({ storage, now: () => now, idFactory: () => 'draft-a' });
  const id = store.stage({ email: ' USER@Example.com ', organization: company, plan: 'compras', period: 'mensal', password: 'secret', card: '4242424242424242' });
  store.bind(id, { uid: 'u1', email: 'user@example.com' });
  assert.equal(store.read({ uid: 'u2', email: 'other@example.com' }), null);
  assert.equal(store.read({ uid: 'u2', email: 'user@example.com' }), null);
  const draft = store.read({ uid:'u1', email: 'USER@example.com' });
  assert.equal(draft.organization.name, company.name);
  assert.equal(store.ensureAttempt(id, {uid:'u1',email:'user@example.com'}), 'signup-draft-a');
  assert.equal(store.ensureAttempt(id, {uid:'u1',email:'user@example.com'}), 'signup-draft-a');
  const serialized = [...storage.data.values()].join('');
  assert.equal(serialized.includes('secret'), false);
  assert.equal(serialized.includes('4242424242424242'), false);
  now += 7*24*60*60*1000+1;
  assert.equal(store.read({uid:'u1',email:'user@example.com'}), null);
});
test('draft tolerates unavailable storage and binds an unbound draft by actual email', () => {
  const store = createSignupDraftStore({ storage:{getItem(){throw Error();},setItem(){throw Error();}}, idFactory:()=> 'x' });
  store.stage({ email:'a@example.com', organization:company });
  assert.equal(store.persistent, false);
  assert.equal(store.read({uid:'wrong',email:'b@example.com'}), null);
  assert.equal(store.read({uid:'a',email:'a@example.com'}).uid,'a');
});
test('separate public bundle and app instances see current drafts and removal', () => {
 const storage=memory();const app=createSignupDraftStore({storage});const form=createSignupDraftStore({storage,idFactory:()=> 'new'});
 form.stage({email:'a@example.com',organization:company});const user={uid:'a',email:'a@example.com'};
 const draft=app.read(user);assert.equal(draft.organization.name,company.name);
 app.remove(draft.id,user);assert.equal(form.read(user),null);
});
test('company attempt is derived from draft identity even with stale tab snapshots',()=>{
 const serialized=JSON.stringify([{id:'shared',email:'a@example.com',organization:company,expiresAt:Date.now()+100000}]);
 const storage={getItem:()=>serialized,setItem(){}};
 const a=createSignupDraftStore({storage,idFactory:()=> 'tab-a'}),b=createSignupDraftStore({storage,idFactory:()=> 'tab-b'}),user={uid:'u',email:'a@example.com'};
 assert.equal(a.ensureAttempt('shared',user),'signup-shared');assert.equal(b.ensureAttempt('shared',user),'signup-shared');
});
test('public intro persists first visit and has an in-memory fallback',()=>{
 const storage=memory();assert.equal(createPublicIntro({storage}).consume(),true);
 assert.equal(createPublicIntro({storage}).consume(),false);
 assert.equal(storage.getItem('sivi.public-intro.v1'),'seen');
 const blocked=createPublicIntro({storage:{getItem(){throw Error();}}});assert.equal(blocked.consume(),true);assert.equal(blocked.consume(),false);
});
test('example operation totals reconcile by period and business role',()=>{
 for(const role of ['buyer','supplier'])for(const period of ['30','60','90']){
  const data=exampleOperations(period,role);
  assert.equal(data.orders.length,data.stages.reduce((n,s)=>n+s.count,0));
  assert.equal(data.quotes.length,3);assert.ok(data.quotes.every(q=>q.amount>0));
 }
 assert.notDeepEqual(exampleSeries('90','buyer'),exampleSeries('90','supplier'));
});
