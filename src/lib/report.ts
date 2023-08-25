import { AStorage } from "@haibun/domain-storage/build/AStorage.js";
import { createHtmlReport } from "axe-html-reporter";

export function generateAxeReport(source: string, dest: string, storage: AStorage) {
    const json = storage.readFile(source);
    const failuresJson = JSON.parse(json);
    // TODO: normalize failures.json, also find a way to make sure we aren't procesing a stale result
    const axeReport = failuresJson.resulaxeReport;
    createHtmlReport({
        results: axeReport,
        options: {
            doNotCreateReportFile: true,
            projectKey: 'JIRA_PROJECT_KEY',
            outputDir: 'axe-reports',
            reportFileName: 'exampleReport.html',
        },
    });



}