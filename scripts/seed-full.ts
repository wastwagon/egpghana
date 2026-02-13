
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

async function seedFull() {
    console.log('🌱 Starting comprehensive data seed...');

    try {
        // 1. Users (Admin)
        const adminEmail = 'admin@egpghana.org';
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await prisma.user.upsert({
            where: { email: adminEmail },
            update: {}, // Don't reset password if exists
            create: {
                name: 'EGP Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                active: true,
            },
        });
        console.log('✅ Admin user ready');

        // 2. Categories
        console.log('🌱 Seeding categories...');
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

        // 3. Articles
        const articles = [
            {
                title: "Analyzing the President’s Five Pillars for Ghana’s Economic and Social Transformation",
                slug: "analyzing-presidents-five-pillars",
                imageUrl: "/assets/images/publications/presidents-five-pillars.jpeg",
                content: "This assessment examines the President’s Five Pillars as a strategic framework for Ghana’s economic and social transformation as reported by the Daily Graphic, with the aim of evaluating their feasibility, coherence, and potential impact...",
                excerpt: "An empirical assessment of the feasibility and impact of the new strategic framework for Ghana's transformation.",
                categoryId: catMap['policy'],
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
                categoryId: catMap['imf'],
                author: "Abdulkarim Mohammed",
                publishedAt: new Date('2026-01-15'),
                featured: true,
                tags: ['IMF', 'Economy', 'Fiscal Policy', 'News'],
            },
            {
                title: "Bank of Ghana’s 350bps Rate Cut: What It Means for Ghana’s Economy",
                slug: "bog-350bps-rate-cut-implications",
                imageUrl: "/assets/images/publications/bog-rate-cut.jpg",
                content: `The Monetary Policy Committee (MPC) of the Bank of Ghana has concluded its 127th meeting with a significant decision — a reduction in the Monetary Policy Rate (MPR) by 350 basis points, from 21.5% to 18%.`,
                excerpt: "The MPC's bold 350bps rate cut signals a turning point for Ghana’s recovery. What does this mean for businesses and households?",
                categoryId: catMap['economy'],
                author: "EGP Research Team",
                publishedAt: new Date('2026-01-05'),
                featured: true,
                tags: ['Monetary Policy', 'BoG', 'Interest Rates', 'News'],
            },
            {
                title: "Fitch Projects MPR Drop to 16.5% by 2026; What It Means for Ghana",
                slug: "fitch-projects-mpr-drop-16-5-2026",
                imageUrl: "/assets/images/publications/fitch-mpr-drop.jpeg",
                content: `Fitch Solutions has projected that Ghana’s Monetary Policy Rate (MPR) could decline to 16.5% by 2026...`,
                excerpt: "Fitch Solutions forecasts further easing of Ghana's policy rate to 16.5% by 2026, contingent on sustained disinflation.",
                categoryId: catMap['economy'],
                author: "EGP Research Team",
                publishedAt: new Date('2026-01-20'),
                featured: false,
                tags: ['Fitch', 'Economy', 'Projections', 'News', 'Analysis'],
            },
            {
                title: "EGP Participates in CSO Budget Forum Review of the 2026 National Budget",
                slug: "egp-participates-cso-budget-forum-2026",
                imageUrl: "/assets/images/publications/cso-budget-forum.jpeg",
                content: `The Economic Governance Platform (EGP) joined other Civil Society Organisations (CSOs) at the Annual CSO Budget Forum...`,
                excerpt: "EGP joins CSOs to scrutinize the 2026 Budget, calling for realistic revenue targets and protection of social spending.",
                categoryId: catMap['policy'],
                author: "EGP Communications",
                publishedAt: new Date('2026-01-25'),
                featured: false,
                tags: ['Budget', 'CSO', 'Advocacy', 'News'],
            },
            {
                title: "Ghanaian CSOs bid farewell to outgoing IMF boss",
                slug: "ghanaian-csos-bid-farewell-imf-boss",
                imageUrl: "/assets/images/publications/imf-boss-farewell-1.jpg",
                content: `A coalition of Ghanaian Civil Society Organisations (CSOs)...`,
                excerpt: "Civil Society groups reflect on engagement with the IMF as the Resident Representative concludes their tenure.",
                categoryId: catMap['imf'],
                author: "EGP Communications",
                publishedAt: new Date('2026-02-05'),
                featured: false,
                tags: ['IMF', 'Civil Society', 'Diplomacy', 'News'],
            },
            {
                title: "Budget 2026 – An EGP analysis: Consolidating gains, but vigilance required",
                slug: "budget-2026-egp-analysis-consolidating-gains",
                imageUrl: "/assets/images/publications/budget-2026-analysis.jpeg",
                content: "The 2026 Budget Statement, presented under the theme 'Consolidating Stability for Shared Growth'...",
                excerpt: "EGP's analysis of the 2026 Budget: A balance between fiscal consolidation and the need for social protection.",
                categoryId: catMap['economy'],
                author: "EGP Research Team",
                publishedAt: new Date('2026-02-10'),
                featured: true,
                tags: ['Budget 2026', 'Fiscal Policy', 'Analysis'],
            },
            {
                title: "Sustainable Debt Management in Ghana",
                slug: "sustainable-debt-management-ghana",
                imageUrl: "/assets/images/publications/sustainable-debt-management.png",
                content: "Ghana has been an active participant in the Highly Indebted Poor Countries (HIPC) Initiative...",
                excerpt: "A deep dive into Ghana's debt history, the recent crisis, and the path toward sustainable borrowing.",
                categoryId: catMap['debt'],
                author: "Ebenezer Otu Okley",
                publishedAt: new Date('2026-02-01'),
                featured: true,
                tags: ['Debt', 'Fiscal Responsibility', 'Economy', 'Analysis'],
            },
            {
                title: "How Ghana’s debt crisis caused nightmares and injuries on Bolgatanga-Bawku road",
                slug: "ghana-debt-crisis-bolgatanga-bawku-road",
                imageUrl: "/assets/images/publications/debt-crisis-road.jpg",
                content: "The Bolgatanga-Bawku-Polimakom road is more than just a stretch of asphalt...",
                excerpt: "The stalled Bolgatanga-Bawku road project stands as a grim symbol of the real-world impact of Ghana's debt crisis.",
                categoryId: catMap['debt'],
                author: "EGP Research Team",
                publishedAt: new Date('2026-02-03'),
                featured: true,
                tags: ['Debt', 'Infrastructure', 'Upper East Region', 'Analysis'],
            },
            {
                title: "Ghana’s Lending Rate at 17% and Its Impact",
                slug: "ghana-lending-rate-17-percent-impact",
                imageUrl: "/assets/images/publications/ghana-lending-rate-17-percent.jpg",
                content: `Ghana’s lending environment has improved significantly in the past year as key macroeconomic indicators; inflation, policy rates, foreign reserves, and growth prospects have strengthened. As a result, the Ghana Reference Rate (GRR) - the benchmark that commercial banks use to price most loans has fallen sharply from near 30% at the start of 2025 to around 17.86% in October 2025, with occasional slight shifts month-to-month around that level.

This decline reflects the cumulative transmission of aggressive cuts by the Bank of Ghana’s Monetary Policy Committee (MPC) including reductions that have brought the policy rate down to as low as 15.5% by early 2026 and broader improvements in inflation and market conditions.

**Why this matters for the private sector:**

1. **Lower cost of borrowing:** A reference rate near 17–18% significantly below the 29–30% seen earlier in 2025 should gradually lead to cheaper loan offers from banks for businesses and households. Cheaper credit improves firms’ ability to invest in expansion, technology, and working capital, which supports higher production and competitiveness across sectors.

2. **Increased confidence and credit growth:** As borrowing becomes more affordable and predictable, private sector credit growth is recovering. Real terms growth in private sector credit has shifted from contraction earlier in the year to positive growth, indicating that businesses are beginning to borrow and invest again.

3. **Support for SMEs:** Small and medium-sized enterprises typically more sensitive to financing costs stand to benefit disproportionately if banks pass through lower benchmark rates to actual lending products. This can help them hire more staff, buy equipment, and scale operations.

**However, important caveats remain:**

1. **Actual lending rates vary:** While the GRR is a strong baseline, commercial banks add risk premiums, operating costs, and other charges to determine the final rate offered to borrowers. As a result, some loans especially to higher-risk borrowers are still priced well above the benchmark. This means that not all businesses feel the full benefit immediately.

2. **Transmission lag:** Monetary policy changes don’t instantly translate into loan pricing. Banks may take time to adjust their portfolios, and some segments (e.g., long-term business loans) are slower to reflect benchmark rate declines.

3. **Broader economic context:** Even at 17%, borrowing costs remain relatively high compared with some emerging markets, and so financing is still a meaningful cost for businesses compared with the earlier period of extreme rates.

The drop in Ghana’s benchmark lending rate toward 17% is a meaningful improvement from the tighter credit conditions of the past. If commercial banks continue to pass those reductions through to borrowers, businesses should experience lower financing costs, stronger investment capacity, and improved growth prospects particularly for SMEs. However, the full benefits depend on banks’ pricing decisions and the pace of transmission from policy to actual loan terms.`,
                excerpt: "Ghana's benchmark lending rate drops to ~17%, signaling lower borrowing costs and private sector recovery, though transmission lags remain.",
                categoryId: catMap['economy'],
                author: "EGP Research Team",
                publishedAt: new Date('2026-02-12'),
                featured: true,
                tags: ['Lending Rate', 'Economy', 'Private Sector', 'SMEs', 'Analysis', 'News'],
            },
        ];

        console.log('🌱 Seeding articles...');
        for (const article of articles) {
            await prisma.article.upsert({
                where: { slug: article.slug },
                update: article,
                create: article,
            });
        }

        // 4. Programs
        console.log('🌱 Seeding programs...');
        for (const prog of programsData) {
            await prisma.program.upsert({
                where: { slug: prog.slug },
                update: prog,
                create: prog,
            });
        }

        // 5. Events
        console.log('🌱 Seeding events...');
        const events = [
            {
                title: "Launch of Public Debt Tracker and IMF Dashboard",
                slug: "launch-of-public-debt-tracker-and-imf-dashboard",
                description: "We unveiled our digital tools that allow citizens and stakeholders to monitor Ghana's public debt and IMF program implementation.",
                location: "Accra, Ghana",
                startDate: new Date('2025-02-13T09:00:00'),
                endDate: new Date('2025-02-13T12:00:00'),
                featured: true,
            },
            {
                title: "2025 EGP Member Strategic Meeting",
                slug: "2025-egp-member-strategic-meeting",
                description: "Our members gathered to set the strategic direction for 2025, focusing on strengthening fiscal transparency initiatives and advocacy work.",
                location: "EGP Conference Room",
                startDate: new Date('2025-02-12T09:00:00'),
                endDate: new Date('2025-02-12T17:00:00'),
                featured: false,
            },
        ];

        for (const evt of events) {
            await prisma.event.upsert({
                where: { slug: evt.slug },
                update: evt,
                create: evt,
            });
        }

        // 6. Staff
        console.log('🌱 Seeding staff...');
        const staff = [
            {
                name: "Beauty Emefa Narteh",
                position: "Executive Secretary",
                bio: "Beauty Emefa Narteh is the Executive Secretary of GACC...",
                order: 1,
            },
            {
                name: "Abdulkarim Mohammed",
                position: "Coordinator",
                bio: "With more than eighteen (18) active years of hands-on experience...",
                order: 2,
            },
            {
                name: "Ebenezer Otu Okley",
                position: "Programmes Officer",
                bio: "Ebenezer Otu Okley is a Programmes Officer at the Economic Governance Platform (EGP)...",
                order: 3,
            }
        ];

        for (const s of staff) {
            const existing = await prisma.staff.findFirst({ where: { name: s.name } });
            if (existing) {
                await prisma.staff.update({ where: { id: existing.id }, data: s });
            } else {
                await prisma.staff.create({ data: s });
            }
        }

        console.log('🎉 Full data seed completed!');
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seedFull();
