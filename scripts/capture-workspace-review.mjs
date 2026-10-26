import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const target = '.impeccable/review/workspace';
await mkdir(target, { recursive: true });
const browser = await chromium.launch({ channel: process.env.SIVI_BROWSER_CHANNEL || 'msedge', headless: true });
const results = [];
const cases = [
  ...[360,390,768,1265,1440,1920].map(width => ({ name:'buyer-home', role:'buyer', path:'comprador/inicio', width, height:width===1265?712:width<500?844:900 })),
  ...['supplier-home','buyer-demands','buyer-proposals','buyer-orders','buyer-suppliers','buyer-reviews','supplier-profile','admin','context'].flatMap(name => [1440,390].map(width => ({ name, width, height:width===390?844:900,
    role:name.startsWith('supplier')?'supplier':name==='admin'?'administration':'buyer',
    path:({'supplier-home':'fornecedor/inicio','buyer-demands':'comprador/demandas','buyer-proposals':'comprador/propostas','buyer-orders':'comprador/pedidos','buyer-suppliers':'comprador/fornecedores','buyer-reviews':'comprador/avaliacoes','supplier-profile':'fornecedor/perfil','admin':'administracao/inicio','context':'contexto'})[name] }))),
  {name:'buyer-empty',role:'buyer',path:'comprador/inicio',state:'empty',width:390,height:844},
  {name:'buyer-error',role:'buyer',path:'comprador/inicio',state:'error',width:390,height:844},
  ...[1440,390].map(width=>({name:'buyer-dark',role:'buyer',path:'comprador/inicio',theme:'dark',width,height:width===390?844:900})),
];
try {
  for (const entry of cases) {
    const context = await browser.newContext({ viewport:{ width:entry.width,height:entry.height },reducedMotion:'reduce',colorScheme:entry.theme??'light' });
    await context.addInitScript(theme=>localStorage.setItem('sivi.theme.v1',theme),entry.theme??'light');
    const page = await context.newPage(); const errors=[]; page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`http://127.0.0.1:4173/tests/fixtures/workspace-preview.html?role=${entry.role}&state=${entry.state??'normal'}#/app/${entry.path}`);
    await page.locator('[data-page-title]').waitFor();
    if (entry.name.includes('home') || entry.name==='buyer-dark') await page.locator('[data-workspace-insights]').waitFor();
    await page.evaluate(()=>document.fonts.ready);
    const result=await page.evaluate(()=>({ overflow:document.documentElement.scrollWidth>innerWidth, title:document.querySelector('[data-page-title]')?.textContent, theme:document.documentElement.dataset.theme }));
    await page.screenshot({ path:`${target}/${entry.name}-${entry.width}.png` });
    if (entry.name==='buyer-home' && [1440,390].includes(entry.width)) await page.screenshot({path:`${target}/${entry.name}-full-${entry.width}.png`,fullPage:true});
    results.push({...entry,...result,errors});
    await context.close();
  }
} finally { await browser.close(); }
await writeFile(`${target}/capture-results.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify({screens:results.length,overflow:results.filter(item=>item.overflow),errors:results.filter(item=>item.errors.length)},null,2));
if(results.some(item=>item.overflow||item.errors.length)) process.exitCode=1;
