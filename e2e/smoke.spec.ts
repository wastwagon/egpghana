import { test, expect } from '@playwright/test';

test.describe('public smoke', () => {
    test('home page loads', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('search page loads', async ({ page }) => {
        await page.goto('/search');
        await expect(page.getByRole('heading', { name: /search/i })).toBeVisible();
        await expect(page.getByRole('searchbox')).toBeVisible();
    });

    test('programs page loads', async ({ page }) => {
        await page.goto('/programs');
        await expect(page.getByRole('heading', { level: 1, name: /what we do/i })).toBeVisible();
    });

    test('careers page loads', async ({ page }) => {
        await page.goto('/careers');
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('dashboards hub loads', async ({ page }) => {
        await page.goto('/dashboards');
        await expect(page.getByRole('heading', { name: /economic dashboards/i })).toBeVisible();
    });

    test('footer credits OceanCyber with backlink', async ({ page }) => {
        await page.goto('/');
        const credit = page.getByRole('link', { name: /OceanCyber/i });
        await expect(credit).toBeVisible();
        await expect(credit).toHaveAttribute('href', 'https://oceancyber.net/');
    });

    test('humans.txt credits OceanCyber', async ({ request }) => {
        const res = await request.get('/humans.txt');
        expect(res.ok()).toBeTruthy();
        const text = await res.text();
        expect(text).toContain('oceancyber.net');
    });

    test('health endpoint reports database up', async ({ request }) => {
        const res = await request.get('/api/health');
        expect(res.ok()).toBeTruthy();
        const json = await res.json();
        expect(json).toMatchObject({ ok: true, database: 'up' });
        expect(json).toHaveProperty('timestamp');
    });

    test('web manifest is served', async ({ request }) => {
        const res = await request.get('/manifest.webmanifest');
        expect(res.ok()).toBeTruthy();
        const json = await res.json();
        expect(json.name).toContain('Economic Governance Platform');
        expect(json.short_name).toBeTruthy();
    });

    test('embed indicators page loads', async ({ page }) => {
        await page.goto('/embed/indicators');
        await expect(page.getByRole('heading', { name: /headline indicators/i })).toBeVisible();
        await expect(page.getByText(/EGP Ghana/i).first()).toBeVisible();
    });

    test('public indicators API returns headline metrics', async ({ request }) => {
        const res = await request.get('/api/indicators/latest?keys=gdp_growth,inflation');
        expect(res.ok()).toBeTruthy();
        const json = await res.json();
        expect(json).toHaveProperty('indicators');
        expect(Array.isArray(json.indicators)).toBeTruthy();
        expect(json.indicators.length).toBe(2);
    });

    test('search API returns JSON', async ({ request }) => {
        const res = await request.get('/api/search?q=debt');
        expect(res.ok()).toBeTruthy();
        const json = await res.json();
        expect(json).toHaveProperty('articles');
        expect(json).toHaveProperty('resources');
        expect(json).toHaveProperty('dashboards');
    });

    test('contact page loads', async ({ page }) => {
        await page.goto('/contact');
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
    });

    test('contact API validates payload', async ({ request }) => {
        const res = await request.post('/api/contact', {
            data: { name: 'a', email: 'bad', message: 'short' },
        });
        expect(res.status()).toBe(400);
    });

    test('dashboard briefing HTML loads', async ({ request }) => {
        const res = await request.get('/api/dashboards/briefing?dashboard=economy');
        expect(res.ok()).toBeTruthy();
        const text = await res.text();
        expect(text).toContain('Macro economy briefing');
        expect(text).toContain('<table>');
    });

    test('feed.xml is valid RSS', async ({ request }) => {
        const res = await request.get('/feed.xml');
        expect(res.ok()).toBeTruthy();
        const text = await res.text();
        expect(text).toContain('<rss');
        expect(text).toContain('<channel>');
    });
});
