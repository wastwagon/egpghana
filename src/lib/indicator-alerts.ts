import { findLatestEconomicData } from '@/lib/cached-economic-data';
import { careersNotifyEmail, isMailConfigured, sendMail } from '@/lib/email';
import { getRedis } from '@/lib/redis';

type AlertRule = {
    id: string;
    indicator: string;
    source?: string;
    compare: 'gt' | 'lt';
    threshold: number;
    title: string;
};

const RULES: AlertRule[] = [
    {
        id: 'inflation-high',
        indicator: 'INFLATION_RATE',
        source: 'Bank of Ghana',
        compare: 'gt',
        threshold: 20,
        title: 'Inflation above 20%',
    },
    {
        id: 'debt-gdp-high',
        indicator: 'DEBT_TO_GDP_RATIO',
        source: 'MOF',
        compare: 'gt',
        threshold: 75,
        title: 'Debt-to-GDP above 75%',
    },
    {
        id: 'debt-service-high',
        indicator: 'DEBT_SERVICE_TO_REVENUE',
        source: 'KPMG',
        compare: 'gt',
        threshold: 50,
        title: 'Debt service to revenue above 50%',
    },
];

const ALERT_STATE_PREFIX = 'alert:state:';

function breached(value: number, rule: AlertRule) {
    return rule.compare === 'gt' ? value > rule.threshold : value < rule.threshold;
}

function alertRecipients() {
    const dedicated = process.env.INDICATOR_ALERT_EMAIL?.trim();
    if (dedicated) return dedicated;
    return careersNotifyEmail();
}

/** Email admins when a watched indicator crosses into a breach state (once per transition). */
export async function evaluateIndicatorAlerts() {
    if (!isMailConfigured()) return;

    const to = alertRecipients();
    if (!to) return;

    const redis = await getRedis();

    for (const rule of RULES) {
        const row = await findLatestEconomicData(rule.indicator, rule.source);
        if (!row) continue;

        const isBreached = breached(row.value, rule);
        const stateKey = `${ALERT_STATE_PREFIX}${rule.id}`;
        let previousBreached: boolean | null = null;

        if (redis) {
            try {
                const prev = await redis.get(stateKey);
                if (prev === '1') previousBreached = true;
                if (prev === '0') previousBreached = false;
            } catch {
                /* ignore */
            }
        }

        if (redis) {
            try {
                await redis.set(stateKey, isBreached ? '1' : '0');
            } catch {
                /* ignore */
            }
        }

        if (!isBreached) continue;
        if (previousBreached === true) continue;

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://egpghana.org';
        const subject = `[EGP Alert] ${rule.title}`;
        const text = [
            rule.title,
            '',
            `Indicator: ${rule.indicator}${rule.source ? ` (${rule.source})` : ''}`,
            `Current value: ${row.value}`,
            `Threshold: ${rule.compare === 'gt' ? '>' : '<'} ${rule.threshold}`,
            `As of: ${row.date.toISOString().slice(0, 10)}`,
            '',
            `Dashboards: ${appUrl}/dashboards`,
        ].join('\n');

        await sendMail({ to, subject, text });
    }
}
