import { testWithDefaults } from '@haibun/core/build/lib/test/lib.js';

import A11yAxe from './a11y-axe-stepper.js';

describe('a11y test', () => {
  it('passes', async () => {
    const feature = { path: '/features/test.feature', content: `page at https://www.example.com is accessible accepting serious 1 and moderate 2` };
    const result = await testWithDefaults([feature], [A11yAxe]);
    expect(result.ok).toBe(true);
  });
  it('passes', async () => {
    const feature = { path: '/features/test.feature', content: `page at https://www.example.com is accessible accepting serious 0 and moderate 0` };
    const result = await testWithDefaults([feature], [A11yAxe]);
    expect(result.ok).toBe(false);
  });
});
