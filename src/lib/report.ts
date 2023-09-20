import { TStepResult } from "@haibun/core/build/lib/defs.js";
import { createHtmlReport } from "axe-html-reporter";

type TFailureResult = {
    results: {
        stepResults: TStepResult[]
    }[]
}

export function generateHTMLAxeReportFromStepReport(json: TFailureResult) {
    const { results: runResults } = json;
    const reports: any = [];
    for (const result of runResults) {
        for (const stepResult of result.stepResults) {
            for (const actionResult of stepResult.actionResults) {
                const { axeFailure } = <any>actionResult.topics;
                if (axeFailure) {
                    reports.push(createHtmlReport({
                        results: axeFailure.details.axeReport,
                        options: {
                            doNotCreateReportFile: true
                        },
                    }));
                }
            }
        }
    }
    return reports;
}

export function generateHTMLAxeReportFromBrowserResult(axeReport: object) {
    return createHtmlReport({
        results: axeReport,
        options: {
            doNotCreateReportFile: true
        },
    });
}
