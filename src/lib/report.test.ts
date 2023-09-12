import { readFileSync } from 'fs';
import { generateAxeReport } from './report.js';

describe('generate report', () => {
    test('generate report from failures', () => {
        const source = JSON.parse(readFileSync('./test/failures.json', 'utf-8'));
        const reports = generateAxeReport(source)
        expect(reports).toBeDefined();
        expect(reports.length).toBe(2);
    });
})
