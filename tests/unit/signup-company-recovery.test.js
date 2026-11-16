import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createFirebaseWorkspaceService } from '../../src/services/firebase-workspace-service.js';
const user={uid:'owner',emailVerified:true};
const input={name:'Empresa Teste',roles:['buyer'],cnpj:'12345678000195',city:'São Paulo',state:'SP',contact:'teste@example.com',onboardingVersion:1};
test('stable signup attempt reconciles a lost successful write and refuses changed payload',async()=>{
 const records=new Map();let writes=0;
 const client={read:async path=>records.get(path)??null,newKey:()=>`random-${writes}`,timestamp:()=>1,patch:async changes=>{writes++;Object.entries(changes).forEach(([k,v])=>records.set(k,v));if(writes===1)throw Error('response lost');}};
 const service=createFirebaseWorkspaceService({client,getUser:()=>user});
 await assert.rejects(service.createOrganization(input,{organizationId:'signup-stable'}));
 const result=await service.createOrganization(input,{organizationId:'signup-stable'});
 assert.equal(result.organizationId,'signup-stable');assert.equal(writes,1);
 await assert.rejects(service.createOrganization({...input,city:'Outra cidade'},{organizationId:'signup-stable'}),/diferentes/);
 await assert.rejects(service.createOrganization(input,{organizationId:'bad/id'}),/identificador/);
 assert.equal(writes,1);
});
