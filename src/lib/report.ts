import { TRunResult } from "@haibun/core/build/lib/defs.js";
import { AStorage } from "@haibun/domain-storage/build/AStorage.js";
import { EMediaTypes } from "@haibun/domain-storage/build/domain-storage.js";
import { createHtmlReport } from "axe-html-reporter";

export function generateAxeReport(source: string, dest: string, storage: AStorage) {
    const json = storage.readFile(source);
    const failuresJson = JSON.parse(json);
    const runResults: TRunResult[] = failuresJson.results;
    const reports = runResults.reduce((a, r) => {
        return a;
    }, []);
    console.log('aa', reports)
    const axeReport = failuresJson.resulaxeReport;
    const report = createHtmlReport({
        results: axeReport,
        options: {
            doNotCreateReportFile: true
        },
    });
    storage.writeFile(dest, report, EMediaTypes.html);
}