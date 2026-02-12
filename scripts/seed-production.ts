import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Check if exported data file exists
const dataFilePath = path.join(__dirname, 'local_data_export.json');
const hasExportedData = fs.existsSync(dataFilePath);

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
    console.log('🚀 Starting Production Seed...');

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

        // 3. Programs
        console.log('🛠 Seeding programs...');
        for (const prog of programsData) {
            await prisma.program.upsert({
                where: { slug: prog.slug },
                update: prog,
                create: prog,
            });
        }

        // 4. Staff
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

        // 5. Import data from exported JSON if available
        if (hasExportedData) {
            console.log('📥 Importing data from local export...');
            const exportedData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

            // Clear existing data
            console.log('🗑️ Clearing old articles, events, and economic data...');
            await prisma.economicData.deleteMany({});
            await prisma.article.deleteMany({});
            await prisma.event.deleteMany({});

            // Import articles
            console.log(`📰 Importing ${exportedData.articles.length} articles...`);
            for (const article of exportedData.articles) {
                await prisma.article.create({
                    data: {
                        ...article,
                        publishedAt: new Date(article.publishedAt)
                    }
                });
            }

            // Import events
            console.log(`📅 Importing ${exportedData.events.length} events...`);
            for (const event of exportedData.events) {
                await prisma.event.create({
                    data: {
                        ...event,
                        startDate: new Date(event.startDate),
                        endDate: event.endDate ? new Date(event.endDate) : null
                    }
                });
            }

            // Import economic data
            console.log(`💹 Importing ${exportedData.economicData.length} economic data points...`);
            for (const econ of exportedData.economicData) {
                await prisma.economicData.create({
                    data: {
                        ...econ,
                        date: new Date(econ.date)
                    }
                });
            }

            console.log('✅ Imported data from local export successfully!');
        } else {
            console.log('⚠️ No exported data file found. Skipping articles, events, and economic data import.');
            console.log('💡 Run "npm run export:data" locally and commit the generated file to include data.');
        }

        console.log('✨ PRODUCTION SEED COMPLETED!');
    } catch (e) {
        console.error('❌ SEED ERROR:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
