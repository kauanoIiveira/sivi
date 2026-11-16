import { expect, test } from '@playwright/test';
import { resetAuthEmulator, resetDatabaseEmulator } from '../helpers/auth-emulator.js';

test('demonstration changes business role and reduced motion leaves manual video control',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/?authEmulator=1#/');
 await expect(page.locator('.sv-hero video')).toHaveJSProperty('paused',true);
 await page.getByRole('button',{name:'Reproduzir vídeo de fundo'}).click();
 await expect(page.locator('.sv-hero video')).toHaveJSProperty('paused',false);
 const demo=page.locator('[data-ui=industrial-demo]');
 await demo.getByRole('button',{name:'Fornecedor',exact:true}).click();
 await expect(demo.getByRole('heading',{name:'Propostas enviadas por semana'})).toBeVisible();
 await expect(demo.getByRole('heading',{name:'Pedidos por etapa',exact:true})).toBeVisible();
 await expect(demo.getByRole('heading',{name:'Versões da proposta',exact:true})).toBeVisible();
 await demo.getByRole('button',{name:'Comprador',exact:true}).click();
 await expect(demo.getByRole('heading',{name:'Condições em comparação',exact:true})).toBeVisible();
});

test('public offer has real destinations, transparent pricing and usable mobile navigation', async ({page}) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/?authEmulator=1#/');
  await expect(page.getByRole('heading',{name:'O próximo acordo começa aqui.'})).toBeVisible();
  await page.getByRole('button',{name:'Anual',exact:true}).click();
  await expect(page.locator('[data-plan=integrado]')).toContainText('1.908');
  await page.locator('[data-plan=integrado]').getByRole('link').click();
  await expect(page).toHaveURL(/plano=integrado&periodo=anual/);
  await expect(page.getByText('Preencha seus dados para criar um acesso acadêmico.', {exact:true})).toBeVisible();
  await page.goto('/?authEmulator=1#/?pagina=privacidade');
  await expect(page.getByRole('heading',{name:'Seus dados, com clareza.'})).toBeVisible();
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Abrir menu'}).click();
  await page.getByRole('navigation',{name:'Navegação principal'}).getByRole('link',{name:'Planos',exact:true}).click();
  await expect(page.locator('#planos')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('academic signup uses only the account, company name and activity', async ({page,request}) => {
  test.setTimeout(90000); await resetAuthEmulator(); await resetDatabaseEmulator();
  await page.goto('/?authEmulator=1#/acesso?modo=register&plano=integrado&periodo=anual');
  await page.locator('#first-name').fill('Conta'); await page.locator('#last-name').fill('Teste');
  await page.locator('#register-email').fill('public-signup@sivi.test');
  await page.locator('#register-password').fill('SiviTeste2026'); await page.locator('#confirm-password').fill('SiviTeste2026');
  await page.getByRole('button',{name:'Continuar para empresa'}).click();
  await page.getByLabel('Nome da empresa',{exact:true}).fill('Empresa Visual Teste');
  await expect(page.getByLabel('CNPJ',{exact:true})).not.toHaveAttribute('required');
  await expect(page.locator('#test-card')).toHaveCount(0);
  const before=await request.get('http://127.0.0.1:9099/emulator/v1/projects/sivi-org/accounts');
  expect((await before.json()).users??[]).toHaveLength(0);
  await page.getByRole('button',{name:'Criar conta',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Sua conta foi criada.'})).toBeVisible();
  const stored=await page.evaluate(()=>localStorage.getItem('sivi.signup-drafts.v1'));
  expect(stored).toContain('Empresa Visual Teste'); expect(stored).not.toContain('4242'); expect(stored).not.toContain('SiviTeste2026');
  const codes=await (await request.get('http://127.0.0.1:9099/emulator/v1/projects/sivi-org/oobCodes')).json();
  const code=codes.oobCodes.find(c=>c.email==='public-signup@sivi.test'&&c.requestType==='VERIFY_EMAIL');
  const verified=await request.post('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:update?key=demo-key',{data:{oobCode:code.oobCode}});
  expect(verified.ok()).toBe(true);
  await page.getByRole('link',{name:'Ir para entrar'}).click();
  await page.locator('#login-email').fill('public-signup@sivi.test');await page.locator('#login-password').fill('SiviTeste2026');
  await page.locator('#login-form button[type=submit]').click();
  await expect(page.locator('[data-review]')).toContainText('Empresa Visual Teste');
  await expect(page.locator('[data-review]')).toContainText('Compradora e Fornecedora');
  await page.getByRole('button',{name:'Solicitar acesso',exact:true}).click();
  await expect(page.locator('.context-company')).toContainText('Em análise');
  await expect(page.locator('.context-company')).toHaveCount(1);
  const remaining=await page.evaluate(()=>JSON.parse(localStorage.getItem('sivi.signup-drafts.v1')));
  expect(remaining).toEqual([]);
});

test('a profile warning after account creation still reports success and never retries signup',async({page})=>{
 await resetAuthEmulator();await resetDatabaseEmulator();let signups=0;
 page.on('request',request=>{if(request.url().includes('accounts:signUp'))signups++;expect(request.postData()??'').not.toContain('4242 4242 4242 4242');});
 await page.route('**/accounts:update?*',async route=>{
  const body=route.request().postDataJSON();
  if(body?.displayName)await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:{message:'UNAVAILABLE'}})});
  else await route.continue();
 });
 await page.goto('/?authEmulator=1#/acesso?modo=register');
 for(const [id,value] of [['first-name','Conta'],['last-name','Parcial'],['register-email','partial-public@sivi.test'],['register-password','SiviTeste2026'],['confirm-password','SiviTeste2026']])await page.locator(`#${id}`).fill(value);
 await page.getByRole('button',{name:'Continuar para empresa'}).click();
 await page.getByLabel('Nome da empresa',{exact:true}).fill('Empresa Parcial');await page.getByLabel('CNPJ',{exact:true}).fill('12345678000195');await page.getByLabel('Cidade',{exact:true}).fill('São Paulo');await page.getByLabel('Telefone ou e-mail de contato').fill('exemplo@example.com');
 await page.getByRole('button',{name:'Criar conta',exact:true}).dblclick();
 await expect(page.getByRole('heading',{name:'Sua conta foi criada.'})).toBeVisible();await expect(page.locator('.sa-notice')).toContainText('A conta existe');expect(signups).toBe(1);
});
