import { test, expect } from '@playwright/test';
import {
    STRATEGIC_REVIEW_SLUG,
    buildCareersApplyMultipart,
    e2eApplicantEmail,
} from './helpers/careers-apply';

test.describe('careers apply API', () => {
    test('POST /api/careers/apply stores a valid EOI when opportunity is open', async ({ request }) => {
        const slugCheck = await request.get(`/careers/${STRATEGIC_REVIEW_SLUG}`);
        if (!slugCheck.ok()) {
            test.skip(true, 'Strategic review opportunity not seeded');
        }

        const email = e2eApplicantEmail();
        const multipart = buildCareersApplyMultipart(email);

        const res = await request.post('/api/careers/apply', { multipart });
        const json = await res.json();

        if (res.status() === 400 && json.error?.includes('not open')) {
            test.skip(true, 'Opportunity closed in database');
        }

        expect(res.ok(), json.error || res.statusText()).toBeTruthy();
        expect(json.success).toBe(true);
        expect(json.id).toBeTruthy();
    });

    test('duplicate email returns 409', async ({ request }) => {
        const email = e2eApplicantEmail();
        const multipart = buildCareersApplyMultipart(email);

        const first = await request.post('/api/careers/apply', { multipart });
        if (!first.ok()) {
            test.skip(true, 'First apply failed — opportunity may be closed');
        }

        const second = await request.post('/api/careers/apply', { multipart });
        expect(second.status()).toBe(409);
    });
});
