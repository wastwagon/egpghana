
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Data sets
const programsData = [
    {
        title: 'Public Debt Tracker',
        slug: 'debt-tracker',
        description: 'Real-time monitoring and analysis of Ghana\'s public debt portfolio, including domestic and external debt obligations.',
        fullContent: `
            <p class="mb-4">The Public Debt Tracker is a flagship initiative of the Economic Governance Platform, designed to provide citizens, media, and policymakers with accessible, up-to-date data on Ghana's public debt situation.</p>
            <p class="mb-4">Our interactive dashboard allows users to explore historical debt trends, analyze the composition of debt (domestic vs. external), and understand the implications of debt servicing costs on the national budget.</p>
            <h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">Objectives</h3>
            <ul class="list-disc list-inside space-y-2 mb-6 text-slate-600">
                <li>Promote transparency in public debt management.</li>
                <li>Empower citizens to hold government accountable for borrowing decisions.</li>
                <li>Provide evidence-based analysis for policy advocacy.</li>
            </ul>
        `,
        features: [
            'Interactive debt dashboard',
            'Historical debt trends',
            'Debt-to-GDP ratio analysis',
            'Quarterly debt reports',
        ],
        color: 'accent-red',
        icon: 'BarChart3',
    },
    {
        title: 'IMF Bailout Monitor',
        slug: 'imf-monitor',
        description: 'Comprehensive tracking of Ghana\'s IMF program implementation, conditionalities, and disbursements.',
        fullContent: `
            <p class="mb-4">The IMF Bailout Monitor tracks the progress of Ghana's Extended Credit Facility (ECF) program with the International Monetary Fund. This tool is essential for understanding the conditions attached to the bailout and monitoring the government's compliance.</p>
            <p class="mb-4">We provide detailed breakdowns of disbursement schedules, structural benchmarks, and quantitative performance criteria to ensure that the public stays informed about the country's economic recovery path.</p>
        `,
        features: [
            'Program timeline and milestones',
            'Conditionality tracking',
            'Disbursement schedule',
            'Impact assessments',
        ],
        color: 'accent-yellow',
        icon: 'Activity',
    },
    {
        title: 'Budget Analysis',
        slug: 'budget-analysis',
        description: 'In-depth analysis of Ghana\'s national budget, revenue projections, and expenditure allocations.',
        fullContent: `
            <p class="mb-4">Our Budget Analysis program dissects the national budget to reveal how public funds are allocated and spent. We look beyond the headline numbers to analyze sectoral allocations, revenue mobilization strategies, and the efficiency of public expenditure.</p>
            <p class="mb-4">Through simple visualizations and plain-language reports, we help citizens understand how the budget affects their daily lives and the delivery of public services.</p>
        `,
        features: [
            'Budget breakdown by sector',
            'Revenue vs. expenditure analysis',
            'Historical budget comparisons',
            'Policy recommendations',
        ],
        color: 'accent-green',
        icon: 'PieChart',
    },
    {
        title: 'Fiscal Policy Research',
        slug: 'fiscal-policy',
        description: 'Research and policy analysis on Ghana\'s fiscal policy framework, tax reforms, and revenue mobilization.',
        fullContent: `
            <p class="mb-4">The Fiscal Policy Research unit conducts high-quality research into Ghana's tax system, fiscal rules, and public financial management legal framework. We advocate for progressive tax reforms that promote equity and economic growth.</p>
        `,
        features: [
            'Policy briefs and papers',
            'Tax policy analysis',
            'Revenue forecasting',
            'Stakeholder engagement',
        ],
        color: 'primary-500',
        icon: 'FileText',
    },
    {
        title: 'Transparency & Accountability',
        slug: 'transparency',
        description: 'Promoting transparency in public financial management and holding government accountable for fiscal decisions.',
        fullContent: `
            <p class="mb-4">We believe that transparency is the bedrock of good governance. Our initiatives focus on opening up government data, tracking public procurement, and creating platforms for citizen-government dialogue.</p>
        `,
        features: [
            'Open data initiatives',
            'Citizen engagement forums',
            'Advocacy campaigns',
            'Accountability reports',
        ],
        color: 'accent-gold',
        icon: 'Eye',
    },
    {
        title: 'Capacity Building',
        slug: 'capacity-building',
        description: 'Training and workshops for CSOs, journalists, and citizens on economic governance and data literacy.',
        fullContent: `
            <p class="mb-4">To effectively demand accountability, citizens and civil society actors need the right skills. Our Capacity Building program offers training in economic literacy, budget tracking, and data journalism.</p>
        `,
        features: [
            'Training workshops',
            'Data literacy programs',
            'Mentorship opportunities',
            'Resource materials',
        ],
        color: 'primary-400',
        icon: 'Users',
    },
];

const categoriesData = [
    { name: 'Economy', slug: 'economy', description: 'General economic news and updates' },
    { name: 'Debt', slug: 'debt', description: 'Public debt analysis and reports' },
    { name: 'IMF', slug: 'imf', description: 'Updates on the IMF Extended Credit Facility' },
    { name: 'Policy', slug: 'policy', description: 'Fiscal and monetary policy briefs' },
    { name: 'News', slug: 'news', description: 'Latest news and press releases' },
    { name: 'Analysis', slug: 'analysis', description: 'In-depth analysis and commentary' },
    { name: 'Reports', slug: 'reports', description: 'Research reports and documents' },
    { name: 'Press Statements', slug: 'press-statements', description: 'Official press statements' },
    { name: 'Policy Papers', slug: 'policy-papers', description: 'Policy strategy papers' },
];

async function main() {
    console.log('🚀 Starting ULTIMATE Production Seed...');

    try {
        // 1. Users
        console.log('👤 Seeding users...');
        const adminEmail = 'admin@egpghana.org';
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                name: 'EGP Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                active: true,
            },
        });

        // 2. Categories
        console.log('📂 Seeding categories...');
        for (const cat of categoriesData) {
            await prisma.category.upsert({
                where: { slug: cat.slug },
                update: { ...cat },
                create: { ...cat },
            });
        }
        const categories = await prisma.category.findMany();
        const catMap = categories.reduce((acc, cat) => {
            acc[cat.slug] = cat.id;
            return acc;
        }, {} as Record<string, string>);

        // 3. Articles (Key starting articles)
        console.log('📰 Seeding articles...');
        const articles = [
            {
                title: "Analyzing the President’s Five Pillars for Ghana’s Economic and Social Transformation",
                slug: "analyzing-presidents-five-pillars",
                imageUrl: "/assets/images/publications/presidents-five-pillars.jpeg",
                content: `This assessment examines the President’s Five Pillars as a strategic framework...`,
                excerpt: "An empirical assessment of the feasibility and impact of the new strategic framework for Ghana's transformation.",
                categoryId: catMap['policy'] || categories[0].id,
                author: "EGP Research Team",
                publishedAt: new Date('2026-01-08'),
                featured: true,
                tags: ['Policy', 'Economy', 'Development', 'Analysis'],
            },
            {
                title: "IMF Approves Fifth Review of Ghana Programme, Set to Release US$385 Million",
                slug: "imf-approves-fifth-review-stabilisation-gains",
                imageUrl: "/assets/images/publications/imf-review-approval.jpeg",
                content: `The Executive Board of the International Monetary Fund (IMF) has completed the fifth review...`,
                excerpt: "IMF Board completes fifth review, unlocking $385m disbursement as macroeconomic stabilization takes hold.",
                categoryId: catMap['imf'] || categories[0].id,
                author: "Abdulkarim Mohammed",
                publishedAt: new Date('2025-12-19'),
                featured: true,
                tags: ['IMF', 'Economy', 'Fiscal Policy', 'News'],
            },
            {
                title: "Bank of Ghana’s 350bps Rate Cut: What It Means for Ghana’s Economy",
                slug: "bog-350bps-rate-cut-implications",
                imageUrl: "/assets/images/publications/bog-rate-cut.jpg",
                content: `The Monetary Policy Committee (MPC) of the Bank of Ghana has concluded its 127th meeting...`,
                excerpt: "The MPC's bold 350bps rate cut signals a turning point for Ghana’s recovery.",
                categoryId: catMap['economy'] || categories[0].id,
                author: "EGP Research Team",
                publishedAt: new Date('2025-11-28'),
                featured: true,
                tags: ['Monetary Policy', 'BoG', 'Interest Rates', 'News'],
            }
        ];
        for (const article of articles) {
            await prisma.article.upsert({
                where: { slug: article.slug },
                update: article,
                create: article,
            });
        }

        // 4. Programs
        console.log('🛠 Seeding programs...');
        for (const prog of programsData) {
            await prisma.program.upsert({
                where: { slug: prog.slug },
                update: prog,
                create: prog,
            });
        }

        // 5. Staff
        console.log('👥 Seeding staff...');
        const staffData = [
            { name: "Beauty Emefa Narteh", position: "Executive Secretary", order: 1 },
            { name: "Abdulkarim Mohammed", position: "Coordinator", order: 2 },
            { name: "Ebenezer Otu Okley", position: "Programmes Officer", order: 3 }
        ];
        for (const s of staffData) {
            const existing = await prisma.staff.findFirst({ where: { name: s.name } });
            if (existing) {
                await prisma.staff.update({ where: { id: existing.id }, data: s });
            } else {
                await prisma.staff.create({ data: { ...s, active: true } });
            }
        }

        // 6. DASHBOARDS DATA (Clear & Re-create for fresh dashboards)
        console.log('📊 Seeding Dashboard Data (Debt, IMF, Economy)...');

        // Wipe existing dashboard indicators to avoid primary key conflicts
        await prisma.economicData.deleteMany({});

        // --- DEBT DATA ---
        const debtData = [];
        const startDate = new Date('2019-01-01');
        let baseDebt = 200000000000;
        for (let i = 0; i < 84; i++) {
            const date = new Date(startDate);
            date.setMonth(startDate.getMonth() + i);
            const year = date.getFullYear();

            let growthRate = year >= 2022 ? 0.025 : 0.015;
            baseDebt *= (1 + growthRate);

            debtData.push({
                indicator: 'TOTAL_DEBT',
                value: baseDebt,
                date: date,
                source: 'Ministry of Finance / IMF',
                unit: 'GHS',
                metadata: { domestic: baseDebt * 0.48, external: baseDebt * 0.52 }
            });

            debtData.push({
                indicator: 'DEBT_TO_GDP_RATIO',
                value: year === 2025 ? 45.5 : (70 + Math.random() * 20),
                date: date,
                source: 'Bank of Ghana',
                unit: '%',
            });
        }
        await prisma.economicData.createMany({ data: debtData });

        // --- IMF DATA ---
        const imfOverview = {
            indicator: 'IMF_PROGRAM_TOTAL',
            value: 3000000000,
            date: new Date('2023-05-17'),
            source: 'IMF',
            unit: 'SDR',
            metadata: { programType: 'Extended Credit Facility', duration: '36 months', endDate: '2026-05-17' }
        };
        await prisma.economicData.create({ data: imfOverview });

        const disbursements = [
            { date: '2023-06-01', actual: 600000000, status: 'Completed' },
            { date: '2023-09-01', actual: 360000000, status: 'Completed' },
            { date: '2024-01-19', actual: 600000000, status: 'Completed' },
            { date: '2024-07-02', actual: 600000000, status: 'Completed' },
            { date: '2025-01-15', actual: 360000000, status: 'Completed' },
        ];
        for (const d of disbursements) {
            await prisma.economicData.create({
                data: {
                    indicator: 'IMF_DISBURSEMENT',
                    value: d.actual,
                    date: new Date(d.date),
                    source: 'IMF',
                    unit: 'SDR',
                    metadata: { status: d.status }
                }
            });
        }

        // --- ECONOMY DATA ---
        await prisma.economicData.createMany({
            data: [
                { indicator: 'GDP_GROWTH', value: 5.7, date: new Date('2024-12-31'), source: 'GSS', unit: '%' },
                { indicator: 'INFLATION_RATE', value: 15.1, date: new Date('2025-01-31'), source: 'GSS', unit: '%' },
                { indicator: 'EXCHANGE_RATE_USD', value: 16.2, date: new Date('2025-02-11'), source: 'BoG', unit: 'GHS' },
                { indicator: 'UNEMPLOYMENT_RATE', value: 14.7, date: new Date('2024-12-31'), source: 'GSS', unit: '%' }
            ]
        });

        console.log('✅ Dashboard data seeded');

        // 7. Events
        console.log('📅 Seeding events...');
        const events = [
            {
                title: "Launch of Public Debt Tracker and IMF Dashboard",
                slug: "launch-of-public-debt-tracker-and-imf-dashboard",
                description: "We unveiled our digital tools that allow citizens and stakeholders to monitor Ghana's public debt.",
                location: "Accra, Ghana",
                startDate: new Date('2025-02-13T09:00:00'),
                featured: true,
            }
        ];
        for (const evt of events) {
            await prisma.event.upsert({
                where: { slug: evt.slug },
                update: evt,
                create: evt,
            });
        }

        console.log('✨ ALL PRODUCTION CONTENT READY!');
    } catch (e) {
        console.error('❌ SEED ERROR:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
