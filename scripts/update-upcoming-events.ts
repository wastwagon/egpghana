import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateEvents() {
    console.log('🗓️ Updating upcoming events...');

    const events = [
        {
            title: "2026 EGP Members Strategic Meeting",
            slug: "2026-egp-members-strategic-meeting",
            description: "A high-level gathering of Economic Governance Platform members to define the strategic roadmap for 2026. Key agenda items include strengthening civil society oversight, enhancing fiscal transparency networks, and coordinating advocacy efforts for the upcoming fiscal year.",
            location: "Alisa Hotel, Accra",
            startDate: new Date('2026-02-21T09:00:00'),
            endDate: new Date('2026-02-21T16:00:00'),
            featured: true,
        },
        {
            title: "National Forum on the Governance Diagnostics Report",
            slug: "governance-diagnostics-report-forum",
            description: "An expert-led forum dissecting the findings of the latest Governance Diagnostics Report. Stakeholders from government, civil society, and development partners will convene to discuss structural vulnerabilities, anti-corruption measures, and actionable steps to improve public sector integrity.",
            location: "British Council, Accra",
            startDate: new Date('2026-02-26T10:00:00'), // Proposed date
            endDate: new Date('2026-02-26T14:00:00'),
            featured: true,
        },
        {
            title: "Press Conference: The State of Public Financial Management",
            slug: "press-conference-public-financial-management",
            description: "EGP holds a major press briefing to assess the government's progress on Public Financial Management (PFM) reforms. We will present evidence-based analysis on expenditure control, arrears clearance, and the effectiveness of current fiscal responsibility mechanisms.",
            location: "Ghana Journalists Association Hall",
            startDate: new Date('2026-03-05T10:00:00'), // Proposed date
            endDate: new Date('2026-03-05T12:00:00'),
            featured: false,
        }
    ];

    try {
        for (const event of events) {
            await prisma.event.upsert({
                where: { slug: event.slug },
                update: event,
                create: event,
            });
            console.log(`✅ Upserted event: ${event.title}`);
        }
    } catch (error) {
        console.error('❌ Error updating events:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateEvents();
