import type { FetchedObservation, SourceFetchResult } from '../types';
import { fetchBuffer } from '../http';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
] as const;

function lastNumber(line: string): number | null {
    const nums = [...line.matchAll(/(\d{1,4}(?:,\d{3})*(?:\.\d+)?|\d+\.\d+)/g)]
        .map((m) => Number(m[1].replace(/,/g, '')))
        .filter((n) => !Number.isNaN(n));
    return nums.length ? nums[nums.length - 1] : null;
}

function parseYmTokens(text: string): Array<{ year: number; month: number }> {
    const tokens = [...text.matchAll(/\b(20\d{2})[:\-/](\d{1,2})\b/g)].map((m) => ({
        year: Number(m[1]),
        month: Number(m[2]),
    }));
    return tokens.filter((t) => t.month >= 1 && t.month <= 12);
}

function endOfMonth(year: number, month: number): Date {
    return new Date(Date.UTC(year, month, 0));
}

async function extractPdfText(buffer: Buffer): Promise<string> {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text || '';
}

/** Probe BoG upload paths for the newest Summary of Economic and Financial Data PDF. */
export async function discoverLatestBogSefdUrl(now = new Date()): Promise<string | null> {
    const candidates: string[] = [];
    for (let back = 0; back < 8; back++) {
        const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - back, 1));
        const year = d.getUTCFullYear();
        const month = d.getUTCMonth() + 1;
        const monthName = MONTH_NAMES[month - 1];
        const mm = String(month).padStart(2, '0');
        candidates.push(
            `https://www.bog.gov.gh/wp-content/uploads/${year}/${mm}/Summary-of-Economic-and-Financial-Data-${monthName}-${year}.pdf`,
            `https://www.bog.gov.gh/wp-content/uploads/${year}/${mm}/Summary-of-Economic-and-Financial-Charts-${monthName}-${year}.pdf`,
        );
    }

    for (const url of candidates) {
        try {
            const buf = await fetchBuffer(url, { Accept: 'application/pdf' });
            if (buf.length > 5000 && buf.subarray(0, 4).toString() === '%PDF') {
                return url;
            }
        } catch {
            // try next
        }
    }
    return null;
}

export function parseBogSefdDebt(text: string, pdfUrl: string): {
    observations: FetchedObservation[];
    warnings: string[];
    asOfDate: Date | null;
} {
    const warnings: string[] = [];
    const lines = text.split(/\n/).map((l) => l.trim());

    let totalBn: number | null = null;
    let debtToGdp: number | null = null;
    let externalBn: number | null = null;
    let externalToGdp: number | null = null;
    let domesticBn: number | null = null;
    let domesticToGdp: number | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^Total Public Debt \(billion GHC\)/i.test(line)) {
            totalBn = lastNumber(line);
            // next ". . . percent of GDP" often follows
            const next = lines[i + 1] || '';
            if (/percent of GDP/i.test(next)) debtToGdp = lastNumber(next);
        } else if (/^External Debt \(billion GHC\)/i.test(line)) {
            externalBn = lastNumber(line);
            const next = lines[i + 1] || '';
            if (/percent of GDP/i.test(next)) externalToGdp = lastNumber(next);
        } else if (/^Domestic Debt \(billion GHC\)/i.test(line)) {
            domesticBn = lastNumber(line);
            const next = lines[i + 1] || '';
            if (/percent of GDP/i.test(next)) domesticToGdp = lastNumber(next);
        }
    }

    // Prefer the YYYY:MM header row sitting just above the Public Debt block
    let asOfDate: Date | null = null;
    const debtBlockIdx = text.search(/Public Debt\s*\n\s*Total Public Debt/i);
    if (debtBlockIdx >= 0) {
        const prelude = text.slice(Math.max(0, debtBlockIdx - 500), debtBlockIdx);
        const headerLine = [...prelude.split(/\n/)].reverse().find((l) => /20\d{2}[:\-/]\d{1,2}/.test(l));
        if (headerLine) {
            const cols = parseYmTokens(headerLine);
            if (cols.length) {
                const last = cols[cols.length - 1];
                asOfDate = endOfMonth(last.year, last.month);
            }
        }
    }
    if (!asOfDate) {
        const ym = parseYmTokens(text);
        if (ym.length) {
            const last = ym[ym.length - 1];
            asOfDate = endOfMonth(last.year, last.month);
        }
    }

    if (totalBn == null) {
        warnings.push('Could not parse Total Public Debt (billion GHC) from BoG SEFD');
        return { observations: [], warnings, asOfDate };
    }

    const totalGhs = totalBn * 1_000_000_000;
    const externalGhs = externalBn != null ? externalBn * 1_000_000_000 : null;
    const domesticGhs = domesticBn != null ? domesticBn * 1_000_000_000 : null;
    const externalShare = externalGhs != null ? Math.round((externalGhs / totalGhs) * 10000) / 100 : null;
    const domesticShare = domesticGhs != null ? Math.round((domesticGhs / totalGhs) * 10000) / 100 : null;

    // Sanity
    if (externalGhs != null && domesticGhs != null) {
        const drift = Math.abs(externalGhs + domesticGhs - totalGhs) / totalGhs;
        if (drift > 0.03) {
            warnings.push(`BoG SEFD composition drift ${(drift * 100).toFixed(1)}% — proposing instead of auto`);
        }
    }

    const mode: 'auto' | 'propose' = warnings.some((w) => w.includes('drift')) ? 'propose' : 'auto';
    const date = asOfDate || new Date();
    const note = `BoG Summary of Economic and Financial Data (as of ${date.toISOString().slice(0, 10)})`;
    const meta = {
        provider: 'bog_sefd',
        pdfUrl,
        publicationUrl: pdfUrl,
    };

    const observations: FetchedObservation[] = [];
    const push = (indicator: string, value: number | null, unit: string, source: string, extra?: Record<string, unknown>) => {
        if (value == null) return;
        observations.push({
            indicator,
            value,
            unit,
            source,
            asOfDate: date,
            sourceUrl: pdfUrl,
            note,
            mode,
            metadata: { ...meta, ...(extra || {}) },
        });
    };

    for (const source of ['Bank of Ghana', 'Ministry of Finance'] as const) {
        push('TOTAL_DEBT', totalGhs, 'GHS', source, {
            currency: 'GHS',
            domestic: domesticGhs,
            external: externalGhs,
            domestic_share: domesticShare,
            external_share: externalShare,
        });
        push('DEBT_STOCK_TOTAL', totalGhs, 'GHS', source);
        push('DEBT_EXTERNAL', externalGhs, 'GHS', source);
        push('DEBT_DOMESTIC', domesticGhs, 'GHS', source);
    }
    push('DEBT_TO_GDP_RATIO', debtToGdp, '%', 'MOF');
    push('DEBT_TO_GDP_RATIO', debtToGdp, '%', 'Bank of Ghana');
    push('DEBT_EXTERNAL_TO_GDP', externalToGdp, '%', 'MOF');
    push('DEBT_DOMESTIC_TO_GDP', domesticToGdp, '%', 'MOF');
    push('DEBT_EXTERNAL_SHARE', externalShare, '%', 'MOF');
    push('DEBT_DOMESTIC_SHARE', domesticShare, '%', 'MOF');
    // Also keep BoG-labelled stock rows used by dashboards
    push('DEBT_EXTERNAL_TO_GDP', externalToGdp, '%', 'Bank of Ghana');
    push('DEBT_DOMESTIC_TO_GDP', domesticToGdp, '%', 'Bank of Ghana');

    return { observations, warnings, asOfDate: date };
}

export async function fetchBogSefdDebt(): Promise<SourceFetchResult> {
    const warnings: string[] = [];
    const pdfUrl = await discoverLatestBogSefdUrl();
    if (!pdfUrl) {
        return {
            sourceKey: 'bog_sefd',
            label: 'BoG Summary of Economic and Financial Data',
            observations: [],
            warnings: ['No recent BoG SEFD PDF found'],
        };
    }

    try {
        const buffer = await fetchBuffer(pdfUrl, { Accept: 'application/pdf' });
        const text = await extractPdfText(buffer);
        const parsed = parseBogSefdDebt(text, pdfUrl);
        warnings.push(...parsed.warnings);
        if (!parsed.observations.length) {
            warnings.push(`Parsed SEFD but no debt observations: ${pdfUrl}`);
        }
        return {
            sourceKey: 'bog_sefd',
            label: 'BoG Summary of Economic and Financial Data',
            observations: parsed.observations,
            warnings,
        };
    } catch (err) {
        return {
            sourceKey: 'bog_sefd',
            label: 'BoG Summary of Economic and Financial Data',
            observations: [],
            warnings: [err instanceof Error ? err.message : String(err)],
        };
    }
}
