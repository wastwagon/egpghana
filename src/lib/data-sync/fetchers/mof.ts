import { prisma } from '@/lib/prisma';
import type { FetchedObservation, SourceFetchResult } from '../types';
import { fetchBuffer, fetchText } from '../http';
import { parseMofDebtBulletin } from './mof-parse';

const MOF_BULLETIN_PAGE = 'https://mofep.gov.gh/public-debt/quarterly-public-debt-statistics-bulletin';
const MOF_DEBT_DATA_PAGE = 'https://mofep.gov.gh/public-debt/debt-data';

function absolutize(href: string) {
    if (href.startsWith('http')) return href;
    if (href.startsWith('//')) return `https:${href}`;
    if (href.startsWith('/')) return `https://mofep.gov.gh${href}`;
    return `https://mofep.gov.gh/${href}`;
}

function extractPdfLinks(html: string): string[] {
    return [...new Set(
        Array.from(html.matchAll(/href=["']([^"']+\.pdf[^"']*)["']/gi)).map((m) => absolutize(m[1]))
    )];
}

function scoreBulletinUrl(url: string): number {
    const u = url.toLowerCase();
    let score = 0;
    if (/debt-statistics-bulletin|debt_statistics_bulletin|public-debt.*bulletin/i.test(u)) score += 100;
    if (/debt/.test(u)) score += 10;
    if (/bulletin/.test(u)) score += 10;
    const year = Number((u.match(/(20\d{2})/) || [])[1] || 0);
    const quarter = Number((u.match(/[q\-]([1-4])(?:\D|$)/) || u.match(/q([1-4])/) || [])[1] || 0);
    // Prefer newest period strongly (today is mid-2026 — never prefer 2025 over 2026)
    score += year * 100 + quarter * 10;
    return score;
}

async function extractPdfText(buffer: Buffer): Promise<string> {
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text || '';
}

async function rememberFingerprint(key: string, fingerprint: string, links: string[], page: string) {
    const asOf = new Date();
    asOf.setUTCHours(0, 0, 0, 0);
    const indicator = `SOURCE_WATCH_${key.toUpperCase()}`;
    await prisma.economicData.upsert({
        where: {
            indicator_date_source: {
                indicator,
                date: asOf,
                source: 'Ministry of Finance',
            },
        },
        update: {
            value: links.length,
            unit: 'docs',
            metadata: { fingerprint, links, page },
        },
        create: {
            indicator,
            value: links.length,
            date: asOf,
            source: 'Ministry of Finance',
            unit: 'docs',
            metadata: { fingerprint, links, page },
        },
    });
}

function buildObservations(
    extract: ReturnType<typeof parseMofDebtBulletin>,
    pdfUrl: string,
    mode: 'auto' | 'propose'
): FetchedObservation[] {
    const asOfDate = extract.asOfDate || new Date();
    const note = `MoF debt bulletin ${extract.periodLabel || ''} (${extract.confidence} confidence)`.trim();
    const meta = {
        provider: 'mof_bulletin',
        period: extract.periodLabel,
        confidence: extract.confidence,
        checks: extract.checks,
        failures: extract.failures,
        pdfUrl,
    };

    const rows: Array<{ indicator: string; value: number | null; unit: string; source: string }> = [
        { indicator: 'DEBT_STOCK_TOTAL', value: extract.totalGhs, unit: 'GHS', source: 'Ministry of Finance' },
        { indicator: 'TOTAL_DEBT', value: extract.totalGhs, unit: 'GHS', source: 'Ministry of Finance' },
        { indicator: 'DEBT_EXTERNAL', value: extract.externalGhs, unit: 'GHS', source: 'Ministry of Finance' },
        { indicator: 'DEBT_DOMESTIC', value: extract.domesticGhs, unit: 'GHS', source: 'Ministry of Finance' },
        { indicator: 'DEBT_EXTERNAL_SHARE', value: extract.externalShare, unit: '%', source: 'MOF' },
        { indicator: 'DEBT_DOMESTIC_SHARE', value: extract.domesticShare, unit: '%', source: 'MOF' },
        { indicator: 'DEBT_TO_GDP_RATIO', value: extract.debtToGdp, unit: '%', source: 'MOF' },
        { indicator: 'DEBT_EXTERNAL_TO_GDP', value: extract.externalToGdp, unit: '%', source: 'MOF' },
        { indicator: 'DEBT_DOMESTIC_TO_GDP', value: extract.domesticToGdp, unit: '%', source: 'MOF' },
    ];

    // Also write Bank of Ghana TOTAL_DEBT mirror with composition metadata (homepage/debt charts)
    const observations: FetchedObservation[] = [];
    for (const row of rows) {
        if (row.value == null) continue;
        observations.push({
            indicator: row.indicator,
            value: row.value,
            unit: row.unit,
            source: row.source,
            asOfDate,
            sourceUrl: pdfUrl,
            note,
            mode,
            metadata: {
                ...meta,
                ...(row.indicator === 'TOTAL_DEBT' || row.indicator === 'DEBT_STOCK_TOTAL'
                    ? {
                        currency: 'GHS',
                        domestic: extract.domesticGhs,
                        external: extract.externalGhs,
                        domestic_share: extract.domesticShare,
                        external_share: extract.externalShare,
                    }
                    : {}),
            },
        });
    }

    if (extract.totalGhs != null) {
        observations.push({
            indicator: 'TOTAL_DEBT',
            value: extract.totalGhs,
            unit: 'GHS',
            source: 'Bank of Ghana',
            asOfDate,
            sourceUrl: pdfUrl,
            note: `${note} (mirrored for dashboard compatibility)`,
            mode,
            metadata: {
                ...meta,
                currency: 'GHS',
                domestic: extract.domesticGhs,
                external: extract.externalGhs,
                domestic_share: extract.domesticShare,
                external_share: extract.externalShare,
                mirroredFrom: 'Ministry of Finance',
            },
        });
        observations.push({
            indicator: 'DEBT_STOCK_TOTAL',
            value: extract.totalGhs,
            unit: 'GHS',
            source: 'Bank of Ghana',
            asOfDate,
            sourceUrl: pdfUrl,
            note,
            mode,
            metadata: meta,
        });
        if (extract.externalGhs != null) {
            observations.push({
                indicator: 'DEBT_EXTERNAL',
                value: extract.externalGhs,
                unit: 'GHS',
                source: 'Bank of Ghana',
                asOfDate,
                sourceUrl: pdfUrl,
                note,
                mode,
                metadata: meta,
            });
        }
        if (extract.domesticGhs != null) {
            observations.push({
                indicator: 'DEBT_DOMESTIC',
                value: extract.domesticGhs,
                unit: 'GHS',
                source: 'Bank of Ghana',
                asOfDate,
                sourceUrl: pdfUrl,
                note,
                mode,
                metadata: meta,
            });
        }
    }

    return observations;
}

/**
 * MoF debt sync:
 * 1) Discover latest quarterly debt bulletin PDF
 * 2) Extract text + parse key debt indicators
 * 3) Validate — high confidence auto-applies; otherwise propose for review
 */
export async function fetchMofDebtWatcher(): Promise<SourceFetchResult> {
    const warnings: string[] = [];
    const alerts: SourceFetchResult['alerts'] = [];
    let observations: FetchedObservation[] = [];

    const pages = [
        { key: 'mof_bulletin', url: MOF_BULLETIN_PAGE, label: 'MoF Quarterly Debt Bulletin' },
        { key: 'mof_debt_data', url: MOF_DEBT_DATA_PAGE, label: 'MoF Debt Data page' },
    ];

    let bulletinLinks: string[] = [];

    for (const page of pages) {
        try {
            const html = await fetchText(page.url);
            const links = extractPdfLinks(html);
            if (!links.length) {
                // Debt Data page is often JS-rendered; bulletin page is the primary source
                if (page.key === 'mof_bulletin') {
                    warnings.push(`${page.label}: no PDF links found`);
                }
                continue;
            }

            if (page.key === 'mof_bulletin' || scoreBulletinUrl(links[0]) >= 5) {
                bulletinLinks = [...bulletinLinks, ...links];
            }

            const fingerprint = links.slice(0, 3).join('|');
            const previous = await prisma.economicData.findFirst({
                where: {
                    indicator: `SOURCE_WATCH_${page.key.toUpperCase()}`,
                    source: 'Ministry of Finance',
                },
                orderBy: { date: 'desc' },
            });
            const prevFingerprint = (previous?.metadata as { fingerprint?: string } | null)?.fingerprint;
            if (prevFingerprint !== fingerprint) {
                await rememberFingerprint(page.key, fingerprint, links, page.url);
            }
        } catch (err) {
            warnings.push(err instanceof Error ? err.message : String(err));
        }
    }

    const candidates = [...bulletinLinks].sort((a, b) => scoreBulletinUrl(b) - scoreBulletinUrl(a));
    const pdfUrl = candidates[0];

    if (!pdfUrl) {
        warnings.push('No MoF debt bulletin PDF candidate found');
        return {
            sourceKey: 'mof_watcher',
            label: 'Ministry of Finance debt bulletin extractor',
            observations: [],
            warnings,
            alerts,
        };
    }

    try {
        const buffer = await fetchBuffer(pdfUrl, { Accept: 'application/pdf' });
        if (buffer.length < 1000 || buffer.subarray(0, 4).toString() !== '%PDF') {
            throw new Error(`Not a valid PDF (${buffer.length} bytes): ${pdfUrl}`);
        }

        const text = await extractPdfText(buffer);
        const extract = parseMofDebtBulletin(text);

        if (!extract.totalGhs && !extract.debtToGdp) {
            alerts.push({
                title: 'MoF bulletin found but figures not parsed',
                detail: `Could not extract debt stock/GDP from ${pdfUrl}. Manual update needed.`,
                sourceUrl: pdfUrl,
            });
            warnings.push(`Parse failed for ${pdfUrl}: ${extract.failures.join('; ') || 'no figures'}`);
        } else {
            const mode = extract.confidence === 'high' ? 'auto' : 'propose';
            observations = buildObservations(extract, pdfUrl, mode);

            if (mode === 'propose') {
                alerts.push({
                    title: `MoF debt extract needs review (${extract.confidence})`,
                    detail: `Parsed ${extract.periodLabel || 'bulletin'}: total=${extract.totalGhs ? (extract.totalGhs / 1e9).toFixed(2) + 'B' : '—'}, debt/GDP=${extract.debtToGdp ?? '—'}. Checks: ${extract.checks.join(', ') || 'none'}. Failures: ${extract.failures.join(', ') || 'none'}.`,
                    sourceUrl: pdfUrl,
                });
            }
            // High confidence: observations mode=auto → applied by sync runner (audit in DataSyncProposal)
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        warnings.push(message);
        alerts.push({
            title: 'MoF bulletin download/extract failed',
            detail: message,
            sourceUrl: pdfUrl,
        });
    }

    return {
        sourceKey: 'mof_watcher',
        label: 'Ministry of Finance debt bulletin extractor',
        observations,
        warnings,
        alerts,
    };
}
