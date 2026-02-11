
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
                content: "This assessment examines the President’s Five Pillars as a strategic framework for Ghana’s economic and social transformation as reported by the Daily Graphic, with the aim of evaluating their feasibility, coherence, and potential impact. It seeks to move beyond broad policy statements by grounding the pillars in empirical evidence, current economic realities, and institutional capacity.\n\nThe assessment draws on credible national and international data to analyze how each pillar aligns with Ghana’s development challenges, including fiscal constraints, unemployment, human capital gaps, governance weaknesses, environmental pressures, and social inclusion. It evaluates both the opportunities presented by the pillars and the structural bottlenecks that could limit effective implementation.\n\n1. A Productive and Diversified Economy\nGhana’s economic structure remains highly concentrated, making diversification an urgent necessity. According to the Ghana Statistical Service (GSS), agriculture, industry, and services contributed 21.3%, 32.4%, and 46.3% to GDP respectively in 2024, yet exports remain dominated by gold, cocoa, and oil, which together account for over 80% of export earnings. Manufacturing contributes less than 11% of GDP, well below the levels observed in peer emerging economies.\nProductivity growth is also weak; the World Bank estimates Ghana’s labour productivity growth at below 1.5% annually over the past decade. This constrains job creation despite positive GDP growth. Achieving this pillar therefore requires scaling industrial value addition, lowering energy and credit costs, and expanding SME access to finance particularly long-term capital if diversification is to translate into resilience and employment.\n\n2. Human Capital Development\nHuman capital outcomes in Ghana reveal a strong access–quality gap. While Free SHS has raised secondary school enrolment by over 30% since 2017, learning outcomes remain weak. The World Bank’s Human Capital Index (2023) places Ghana at 0.44, meaning a child born today will be only 44% as productive as they could be with full education and health.\nUnemployment among youth (15–35 years) stands at over 19%, with underemployment significantly higher, reflecting persistent skills mismatch. In health, Ghana spends about 3.2% of GDP, below the Abuja target of 15% of government expenditure, contributing to NHIS arrears and health worker emigration. Without stronger investment in TVET, skills alignment, and health system financing, the human capital pillar risks yielding limited economic returns.\n\n3. Good Governance and National Discipline\nGovernance weaknesses have been a central driver of Ghana’s fiscal distress. Public debt rose from 55% of GDP in 2019 to over 90% in 2023, prompting IMF intervention. The IMF Governance Diagnostic Assessment (2024) highlights vulnerabilities in procurement, SOE oversight, and asset declaration enforcement.\nCorruption-related inefficiencies are estimated by Transparency International and UNDP to cost Ghana 2–3% of GDP annually, equivalent to several billion cedis in lost public resources. While institutions such as the Auditor-General and OSP exist, enforcement remains uneven. This pillar can only be realized if fiscal rules are respected beyond IMF conditionality, procurement transparency is strengthened, and accountability institutions are insulated from political influence.",
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
                content: `The Executive Board of the International Monetary Fund (IMF) has completed the fifth review of Ghana’s 39-month Extended Credit Facility (ECF) arrangement, approving the immediate disbursement of about US$385 million (SDR 267.5 million). This brings total IMF disbursements to Ghana to approximately US$2.8 billion under the US$3 billion programme approved in May 2023.`,
                excerpt: "IMF Board completes fifth review, unlocking $385m disbursement as macroeconomic stabilization takes hold.",
                categoryId: catMap['imf'],
                author: "Abdulkarim Mohammed",
                publishedAt: new Date('2025-12-19'),
                featured: true,
                tags: ['IMF', 'Economy', 'Fiscal Policy', 'News'],
            },
            {
                title: "Bank of Ghana’s 350bps Rate Cut: What It Means for Ghana’s Economy",
                slug: "bog-350bps-rate-cut-implications",
                imageUrl: "/assets/images/publications/bog-rate-cut.jpg",
                content: `The Monetary Policy Committee (MPC) of the Bank of Ghana has concluded its 127th meeting with a significant decision — a reduction in the Monetary Policy Rate (MPR) by 350 basis points, from 21.5% to 18%. This is the largest single cut in the current easing cycle and marks a turning point in Ghana’s macroeconomic recovery efforts.`,
                excerpt: "The MPC's bold 350bps rate cut signals a turning point for Ghana’s recovery. What does this mean for businesses and households?",
                categoryId: catMap['economy'],
                author: "EGP Research Team",
                publishedAt: new Date('2025-11-28'),
                featured: true,
                tags: ['Monetary Policy', 'BoG', 'Interest Rates', 'News'],
            },
            {
                title: "Fitch Projects MPR Drop to 16.5% by 2026; What It Means for Ghana",
                slug: "fitch-projects-mpr-drop-16-5-2026",
                imageUrl: "/assets/images/publications/fitch-mpr-drop.jpeg",
                content: `Fitch Solutions has projected that Ghana’s Monetary Policy Rate (MPR) could decline to 16.5% by 2026, signalling expectations of easing inflation pressures and a gradually stabilising macroeconomic environment.`,
                excerpt: "Fitch Solutions forecasts further easing of Ghana's policy rate to 16.5% by 2026, contingent on sustained disinflation.",
                categoryId: catMap['economy'],
                author: "EGP Research Team",
                publishedAt: new Date('2025-11-20'),
                featured: false,
                tags: ['Fitch', 'Economy', 'Projections', 'News', 'Analysis'],
            },
            {
                title: "EGP Participates in CSO Budget Forum Review of the 2026 National Budget",
                slug: "egp-participates-cso-budget-forum-2026",
                imageUrl: "/assets/images/publications/cso-budget-forum.jpeg",
                content: `The Economic Governance Platform (EGP) joined other Civil Society Organisations (CSOs) at the Annual CSO Budget Forum to review and analyze the 2026 National Budget Statement and Economic Policy.`,
                excerpt: "EGP joins CSOs to scrutinize the 2026 Budget, calling for realistic revenue targets and protection of social spending.",
                categoryId: catMap['policy'],
                author: "EGP Communications",
                publishedAt: new Date('2025-11-18'),
                featured: false,
                tags: ['Budget', 'CSO', 'Advocacy', 'News'],
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
        await prisma.staff.deleteMany(); // Reset staff order
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
        await prisma.staff.createMany({ data: staff });

        console.log('🎉 Full data seed completed!');
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seedFull();
