import { testWithDefaults } from '@haibun/core/build/lib/test/lib.js';

import A11yAxe from './a11y-axe-stepper.js';

describe('a11y test', () => {
  it.only('passes', async () => {
    const feature = { path: '/features/test.feature', content: `page at https://www.example.com is accessible` };
    const result = await testWithDefaults([feature], [A11yAxe]);
    expect(result.ok).toBe(true);
  });
  it('fails', async () => {
    const feature = { path: '/features/test.feature', content: `your test phrase fails` };
    const result = await testWithDefaults([feature], [A11yAxe]);
    expect(result.ok).toBe(false);
  });
});
