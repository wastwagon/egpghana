/**
 * Canonical indicator catalog for the public debt/economy indicator grid.
 * Values are loaded from EconomicData; display metadata lives here.
 */
export type IndicatorCategory = 'debt' | 'gdp' | 'market';

export interface CatalogEntry {
    id: string;
    indicator: string;
    category: IndicatorCategory;
    title: string;
    source: string;
    /** Prefer these sources in order when multiple exist */
    sourcePriority?: string[];
    format: 'ghs_billions' | 'usd_billions' | 'usd' | 'ghs' | 'percent' | 'percent_band' | 'raw';
    /** Optional static analysis when no previous value for trend */
    analysisFallback?: string;
    tag?: { label: string; type: 'high' | 'moderate' | 'target' | 'improving' };
}

export const INDICATOR_CATALOG: CatalogEntry[] = [
    { id: '1', indicator: 'DEBT_STOCK_TOTAL', category: 'debt', title: 'Total debt stock', source: 'Bank of Ghana', sourcePriority: ['Bank of Ghana', 'Ministry of Finance'], format: 'ghs_billions' },
    { id: '2', indicator: 'DEBT_EXTERNAL', category: 'debt', title: 'External Debt', source: 'Bank of Ghana', format: 'ghs_billions' },
    { id: '3', indicator: 'DEBT_DOMESTIC', category: 'debt', title: 'Domestic Debt', source: 'Bank of Ghana', format: 'ghs_billions' },
    { id: '4', indicator: 'DEBT_EXTERNAL_SHARE', category: 'debt', title: 'External Debt % share', source: 'MOF', sourcePriority: ['MOF', 'Ministry of Finance'], format: 'percent' },
    { id: '5', indicator: 'DEBT_DOMESTIC_SHARE', category: 'debt', title: 'Domestic Debt % share', source: 'MOF', sourcePriority: ['MOF', 'Ministry of Finance'], format: 'percent' },
    { id: '6', indicator: 'DEBT_INTEREST_PAYMENT_REVISED', category: 'debt', title: 'Revised interest payment', source: 'MOF', sourcePriority: ['MOF', 'Ministry of Finance'], format: 'ghs_billions' },
    { id: '7', indicator: 'DEBT_INTEREST_TO_EXPENDITURE', category: 'debt', title: 'Interest/Expenditure Ratio', source: 'Bank of Ghana', format: 'percent' },
    { id: '8', indicator: 'DEBT_PER_CAPITA', category: 'debt', title: 'Debt per Capita', source: 'World Bank', format: 'ghs' },
    { id: '9', indicator: 'DEBT_SERVICE_TO_REVENUE', category: 'debt', title: 'Interest/Revenue Share', source: 'KPMG', format: 'percent' },
    { id: '10', indicator: 'DEBT_TO_GDP_RATIO', category: 'gdp', title: 'Total Debt to GDP Ratio', source: 'MOF', sourcePriority: ['MOF', 'Ministry of Finance'], format: 'percent', tag: { label: 'Moderate', type: 'moderate' } },
    { id: '11', indicator: 'DEBT_DOMESTIC_TO_GDP', category: 'gdp', title: 'Domestic Debt % of GDP', source: 'MOF', sourcePriority: ['MOF', 'Ministry of Finance'], format: 'percent' },
    { id: '12', indicator: 'DEBT_EXTERNAL_TO_GDP', category: 'gdp', title: 'External Debt % of GDP', source: 'MOF', sourcePriority: ['MOF', 'Ministry of Finance'], format: 'percent' },
    { id: '13', indicator: 'PER_CAPITA_INCOME_USD', category: 'gdp', title: 'Per CAPITA Income', source: 'World Bank', format: 'usd' },
    { id: '14', indicator: 'GDP_NOMINAL_USD', category: 'gdp', title: 'GDP (USD)', source: 'World Bank', format: 'usd_billions' },
    { id: '19', indicator: 'GDP_NOMINAL_GHS', category: 'gdp', title: 'GDP (GHS)', source: 'Bank of Ghana', format: 'ghs_billions' },
    { id: '15', indicator: 'INFLATION_RATE', category: 'market', title: 'Inflation (YoY)', source: 'Bank of Ghana', format: 'percent', tag: { label: 'Below Target', type: 'target' } },
    { id: '16', indicator: 'INFLATION_TARGET_MID', category: 'market', title: 'Inflation Target', source: 'Bank of Ghana', format: 'percent_band', tag: { label: 'Target', type: 'target' } },
    { id: '17', indicator: 'POLICY_RATE', category: 'market', title: 'Monetary Policy Rate', source: 'Bank of Ghana', format: 'percent', tag: { label: 'Moderate', type: 'moderate' } },
    { id: '18', indicator: 'TREASURY_BILL_91D', category: 'market', title: '91-Day T-Bill Rate', source: 'Bank of Ghana', format: 'percent' },
];
