export type SyncMode = 'auto' | 'propose' | 'watch';

export interface FetchedObservation {
    indicator: string;
    value: number;
    unit?: string;
    source: string;
    asOfDate: Date;
    sourceUrl?: string;
    note?: string;
    metadata?: Record<string, unknown>;
    /** auto = write EconomicData if changed; propose = pending approval; watch = alert only */
    mode: SyncMode;
}

export interface SourceFetchResult {
    sourceKey: string;
    label: string;
    observations: FetchedObservation[];
    warnings?: string[];
    /** Extra alerts (e.g. new MoF bulletin URL) without a numeric value */
    alerts?: Array<{
        title: string;
        detail: string;
        sourceUrl?: string;
    }>;
}

export interface SyncRunSummary {
    checked: number;
    unchanged: number;
    applied: number;
    proposed: number;
    alerts: number;
    errors: string[];
}
