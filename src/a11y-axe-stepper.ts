import { AStepper, TWorld, TNamed } from '@haibun/core/build/lib/defs.js';
import { actionNotOK, actionOK, findStepper } from '@haibun/core/build/lib/util/index.js';
import { chromium, Page } from 'playwright';
import { evalSeverity, getReport } from './lib/a11y-axe.js';

type TGetsPage = { getPage: () => Promise<Page> };
class A11yStepper extends AStepper {
  pageGetter?: TGetsPage;
  setWorld(world: TWorld, steppers: AStepper[]) {
    super.setWorld(world, steppers);
    this.pageGetter = findStepper<TGetsPage>(steppers, 'WebPlaywright');
  }

  steps = {
    checkA11yRuntime: {
      gwta: `page is accessible accepting serious {serious} and moderate {moderate}`,
      action: async ({ serious, moderate }: TNamed) => {
        const page = await this.pageGetter?.getPage();
        if (!page) {
          return actionNotOK(`no page in runtime`)
        }

        try {
          const axeReport = await getReport(page);
          const evaluation = evalSeverity(axeReport, { serious: parseInt(serious!) || 0, moderate: parseInt(moderate!) || 0 });
          if (evaluation.ok) {
            return actionOK({ axeSuccess: { summary: 'conditions', details: { axeReport, res: evaluation } } });
          }
          const message = `not acceptable`;
          return actionNotOK(message, { topics: { axeFailure: { summary: message, details: { axeReport, res: evaluation } } } });
        } catch (e) {
          const { message } = { message: 'test' };
          return actionNotOK(message, { topics: { exception: { summary: message, details: e } } });
        }
      }
    },
    checkA11yWithUri: {
      gwta: `page at {uri} is accessible accepting serious {serious} and moderate {moderate}`,
      action: async ({ uri, serious, moderate }: TNamed) => {
        const browser = await chromium.launch();
        const page: Page = await browser.newPage();
        await page.goto(uri!);

        try {
          const axeReport = await getReport(page);
          const evaluation = evalSeverity(axeReport, { serious: parseInt(serious!) || 0, moderate: parseInt(moderate!) || 0 });
          if (evaluation.ok) {
            return actionOK({ axeSuccess: { summary: 'acceptable', details: { axeReport, res: evaluation } } });
          }
          const message = `not acceptable: ${axeReport}`;
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
