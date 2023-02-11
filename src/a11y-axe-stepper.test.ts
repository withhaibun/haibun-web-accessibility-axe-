import { testWithDefaults } from '@haibun/core/build/lib/test/lib.js';
import WebPlaywright from '@haibun/web-playwright';
import DomainWebPage from '@haibun/domain-webpage';
import StorageFS from '@haibun/storage-fs/build/storage-fs.js';

import A11yAxe from './a11y-axe-stepper.js';
import { DEFAULT_DEST } from '@haibun/core/build/lib/defs.js';
import { getStepperOptionName } from '@haibun/core/build/lib/util/index.js';
import { BrowserFactory } from '@haibun/web-playwright/build/BrowserFactory.js';

import WebServerStepper from '@haibun/web-server-express';

jest.setTimeout(30000);

const PASSES_URI = 'http://localhost:8123/static/passes.html';
const FAILS_URI = 'http://localhost:8123/static/passes.html';

const options = {
  DEST: DEFAULT_DEST
};

const extraOptions = {
  [getStepperOptionName(WebPlaywright, 'STORAGE')]: 'StorageFS'
}

afterAll(async () => {
  await BrowserFactory.closeBrowsers();
});

describe('a11y test from uri', () => {
  it('passes', async () => {
    const features = [{
      path: '/features/test.feature', content: `
serve files at /static from test
On the ${PASSES_URI} webpage
page is accessible accepting serious 0 and moderate 2
`}];

    const res = await testWithDefaults(features, [A11yAxe, WebServerStepper, WebPlaywright, DomainWebPage, StorageFS], { options, extraOptions });
    expect(res.ok).toBe(true);
  });
  it('fails', async () => {
    const features = [{
      path: '/features/test.feature', content: `
serve files at /static from test
On the ${FAILS_URI} webpage
page is accessible accepting serious 0 and moderate 0
`}];

    const res = await testWithDefaults(features, [A11yAxe, WebServerStepper, WebPlaywright, DomainWebPage, StorageFS], { options, extraOptions });
    expect(res.ok).toBe(false);
  });
});


describe('a11y test from runtime', () => {
  it('passes', async () => {
    const features = [{
      path: '/features/test.feature', content: `
serve files at /static from test
page at ${PASSES_URI} is accessible accepting serious 0 and moderate 2
`}];
    const res = await testWithDefaults(features, [A11yAxe, WebServerStepper, WebPlaywright, DomainWebPage, StorageFS], { options, extraOptions });
    expect(res.ok).toBe(true);
  });
  it('fails', async () => {
    const features = [{
      path: '/features/test.feature', content: `
serve files at /static from test
page at ${FAILS_URI} is accessible accepting serious 0 and moderate 0
`}];

    const res = await testWithDefaults(features, [A11yAxe, WebServerStepper, WebPlaywright, DomainWebPage, StorageFS], { options, extraOptions });
    expect(res.ok).toBe(false);
  });
});
