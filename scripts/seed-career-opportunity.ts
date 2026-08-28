import { PrismaClient } from '@prisma/client';
import {
    STRATEGIC_REVIEW_EOI_DEADLINE_ISO,
    STRATEGIC_REVIEW_END_ISO,
    STRATEGIC_REVIEW_NOTIFY_EMAIL,
    STRATEGIC_REVIEW_SLUG,
    STRATEGIC_REVIEW_START_ISO,
    STRATEGIC_REVIEW_SUMMARY,
    STRATEGIC_REVIEW_TITLE,
    STRATEGIC_REVIEW_TOR_HTML,
} from '../src/lib/career-tor-content';

const prisma = new PrismaClient();

const opportunityData = {
    title: STRATEGIC_REVIEW_TITLE,
    type: 'consultancy',
    summary: STRATEGIC_REVIEW_SUMMARY,
    content: STRATEGIC_REVIEW_TOR_HTML,
    deadline: new Date(STRATEGIC_REVIEW_EOI_DEADLINE_ISO),
    startDate: new Date(STRATEGIC_REVIEW_START_ISO),
    endDate: new Date(STRATEGIC_REVIEW_END_ISO),
    notifyEmail: STRATEGIC_REVIEW_NOTIFY_EMAIL,
};

export async function upsertStrategicReviewOpportunity() {
    return prisma.careerOpportunity.upsert({
        where: { slug: STRATEGIC_REVIEW_SLUG },
        update: opportunityData,
        create: {
            slug: STRATEGIC_REVIEW_SLUG,
            status: 'open',
            ...opportunityData,
        },
    });
}

async function main() {
    const row = await upsertStrategicReviewOpportunity();
    console.log(`✅ Career opportunity ready: ${row.slug} (${row.id})`);
    console.log(`   Deadline: ${row.deadline?.toISOString()}`);
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
