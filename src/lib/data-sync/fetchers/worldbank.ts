import type { SourceFetchResult } from '../types';

const WB_BASE = 'https://api.worldbank.org/v2/country/GHA/indicator';

const INDICATORS: Array<{
    code: string;
    indicator: string;
    unit: string;
    label: string;
}> = [
    { code: 'NY.GDP.MKTP.CD', indicator: 'GDP_NOMINAL_USD', unit: 'USD', label: 'GDP (current US$)' },
    { code: 'NY.GDP.PCAP.CD', indicator: 'PER_CAPITA_INCOME_USD', unit: 'USD', label: 'GDP per capita (current US$)' },
    { code: 'SP.POP.TOTL', indicator: 'POPULATION_TOTAL', unit: 'people', label: 'Population' },
];

async function fetchLatest(code: string): Promise<{ value: number; date: Date } | null> {
    const url = `${WB_BASE}/${code}?format=json&per_page=5&mrv=5`;
    const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
    });
    if (!res.ok) throw new Error(`World Bank ${code}: HTTP ${res.status}`);

    const json = await res.json();
    const rows = Array.isArray(json?.[1]) ? json[1] : [];
    for (const row of rows) {
        if (row?.value != null && row?.date) {
            return {
                value: Number(row.value),
                date: new Date(`${row.date}-12-31T00:00:00.000Z`),
            };
        }
    }
    return null;
}

export async function fetchWorldBank(): Promise<SourceFetchResult> {
    const observations: SourceFetchResult['observations'] = [];
    const warnings: string[] = [];

    for (const item of INDICATORS) {
        try {
            const latest = await fetchLatest(item.code);
            if (!latest) {
                warnings.push(`No value for ${item.code}`);
                continue;
            }
            observations.push({
                indicator: item.indicator,
                value: latest.value,
                unit: item.unit,
                source: 'World Bank',
                asOfDate: latest.date,
                sourceUrl: `https://data.worldbank.org/indicator/${item.code}?locations=GH`,
                note: item.label,
                mode: 'auto',
                metadata: { provider: 'world_bank', code: item.code },
            });
        } catch (err) {
            warnings.push(err instanceof Error ? err.message : String(err));
        }
    }

    return {
        sourceKey: 'world_bank',
        label: 'World Bank Open Data API',
        observations,
        warnings,
    };
}
