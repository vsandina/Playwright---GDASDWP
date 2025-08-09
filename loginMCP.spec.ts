import { test, expect } from '@playwright/test';

// Automates login and SEMS65 selection on QADC portal
test('Login to QADC and select SEMS65', async ({ page }) => {
  // 1. Open QADC portal
  await page.goto('https://qadcportal.aaps.deloitte.com/');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // 2. Enter email
  await page.fill('input[type="email"]', 'USAUDITTestUser03@deloitte.com');

  // 3. Click Next button
  await page.click('input[type="submit"], button:has-text("Next")');

  // 4. Enter password
  await page.fill('input[type="password"]', 'c0#GV>zC6A%)jwUq^d%y');

  // 5. Click Signin button
  await page.click('input[type="submit"], button:has-text("Sign in")');

  // 6. Click globe icon (wait for it to appear)
  const globeSelector = 'button[aria-label*="Globe"], button[aria-label*="globe"], [data-testid*="globe"], button[title*="Globe"]';
  try {
    const globeIcon = await page.waitForSelector(globeSelector, { timeout: 15000 });
    await globeIcon.click();
  } catch (error) {
    throw new Error('Globe icon not found on the page.');
  }

  // 7. Select SEMS65 member firm from the list
  const sems65Option = await page.$('text=SEMS65');
  if (sems65Option) {
    await sems65Option.click();
  } else {
    // If already selected, close the popup
    const closeBtn = await page.$('button:has-text("Close")');
    if (closeBtn) {
      await closeBtn.click();
    }
  }

  // Optionally, add an assertion to verify login or firm selection
  // Example: expect(await page.isVisible('text=Welcome')).toBeTruthy();
});
