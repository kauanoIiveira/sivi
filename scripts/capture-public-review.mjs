import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const output='exports/revisao-visual/publico';await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:process.env.SIVI_BROWSER_CHANNEL??'msedge',headless:true});
const results=[];
try {
 for(const [width,height] of [[1440,900],[1265,712],[768,1024],[390,844],[360,800],[1920,1080],[2560,1440]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});const page=await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/?authEmulator=1#/');await page.locator('#public-title').waitFor();await page.evaluate(()=>document.fonts.ready);
  for(const photo of await page.locator('img[loading=lazy]').all()){await photo.scrollIntoViewIfNeeded();await photo.evaluate(image=>image.decode());}
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${output}/home-${width}.png`});await page.screenshot({path:`${output}/home-full-${width}.png`,fullPage:true});
  for(const [name,selector] of [['demo','.sv-demo'],['pricing','.sv-pricing'],['footer','.sv-footer']]) if([1440,390,360].includes(width))await page.locator(selector).screenshot({path:`${output}/${name}-${width}.png`});
  results.push({surface:'home',width,height,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors});
  if([1440,390,360].includes(width)){
   await page.goto('http://127.0.0.1:4173/?authEmulator=1#/acesso?modo=register&plano=integrado&periodo=anual');await page.locator('#first-name').waitFor();
   await page.screenshot({path:`${output}/signup-${width}.png`,fullPage:true});
   await page.getByRole('button',{name:'Continuar para empresa'}).click();await page.screenshot({path:`${output}/signup-error-${width}.png`,fullPage:true});
   await page.locator('#first-name').fill('Responsável');await page.locator('#last-name').fill('Exemplo');await page.locator('#register-email').fill('responsavel@example.com');await page.locator('#register-password').fill('Exemplo2026');await page.locator('#confirm-password').fill('Exemplo2026');await page.getByRole('button',{name:'Continuar para empresa'}).click();
   await page.getByLabel('Nome da empresa',{exact:true}).fill('Metalúrgica Exemplo');
   await page.screenshot({path:`${output}/company-${width}.png`,fullPage:true});results.push({surface:'company',width,height,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors});
   await page.goto('http://127.0.0.1:4173/?authEmulator=1#/acesso?modo=login');await page.locator('#login-email').waitFor();await page.screenshot({path:`${output}/login-${width}.png`,fullPage:true});
   await page.goto('http://127.0.0.1:4173/?authEmulator=1#/?pagina=privacidade');await page.locator('#public-title').waitFor();await page.screenshot({path:`${output}/privacy-${width}.png`,fullPage:true});
  }
  await context.close();
 }
 await writeFile(`${output}/capture-results.json`,JSON.stringify(results,null,2));
 console.log(JSON.stringify(results));
}finally{await browser.close();}
