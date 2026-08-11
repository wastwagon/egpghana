/**
 * Quick local test of MoF PDF parser.
 * Usage: npx tsx scripts/test-mof-parse.ts [path-or-url]
 */
import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import { parseMofDebtBulletin } from '../src/lib/data-sync/fetchers/mof-parse';
import { fetchBuffer } from '../src/lib/data-sync/http';

async function main() {
    const input = process.argv[2] || '/tmp/egp-mof/q4.pdf';
    let buffer: Buffer;
    if (input.startsWith('http')) {
        buffer = await fetchBuffer(input, { Accept: 'application/pdf' });
    } else {
        buffer = fs.readFileSync(input);
    }

    const parser = new PDFParse({ data: buffer });
    const { text } = await parser.getText();
    const extract = parseMofDebtBulletin(text);
    console.log(JSON.stringify(extract, null, 2));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
