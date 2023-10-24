import { AStepper, TWorld, TNamed, IHasOptions, OK, TVStep } from '@haibun/core/build/lib/defs.js';
import { actionNotOK, findStepper, findStepperFromOption, stringOrError } from '@haibun/core/build/lib/util/index.js';
import { chromium, Page } from 'playwright';
import { evalSeverity, getAxeBrowserResult } from './lib/a11y-axe.js';
import { generateHTMLAxeReportFromStepReport, generateHTMLAxeReportFromBrowserResult } from './lib/report.js';
import { AStorage } from '@haibun/domain-storage/build/AStorage.js';
import { EMediaTypes } from '@haibun/domain-storage/build/domain-storage.js';
import { TArtifact, TArtifactMessageContext, TMessageContext } from '@haibun/core/build/lib/interfaces/logger.js';

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
      action: async ({ serious, moderate }: TNamed, step: TVStep) => {
        const page = await this.pageGetter?.getPage();
        if (!page) {
          return actionNotOK(`no page in runtime`);
        }
        return await this.checkA11y(page, serious!, moderate!, step.seq, 'action');
      },
    },
    checkA11yWithUri: {
      gwta: `page at {uri} is accessible accepting serious {serious} and moderate {moderate}`,
      action: async ({ uri, serious, moderate }: TNamed, step: TVStep) => {
        const browser = await chromium.launch();
        const page: Page = await browser.newPage();
        await page.goto(uri!);

        const result = await this.checkA11y(page, serious!, moderate!, step.seq, 'action');

        // page.close();
        // browser.close();
        return result;
      },
    },
    generateHTMLRereport: {
      gwta: `extract HTML report from {source} to {dest}`,
      action: async ({ source, dest }: TNamed) => {
        const storage = findStepperFromOption<AStorage>(this.steppers, this, this.getWorld().extraOptions, A11yStepper.STORAGE);
        const json = JSON.parse(storage.readFile(source!));
        const report = generateHTMLAxeReportFromStepReport(json);
        storage.writeFile(dest!, report, EMediaTypes.html);
        return OK;
      },
    },
  };
  async checkA11y(page: Page, serious: string, moderate: string, seq: number, stage: string) {
    try {
      const axeReport = await getAxeBrowserResult(page);
      const evaluation = evalSeverity(axeReport, {
        serious: parseInt(serious!) || 0,
        moderate: parseInt(moderate!) || 0,
      });
      if (evaluation.ok) {
        // TMI
        return OK;
      }
      const message = `not acceptable`;
      const html = generateHTMLAxeReportFromBrowserResult(axeReport);
      this.getWorld().logger.error(message, <TArtifactMessageContext>{ topic: { seq: seq, event: 'failure', stage }, artifact: { type: 'html', content: html, }, tag: this.getWorld().tag });
      return actionNotOK(message, {
        topics: {
          axeFailure: {
            summary: message,
            report: { html },
            details: { axeReport, res: evaluation },
          },
        },
      });
    } catch (e) {
      const { message } = { message: 'test' };
      return actionNotOK(message, {
        topics: { exception: { summary: message, details: e } },
      });
    }
  }
}

export default A11yStepper;
