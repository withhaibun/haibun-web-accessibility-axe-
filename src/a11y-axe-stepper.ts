import { AStepper, TWorld, TNamed, OK } from '@haibun/core/build/lib/defs.js';
import { actionNotOK } from '@haibun/core/build/lib/util/index.js';
import { chromium, Page } from 'playwright';
import { evalSeverity, getReport } from './lib/a11y-axe.js';

class a11yStepper extends AStepper {
  setWorld(world: TWorld, steppers: AStepper[]) {
    super.setWorld(world, steppers);
  }

  steps = {
    checkA11y: {
      gwta: `page at {uri} is accessible accepting serious {serious} and moderate {moderate}`,
      action: async ({ uri, serious, moderate }: TNamed) => {
        const browser = await chromium.launch({ headless: false });
        const page: Page = await browser.newPage();
        await page.goto(uri!);

        try {
          const report = await getReport(uri!, page);
          if (evalSeverity(report, { serious: parseInt(serious!) || 0, moderate: parseInt(moderate!) || 0 })) {
            return OK;
          }
          const message = `did not pass severity test`;
          return actionNotOK(message, { topics: { sarif: { summary: message, details: report } } });
        } catch (e) {
          const { message } = { message: 'test' };
          return actionNotOK(message, { topics: { sarif: { summary: message, details: e } } });
        } finally {
          page.close();
          browser.close();
        }

      }
    },
  }
}

export default a11yStepper;
