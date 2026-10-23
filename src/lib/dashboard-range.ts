export type DashboardRange = '1y' | '3y' | '5y' | 'all';

const VALID: DashboardRange[] = ['1y', '3y', '5y', 'all'];

export function parseDashboardRange(value?: string): DashboardRange {
    if (value && VALID.includes(value as DashboardRange)) {
        return value as DashboardRange;
    }
    return '3y';
}

export function rangeCutoff(range: DashboardRange): Date | null {
    if (range === 'all') return null;
    const years = range === '1y' ? 1 : range === '3y' ? 3 : 5;
    const d = new Date();
    d.setFullYear(d.getFullYear() - years);
    return d;
}

export function seriesTakeForRange(range: DashboardRange, monthly = true) {
    if (range === '1y') return monthly ? 12 : 4;
    if (range === '3y') return monthly ? 36 : 12;
    if (range === '5y') return monthly ? 60 : 20;
    return monthly ? 120 : 40;
}

export function filterEconomicRowsByCutoff<T extends { date: Date }>(rows: T[], cutoff: Date | null) {
    if (!cutoff) return rows;
    return rows.filter((row) => row.date >= cutoff);
}
