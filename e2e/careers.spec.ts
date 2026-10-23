import { test, expect } from '@playwright/test';

test.describe('careers', () => {
    test('EOI form renders for an open opportunity', async ({ page }) => {
        await page.goto('/careers');
        const applyLink = page.getByRole('link', { name: /View Terms of Reference/i }).first();
        if ((await applyLink.count()) === 0) {
            test.skip(true, 'No open career opportunities in the database');
        }
        await applyLink.click();
        await expect(page.getByRole('heading', { name: /Expression of Interest/i })).toBeVisible();
        await expect(page.getByText('Name of Consultant / Firm')).toBeVisible();
        await expect(page.locator('input[name="applicantName"]')).toBeVisible();
    });
});
