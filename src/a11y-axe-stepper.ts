import { AStepper, TWorld, TNamed, IHasOptions, OK } from '@haibun/core/build/lib/defs.js';
import { actionNotOK, actionOK, findStepper, findStepperFromOption, stringOrError } from '@haibun/core/build/lib/util/index.js';
import { chromium, Page } from 'playwright';
import { evalSeverity, getAxeBrowserResult } from './lib/a11y-axe.js';
import { generateHTMLAxeReportFromStepReport, generateHTMLAxeReportFromBrowserResult } from './lib/report.js';
import { AStorage } from '@haibun/domain-storage/build/AStorage.js';
import { EMediaTypes } from '@haibun/domain-storage/build/domain-storage.js';

type TGetsPage = { getPage: () => Promise<Page> };

class A11yStepper extends AStepper implements IHasOptions {
  static STORAGE = 'STORAGE';
  options = {
    [A11yStepper.STORAGE]: {
      desc: 'Storage for results',
      parse: (input: string) => stringOrError(input),
    },
  };
  pageGetter?: TGetsPage;
  steppers: AStepper[] = [];
  async setWorld(world: TWorld, steppers: AStepper[]) {
    await super.setWorld(world, steppers);
    this.pageGetter = findStepper<TGetsPage>(steppers, 'WebPlaywright');
    this.steppers = steppers;
  }

  steps = {
    checkA11yRuntime: {
      gwta: `page is accessible accepting serious {serious} and moderate {moderate}`,
      action: async ({ serious, moderate }: TNamed) => {
        const page = await this.pageGetter?.getPage();
        if (!page) {
          return actionNotOK(`no page in runtime`)
        }

        return await this.checkA11y(page, serious!, moderate!);

      }
    },
    checkA11yWithUri: {
      //             page at http://localhost:8123/static/passes.html is accessible accepting serious 0 and moderate 2
      gwta: `page at {uri} is accessible accepting serious {serious} and moderate {moderate}`,
      action: async ({ uri, serious, moderate }: TNamed) => {
        const browser = await chromium.launch();
        const page: Page = await browser.newPage();
        await page.goto(uri!);

        const result = await this.checkA11y(page, serious!, moderate!);

        // page.close();
        // browser.close();
        return result;
      }
    },
    generateHTMLRereport: {
      gwta: `generate HTML report from {source} to {dest}`,
      action: async ({ source, dest }: TNamed) => {
        const storage = findStepperFromOption<AStorage>(this.steppers, this, this.getWorld().extraOptions, A11yStepper.STORAGE);
        const json = JSON.parse(storage.readFile(source!));
        const report = generateHTMLAxeReportFromStepReport(json);
        storage.writeFile(dest!, report, EMediaTypes.html);
        return OK;
      }
    }
  }
  async checkA11y(page: Page, serious: string, moderate: string) {
    try {
      const axeReport = await getAxeBrowserResult(page);
      const evaluation = evalSeverity(axeReport, { serious: parseInt(serious!) || 0, moderate: parseInt(moderate!) || 0 });
      if (evaluation.ok) {
        return actionOK({ axeSuccess: { summary: 'conditions', details: { axeReport, res: evaluation } } });
      }
      const message = `not acceptable`;
      const html = generateHTMLAxeReportFromBrowserResult(axeReport);
      return actionNotOK(message, { topics: { axeFailure: { summary: message, details: { axeReport, res: evaluation } } } });
    } catch (e) {
      const { message } = { message: 'test' };
      return actionNotOK(message, { topics: { exception: { summary: message, details: e } } });
    }
  }
}

export default A11yStepper;
