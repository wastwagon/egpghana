import { test, expect } from '@playwright/test';

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test.describe('admin', () => {
    test.beforeEach(() => {
        test.skip(!adminEmail || !adminPassword, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run admin e2e');
    });

    test('login reaches secure dashboard', async ({ page }) => {
        await page.goto('/admin/login');
        await page.getByPlaceholder('admin@egpghana.org').fill(adminEmail!);
        await page.getByPlaceholder('••••••••').fill(adminPassword!);
        await page.getByRole('button', { name: /sign in/i }).click();
        await expect(page).toHaveURL(/\/admin\/dashboard/);
        await expect(page.getByText('Dashboard Overview')).toBeVisible({ timeout: 15_000 });
    });
});
