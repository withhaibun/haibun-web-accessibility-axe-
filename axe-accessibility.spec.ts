import {chromium, Browser, Page} from "playwright"; // imports
import {test} from '@playwright/test'
import {injectAxe, checkA11y} from 'axe-playwright'

let browser: Browser; // browser instance 
let page: Page; // page instance 

test.describe('Axe and Playwright Accessibility Test',()=> {
    test.beforeAll(async ()=> {
        browser = await chromium.launch(); 
        page = await browser.newPage();
        await page.goto("https://www.canada.ca/en.html"); // test website, needs to be updated as required
        await injectAxe(page);
    });

    test ('Complete page validation',async()=> {
        await checkA11y(page, {
            axeOptions: {

                /** Used to execute specific tags
                runOnly: {
                    type: 'tag', // return the id in readable tags
                    values: ["wcag2a","wcag2aa"] // needs of the tags
                } 
                **/

                /** Used to execute specific rules
                runOnly: {
                    type: 'rules', // return the id in readable rules
                    values: ["html-has-lang","landmark-one-main"] // needs of the rules
                } 
                **/
            },
            detailedReport: true, // enable a detailed report on issues 
            detailedReportOptions: {
                html: true
            }
        })
    });
});
