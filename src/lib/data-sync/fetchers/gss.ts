import type { SourceFetchResult } from '../types';
import { fetchText } from '../http';

const GSS_INFLATION_URL = 'https://www.statsghana.gov.gh/highlights/inflation-rate';
const GSS_HOME_URL = 'https://www.statsghana.gov.gh/';

const MONTH_INDEX: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
};

function endOfMonthUtc(year: number, monthIndex: number): Date {
    return new Date(Date.UTC(year, monthIndex + 1, 0));
}

function endOfQuarterUtc(year: number, quarter: 1 | 2 | 3 | 4): Date {
    return new Date(Date.UTC(year, quarter * 3, 0));
}

function stripTags(html: string) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/** Parse headline CPI from GSS inflation highlights page. */
export function parseGssHeadlineInflation(text: string): {
    value: number;
    month: string;
    year: number;
    asOfDate: Date;
} | null {
    const compact = text.replace(/\s+/g, ' ');

    const stands = compact.match(
        /stands at\s+(\d+(?:\.\d+)?)\s+in\s+([A-Za-z]+)\s+(20\d{2})/i,
    );
    if (stands) {
        const value = Number(stands[1]);
        const monthName = stands[2].toLowerCase();
        const year = Number(stands[3]);
        const monthIndex = MONTH_INDEX[monthName];
        if (!Number.isNaN(value) && monthIndex != null) {
            return {
                value,
                month: stands[2],
                year,
                asOfDate: endOfMonthUtc(year, monthIndex),
            };
        }
    }

    const yoy = compact.match(
        /Inflation\s*\(?\s*YoY\s*\)?[^0-9]{0,40}(\d+(?:\.\d+)?)\s*%[^A-Za-z]{0,40}([A-Za-z]+)\s+(20\d{2})/i,
    );
    if (yoy) {
        const value = Number(yoy[1]);
        const monthName = yoy[2].toLowerCase();
        const year = Number(yoy[3]);
        const monthIndex = MONTH_INDEX[monthName];
        if (!Number.isNaN(value) && monthIndex != null) {
            return {
                value,
                month: yoy[2],
                year,
                asOfDate: endOfMonthUtc(year, monthIndex),
            };
        }
    }

    return null;
}

/** Real GDP YoY (production approach) — quarterly figure from GSS homepage “Ghana at a Glance”. */
export function parseGssHomepageGdpQuarterly(html: string): {
    value: number;
    quarterLabel: string;
    year: number;
    quarter: 1 | 2 | 3 | 4;
    asOfDate: Date;
} | null {
    const block = html.match(
        /Growth by Production[\s\S]{0,1200}?Quarterly<\/p>\s*<p[^>]*>(\d+(?:\.\d+)?)%<\/p>\s*<p[^>]*>(20\d{2})\s*Q([1-4])/i,
    );
    if (!block) return null;

    const value = Number(block[1]);
    const year = Number(block[2]);
    const quarter = Number(block[3]) as 1 | 2 | 3 | 4;
    if (Number.isNaN(value) || quarter < 1 || quarter > 4) return null;

    return {
        value,
        quarterLabel: `${year} Q${quarter}`,
        year,
        quarter,
        asOfDate: endOfQuarterUtc(year, quarter),
    };
}

export async function fetchGssInflation(): Promise<SourceFetchResult> {
    const warnings: string[] = [];
    try {
        const html = await fetchText(GSS_INFLATION_URL);
        const text = stripTags(html);
        const parsed = parseGssHeadlineInflation(text);

        if (!parsed) {
            return {
                sourceKey: 'gss_cpi',
                label: 'Ghana Statistical Service — CPI / inflation',
                observations: [],
                warnings: ['Could not parse headline inflation from GSS highlights page'],
            };
        }

        const note = `GSS headline CPI (YoY), reference month ${parsed.month} ${parsed.year}`;

        return {
            sourceKey: 'gss_cpi',
            label: 'Ghana Statistical Service — CPI / inflation',
            observations: [
                {
                    indicator: 'INFLATION_RATE',
                    value: parsed.value,
                    unit: '%',
                    source: 'Ghana Statistical Service',
                    asOfDate: parsed.asOfDate,
                    sourceUrl: GSS_INFLATION_URL,
                    note,
                    mode: 'auto',
                    metadata: {
                        provider: 'gss_cpi',
                        referenceMonth: `${parsed.year}-${String(MONTH_INDEX[parsed.month.toLowerCase()] + 1).padStart(2, '0')}`,
                        cpiReference: `${parsed.month} ${parsed.year}`,
                    },
                },
            ],
            warnings,
        };
    } catch (err) {
        return {
            sourceKey: 'gss_cpi',
            label: 'Ghana Statistical Service — CPI / inflation',
            observations: [],
            warnings: [err instanceof Error ? err.message : String(err)],
        };
    }
}

export async function fetchGssQgdp(): Promise<SourceFetchResult> {
    const warnings: string[] = [];
    try {
        const html = await fetchText(GSS_HOME_URL);
        const parsed = parseGssHomepageGdpQuarterly(html);

        if (!parsed) {
            return {
                sourceKey: 'gss_qgdp',
                label: 'Ghana Statistical Service — quarterly real GDP (production)',
                observations: [],
                warnings: ['Could not parse quarterly GDP growth from GSS homepage'],
            };
        }

        const note = `GSS real GDP growth (YoY, production), ${parsed.quarterLabel}`;

        return {
            sourceKey: 'gss_qgdp',
            label: 'Ghana Statistical Service — quarterly real GDP (production)',
            observations: [
                {
                    indicator: 'GDP_GROWTH',
                    value: parsed.value,
                    unit: '%',
                    source: 'Ghana Statistical Service',
                    asOfDate: parsed.asOfDate,
                    sourceUrl: GSS_HOME_URL,
                    note,
                    mode: 'auto',
                    metadata: {
                        provider: 'gss_qgdp',
                        measure: 'Real GDP growth (YoY, quarterly, production)',
                        period: `${parsed.year}Q${parsed.quarter}`,
                        quarterReference: parsed.quarterLabel,
                    },
                },
            ],
            warnings,
        };
    } catch (err) {
        return {
            sourceKey: 'gss_qgdp',
            label: 'Ghana Statistical Service — quarterly real GDP (production)',
            observations: [],
            warnings: [err instanceof Error ? err.message : String(err)],
        };
    }
}
