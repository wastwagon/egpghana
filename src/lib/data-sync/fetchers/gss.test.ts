import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseGssHeadlineInflation, parseGssHomepageGdpQuarterly } from './gss';

describe('parseGssHeadlineInflation', () => {
    it('parses “stands at … in Month Year” copy', () => {
        const parsed = parseGssHeadlineInflation(
            'Inflation rate stands at 5.2 in September 2026. Download bulletin.',
        );
        assert.ok(parsed);
        assert.equal(parsed.value, 5.2);
        assert.equal(parsed.month, 'September');
        assert.equal(parsed.year, 2026);
        assert.equal(parsed.asOfDate.toISOString().slice(0, 10), '2026-09-30');
    });

    it('returns null when headline is missing', () => {
        assert.equal(parseGssHeadlineInflation('No CPI data here'), null);
    });
});

describe('parseGssHomepageGdpQuarterly', () => {
    it('parses Growth by Production quarterly card', () => {
        const html = `
          <p>Growth by Production</p>
          <p class="truncate text-[10px] font-semibold text-slate-500">Quarterly</p>
          <p class="mt-0.5 text-lg font-extrabold leading-tight text-slate-900">6.0%</p>
          <p class="truncate text-[9px] text-slate-400">2026 Q2</p>
        `;
        const parsed = parseGssHomepageGdpQuarterly(html);
        assert.ok(parsed);
        assert.equal(parsed.value, 6);
        assert.equal(parsed.quarterLabel, '2026 Q2');
        assert.equal(parsed.asOfDate.toISOString().slice(0, 10), '2026-06-30');
    });
});
