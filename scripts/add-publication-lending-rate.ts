import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addLendingRateArticle() {
    console.log('📝 Adding "Ghana Reference Rate at 17%" article...');

    try {
        // Find the 'economy' category
        const category = await prisma.category.findUnique({
            where: { slug: 'economy' },
        });

        if (!category) {
            throw new Error('Category "economy" not found. Please run seed-content.ts first.');
        }

        const articleData = {
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
            categoryId: category.id,
            author: "EGP Research Team", // Assuming author
            publishedAt: new Date(), // Now
            featured: true,
            tags: ['Lending Rate', 'Economy', 'Private Sector', 'SMEs'],
        };

        const article = await prisma.article.upsert({
            where: { slug: articleData.slug },
            update: articleData,
            create: articleData,
        });

        console.log(`✅ Article "${article.title}" added/updated successfully!`);

    } catch (error) {
        console.error('❌ Error adding article:', error);
    } finally {
        await prisma.$disconnect();
    }
}

addLendingRateArticle();
