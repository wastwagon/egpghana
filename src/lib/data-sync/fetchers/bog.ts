import type { SourceFetchResult } from '../types';
import { fetchText } from '../http';

const BOG_HOME = 'https://www.bog.gov.gh/';
const BOG_TBILL = 'https://www.bog.gov.gh/treasury-and-the-markets/treasury-bill-rates/';

function stripTags(html: string) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function parseNumberNearLabel(text: string, labels: RegExp[]): number | null {
    for (const label of labels) {
        // Label then number (common in plain text)
        const forward = new RegExp(`${label.source}[^0-9%]{0,40}(\\d+(?:\\.\\d+)?)`, 'i');
        const fm = text.match(forward);
        if (fm?.[1]) return Number(fm[1]);

        // Number then label (BoG Elementor cards)
        const backward = new RegExp(`(\\d+(?:\\.\\d+)?)[^0-9]{0,80}${label.source}`, 'i');
        const bm = text.match(backward);
        if (bm?.[1]) return Number(bm[1]);
    }
    return null;
}

/** Prefer structured Elementor heading pairs: value heading, then label heading. */
function parseElementorMetric(html: string, labelPattern: RegExp): number | null {
    const re = new RegExp(
        `elementor-heading-title[^>]*>\\s*(?:<a[^>]*>)?\\s*(\\d+(?:\\.\\d+)?)\\s*(?:</a>)?\\s*</h2>[\\s\\S]{0,1200}?elementor-heading-title[^>]*>\\s*(?:<a[^>]*>)?\\s*([^<]{0,120})`,
        'gi'
    );
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
        const value = Number(m[1]);
        const label = m[2].replace(/&[^;]+;/g, ' ').trim();
        if (!Number.isNaN(value) && labelPattern.test(label)) return value;
    }
    return null;
}

function todayUtc(): Date {
    const d = new Date();
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Parse BoG homepage cards: MPR, inflation, inflation target, 91-day T-bill. */
export async function fetchBogHomepage(): Promise<SourceFetchResult> {
    const html = await fetchText(BOG_HOME);
    const text = stripTags(html);
    const asOfDate = todayUtc();
    const observations: SourceFetchResult['observations'] = [];
    const warnings: string[] = [];

    const policyRate =
        parseElementorMetric(html, /Current Monetary Policy Rate/i)
        ?? parseNumberNearLabel(text, [/Current Monetary Policy Rate/i, /Monetary Policy Rate/i]);
    const inflation =
        parseElementorMetric(html, /Current inflation rate/i)
        ?? parseNumberNearLabel(text, [/Current inflation rate/i, /Headline inflation/i]);
    const tbill =
        parseElementorMetric(html, /91-Day Treasury Bill Rate/i)
        ?? parseNumberNearLabel(text, [/91-Day Treasury Bill Rate/i, /91[- ]Day Treasury Bill/i]);

    if (policyRate != null) {
        observations.push({
            indicator: 'POLICY_RATE',
            value: policyRate,
            unit: '%',
            source: 'Bank of Ghana',
            asOfDate,
            sourceUrl: BOG_HOME,
            note: 'Monetary Policy Rate from BoG homepage',
            mode: 'auto',
        });
    } else {
        warnings.push('Could not parse Monetary Policy Rate from BoG homepage');
    }

    if (inflation != null) {
        observations.push({
            indicator: 'INFLATION_RATE',
            value: inflation,
            unit: '%',
            source: 'Bank of Ghana',
            asOfDate,
            sourceUrl: BOG_HOME,
            note: 'Headline inflation from BoG homepage',
            mode: 'auto',
        });
    } else {
        warnings.push('Could not parse inflation from BoG homepage');
    }

    const targetMatch = html.match(/>(\d+(?:\.\d+)?)\s*(?:±|&plusmn;|\\u00b1)\s*2</i)
        || text.match(/(\d+(?:\.\d+)?)\s*±\s*2/i);
    const targetMid = targetMatch ? Number(targetMatch[1]) : parseNumberNearLabel(text, [/Inflation Target/i]);
    if (targetMid != null) {
        observations.push({
            indicator: 'INFLATION_TARGET_MID',
            value: targetMid,
            unit: '%',
            source: 'Bank of Ghana',
            asOfDate,
            sourceUrl: BOG_HOME,
            note: 'Inflation target midpoint',
            mode: 'auto',
            metadata: { band: '+/- 2%' },
        });
    }

    if (tbill != null) {
        observations.push({
            indicator: 'TREASURY_BILL_91D',
            value: tbill,
            unit: '%',
            source: 'Bank of Ghana',
            asOfDate,
            sourceUrl: BOG_HOME,
            note: '91-day T-bill from BoG homepage',
            mode: 'auto',
        });
    }

    return {
        sourceKey: 'bog_homepage',
        label: 'Bank of Ghana homepage',
        observations,
        warnings,
    };
}

/** Parse latest 91-day interest rate from BoG T-bill table (more precise than homepage). */
export async function fetchBogTbill(): Promise<SourceFetchResult> {
    const html = await fetchText(BOG_TBILL);
    const warnings: string[] = [];
    const observations: SourceFetchResult['observations'] = [];

    // Table cells often: Issue Date | Tender | Security Type | Discount Rate | Interest Rate
    const rowMatch = html.match(
        /(\d{1,2}\s+[A-Za-z]{3}\s+\d{4})[^<]{0,80}91\s*DAY\s*BILL[^<]{0,120}?(\d+\.\d+)\s*(\d+\.\d+)/i
    )
        || html.match(/91\s*DAY\s*BILL[\s\S]{0,200}?(\d+\.\d+)[\s\S]{0,40}?(\d+\.\d+)/i);

    let interest: number | null = null;
    let asOfDate = todayUtc();

    if (rowMatch) {
        // Prefer interest rate (last number in pair)
        if (rowMatch[3]) {
            interest = Number(rowMatch[3]);
            const parsed = Date.parse(rowMatch[1]);
            if (!Number.isNaN(parsed)) asOfDate = new Date(parsed);
        } else if (rowMatch[2]) {
            interest = Number(rowMatch[2]);
        }
    }

    if (interest == null) {
        const text = stripTags(html);
        interest = parseNumberNearLabel(text, [/91\s*DAY\s*BILL/i]);
    }

    if (interest != null) {
        observations.push({
            indicator: 'TREASURY_BILL_91D',
            value: interest,
            unit: '%',
            source: 'Bank of Ghana',
            asOfDate,
            sourceUrl: BOG_TBILL,
            note: '91-day Treasury Bill interest rate',
            mode: 'auto',
        });
    } else {
        warnings.push('Could not parse 91-day T-bill rate from BoG table');
    }

    return {
        sourceKey: 'bog_tbill',
        label: 'Bank of Ghana Treasury Bill Rates',
        observations,
        warnings,
    };
}
