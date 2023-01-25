import { AStepper, TWorld, TNamed, OK } from '@haibun/core/build/lib/defs.js';
import { actionNotOK, findStepper } from '@haibun/core/build/lib/util/index.js';
import { chromium, Page } from 'playwright';
import { evalSeverity, getReport } from './lib/a11y-axe.js';

class A11yStepper extends AStepper {
  webPlaywright?: { getPage: () => Page };
  setWorld(world: TWorld, steppers: AStepper[]) {
    super.setWorld(world, steppers);
    try {
      this.webPlaywright = findStepper<any>(steppers, 'WebPlaywright');
    } catch (e) {
    }
  }

  steps = {
    checkA11yRuntime: {
      gwta: `page is accessible accepting serious {serious} and moderate {moderate}`,
      action: async ({ serious, moderate }: TNamed) => {
        const page = await this.webPlaywright?.getPage();
        if (!page) {
          return actionNotOK(`no page in runtime`)
        }

        try {
          const report = await getReport(page);
          const res = evalSeverity(report, { serious: parseInt(serious!) || 0, moderate: parseInt(moderate!) || 0 });
          if (res.ok) {
            return OK;
          }
          const message = `did not pass severity test`;
          return actionNotOK(message, { topics: { severity: { summary: message, details: { ...res } } } });
        } catch (e) {
          const { message } = { message: 'test' };
          return actionNotOK(message, { topics: { exception: { summary: message, details: e } } });
        }
      }
    },
    checkA11yWithUri: {
      gwta: `page at {uri} is accessible accepting serious {serious} and moderate {moderate}`,
      action: async ({ uri, serious, moderate }: TNamed) => {
        const browser = await chromium.launch({ headless: false });
        const page: Page = await browser.newPage();
        await page.goto(uri!);

        try {
          const report = await getReport(page);
          if (evalSeverity(report, { serious: parseInt(serious!) || 0, moderate: parseInt(moderate!) || 0 })) {
            return OK;
          }
          const message = `did not pass severity test`;
          return actionNotOK(message);
        } catch (e) {
          const { message } = { message: 'test' };
          return actionNotOK(message, { topics: { exception: { summary: message, details: e } } });
        } finally {
          page.close();
          browser.close();
        }
      }
    }
  }
}

export default A11yStepper;
