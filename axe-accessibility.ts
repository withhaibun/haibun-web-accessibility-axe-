import {chromium, Browser, Page} from "playwright"; // imports
import {test} from '@playwright/test'
import {injectAxe, checkA11y} from 'axe-playwright'

let browser: Browser; // browser instance 
let page: Page; // page instance 

test.describe('Axe and Playwright accessibility test',()=> {
    test.beforeAll(async ()=> {
        browser = await chromium.launch(); 
        page = await browser.newPage();
        await page.goto("http://localhost:8080/passes.html");
        await injectAxe(page);
    });

    test ('Complete Accessibility Check',async ()=> {
        await checkA11y(page);
    });
});
