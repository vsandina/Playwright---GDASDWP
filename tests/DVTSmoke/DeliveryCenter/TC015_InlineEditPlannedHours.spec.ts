import { test, expect } from '@playwright/test';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import ServerSelection from '../../../PageObjectsTest/ServerSelection.spec';
import DeliveryCenterPopup from "../../../PageObjectsTest/DeliveryCenterPopup.spec";
import ReportUtils from "../../../utils/reportUtils.spec";
import GlobalDeiveryCenter from "../../../PageObjectsTest/GlobalDeliveryCenter";
import * as fs from 'fs';

test.use({
  viewport: { width: 1920, height: 973 },
});

test.describe.serial("QuickFind", () =>
{// Describe the test suite for QuickFind

    let login: LoginPage;// Declare the LoginPage object
    let page;
    let context;
    let serverSelection: ServerSelection;// Declare the ServerSelection object
    let deliveryCenterPopup: DeliveryCenterPopup;// Declare the DeliveryCenterPopup object
    let globalDeiveryCenter: GlobalDeiveryCenter;// Declare the GlobalDeliveryCenter object
 
    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();// Create a new browser context
        page = await context.newPage();// Open a new page in the browser context
        await page.goto(Env.QDWP);// Navigate to the DWP login page
        login = new LoginPage(page);// Initialize the LoginPage object with the current page context
        serverSelection = new ServerSelection(page);// Initialize the ServerSelection object with the current page context
        deliveryCenterPopup = new DeliveryCenterPopup(page);// Initialize the DeliveryCenterPopup object with the current page context
        globalDeiveryCenter = new GlobalDeiveryCenter(page);// Initialize the GlobalDeliveryCenter object with the current page context
    });
    async function waitForLoaderToDisappear(page, loaderSelector = '.nova-ui-loader-container', timeout = 30000) {
    const loader = page.locator(loaderSelector);
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if ((await loader.count()) === 0 || !(await loader.isVisible())) {
            return;
        }
        await page.waitForTimeout(5000); // Check every 5s
    }
    throw new Error('Loader did not disappear in time. Please check backend/API or UI for issues.');
    }
    test.setTimeout(200000);
    test("TC015_PlannedHours", async () => {
        // Login
        await login.enterUserName(data.email);
        await login.nxtButton();
        await login.enterUserPassword(data.pass);
        await login.clickSignBtn();
        console.log("Login completed successfully");

        // Home page Server Selection
        await serverSelection.selectAndHandleServer();
        console.log("Server selection completed successfully");

        // Delivery Center Selection
        await deliveryCenterPopup.handlePopup();
        await waitForLoaderToDisappear(page);

        // Read buffered requestId
        const buffer = JSON.parse(fs.readFileSync('data/buffer.json', 'utf-8'));
        const requestId = buffer.requestId;
        console.log('Read buffered requestId:', requestId);

        // Search for requestId
        await page.locator('#quick-filter-textbox').pressSequentially(requestId);
        await waitForLoaderToDisappear(page);
        await expect(page.locator(`text=${requestId}`)).toBeVisible({ timeout: 60000 });
        await page.waitForTimeout(7000); // Wait for the search results to stabilize
        // await page.pause(); // Pause for manual inspection if needed

        await page.locator("//label[@for='radc-requests-list-table-checkbox-selected-0']").click();//radio button
        await page.locator("(//label[@class='mat-mdc-tooltip-trigger btn btn-default btn-rocker'])[2]").click();

    // Fill all visible number input fields with a value below 20
          // For each targeted input, if a value is present, increment it by 1
          const inputSelectors = [
            'div:nth-child(10) > .form-control',
            'div:nth-child(13) > .form-control',
            'div:nth-child(16) > .form-control'
          ];
          for (const selector of inputSelectors) {
            const input = page.locator(selector);
            await expect(input).toBeVisible({ timeout: 10000 });
            const value = await input.inputValue();
            if (value && !isNaN(Number(value))) {
              await input.fill(String(Number(value) + 1));
            } else {
              await input.fill('1'); // Default to 1 if empty or not a number
            }
          }
        
    await page.locator("//div[@class='dicon dicon-save-nc text-primary']").click();
    // Wait for the saving indicator to appear and then disappear (robust for dynamic text)
    const savingLocator = page.locator("//div[contains(normalize-space(), 'Saving') and contains(normalize-space(), 'requests')]");
    // Wait for it to appear (if it does)
    try {
      await savingLocator.waitFor({ state: 'visible', timeout: 10000 });
    } catch (e) {
      // If not visible, continue
    }
    // Wait for it to disappear
       // Wait for the toaster message 'Your request has been updated successfully' to appear
    await expect(page.locator("text=Your request has been updated successfully")).toBeVisible({ timeout: 20000 });
    await ReportUtils.screenshot(page, "PlannedHours");
    
  });

    test("Cleanup", async () => {
      if (page) await page.close();
      if (context) await context.close();
    });
  });

