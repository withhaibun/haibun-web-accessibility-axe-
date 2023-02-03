import { testWithDefaults } from '@haibun/core/build/lib/test/lib.js';
import WebPlaywright from '@haibun/web-playwright';
import DomainWebPage, { WEB_PAGE } from '@haibun/domain-webpage';
import StorageFS from '@haibun/storage-fs/build/storage-fs.js';

import A11yAxe from './a11y-axe-stepper.js';
import { DEFAULT_DEST } from '@haibun/core/build/lib/defs.js';
import { getStepperOptionName } from '@haibun/core/build/lib/util/index.js';
import { BrowserFactory } from '@haibun/web-playwright/build/BrowserFactory.js';


afterAll(async () => {
  await BrowserFactory.closeBrowsers();
});

describe('a11y test from uri', () => {
  it('passes', async () => {
    const feature = { path: '/features/test.feature', content: `page at http://localhost:8123/passes.html is accessible accepting serious 2 and moderate 2` };
    const result = await testWithDefaults([feature], [A11yAxe]);
    expect(result.ok).toBe(true);
  });
  xit('fails', async () => {
    const feature = { path: '/features/test.feature', content: `page at http://localhost:8123/passes.html is accessible accepting serious 0 and moderate 0` };
    const result = await testWithDefaults([feature], [A11yAxe]);
    expect(result.ok).toBe(false);
  });
});

describe('a11y test from runtime', () => {
  it('passes', async () => {
    const options = {
      options: { DEST: DEFAULT_DEST, },
      extraOptions: {
        [getStepperOptionName(WebPlaywright, WebPlaywright.STORAGE)]: 'StorageFS',
      }
    }
    const features = [
      { path: '/features/test.feature', content: `On the http://localhost:8123/passes.html ${WEB_PAGE}` },
      { path: '/features/test.feature', content: `page is accessible accepting serious 2 and moderate 2` }
    ];

    const result = await testWithDefaults(features, [A11yAxe, DomainWebPage, StorageFS, WebPlaywright], options);
    expect(result.ok).toBe(true);
  });
  it('fails', async () => {
    const options = {
      options: { DEST: DEFAULT_DEST, },
      extraOptions: {
        [getStepperOptionName(WebPlaywright, WebPlaywright.STORAGE)]: 'StorageFS',
      }
    }
    const features = [
      { path: '/features/test.feature', content: `On the http://localhost:8123/passes.html ${WEB_PAGE}` },
      { path: '/features/test.feature', content: `page is accessible accepting serious 0 and moderate 0` }
    ];

    const result = await testWithDefaults(features, [A11yAxe, DomainWebPage, StorageFS, WebPlaywright], options);
    expect(result.ok).toBe(false);
  });
});
