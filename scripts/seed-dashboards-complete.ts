
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDashboards() {
    console.log('🚀 Seeding complete dashboard data...');

    // --- 1. IMF DASHBOARD DATA ---
    console.log('📦 Seeding IMF Data...');

    // Disbursement Schedule
    const disbursementDataRaw = [
        { date: '2023-05-17', amount: 600, sdr: 451.4, status: 'Completed', quarter: 'May 2023', type: 'Approval' },
        { date: '2024-01-19', amount: 600, sdr: 451.4, status: 'Completed', quarter: 'Jan 2024', type: '1st Review' },
        { date: '2024-06-28', amount: 360, sdr: 269.1, status: 'Completed', quarter: 'Jun 2024', type: '2nd Review' },
        { date: '2024-12-02', amount: 360, sdr: 269.1, status: 'Completed', quarter: 'Dec 2024', type: '3rd Review' },
        { date: '2025-07-07', amount: 367, sdr: 267.5, status: 'Completed', quarter: 'Jul 2025', type: '4th Review' },
        { date: '2025-12-15', amount: 385, sdr: 278.0, status: 'Completed', quarter: 'Dec 2025', type: '5th Review' },
        { date: '2026-06-15', amount: 328, sdr: 250.0, status: 'Pending', quarter: 'Jun 2026', type: '6th Review (Proj)' },
    ];

    for (const item of disbursementDataRaw) {
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'IMF_DISBURSEMENT',
                    date: new Date(item.date),
                    source: 'IMF',
                },
            },
            update: {
                value: item.amount, // USD Millions
                unit: 'Million USD',
                metadata: {
                    sdr: item.sdr,
                    status: item.status,
                    quarter: item.quarter,
                    type: item.type,
                },
            },
            create: {
                indicator: 'IMF_DISBURSEMENT',
                value: item.amount,
                date: new Date(item.date),
                source: 'IMF',
                unit: 'Million USD',
                metadata: {
                    sdr: item.sdr,
                    status: item.status,
                    quarter: item.quarter,
                    type: item.type,
                },
            },
        });
    }

    // Conditionalities
    const realConditionalities = [
        {
            id: 'cond-1',
            title: 'Primary Fiscal Consolidation (Non-Oil Revenue & Primary Surplus)',
            category: 'Fiscal',
            status: 'In Progress',
            deadline: '2026-12-31',
            description: 'Deliver primary fiscal consolidation by raising non-oil revenue and achieving primary surplus targets.',
            verificationNote: 'Initially met with slippages at end-2024. Corrective measures adopted in 2025 including enhanced tax enforcement and expenditure controls. Q1 2026 shows improved compliance with revenue targets.',
            sourceLink: 'https://www.imf.org/en/Countries/GHA',
            sourceTitle: 'IMF 4th & 5th Review Reports'
        },
        {
            id: 'cond-2',
            title: 'Electricity Tariff Adjustment (Cost-Recovery)',
            category: 'Energy',
            status: 'Met',
            deadline: '2025-12-31',
            description: 'Prior action: upfront weighted-average tariff adjustment to achieve cost-recovery levels.',
            verificationNote: 'Met. Initial upfront adjustment completed. Further quarterly tariff adjustments implemented as corrective action (2024–25). PURC continues automatic adjustment formula.',
            sourceLink: 'https://purc.com.gh',
            sourceTitle: 'PURC Tariff Gazette 2025'
        },
        {
            id: 'cond-3',
            title: 'Debt Restructuring (G20 Common Framework & DDEP)',
            category: 'Fiscal',
            status: 'In Progress',
            deadline: '2026-06-30',
            description: 'Complete debt restructuring under G20 Common Framework and domestic debt exchange measures.',
            verificationNote: 'Substantial progress achieved. Domestic Debt Exchange Program (DDEP) completed with 85% participation. Official bilateral debt restructuring agreements reached with major creditors. Eurobond restructuring ongoing.',
            target: 100,
            actual: 75,
            unit: '% Complete',
            sourceLink: 'https://mofep.gov.gh',
            sourceTitle: 'MoF Debt Restructuring Report'
        },
        {
            id: 'cond-4',
            title: 'Strengthen PFM & Transparent Budget Execution',
            category: 'Governance',
            status: 'In Progress',
            deadline: '2026-12-31',
            description: 'Strengthen Public Financial Management using GIFMIS and GHANEPS for transparent budget execution.',
            verificationNote: 'In Progress. IMF repeatedly calls for strengthened budget controls amid 2024 fiscal slippage. PFM reforms have accelerated post-2024 with improved GIFMIS-GHANEPS integration and enhanced reporting.',
            sourceLink: 'https://ppa.gov.gh',
            sourceTitle: 'PPA Reform Progress Report'
        },
        {
            id: 'cond-5',
            title: 'Gold-for-Oil Program Risk Assessment',
            category: 'Energy',
            status: 'Met',
            deadline: '2024-06-30',
            description: 'Risk assessment and exit strategy for "gold-for-oil" program to reduce contingent liabilities.',
            verificationNote: 'Met. Comprehensive risk assessment submitted to Bank of Ghana Board by June 2024. Exit strategy framework approved with gradual phase-out plan over 24 months.',
            sourceLink: 'https://bog.gov.gh',
            sourceTitle: 'BoG Board Report June 2024'
        },
        {
            id: 'cond-6',
            title: 'Cap Net Credit to Government from Central Bank',
            category: 'Monetary',
            status: 'In Progress',
            deadline: '2026-12-31',
            description: 'Reduce and maintain ceiling on net credit to government from central bank.',
            verificationNote: 'Monitored as quantitative criterion. Performance met in early reviews but program warned of slippages at end-2024. Ongoing monitoring shows improvement in Q1 2026 with zero new central bank financing.',
            sourceLink: 'https://bog.gov.gh',
            sourceTitle: 'BoG Monetary Policy Report'
        },
        {
            id: 'cond-7',
            title: 'Maintain Limits on Treasury & FX Guarantees',
            category: 'Fiscal',
            status: 'Met',
            deadline: '2026-12-31',
            description: 'Maintain strict ceilings on treasury guarantees and foreign exchange guarantees.',
            verificationNote: 'IMF reports compliance in early reviews. Remains a program performance criterion with ongoing monitoring. No breaches reported through Q4 2025.',
            sourceLink: 'https://mofep.gov.gh',
            sourceTitle: 'MoF Quarterly Fiscal Report'
        },
        {
            id: 'cond-8',
            title: 'Publish Quarterly Debt Bulletins',
            category: 'Governance',
            status: 'Met',
            deadline: '2026-12-31',
            description: 'Publish quarterly debt bulletins and strengthen public debt transparency.',
            verificationNote: 'Met. Early reviews reported publication and improved transparency. All quarterly bulletins for 2024-2025 published on schedule. Enhanced disclosure includes creditor breakdown and debt service projections.',
            sourceLink: 'https://mofep.gov.gh/debt-management',
            sourceTitle: 'MoF Debt Management Portal'
        },
        {
            id: 'cond-9',
            title: 'Medium-Term PFM Reform Strategy',
            category: 'Governance',
            status: 'In Progress',
            deadline: '2026-06-30',
            description: 'Prepare and implement medium-term Public Financial Management Reform Strategy & Action Plan.',
            verificationNote: 'Pending / In progress. IMF structural benchmark. Draft strategy completed and under Cabinet review. Action plan development ongoing with World Bank technical assistance.',
            target: 100,
            actual: 65,
            unit: '% Complete',
            sourceLink: 'https://mofep.gov.gh',
            sourceTitle: 'MoF PFM Reform Unit'
        },
        {
            id: 'cond-10',
            title: 'Tax & Revenue Measures (Non-Oil Revenue Floor)',
            category: 'Fiscal',
            status: 'In Progress',
            deadline: '2026-12-31',
            description: 'Implement tax and revenue measures to meet non-oil revenue targets (floor on central government tax revenue).',
            verificationNote: 'Met in early reviews (1st & 2nd). Subject to ongoing monitoring. IMF reports targets met initially but Q4 2024 showed shortfall. Enhanced enforcement measures implemented in 2025.',
            target: 15.5,
            actual: 14.8,
            unit: '% of GDP',
            sourceLink: 'https://gra.gov.gh',
            sourceTitle: 'GRA Revenue Report 2025'
        },
        {
            id: 'cond-11',
            title: 'Maintain Social Spending Floors',
            category: 'Social',
            status: 'Met',
            deadline: '2026-12-31',
            description: 'Protect social spending while consolidating overall fiscal position (maintain minimum spending floors).',
            verificationNote: 'Program requirement adhered to. IMF notes social spending protection maintained throughout consolidation. LEAP, school feeding, and health programs fully funded in 2024-2025 budgets.',
            sourceLink: 'https://mogcsp.gov.gh',
            sourceTitle: 'Ministry of Gender Social Protection Report'
        },
        {
            id: 'cond-12',
            title: 'Beneficial Ownership Framework (FATF Standards)',
            category: 'Governance',
            status: 'In Progress',
            deadline: '2026-03-31',
            description: 'Introduce beneficial ownership framework amendments to Companies Act to meet FATF standards.',
            verificationNote: 'Partially met / In final stages. IMF flagged ongoing work by mid-2025. Companies Act amendments passed Parliament in Dec 2025. Regulations and implementation guidelines under development.',
            target: 100,
            actual: 85,
            unit: '% Complete',
            sourceLink: 'https://www.parliament.gh',
            sourceTitle: 'Parliament Act 2025'
        },
        {
            id: 'cond-13',
            title: 'Quarterly Electricity Tariff Formula Adjustments',
            category: 'Energy',
            status: 'In Progress',
            deadline: '2026-12-31',
            description: 'Maintain electricity tariffs at cost-recovery levels through quarterly formula adjustments.',
            verificationNote: 'Partially met / Ongoing. Initial tariff adjustments taken. IMF noted later adjustments as part of corrective actions in 2025. PURC committed to automatic quarterly adjustments going forward.',
            sourceLink: 'https://purc.com.gh',
            sourceTitle: 'PURC Automatic Adjustment Framework'
        },
        {
            id: 'cond-14',
            title: 'Strengthen Procurement Transparency (E-Procurement)',
            category: 'Governance',
            status: 'In Progress',
            deadline: '2026-06-30',
            description: 'Publish large contracts and beneficiaries on designated website; complete e-procurement roll-out.',
            verificationNote: 'Pending / In progress. IMF highlights e-procurement strengthening as mid-2025 priority. GHANEPS platform upgraded. Contracts above GH₵ 5M now published. Full roll-out to all MDAs targeted for Q2 2026.',
            target: 100,
            actual: 70,
            unit: '% MDAs',
            sourceLink: 'https://ppa.gov.gh',
            sourceTitle: 'PPA E-Procurement Report'
        },
        {
            id: 'cond-15',
            title: 'Achieve NIR / Reserves Targets',
            category: 'Monetary',
            status: 'Met',
            deadline: '2026-12-31',
            description: 'Achieve specified program net official international reserves (NIR) floors.',
            verificationNote: 'Mixed performance. IMF notes international reserves improved and exceeded targets by end-2024. Program monitoring continues. Reserves stood at $6.2B (3.5 months of imports) as of Dec 2025.',
            target: 6000,
            actual: 6200,
            unit: 'Million USD',
            sourceLink: 'https://bog.gov.gh',
            sourceTitle: 'BoG Reserves Report'
        },
        {
            id: 'cond-16',
            title: 'Power Sector Restructuring & Arrears Reduction',
            category: 'Energy',
            status: 'In Progress',
            deadline: '2026-09-30',
            description: 'Prepare power-sector restructuring strategy and implement measures to reduce arrears and fiscal risks.',
            verificationNote: 'Progress with some delays. Restructuring strategy submitted to Cabinet. Arrears clearance plan in implementation with quarterly payments to IPPs resumed. Total arrears reduced by 25% from peak.',
            target: 100,
            actual: 45,
            unit: '% Arrears Cleared',
            sourceLink: 'https://energycom.gov.gh',
            sourceTitle: 'Energy Commission Report'
        },
        {
            id: 'cond-17',
            title: 'Establish New Tax Enforcement Capacities',
            category: 'Fiscal',
            status: 'In Progress',
            deadline: '2026-06-30',
            description: 'Establish new tax enforcement units and enhance GRA capacity for revenue mobilization.',
            verificationNote: 'Planned / In progress per IMF staff statements. GRA established dedicated High Net Worth Individual (HNWI) unit in 2025. Transfer pricing unit operationalized. Digital tax compliance system under deployment.',
            target: 5,
            actual: 3,
            unit: 'New Units',
            sourceLink: 'https://gra.gov.gh',
            sourceTitle: 'GRA Modernization Plan'
        },
        {
            id: 'cond-18',
            title: 'Program Quantitative Performance Criteria',
            category: 'Fiscal',
            status: 'In Progress',
            deadline: '2026-12-31',
            description: 'Meet all quantitative performance criteria (fiscal, monetary, external) on each review date.',
            verificationNote: 'Initially met across early reviews (1st–3rd). Deterioration noted end-2024 but corrective actions taken leading to 4th and 5th review completion. Ongoing monitoring for 6th review scheduled April 2026.',
            sourceLink: 'https://www.imf.org/en/Countries/GHA',
            sourceTitle: 'IMF Program Reviews'
        }
    ];

    for (const cond of realConditionalities) {
        // use ID in source to ensure uniqueness for same-date deadlines
        const uniqueSource = `IMF-${cond.id}`;

        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'IMF_CONDITIONALITY',
                    date: new Date(cond.deadline),
                    source: uniqueSource,
                },
            },
            update: {
                value: 0,
                unit: 'Status',
                metadata: cond,
            },
            create: {
                indicator: 'IMF_CONDITIONALITY',
                value: 0,
                date: new Date(cond.deadline),
                source: uniqueSource,
                unit: 'Status',
                metadata: cond,
            },
        });
    }

    // Milestones Data
    const milestonesRaw = [
        { date: '2023-05-17', title: 'IMF Board Approval', description: 'Executive Board approves US$3 billion ECF arrangement for Ghana.', status: 'completed', type: 'approval' },
        { date: '2024-01-19', title: '1st Review Completion', description: 'Board completes first review, enabling US$600 million disbursement.', status: 'completed', type: 'review' },
        { date: '2024-06-28', title: '2nd Review Completion', description: 'Completion of second review; US$360 million disbursement approved.', status: 'completed', type: 'review' },
        { date: '2024-12-02', title: '3rd Review Completion', description: 'Completion of third review; US$360 million disbursement approved.', status: 'completed', type: 'review' },
        { date: '2025-07-07', title: '4th Review Completion', description: 'Completion of fourth review; US$367 million disbursement approved.', status: 'completed', type: 'review' },
        { date: '2025-12-15', title: '5th Review Completion', description: 'Completion of fifth review after corrective actions; US$385 million disbursement.', status: 'completed', type: 'review' },
        { date: '2026-04-15', title: '6th Review Mission', description: 'IMF staff mission expected to conduct 6th review of program performance.', status: 'pending', type: 'mission' },
        { date: '2026-06-30', title: '6th Review Board Date', description: 'Expected Board approval for 6th review and disbursement.', status: 'pending', type: 'review' },
    ];

    for (const m of milestonesRaw) {
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'IMF_MILESTONE',
                    date: new Date(m.date),
                    source: 'IMF',
                },
            },
            update: {
                value: 0,
                unit: 'Event',
                metadata: m,
            },
            create: {
                indicator: 'IMF_MILESTONE',
                value: 0,
                date: new Date(m.date),
                source: 'IMF',
                unit: 'Event',
                metadata: m,
            },
        });
    }

    // --- 2. DEBT DASHBOARD DATA ---
    console.log('📦 Seeding Debt Data...');

    // Creditor Breakdown (Nov 2025)
    const creditors = [
        { name: 'World Bank', value: 32, type: 'External', color: '#FCD116' },
        { name: 'China EXIM', value: 28, type: 'External', color: '#CE1126' },
        { name: 'Eurobonds', value: 25, type: 'External', color: '#006B3F' },
        { name: 'Other Bilateral', value: 15, type: 'External', color: '#1a365d' },
        { name: 'Medium-term Bonds', value: 45.2, type: 'Domestic', color: '#006B3F' },
        { name: 'Treasury Bills', value: 36.5, type: 'Domestic', color: '#FCD116' },
        { name: 'Long-term Bonds', value: 15.8, type: 'Domestic', color: '#CE1126' },
        { name: 'Other Domestic', value: 2.5, type: 'Domestic', color: '#94a3b8' },
    ];

    for (const cred of creditors) {
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'DEBT_BY_CREDITOR',
                    date: new Date('2025-11-01'),
                    source: `${cred.name}`,
                },
            },
            update: {
                value: cred.value,
                unit: '% (Share)',
                metadata: {
                    creditor: cred.name,
                    type: cred.type,
                    color: cred.color,
                },
            },
            create: {
                indicator: 'DEBT_BY_CREDITOR',
                value: cred.value,
                date: new Date('2025-11-01'),
                source: `${cred.name}`,
                unit: '% (Share)',
                metadata: {
                    creditor: cred.name,
                    type: cred.type,
                    color: cred.color,
                },
            },
        });
    }

    // --- 3. ECONOMY/MACRO DATA (2026 Updates) ---
    console.log('📦 Seeding Economy Data...');

    // GDP Growth - Latest projection for 2026
    await prisma.economicData.upsert({
        where: {
            indicator_date_source: {
                indicator: 'GDP_GROWTH',
                date: new Date('2026-01-31'),
                source: 'Fitch Solutions / IMF',
            },
        },
        update: {
            value: 5.9,
            unit: '%',
            metadata: {
                quarter: '2026 Q1 Projection',
                note: 'Projected growth driven by strong domestic demand, improved exports',
            },
        },
        create: {
            indicator: 'GDP_GROWTH',
            value: 5.9,
            date: new Date('2026-01-31'),
            source: 'Fitch Solutions / IMF',
            unit: '%',
            metadata: {
                quarter: '2026 Q1 Projection',
                note: 'Projected growth driven by strong domestic demand, improved exports',
            },
        },
    });

    // ... (Previous GDP entry) ...

    // Historical GDP Data (2023-2025)
    const historicalGDP = [
        { date: '2023-03-31', value: 3.2, quarter: 'Q1 2023', agri: 4.5, ind: 2.1, serv: 3.5 },
        { date: '2023-06-30', value: 3.5, quarter: 'Q2 2023', agri: 4.8, ind: 2.3, serv: 3.8 },
        { date: '2023-09-30', value: 2.8, quarter: 'Q3 2023', agri: 4.1, ind: 1.8, serv: 3.0 },
        { date: '2023-12-31', value: 3.8, quarter: 'Q4 2023', agri: 5.0, ind: 2.5, serv: 4.2 },
        { date: '2024-03-31', value: 4.7, quarter: 'Q1 2024', agri: 5.5, ind: 3.0, serv: 5.1 },
        { date: '2024-06-30', value: 6.9, quarter: 'Q2 2024', agri: 7.2, ind: 5.8, serv: 7.0 }, // Boom
        { date: '2024-09-30', value: 5.5, quarter: 'Q3 2024', agri: 6.0, ind: 4.5, serv: 5.8 },
        { date: '2024-12-31', value: 5.1, quarter: 'Q4 2024', agri: 5.8, ind: 4.2, serv: 5.5 },
        { date: '2025-03-31', value: 5.3, quarter: 'Q1 2025', agri: 5.9, ind: 4.5, serv: 5.7 },
        { date: '2025-06-30', value: 5.6, quarter: 'Q2 2025', agri: 6.1, ind: 4.8, serv: 6.0 },
        { date: '2025-09-30', value: 5.7, quarter: 'Q3 2025', agri: 6.2, ind: 4.9, serv: 6.1 },
        { date: '2025-12-31', value: 5.8, quarter: 'Q4 2025', agri: 6.3, ind: 5.0, serv: 6.2 },
    ];

    for (const item of historicalGDP) {
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'GDP_GROWTH',
                    date: new Date(item.date),
                    source: 'GSS',
                },
            },
            update: {
                value: item.value,
                unit: '%',
                metadata: {
                    quarter: item.quarter,
                    agriculture: item.agri,
                    industry: item.ind,
                    services: item.serv,
                },
            },
            create: {
                indicator: 'GDP_GROWTH',
                value: item.value,
                date: new Date(item.date),
                source: 'GSS',
                unit: '%',
                metadata: {
                    quarter: item.quarter,
                    agriculture: item.agri,
                    industry: item.ind,
                    services: item.serv,
                },
            },
        });
    }

    // Historical Inflation Data (Last 24 months)
    const historicalInflation = [
        { date: '2024-01-31', value: 23.5 }, { date: '2024-02-29', value: 23.2 },
        { date: '2024-03-31', value: 25.8 }, { date: '2024-04-30', value: 25.0 },
        { date: '2024-05-31', value: 23.1 }, { date: '2024-06-30', value: 22.8 },
        { date: '2024-07-31', value: 20.9 }, { date: '2024-08-31', value: 20.4 },
        { date: '2024-09-30', value: 21.5 }, { date: '2024-10-31', value: 22.1 },
        { date: '2024-11-30', value: 23.2 }, { date: '2024-12-31', value: 23.2 },
        { date: '2025-01-31', value: 21.8 }, { date: '2025-02-28', value: 20.5 },
        { date: '2025-03-31', value: 19.8 }, { date: '2025-04-30', value: 18.5 },
        { date: '2025-05-31', value: 17.2 }, { date: '2025-06-30', value: 15.8 },
        { date: '2025-07-31', value: 14.5 }, { date: '2025-08-31', value: 13.2 },
        { date: '2025-09-30', value: 11.5 }, { date: '2025-10-31', value: 9.8 },
        { date: '2025-11-30', value: 8.5 }, { date: '2025-12-31', value: 7.2 },
    ];

    for (const item of historicalInflation) {
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'INFLATION_RATE',
                    date: new Date(item.date),
                    source: 'GSS',
                },
            },
            update: { value: item.value, unit: '%', metadata: { policyRate: item.value + 4 } },
            create: { indicator: 'INFLATION_RATE', value: item.value, date: new Date(item.date), source: 'GSS', unit: '%', metadata: { policyRate: item.value + 4 } },
        });
    }

    // Historical Exchange Rate (Monthly avg)
    const historicalFx = [
        { date: '2024-01-31', value: 11.9 }, { date: '2024-02-29', value: 12.2 },
        { date: '2024-03-31', value: 12.8 }, { date: '2024-04-30', value: 13.5 },
        { date: '2024-05-31', value: 14.1 }, { date: '2024-06-30', value: 14.8 },
        { date: '2024-07-31', value: 15.2 }, { date: '2024-08-31', value: 15.6 },
        { date: '2024-09-30', value: 15.8 }, { date: '2024-10-31', value: 16.0 },
        { date: '2024-11-30', value: 15.9 }, { date: '2024-12-31', value: 15.8 }, // Stabilizing
        { date: '2025-01-31', value: 15.7 }, { date: '2025-02-28', value: 15.5 },
        { date: '2025-03-31', value: 15.3 }, { date: '2025-04-30', value: 15.1 },
        { date: '2025-05-31', value: 14.8 }, { date: '2025-06-30', value: 14.5 },
        { date: '2025-07-31', value: 14.2 }, { date: '2025-08-31', value: 13.8 },
        { date: '2025-09-30', value: 13.5 }, { date: '2025-10-31', value: 13.0 },
        { date: '2025-11-30', value: 12.5 }, { date: '2025-12-31', value: 11.5 }, // Appreciating
    ];

    for (const item of historicalFx) {
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'EXCHANGE_RATE_USD',
                    date: new Date(item.date),
                    source: 'Bank of Ghana',
                },
            },
            update: { value: item.value, unit: 'GHS' },
            create: { indicator: 'EXCHANGE_RATE_USD', value: item.value, date: new Date(item.date), source: 'Bank of Ghana', unit: 'GHS' },
        });
    }

    // Historical Debt (Monthly)
    const historicalDebt = [
        { date: '2024-01-31', value: 610000000000, domestic: 280000000000, external: 330000000000 },
        { date: '2024-06-30', value: 742000000000, domestic: 300000000000, external: 442000000000 }, // Peak
        { date: '2024-12-31', value: 726700000000, domestic: 290000000000, external: 436700000000 },
        { date: '2025-06-30', value: 680000000000, domestic: 310000000000, external: 370000000000 }, // Restructuring kick-in
        { date: '2025-11-01', value: 644600000000, domestic: 314400000000, external: 330200000000 },
    ];

    for (const item of historicalDebt) {
        await prisma.economicData.upsert({
            where: {
                indicator_date_source: {
                    indicator: 'TOTAL_DEBT',
                    date: new Date(item.date),
                    source: 'Ministry of Finance',
                },
            },
            update: {
                value: item.value,
                unit: 'GHS',
                metadata: { domestic: item.domestic, external: item.external }
            },
            create: {
                indicator: 'TOTAL_DEBT',
                value: item.value,
                date: new Date(item.date),
                source: 'Ministry of Finance',
                unit: 'GHS',
                metadata: { domestic: item.domestic, external: item.external }
            },
        });
    }

    // Inflation Rate - January 2026 actual data (Latest) - Keeping the original upsert below to ensure it's the specific single point source of truth
    await prisma.economicData.upsert({
        where: {
            indicator_date_source: {
                indicator: 'INFLATION_RATE',
                date: new Date('2026-01-31'),
                source: 'Ghana Statistical Service',
            },
        },
        update: {
            value: 3.8,
            unit: '%',
            metadata: {
                month: 'Jan 26',
                policyRate: 26.0,
                targetLow: 6,
                targetHigh: 10,
                note: '13th consecutive month of decline, lowest since 2021 rebasing',
            },
        },
        create: {
            indicator: 'INFLATION_RATE',
            value: 3.8,
            date: new Date('2026-01-31'),
            source: 'Ghana Statistical Service',
            unit: '%',
            metadata: {
                month: 'Jan 26',
                policyRate: 26.0,
                targetLow: 6,
                targetHigh: 10,
                note: '13th consecutive month of decline, lowest since 2021 rebasing',
            },
        },
    });

    // Exchange Rate - February 2026
    await prisma.economicData.upsert({
        where: {
            indicator_date_source: {
                indicator: 'EXCHANGE_RATE_USD',
                date: new Date('2026-02-06'),
                source: 'Bank of Ghana',
            },
        },
        update: {
            value: 10.99,
            unit: 'GHS per USD',
            metadata: {
                month: 'Feb 26',
                interbankRate: 10.99,
                note: 'Interbank selling rate',
            },
        },
        create: {
            indicator: 'EXCHANGE_RATE_USD',
            value: 10.99,
            date: new Date('2026-02-06'),
            source: 'Bank of Ghana',
            unit: 'GHS per USD',
            metadata: {
                month: 'Feb 26',
                interbankRate: 10.99,
                note: 'Interbank selling rate',
            },
        },
    });

    // Total Debt - November 2025 (most recent)
    await prisma.economicData.upsert({
        where: {
            indicator_date_source: {
                indicator: 'TOTAL_DEBT',
                date: new Date('2025-11-01'),
                source: 'Ministry of Finance',
            },
        },
        update: {
            value: 644600000000, // GH₵ 644.6B
            metadata: {
                currency: 'GHS',
                domestic: 314400000000,
                external: 330200000000,
                domestic_share: 48.8,
                external_share: 51.2,
                externalUSD: 29300000000,
                note: 'Significant reduction from GH₵726.7B in Dec 2024',
            },
        },
        create: {
            indicator: 'TOTAL_DEBT',
            value: 644600000000,
            date: new Date('2025-11-01'),
            source: 'Ministry of Finance',
            unit: 'GHS',
            metadata: {
                currency: 'GHS',
                domestic: 314400000000,
                external: 330200000000,
                domestic_share: 48.8,
                external_share: 51.2,
                externalUSD: 29300000000,
                note: 'Significant reduction from GH₵726.7B in Dec 2024',
            },
        },
    });

    // Unemployment - Q4 2025
    await prisma.economicData.upsert({
        where: {
            indicator_date_source: {
                indicator: 'UNEMPLOYMENT_RATE',
                date: new Date('2025-12-31'),
                source: 'GSS',
            },
        },
        update: {
            value: 3.2,
            unit: '%',
            metadata: {
                quarter: 'Q4 2025',
                note: 'Decline from peak of 13.9% in 2022',
            },
        },
        create: {
            indicator: 'UNEMPLOYMENT_RATE',
            value: 3.2,
            date: new Date('2025-12-31'),
            source: 'GSS',
            unit: '%',
            metadata: {
                quarter: 'Q4 2025',
                note: 'Decline from peak of 13.9% in 2022',
            },
        },
    });

    console.log('✅ Dashboard Data Seeded Successfully!');
}

seedDashboards()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
