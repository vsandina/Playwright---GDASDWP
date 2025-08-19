import { test, expect } from '@playwright/test';
import LoginPage from "../../PageObjectsTest/LoginPage.spec";
import Env from "../../utils/environment";
import * as data from "../../data/login.cred.json";
import ServerSelection from '../../PageObjectsTest/ServerSelection.spec';
import DeliveryCenterPopup from "../../PageObjectsTest/DeliveryCenterPopup.spec";
import ReportUtils from "../../utils/reportUtils.spec";
import GlobalDeiveryCenter from "../../PageObjectsTest/GlobalDeliveryCenter";
import * as fs from 'fs';

test.use({
  viewport: { width: 1920, height: 937 },
});

test.describe.serial("LinkedWorkItem", () =>
{// Describe the test suite for LinkedWorkItem

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
    test.setTimeout(300000);
    test("TC023_LinkedWorkItem", async () => {
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
        await page.waitForLoadState('networkidle');
        // Search for requestId
        await page.locator('#quick-filter-textbox').pressSequentially("396240");
        await expect(page.locator(`text=396240`)).toBeVisible({ timeout: 30000 });
        await page.waitForTimeout(5000); // Wait for the search results to stabilize
             
        await page.locator("//a[normalize-space()='PlaywrightAutomation']").click();

        // Listen for the new page event
        const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('link', { name: '13900 Audit strategy and' }).click()
        ]);
        console.log("Linked Work Item is visible and clicked on the Linked Work Item");

        // Wait for the new page to load
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForLoadState('domcontentloaded');

        // Optionally, wait for a specific element on the new page
        await newPage.waitForSelector('.dataTableRowsContainer', { state: 'visible', timeout: 60000 });
        console.log("Navigate to linked work item");
        await ReportUtils.screenshot(page, "Linked Work Item is visible");
    });
 
   test("Cleanup", async () => {
            if (page) await page.close();
            if (context) await context.close();
        });
        
});