import { AStepper, TWorld, TNamed, OK } from '@haibun/core/build/lib/defs.js';
import { actionNotOK } from '@haibun/core/build/lib/util/index.js';
import a11yAxe from './lib/a11y-axe.js';

class a11yStepper extends AStepper {
  setWorld(world: TWorld, steppers: AStepper[]) {
    super.setWorld(world, steppers);
  }

  steps = {
    checkA11y: {
      gwta: `page at {uri} is accessible`,
      action: async ({ uri }: TNamed) => {
        const result = await a11yAxe(<string>uri);
        if (result.ok === true) {
          return OK;
        }
        const { message } = { message: 'test' };
        return actionNotOK(message, { topics: { sarif: { summary: message, details: result } } });
      }
    },
  }
}

export default a11yStepper;
