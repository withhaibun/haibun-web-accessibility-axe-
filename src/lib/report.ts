import { AStorage } from "@haibun/domain-storage/build/AStorage.js";
import { EMediaTypes } from "@haibun/domain-storage/build/domain-storage.js";
import { createHtmlReport } from "axe-html-reporter";

export function generateAxeReport(source: string, dest: string, storage: AStorage) {
    const json = storage.readFile(source);
    const failuresJson = JSON.parse(json);
    // TODO: normalize failures.json, also find a way to make sure we aren't procesing a stale result
    const axeReport = failuresJson.resulaxeReport;
    const report = createHtmlReport({
        results: axeReport,
        options: {
            doNotCreateReportFile: true
        },
    });
    storage.writeFile(dest, report, EMediaTypes.html);
}