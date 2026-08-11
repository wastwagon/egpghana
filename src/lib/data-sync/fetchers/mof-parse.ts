export interface MofDebtExtract {
    totalGhs: number | null;
    externalGhs: number | null;
    domesticGhs: number | null;
    debtToGdp: number | null;
    externalToGdp: number | null;
    domesticToGdp: number | null;
    externalShare: number | null;
    domesticShare: number | null;
    asOfDate: Date | null;
    periodLabel: string | null;
    confidence: 'high' | 'medium' | 'low';
    checks: string[];
    failures: string[];
}

function lastNumber(line: string): number | null {
    const nums = [...line.matchAll(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+\.\d+|\d+)/g)].map((m) =>
        Number(m[1].replace(/,/g, ''))
    );
    if (!nums.length) return null;
    return nums[nums.length - 1];
}

function lastPercent(line: string): number | null {
    const nums = [...line.matchAll(/(\d+(?:\.\d+)?)%/g)].map((m) => Number(m[1]));
    if (!nums.length) return null;
    return nums[nums.length - 1];
}

function parseBillionToGhs(value: number): number {
    // MoF tables are in GH₵ billions
    return value * 1_000_000_000;
}

function parseAsOfDate(text: string): { date: Date | null; label: string | null } {
    const q = text.match(/\bQ([1-4])[-–]?(\d{4})\b/i);
    if (q) {
        const quarter = Number(q[1]);
        const year = Number(q[2]);
        const month = quarter * 3; // end month
        return {
            date: new Date(Date.UTC(year, month, 0)), // last day of quarter end month
            label: `Q${quarter}-${year}`,
        };
    }
    const month = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/i);
    if (month) {
        const monthIndex = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december',
        ].indexOf(month[1].toLowerCase());
        const year = Number(month[2]);
        return {
            date: new Date(Date.UTC(year, monthIndex + 1, 0)),
            label: `${month[1]} ${year}`,
        };
    }
    return { date: null, label: null };
}

function parseFromTable(text: string): Partial<MofDebtExtract> {
    const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
    const out: Partial<MofDebtExtract> = {};

    for (const line of lines) {
        if (/^Total Public Debt\b/i.test(line)) {
            const n = lastNumber(line);
            if (n != null && n > 50 && n < 5000) out.totalGhs = parseBillionToGhs(n);
        } else if (/^External Debt\b/i.test(line) && !/GDP|Service|Disbursement|Stock by/i.test(line)) {
            const n = lastNumber(line.replace(/%/g, ' % '));
            const share = lastPercent(line);
            // number before trailing share % is the stock in billions — lastNumber may be the share
            const stockMatch = line.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s*$/);
            if (stockMatch) {
                out.externalGhs = parseBillionToGhs(Number(stockMatch[1]));
                out.externalShare = Number(stockMatch[2]);
            } else if (n != null && n > 50 && n < 5000) {
                out.externalGhs = parseBillionToGhs(n);
                if (share != null) out.externalShare = share;
            }
        } else if (/^Domestic Debt\b/i.test(line) && !/GDP|Holders|Stock/i.test(line)) {
            const stockMatch = line.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s*$/);
            if (stockMatch) {
                out.domesticGhs = parseBillionToGhs(Number(stockMatch[1]));
                out.domesticShare = Number(stockMatch[2]);
            }
        } else if (/Public Debt\/GDP ratio/i.test(line)) {
            const p = lastPercent(line);
            if (p != null) out.debtToGdp = p;
        } else if (/^External Debt\/GDP/i.test(line)) {
            const p = lastPercent(line);
            if (p != null) out.externalToGdp = p;
        } else if (/^Domestic Debt\/GDP/i.test(line)) {
            const p = lastPercent(line);
            if (p != null) out.domesticToGdp = p;
        }
    }

    return out;
}

function parseFromNarrative(text: string): Partial<MofDebtExtract> {
    const out: Partial<MofDebtExtract> = {};
    const compact = text.replace(/\s+/g, ' ');

    const total = compact.match(
        /(?:central government debt|government-guaranteed debt\)?)\s*(?:stood at\s*)?(?:GH[₵¢]|GHS?)\s*([\d,.]+)\s*billion/i
    ) || compact.match(/(?:GH[₵¢]|GHS?)\s*([\d,.]+)\s*bn\b[^.]{0,40}Q[1-4]/i);
    if (total) out.totalGhs = parseBillionToGhs(Number(total[1].replace(/,/g, '')));

    const debtGdp = compact.match(
        /(?:government debt|central\s+government debt)\s+stood at\s+(\d+(?:\.\d+)?)\s*percent/i
    ) || compact.match(/stood at\s+(\d+(?:\.\d+)?)\s*percent as at end/i);
    if (debtGdp) out.debtToGdp = Number(debtGdp[1]);

    const parts = compact.match(
        /external debt of\s*(?:GH[₵¢]|GHS?)\s*([\d,.]+)\s*billion[\s\S]{0,80}?domestic debt of\s*(?:GH[₵¢]|GHS?)\s*([\d,.]+)\s*billion[\s\S]{0,80}?(\d+(?:\.\d+)?)\s*percent of GDP and\s*(\d+(?:\.\d+)?)\s*percent of GDP/i
    );
    if (parts) {
        out.externalGhs = parseBillionToGhs(Number(parts[1].replace(/,/g, '')));
        out.domesticGhs = parseBillionToGhs(Number(parts[2].replace(/,/g, '')));
        out.externalToGdp = Number(parts[3]);
        out.domesticToGdp = Number(parts[4]);
    }

    return out;
}

export function validateMofExtract(data: Omit<MofDebtExtract, 'confidence' | 'checks' | 'failures'>): {
    confidence: MofDebtExtract['confidence'];
    checks: string[];
    failures: string[];
} {
    const checks: string[] = [];
    const failures: string[] = [];

    const { totalGhs, externalGhs, domesticGhs, debtToGdp, externalShare, domesticShare, externalToGdp, domesticToGdp } = data;

    if (totalGhs != null && externalGhs != null && domesticGhs != null) {
        const sum = externalGhs + domesticGhs;
        const drift = Math.abs(sum - totalGhs) / totalGhs;
        if (drift <= 0.02) checks.push('total ≈ external + domestic');
        else failures.push(`total vs parts drift ${(drift * 100).toFixed(1)}%`);
    } else {
        failures.push('missing total/external/domestic');
    }

    if (debtToGdp != null && debtToGdp >= 15 && debtToGdp <= 120) {
        checks.push('debt/GDP in sane range');
    } else {
        failures.push('debt/GDP missing or out of range');
    }

    if (externalShare != null && domesticShare != null) {
        const shareSum = externalShare + domesticShare;
        if (Math.abs(shareSum - 100) <= 2) checks.push('shares sum ≈ 100%');
        else failures.push(`shares sum ${shareSum.toFixed(1)}%`);
    }

    if (debtToGdp != null && externalToGdp != null && domesticToGdp != null) {
        const gdpSum = externalToGdp + domesticToGdp;
        if (Math.abs(gdpSum - debtToGdp) <= 3) checks.push('GDP components ≈ debt/GDP');
        else failures.push(`GDP components sum ${gdpSum.toFixed(1)} vs ${debtToGdp}`);
    }

    let confidence: MofDebtExtract['confidence'] = 'low';
    if (failures.length === 0 && checks.length >= 2) confidence = 'high';
    else if (totalGhs != null && debtToGdp != null && failures.length <= 1) confidence = 'medium';

    return { confidence, checks, failures };
}

export function parseMofDebtBulletin(text: string): MofDebtExtract {
    const fromTable = parseFromTable(text);
    const fromNarrative = parseFromNarrative(text);
    const { date, label } = parseAsOfDate(text);

    const merged = {
        totalGhs: fromTable.totalGhs ?? fromNarrative.totalGhs ?? null,
        externalGhs: fromTable.externalGhs ?? fromNarrative.externalGhs ?? null,
        domesticGhs: fromTable.domesticGhs ?? fromNarrative.domesticGhs ?? null,
        debtToGdp: fromTable.debtToGdp ?? fromNarrative.debtToGdp ?? null,
        externalToGdp: fromTable.externalToGdp ?? fromNarrative.externalToGdp ?? null,
        domesticToGdp: fromTable.domesticToGdp ?? fromNarrative.domesticToGdp ?? null,
        externalShare: fromTable.externalShare ?? null,
        domesticShare: fromTable.domesticShare ?? null,
        asOfDate: date,
        periodLabel: label,
    };

    // Derive shares if missing
    if (merged.totalGhs && merged.externalGhs && merged.externalShare == null) {
        merged.externalShare = Math.round((merged.externalGhs / merged.totalGhs) * 10000) / 100;
    }
    if (merged.totalGhs && merged.domesticGhs && merged.domesticShare == null) {
        merged.domesticShare = Math.round((merged.domesticGhs / merged.totalGhs) * 10000) / 100;
    }

    const { confidence, checks, failures } = validateMofExtract(merged);
    return { ...merged, confidence, checks, failures };
}
