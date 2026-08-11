/**
 * Test Mid-Year Fiscal Policy Review parser.
 * Usage: npx tsx scripts/test-midyear-parse.ts [path-or-url]
 */
import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import { parseMidYearDebt, discoverMidYearPdfUrl } from '../src/lib/data-sync/fetchers/mof-midyear';
import { fetchBuffer } from '../src/lib/data-sync/http';

async function main() {
    const input = process.argv[2];
    let buffer: Buffer;
    let url = input;
    if (!input) {
        url = (await discoverMidYearPdfUrl()) || '';
        if (!url) throw new Error('No Mid-Year PDF discovered');
        console.log('Discovered:', url);
        buffer = await fetchBuffer(url, { Accept: 'application/pdf' });
    } else if (input.startsWith('http')) {
        buffer = await fetchBuffer(input, { Accept: 'application/pdf' });
    } else {
        buffer = fs.readFileSync(input);
        url = input;
    }

    const parser = new PDFParse({ data: buffer });
    const { text } = await parser.getText();
    const parsed = parseMidYearDebt(text, url || 'local');
    console.log(JSON.stringify({
        year: parsed.year,
        warnings: parsed.warnings,
        observations: parsed.observations.map((o) => ({
            indicator: o.indicator,
            value: o.value,
            source: o.source,
            asOf: o.asOfDate.toISOString().slice(0, 10),
            mode: o.mode,
        })),
    }, null, 2));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
