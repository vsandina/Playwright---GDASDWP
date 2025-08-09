import { test, expect } from '@playwright/test';

// Automates login and SEMS65 selection on QADC portal
test('Login to QADC and select SEMS65', async ({ page }) => {
  // 1. Open QADC portal
  await page.goto('https://qadcportal.aaps.deloitte.com/');

  // 2. Enter email
  await page.fill('input[type="email"]', 'USAUDITTestUser03@deloitte.com');

  // 3. Click Next button
  await page.click('button:has-text("Next")');

  // 4. Enter password
  await page.fill('input[type="password"]', 'c0#GV>zC6A%)jwUq^d%y');

  // 5. Click Signin button
  await page.click('button:has-text("Sign in")');

  // 6. Close any popups that may appear
  // Try to close popups with a generic close button, if present
  const popupCloseBtn = await page.$('button:has-text("Close"), button[aria-label="Close"], .modal-close, .ant-modal-close');
  if (popupCloseBtn) {
    await popupCloseBtn.click();
  }

  // 7. Click on the globe icon and select the 'SEMS65' member firm from the list
  let globeFound = false;
  try {
    await page.waitForSelector('button[aria-label*="globe"], [data-testid*="globe"]', { timeout: 15000 });
    globeFound = true;
    await page.click('button[aria-label*="globe"], [data-testid*="globe"]');
  } catch (e) {
    // 9. If the globe icon is not found, an error message will be displayed
    throw new Error('Globe icon not found.');
  }

  if (globeFound) {
    // 8. Select SEMS65 member firm from the list
    const sems65Option = await page.$('text=SEMS65');
    if (sems65Option) {
      await sems65Option.click();
    } else {
      // If already selected, close the popup
      const closeBtn = await page.$('button:has-text("Close"), button[aria-label="Close"], .modal-close, .ant-modal-close');
      if (closeBtn) {
        await closeBtn.click();
      }
    }
  }

  // Optionally, add an assertion to verify login or firm selection
  // Example: expect(await page.isVisible('text=Welcome')).toBeTruthy();
});
