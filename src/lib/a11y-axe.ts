import { chromium } from 'playwright';
import { TActionResult } from '@haibun/core/build/lib/defs.js';

const axeOptions = {
  axeOptions: {
  },
  detailedReport: true,
  detailedReportOptions: {
    html: true
  }
}

function runAxe(): Promise<any> {
  console.log('starting runAxe');
  
  const w = (window as any);
  w.log('running');
  return w.axe.run();
}

export default async function a11yAxe(uri: string): Promise<TActionResult> {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(uri); // test website, needs to be updated as required
  console.log('addScriptTag');
  
  await page.addScriptTag({ path: require.resolve('axe-core') });
  console.log('post addScriptTag');

  const result = await runAxe();
  console.log('r', result);
  // browser.close();
  return { ok: true };
}
