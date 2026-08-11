import type { FetchedObservation, SourceFetchResult } from '../types';
import { fetchBuffer, fetchText } from '../http';

const BUDGET_PAGE = 'https://www.mofep.gov.gh/publications/budget-statements/2026';
const KNOWN_URLS = [
    'https://www.mofep.gov.gh/sites/default/files/budget-statements/2026-Mid-Year-Fiscal-Policy-Review.pdf.pdf',
    'https://www.mofep.gov.gh/sites/default/files/budget-statements/2026-Mid-Year-Fiscal-Policy-Review.pdf',
    'https://mofep.gov.gh/sites/default/files/budget-statements/2026-Mid-Year-Fiscal-Policy-Review.pdf.pdf',
    'https://mofep.gov.gh/sites/default/files/budget-statements/2026-Mid-Year-Fiscal-Policy-Review.pdf',
];

function absolutize(href: string) {
    if (href.startsWith('http')) return href;
    if (href.startsWith('//')) return `https:${href}`;
    if (href.startsWith('/')) return `https://www.mofep.gov.gh${href}`;
    return `https://www.mofep.gov.gh/${href}`;
}

function endOfJune(year: number): Date {
    return new Date(Date.UTC(year, 6, 0)); // day 0 of July = 30 June
}

async function extractPdfText(buffer: Buffer): Promise<string> {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text || '';
}

async function urlLooksLikePdf(url: string): Promise<boolean> {
    try {
        const buf = await fetchBuffer(url, { Accept: 'application/pdf' });
        return buf.length > 20_000 && buf.subarray(0, 4).toString() === '%PDF';
    } catch {
        return false;
    }
}

/** Discover the Mid-Year Fiscal Policy Review PDF (preferred national budget snapshot). */
export async function discoverMidYearPdfUrl(): Promise<string | null> {
    for (const url of KNOWN_URLS) {
        if (await urlLooksLikePdf(url)) return url;
    }

    try {
        const html = await fetchText(BUDGET_PAGE);
        const links = [...new Set(
            Array.from(html.matchAll(/href=["']([^"']+\.pdf[^"']*)["']/gi)).map((m) => absolutize(m[1]))
        )];
        const ranked = links
            .filter((l) => /mid[- ]?year/i.test(l) && /fiscal|budget|review/i.test(l))
            .sort((a, b) => {
                const ya = Number((a.match(/(20\d{2})/) || [])[1] || 0);
                const yb = Number((b.match(/(20\d{2})/) || [])[1] || 0);
                return yb - ya;
            });
        for (const url of ranked) {
            if (await urlLooksLikePdf(url)) return url;
        }
    } catch {
        // fall through
    }

    // Probe current/previous year generic paths
    const year = new Date().getUTCFullYear();
    for (const y of [year, year - 1]) {
        const candidates = [
            `https://www.mofep.gov.gh/sites/default/files/budget-statements/${y}-Mid-Year-Fiscal-Policy-Review.pdf.pdf`,
            `https://www.mofep.gov.gh/sites/default/files/budget-statements/${y}-Mid-Year-Fiscal-Policy-Review.pdf`,
        ];
        for (const url of candidates) {
            if (await urlLooksLikePdf(url)) return url;
        }
    }

    return null;
}

export function parseMidYearDebt(text: string, pdfUrl: string): {
    observations: FetchedObservation[];
    warnings: string[];
    year: number | null;
} {
    const warnings: string[] = [];
    const compact = text.replace(/\s+/g, ' ');

    const yearMatch = compact.match(/H1\s+(20\d{2})/i)
        || compact.match(/end of June\s+(20\d{2})/i)
        || compact.match(/Mid-Year Fiscal Policy Review[\s\S]{0,80}(20\d{2})/i);
    const year = yearMatch ? Number(yearMatch[1]) : new Date().getUTCFullYear();
    const asOfDate = endOfJune(year);

    // Table 3 style: External / Domestic / Total ... last column = H1
    let externalBn: number | null = null;
    let domesticBn: number | null = null;
    let totalBn: number | null = null;

    const tableBlock = text.slice(
        Math.max(0, text.search(/Gross Nominal Public Debt[\s\S]{0,200}H1\s+20\d{2}/i)),
        Math.max(0, text.search(/Gross Nominal Public Debt[\s\S]{0,200}H1\s+20\d{2}/i)) + 1200
    ) || text;

    const extLine = tableBlock.match(/External Debt\s+([\d.\s]+)/i);
    const domLine = tableBlock.match(/Domestic Debt\s+([\d.\s]+)/i);
    const totLine = tableBlock.match(/Total Public Debt\s+([\d.\s]+)/i);

    const last = (nums: string) => {
        const parts = nums.trim().split(/\s+/).map(Number).filter((n) => !Number.isNaN(n) && n > 0);
        return parts.length ? parts[parts.length - 1] : null;
    };

    if (extLine) externalBn = last(extLine[1]);
    if (domLine) domesticBn = last(domLine[1]);
    if (totLine) totalBn = last(totLine[1]);

    // Prefer GHS block (billions of GH) before USD block — table has both; first Total Public Debt after "(in billions of GH" is GHS
    const ghsSection = text.match(/\(in billions of GH[^\)]*\)([\s\S]{0,400}?)Total Public Debt\s+([\d.\s]+)/i);
    if (ghsSection) {
        const section = ghsSection[0];
        const e = section.match(/External Debt\s+([\d.\s]+)/i);
        const d = section.match(/Domestic Debt\s+([\d.\s]+)/i);
        const t = section.match(/Total Public Debt\s+([\d.\s]+)/i);
        if (e) externalBn = last(e[1]);
        if (d) domesticBn = last(d[1]);
        if (t) totalBn = last(t[1]);
    }

    let debtToGdp: number | null = null;
    const gdpMatch = compact.match(/reached\s+(\d+(?:\.\d+)?)\s*percent by the end of June\s+20\d{2}/i)
        || compact.match(/end-June\s+20\d{2}[,\s]+it stood at\s+(\d+(?:\.\d+)?)\s*percent of GDP/i)
        || compact.match(/stood at\s+(\d+(?:\.\d+)?)\s*percent of GDP[\s\S]{0,40}June\s+20\d{2}/i);
    if (gdpMatch) debtToGdp = Number(gdpMatch[1]);

    let domesticShare: number | null = null;
    let externalShare: number | null = null;
    const shareMatch = compact.match(
        /domestic debt accounted for\s+(\d+(?:\.\d+)?)\s*percent[\s\S]{0,80}?external debt accounted for\s+(\d+(?:\.\d+)?)\s*percent/i
    );
    if (shareMatch) {
        domesticShare = Number(shareMatch[1]);
        externalShare = Number(shareMatch[2]);
    }

    // Optional macros from the same document
    let inflation: number | null = null;
    const inflMatch = compact.match(/As at June\s+20\d{2},\s*overall inflation stood at\s+(\d+(?:\.\d+)?)\s*percent/i)
        || compact.match(/inflation stood at\s+(\d+(?:\.\d+)?)\s*percent[\s\S]{0,40}June\s+20\d{2}/i)
        || compact.match(/fallen from[\s\S]{0,60}?to\s+(\d+(?:\.\d+)?)\s*percent by end-June\s+20\d{2}/i);
    if (inflMatch) inflation = Number(inflMatch[1]);

    let tbill91: number | null = null;
    const tbMatch = compact.match(
        /91-day Treasury Bill rate[\s\S]{0,120}?to\s+(\d+(?:\.\d+)?)\s*percent in June\s+20\d{2}/i
    );
    if (tbMatch) tbill91 = Number(tbMatch[1]);

    if (totalBn == null || externalBn == null || domesticBn == null) {
        warnings.push('Could not fully parse Mid-Year Table 3 debt stock');
    }

    const totalGhs = totalBn != null ? totalBn * 1_000_000_000 : null;
    const externalGhs = externalBn != null ? externalBn * 1_000_000_000 : null;
    const domesticGhs = domesticBn != null ? domesticBn * 1_000_000_000 : null;

    if (totalGhs != null && externalGhs != null && domesticGhs != null) {
        const drift = Math.abs(externalGhs + domesticGhs - totalGhs) / totalGhs;
        if (drift > 0.02) warnings.push(`Mid-Year composition drift ${(drift * 100).toFixed(1)}%`);
    }
    if (debtToGdp == null) warnings.push('Mid-Year debt/GDP not found');
    if (domesticShare == null || externalShare == null) {
        if (totalGhs && externalGhs && domesticGhs) {
            externalShare = Math.round((externalGhs / totalGhs) * 10000) / 100;
            domesticShare = Math.round((domesticGhs / totalGhs) * 10000) / 100;
        }
    }

    const externalToGdp = debtToGdp != null && externalShare != null
        ? Math.round(debtToGdp * (externalShare / 100) * 10) / 10
        : null;
    const domesticToGdp = debtToGdp != null && domesticShare != null
        ? Math.round(debtToGdp * (domesticShare / 100) * 10) / 10
        : null;

    const mode: 'auto' | 'propose' =
        totalGhs != null && debtToGdp != null && warnings.every((w) => !w.includes('drift') && !w.includes('not fully'))
            ? 'auto'
            : 'propose';

    const note = `MoF ${year} Mid-Year Fiscal Policy Review (H1 / end-June ${year})`;
    const meta = {
        provider: 'mof_midyear',
        document: 'Mid-Year Fiscal Policy Review',
        period: `H1-${year}`,
        pdfUrl,
    };

    const observations: FetchedObservation[] = [];
    const push = (
        indicator: string,
        value: number | null,
        unit: string,
        source: string,
        extra?: Record<string, unknown>
    ) => {
        if (value == null) return;
        observations.push({
            indicator,
            value,
            unit,
            source,
            asOfDate,
            sourceUrl: pdfUrl,
            note,
            mode,
            metadata: { ...meta, ...(extra || {}) },
        });
    };

    for (const source of ['Ministry of Finance', 'Bank of Ghana', 'MOF'] as const) {
        if (source === 'MOF') {
            push('DEBT_TO_GDP_RATIO', debtToGdp, '%', 'MOF');
            push('DEBT_EXTERNAL_SHARE', externalShare, '%', 'MOF');
            push('DEBT_DOMESTIC_SHARE', domesticShare, '%', 'MOF');
            push('DEBT_EXTERNAL_TO_GDP', externalToGdp, '%', 'MOF');
            push('DEBT_DOMESTIC_TO_GDP', domesticToGdp, '%', 'MOF');
            continue;
        }
        push('TOTAL_DEBT', totalGhs, 'GHS', source, {
            currency: 'GHS',
            domestic: domesticGhs,
            external: externalGhs,
            domestic_share: domesticShare,
            external_share: externalShare,
            authoritative: 'mid_year_budget',
        });
        push('DEBT_STOCK_TOTAL', totalGhs, 'GHS', source);
        push('DEBT_EXTERNAL', externalGhs, 'GHS', source);
        push('DEBT_DOMESTIC', domesticGhs, 'GHS', source);
        if (source === 'Bank of Ghana') {
            push('DEBT_TO_GDP_RATIO', debtToGdp, '%', source);
            push('DEBT_EXTERNAL_TO_GDP', externalToGdp, '%', source);
            push('DEBT_DOMESTIC_TO_GDP', domesticToGdp, '%', source);
        }
    }

    // Mid-year also carries useful market/macro checkpoints (June)
    push('INFLATION_RATE', inflation, '%', 'Bank of Ghana', { fromDocument: 'mid_year' });
    push('TREASURY_BILL_91D', tbill91, '%', 'Bank of Ghana', { fromDocument: 'mid_year' });

    if (!observations.length) {
        warnings.push('No observations extracted from Mid-Year PDF');
    }

    return { observations, warnings, year };
}

/**
 * Preferred debt authority as of mid/late calendar year:
 * MoF Mid-Year Fiscal Policy Review (H1 / end-June figures).
 */
export async function fetchMofMidYear(): Promise<SourceFetchResult> {
    const warnings: string[] = [];
    const pdfUrl = await discoverMidYearPdfUrl();
    if (!pdfUrl) {
        return {
            sourceKey: 'mof_midyear',
            label: 'MoF Mid-Year Fiscal Policy Review',
            observations: [],
            warnings: ['Mid-Year Fiscal Policy Review PDF not found'],
            alerts: [{
                title: 'Mid-Year budget PDF missing',
                detail: 'Could not locate the Mid-Year Fiscal Policy Review on mofep.gov.gh',
                sourceUrl: BUDGET_PAGE,
            }],
        };
    }

    try {
        const buffer = await fetchBuffer(pdfUrl, { Accept: 'application/pdf' });
        const text = await extractPdfText(buffer);
        const parsed = parseMidYearDebt(text, pdfUrl);
        warnings.push(...parsed.warnings);

        return {
            sourceKey: 'mof_midyear',
            label: 'MoF Mid-Year Fiscal Policy Review',
            observations: parsed.observations,
            warnings,
        };
    } catch (err) {
        return {
            sourceKey: 'mof_midyear',
            label: 'MoF Mid-Year Fiscal Policy Review',
            observations: [],
            warnings: [err instanceof Error ? err.message : String(err)],
            alerts: [{
                title: 'Mid-Year extract failed',
                detail: err instanceof Error ? err.message : String(err),
                sourceUrl: pdfUrl,
            }],
        };
    }
}
