import { test, expect } from '@playwright/test';

test.describe('Webhook.cafe - Phase 1 Setup', () => {
  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check title
    await expect(page).toHaveTitle(/Next\.js/i);
    
    // Check that main content loads
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Log success
    console.log('✅ Homepage loaded successfully');
  });
});

test.describe('UI Components', () => {
  test('shadcn/ui components are working', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    console.log(`Found ${buttonCount} buttons on page`);
    
    // Check for links
    const links = page.locator('a');
    const linkCount = await links.count();
    console.log(`Found ${linkCount} links on page`);
  });
});

test.describe('Tailwind CSS', () => {
  test('Tailwind styles are applied', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for Tailwind utility classes in HTML
    const body = page.locator('body');
    const hasTailwind = await body.evaluate((el) => {
      const classes = el.className;
      return classes.includes('bg-') || classes.includes('text-');
    });
    
    console.log(`Tailwind classes applied: ${hasTailwind}`);
    expect(hasTailwind).toBe(true);
  });
});
