import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedContent() {
    console.log('🌱 Seeding content (Articles, Events, Resources, Team)...');

    try {
        // 1. Clean up existing data (optional, but good for idempotency)
        // Be careful in prod, but for dev it's fine.
        await prisma.article.deleteMany();
        await prisma.category.deleteMany();
        await prisma.event.deleteMany();
        await prisma.resource.deleteMany();
        await prisma.staff.deleteMany();
        console.log('✅ Cleared existing content data');

        // 2. Categories
        const categories = await prisma.category.createManyAndReturn({
            data: [
                { name: 'Economy', slug: 'economy', description: 'General economic news and updates' },
                { name: 'Debt', slug: 'debt', description: 'Public debt analysis and reports' },
                { name: 'IMF', slug: 'imf', description: 'Updates on the IMF Extended Credit Facility' },
                { name: 'Policy', slug: 'policy', description: 'Fiscal and monetary policy briefs' },
            ],
        });
        console.log(`✅ Created ${categories.length} categories`);

        const catMap = categories.reduce((acc, cat) => {
            acc[cat.slug] = cat.id;
            return acc;
        }, {} as Record<string, string>);

        // 3. Articles (Updated with real themes)
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
                content: `The Executive Board of the International Monetary Fund (IMF) has completed the fifth review of Ghana’s 39-month Extended Credit Facility (ECF) arrangement, approving the immediate disbursement of about US$385 million (SDR 267.5 million). This brings total IMF disbursements to Ghana to approximately US$2.8 billion under the US$3 billion programme approved in May 2023.

According to the IMF, Ghana’s performance under the programme has been broadly satisfactory, with all quantitative performance criteria and indicative targets for the review met.The Fund noted that macroeconomic stabilisation is gaining momentum, supported by stronger- than - expected economic growth, improved fiscal and external balances, and progress on debt restructuring.Inflation has returned to single - digit levels for the first time since 2021, while foreign exchange reserves have exceeded programme targets, aided by strong gold and cocoa exports and renewed investor confidence.

The IMF acknowledged continued progress on public debt restructuring, with Ghana having signed bilateral agreements with several official creditors and reached Agreements in Principle with multiple commercial creditors.Fiscal discipline remains central to the programme, with Ghana on track to achieve a primary surplus of 1.5 % of GDP by end - 2025. The 2026 Budget, now before Parliament, aligns with programme objectives and the new fiscal responsibility framework, balancing consolidation with development and social protection priorities.

The Fund welcomed the Bank of Ghana’s cautious monetary easing, following declining inflation and recent appreciation of the cedi, while emphasizing that further easing should remain gradual and data - dependent.It also highlighted steps taken to safeguard financial stability, including reforms in state - owned banks, improved crisis management frameworks, and measures to reduce non - performing loans.

Despite the positive outlook, the IMF stressed that sustained reform momentum is essential.Stronger domestic revenue mobilization, improved public financial management, better oversight of state - owned enterprises, and deeper governance and anti - corruption reforms remain critical to maintaining macroeconomic stability, restoring debt sustainability, and creating an environment conducive to private - sector - led growth and job creation.`,
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
                content: `The Monetary Policy Committee (MPC) of the Bank of Ghana has concluded its 127th meeting with a significant decision — a reduction in the Monetary Policy Rate (MPR) by 350 basis points, from 21.5% to 18%. This is the largest single cut in the current easing cycle and marks a turning point in Ghana’s macroeconomic recovery efforts.

At the Economic Governance Platform(EGP), we view this decision as a clear signal of improving economic conditions and growing confidence in the country’s stabilization programme.

A Journey from Tight Control to Strategic Easing
This outcome did not emerge overnight.Over the past year, Ghana’s monetary policy stance moved through phases of restraint, discipline, and cautious adjustment.The policy rate peaked at 28 % earlier in 2025 when inflation remained persistent.Rather than relax prematurely, the Bank maintained a tight stance until firm disinflation indicators emerged.Only then did it begin easing — first in July, then again in September and October — culminating in this most recent and bold adjustment.

From the peak of 28 %, Ghana has now recorded a cumulative policy easing of 1,000 basis points, reflecting a carefully staged transition from inflation containment to economic stimulus.

Why the Bank Acted Now
Several macroeconomic developments shaped this decision:
• Inflation has fallen sharply — from over 23 % in January 2025 to 8 % in October, placing it squarely within the Bank’s medium - term target band for the first time since 2021.
• The cedi has stabilised strongly, supported by improved foreign reserves, a surplus current account, and renewed market confidence.
• Fiscal consolidation has taken hold, with Ghana recording a primary surplus and outperforming deficit targets in the first nine months of 2025.
• Economic activity is rebounding, with business confidence, consumption, and production all showing sustained improvement.

            Together, these factors provided the policy space for easing without undermining price stability.

What This Means for Businesses, Investors, and Households
The cut is expected to generate wide - ranging effects across the economy:
• Cheaper credit: Lending to the private sector is expected to pick up, especially for manufacturing, SMEs, and agribusiness.
• Lower government borrowing costs: Falling interest rates will ease pressure on the budget and free fiscal space for development spending.
• Treasury bill yields are likely to decline further, improving market liquidity.
• Improved investor sentiment: The combination of falling inflation and a stable exchange rate strengthens Ghana’s attractiveness to both domestic and international investors.

While market interest rates may not fall immediately to match the policy rate, EGP anticipates more favourable financing conditions within the next two quarters.

Risks That Still Require Vigilance
Despite the positive outlook, risks remain:
• Global commodity price shocks could reintroduce inflationary pressures.
• Capital outflows are possible as Ghana’s rate advantage narrows.
• Domestic demand growth could become excessive if not properly managed.

The Bank’s return to active liquidity management through short - term instruments will be critical to navigating this transition.

            EGP’s View
EGP believes the 350bps cut is a bold but justified decision.It reflects discipline, consistency, and confidence rooted in evidence, not sentiment.The current real interest rate remains positive, meaning inflation control is still intact even as growth is supported.

            However, sustaining these gains requires continued fiscal discipline, financial sector reform, and careful monitoring of macroeconomic risks.

The Way Forward
For businesses, this is the moment to plan investments strategically and negotiate financing more actively.
For policymakers, the task is to preserve hard - won stability through responsible fiscal management.
For investors, Ghana’s improving fundamentals present opportunity — but discipline must be maintained on all fronts.`,
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
                content: `Fitch Solutions has projected that Ghana’s Monetary Policy Rate (MPR) could decline to 16.5% by 2026, signalling expectations of easing inflation pressures and a gradually stabilising macroeconomic environment. This projection comes at a critical moment, as the Bank of Ghana’s Monetary Policy Committee (MPC) meets this week to set the next policy rate.

A potential downward trajectory in the policy rate reflects improving inflation dynamics, strengthened fiscal consolidation under the IMF - supported programme, and a recovering cedi.However, the path to lower interest rates will depend heavily on sustained policy credibility, revenue performance, and disciplined expenditure management.

For businesses and households, a future easing in the policy rate would mean lower borrowing costs, improved access to credit, and reduced pressure on the private sector.But Ghana is not there yet.Inflation, though declining, remains above target; global conditions are still uncertain; and domestic revenue mobilisation remains fragile.

As the MPC prepares its decision this week, EGP will be monitoring three key areas:
        1. Inflation Trends: Is the disinflation path durable enough to support aggressive cuts ?
            2. Currency Stability: Can the cedi withstand lower interest rates without triggering capital flight ?
                3. Fiscal Discipline: Will government spending in the coming months align with tight monetary policy ?

                    Fitch’s projection offers a glimpse of hope for a cheaper cost of credit in the medium term.But for now, all eyes are on the Bank of Ghana’s decision and the data that drives it.`,
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
                content: `The Economic Governance Platform (EGP) joined other Civil Society Organisations (CSOs) at the Annual CSO Budget Forum to review and analyze the 2026 National Budget Statement and Economic Policy. The forum, organized by the Civil Society Platform on the IMF Programme, provided a critical space for non-state actors to interrogate the government’s revenue and expenditure plans for the coming fiscal year.

During the session, EGP’s research team highlighted key concerns regarding the credibility of revenue projections and the allocation of resources to social protection programmes.While acknowledging the government's commitment to fiscal consolidation under the IMF programme, CSOs raised questions about the realism of the 2026 domestic revenue targets, given the underperformance in previous years.

Key takeaways from the forum included:
• The need for more aggressive expenditure rationalization to complement revenue measures.
• Concerns over the rising cost of debt service, which continues to crowd out discretionary spending.
• A call for greater transparency in the utilization of the Annual Budget Funding Amount(ABFA) from oil revenues.
• The importance of ring - fencing social spending to protect the most vulnerable from the impact of austerity measures.

The forum concluded with a communiqué urging Parliament to scrutinize the budget estimates rigorously before approval.EGP remains committed to providing evidence - based analysis to support this process and ensure that the 2026 budget delivers on its promise of stability and growth.`,
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
                content: `A coalition of Ghanaian Civil Society Organisations (CSOs), including the Economic Governance Platform (EGP), held a farewell meeting with the outgoing Resident Representative of the International Monetary Fund (IMF) to Ghana. The meeting served as an opportunity to reflect on the IMF’s engagement with civil society during a turbulent period in Ghana’s economic history.

The CSOs acknowledged the Resident Representative’s openness to dialogue and willingness to engage with non - state actors, a departure from the more opaque relationships of the past.They highlighted how regular briefings and access to data had empowered CSOs to monitor the IMF programme more effectively and hold the government accountable.

            However, the groups also raised lingering concerns.They pointed to the social impact of the rigorous fiscal adjustments required by the programme and urged the IMF to place a stronger emphasis on social impact assessments in future reviews.EGP specifically raised the issue of debt transparency and the need for the Fund to be more vocal about the governance reforms that are structural benchmarks of the programme.

<img src="/assets/images/publications/imf-boss-farewell-2.jpg" alt="Farewell Meeting" className="w-full h-auto rounded-xl my-6 shadow-md" />

In response, the outgoing Resident Representative thanked the CSOs for their constructive criticism and partnership.He emphasized that the IMF views civil society as a critical partner in ensuring programme ownership and sustainability.He urged the CSOs to maintain their vigilance and continue to demand accountability from national leaders.

As Ghana continues its journey under the Extended Credit Facility, the relationship between the IMF and renewed civil society will remain a critical accountability mechanism.



<img src="/assets/images/publications/imf-boss-farewell.jpg" alt="Group Photo" className="w-full h-auto rounded-xl my-6 shadow-md" />`,
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
                content: "The 2026 Budget Statement, presented under the theme 'Consolidating Stability for Shared Growth,' reflects a government attempting to balance the books while stimulating an economy still recovering from deep scars. At the Economic Governance Platform (EGP), our preliminary analysis suggests a budget that is directionally correct but operationally ambitious.\n\nKey Highlights & EGP Observations:\n\n1. Revenue Measures: The reliance on widening the tax net rather than introducing new taxes is a welcome shift. The digitalization of property rates and the streamline of VAT invoicing are long-overdue reforms. However, EGP cautions that administrative efficiency takes time to yield results. If these measures underperform, the government may be forced to cut expenditure or borrow more — neither of which is desirable.\n\n2. Expenditure Control: The budget proposes a decline in the deficit to 3.5% of GDP. This signal of fiscal discipline is crucial for investor confidence. Yet, the wage bill and interest payments continue to consume over 60% of domestic revenue. EGP advocates for a more aggressive rationalization of non-essential recurrent expenditure to free up fiscal space.\n\n3. Social Protection: We note the increased allocation to LEAP and the School Feeding Programme. In a time of rising cost of living, protecting the vulnerable is non-negotiable. EGP will be monitoring the timely release of these funds, as allocation does not always equal disbursement.\n\n4. Debt Sustainability: The budget hinges on the successful completion of external debt restructuring. EGP urges the government to be transparent about the terms of these agreements and their long-term implications for Ghana’s creditworthiness.\n\nConclusion:\nThe 2026 Budget offers a pathway to stability, but it is paved with implementation risks. EGP calls on Parliament to exercise rigorous oversight and on citizens to demand value for every cedi spent. We are not out of the woods yet, but with discipline and vigilance, recovery is within reach.",
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
                content: "Ghana has been an active participant in the Highly Indebted Poor Countries (HIPC) Initiative, benefiting from substantial debt relief in the early 2000s. This relief created fiscal space that allowed for significant investments in infrastructure and social services, contributing to a period of robust economic growth. However, in recent years, the country’s debt trajectory has once again become a source of major concern for policymakers, international partners, and civil society.\n\nPost-HIPC Borrowing and the Rise of Commercial Debt\nFollowing its exit from HIPC, Ghana gained access to international capital markets, issuing its first Eurobond in 2007. This marked a shift in the debt portfolio from primarily concessional loans (from institutions like the World Bank and bilateral partners) to more expensive commercial debt. While this unlocked capital for development projects, it also exposed the economy to exchange rate volatility and higher debt servicing costs. By 2022, debt service was consuming more than half of government revenue, crowding out critical spending on health, education, and social protection.\n\nThe Current Crisis and the DDEP\nThe COVID-19 pandemic and global geopolitical shocks exacerbated Ghana’s fiscal vulnerabilities, pushing the debt-to-GDP ratio above 90% by 2022. This necessitated a return to the IMF and the launch of a Domestic Debt Exchange Programme (DDEP) in 2023 — a painful but necessary step to restore debt sustainability. The DDEP imposed significant losses on bondholders, including pension funds and individual investors, highlighting the real-world cost of unsustainable borrowing.\n\nThe Way Forward: Transparency and Accountability\nSustainable debt management requires more than just restructuring; it demands a fundamental change in how debt is contracted and utilized. EGP advocates for:\n• Greater Parliamentary Oversight: Parliament must rigorously scrutinize loan agreements to ensure they offer value for money.\n• Enhanced Transparency: All debt obligations, including collateralized loans and off-balance-sheet liabilities, must be publicly disclosed.\n• Strict Adherence to the Fiscal Responsibility Act: The deficit cap of 5% of GDP must be respected to prevent future spirals.\n\nGhana’s path to recovery lies not in borrowing more, but in borrowing wisely and spending efficiently. Only through prudent management can we ensure that future generations do not inherit a burden they did not create.",
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
                content: "The Bolgatanga-Bawku-Polimakom road is more than just a stretch of asphalt; it is a major economic artery connecting the Upper East Region to the borders of Burkina Faso and Togo. For years, residents and travelers endured a perilous journey on this dusty, pothole-riddled road. In 2016, hope was ignited when the government awarded a contract for its reconstruction. Work began, and for a while, the dust seemed to settle.\n\nHowever, in 2022, the machinery fell silent. The contractor demobilized, leaving the road in a state worse than before. The reason? Ghana’s escalating debt crisis. As the government struggled to service its mounting debts, payments to contractors nationwide stalled. The Bolgatanga-Bawku road became a casualty of fiscal distress.\n\nThe Human Cost of a Stalled Project\nFor the people of Bawku and surrounding communities, the halted construction was not just a bureaucratic delay; it was a daily hazard. The exposed sharp edges of culverts, deep trenches left uncovered, and excessive dust pollution turned the road into a death trap.\n\n“We see accidents here every week,” says generic resident name, a trader who plies the route daily. “The dust gives us respiratory problems, and when it rains, the road becomes a river. We were promised development, but we got injuries.”\n\nHealth officials in the district reported a spike in upper respiratory tract infections, directly linked to the dust pollution. Meanwhile, the cost of transportation soared as vehicle owners passed on the higher maintenance costs to commuters.\n\nA Glimmer of Hope?\nWith the recent disbursement of IMF funds and the restructuring of debt, the government has signaled a resumption of work on priority infrastructure projects. Contractors are slowly returning to site. But for the victims of accidents on the abandoned road, the relief comes too late.\n\nThis story serves as a stark reminder: macroeconomic statistics and debt figures on a spreadsheet have real, painful consequences on the ground. As Ghana navigates its recovery, the completion of projects like the Bolgatanga-Bawku road must be prioritized, not just for economic connectivity, but for the safety and dignity of its citizens.",
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

        for (const article of articles) {
            await prisma.article.create({ data: article });
        }
        console.log(`✅ Created ${articles.length} articles`);

        // 4. Events
        const events = [
            {
                title: "Launch of Public Debt Tracker and IMF Dashboard",
                slug: "launch-of-public-debt-tracker-and-imf-dashboard",
                description: "We unveiled our digital tools that allow citizens and stakeholders to monitor Ghana's public debt and IMF program implementation.",
                location: "Accra, Ghana",
                startDate: new Date('2026-02-20T09:00:00'),
                endDate: new Date('2026-02-20T12:00:00'),
                featured: true,
            },
            {
                title: "2026 EGP Member Strategic Meeting",
                slug: "2025-egp-member-strategic-meeting",
                description: "Our members gathered to set the strategic direction for 2026, focusing on strengthening fiscal transparency initiatives and advocacy work.",
                location: "EGP Conference Room",
                startDate: new Date('2026-03-12T09:00:00'),
                endDate: new Date('2026-03-12T17:00:00'),
                featured: false,
            },
            {
                title: "2026 Budget Input Gathering with CSOs Budget Forum",
                slug: "2025-budget-input-gathering-with-csos-budget-forum",
                description: "We facilitated a collaborative session with Civil Society Organizations to gather inputs for the 2026 national budget.",
                location: "Accra International Conference Centre",
                startDate: new Date('2026-03-24T10:00:00'),
                endDate: new Date('2026-03-24T15:00:00'),
                featured: false,
            },
            {
                title: "Post Budget Press Briefing 2026",
                slug: "post-budget-press-briefing",
                description: "Our team of fiscal policy experts will provide analysis and insights on the recently announced national budget, highlighting key issues related to debt management.",
                location: "EGP Head Office",
                startDate: new Date('2026-05-15T10:00:00'),
                endDate: new Date('2026-05-15T12:00:00'),
                featured: false,
            },
            {
                title: "Launch of Sustainable Debt Management Report in Accra",
                slug: "launch-of-sustainable-debt-management-report-in-accra",
                description: "Join us for the official launch of our comprehensive report on sustainable debt management practices, featuring policy recommendations.",
                location: "Accra, Ghana",
                startDate: new Date('2026-06-07T09:00:00'),
                endDate: new Date('2026-06-07T13:00:00'),
                featured: false,
            },
            {
                title: "Launch of Sustainability Debt Management Report in Kumasi and Tamale",
                slug: "launch-of-sustainability-debt-management-report-in-kumasi-and-tamale",
                description: "Our regional outreach continues with the launch of our Sustainable Debt Management Report in Kumasi and Tamale across Ghana.",
                location: "Kumasi and Tamale",
                startDate: new Date('2026-06-21T09:00:00'),
                endDate: new Date('2026-06-21T17:00:00'),
                featured: false,
            },
        ];

        await prisma.event.createMany({ data: events });
        console.log(`✅ Created ${events.length} events`);

        // 5. Resources
        const resources: any[] = [];

        await prisma.resource.createMany({ data: resources });
        console.log(`✅ Created ${resources.length} resources`);

        // 6. Staff (Real EGP Team)
        const staff = [
            {
                name: "Beauty Emefa Narteh",
                position: "Executive Secretary",
                bio: "Beauty Emefa Narteh is the Executive Secretary of GACC. Prior to this, Beauty served as the Acting Executive Secretary and Communications Officer of GACC.\n\nBeauty mobilises support through increased awareness raising and continued sensitization of citizens on the basic anti-corruption laws especially the Whistblower Act 2006(Act 720). This is expected to promote increased transparency as empowered citizens hold duty bearers to account. Beauty also coordinated the World Bank funded West Africa Contract Monitoring Network in Ghana, Nigeria, Sierra Leone and Liberia. The project supported the multi-stakeholder networks to monitor contracts and to advocate for improved governance in priority sectors.\n\nBeauty holds a Master’s degree in International Affairs with a concentration in Communication and Development and a graduate Certificate in Women’s Studies from Ohio University, United States. Beauty also has a certificate in Executive Communications and Governance Reform from the World Bank and the Annenberg School in the United States, and a BA from the University of Ghana. Beauty is a Ford Fellow and an Accredited Member of the Institute of Public Relations Ghana. Beauty has over twelve (12) years’ experience in communications, advocacy, public relations and development work.",
                imageUrl: "/assets/images/staff/beauty-2.jpg",
                order: 1,
            },
            {
                name: "Abdulkarim Mohammed",
                position: "Coordinator",
                bio: "With more than eighteen (18) active years of hands-on experience and knowledge in managing governance programs through various lead roles (from coordinator through country manager to regional advisory) on donor funded initiatives involving high level institutional support and collaboration on diverse sectorial themes: active citizens participation in governance, public finance management, parliamentary oversight, civil society advocacy, extractives governance, environment and climate change, local governance, human rights and justice administration.\n\nTrained as a Development Economist with a background in Agriculture and Natural Resource Policy & Management, he is well versed in contemporary development dynamics with his core competencies in Policy Formulation & Analysis; Project Design, Planning and Implementation; Campaign & Advocacy; Training & Facilitation; Monitoring & Evaluation; Human Capacity & Institutional Reform; Development Planning and Management; as well as Community Development Interventions.",
                imageUrl: "/assets/images/staff/Adulkarim.png",
                order: 2,
            },
            {
                name: "Ebenezer Otu Okley",
                position: "Programmes Officer",
                bio: "Ebenezer Otu Okley is a Programmes Officer at the Economic Governance Platform (EGP). In this role, he supports the implementation of projects that advance transparent, accountable, and people-centered economic governance in Ghana. He currently works on the Citizen Action for Sustainable Debt Management Project, which aims to strengthen public oversight and citizen engagement in debt-related policymaking.\n\nPrior to joining EGP, Ebenezer served as a Teaching and Research Assistant at the University of Ghana Business School, where he supported instruction in microeconomics, macroeconomics, finance, and managerial economics. His academic and professional work reflects a strong passion for economics and finance education, having delivered several public sessions on personal finance, corporate finance management, and basic economic literacy.\n\nEbenezer has contributed to a number of strategic engagements and policy-focused seminars, including insight meetings with the IMF during Ghana’s bailout negotiations and public finance and revenue strategy forums that promote inclusive economic dialogue.\n\nHe holds a Bachelor’s degree in Accounting and Sociology and an MPhil in Finance from the University of Ghana. His MPhil thesis explored multidimensional poverty and tax policy in Sub-Saharan Africa. Ebenezer is committed to using his expertise to bridge economic knowledge gaps and foster citizen-responsive economic reforms.",
                imageUrl: "/assets/images/staff/Eben.jpg",
                order: 3,
            }
        ];

        await prisma.staff.createMany({ data: staff });
        console.log(`✅ Created ${staff.length} team members`);

        console.log('\n🎉 Content seeding completed successfully!');
        console.log(`📊 Total records created: ${categories.length + articles.length + events.length + resources.length + staff.length}`);

    } catch (error) {
        console.error('❌ Error seeding content:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedContent()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
