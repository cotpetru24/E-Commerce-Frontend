import { test, expect } from '@playwright/test';

test('smoke: homepage loads and has a header', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await expect(page.locator('header')).toBeVisible();
});
