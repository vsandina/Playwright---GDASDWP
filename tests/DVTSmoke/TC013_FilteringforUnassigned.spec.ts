import { test, expect } from '@playwright/test';
import LoginPage from "../../PageObjectsTest/LoginPage.spec";
import Env from "../../utils/environment";
import * as data from "../../data/login.cred.json";
import ServerSelection from '../../PageObjectsTest/ServerSelection.spec';
import DeliveryCenterPopup from "../../PageObjectsTest/DeliveryCenterPopup.spec";
import ReportUtils from "../../utils/reportUtils.spec";
import GlobalDeiveryCenter from "../../PageObjectsTest/GlobalDeliveryCenter";

test.use({
  viewport: { width: 1920, height: 937 },
});

test.describe.serial("FilteringforUnassigned", () =>
{
    let login: LoginPage;
    let page;
    let context;
    let serverSelection: ServerSelection;
    let deliveryCenterPopup: DeliveryCenterPopup;
    let globalDeiveryCenter: GlobalDeiveryCenter;
 
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
    test.setTimeout(100000);
    test("TC018_FilteringforUnassigned", async () => {
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
    // Wait for the page to be fully loaded before interacting with the search box
            await page.locator(".dicon.dicon-filter-nc").click();
            await page.locator("//input[@id='preparerCurrentAdGuidtypeahead']").fill("Unassigned");
            await page.locator("#ngb-typeahead-6-0").click();
            await page.locator("//div[normalize-space()='Apply']").click();
            await waitForLoaderToDisappear(page);
        // Wait for results to appear
            await expect(page.locator("//div[@class='radc-requests-list-table-wrapper ng-star-inserted']")).toBeVisible({ timeout: 20000 });
            // Take screenshot after page is properly loaded
            await page.locator('#preparerName').scrollIntoViewIfNeeded();
            await waitForLoaderToDisappear(page);
            await ReportUtils.screenshot(page, "Unassigned Preparer");
            console.log("No Preparer values in the Unassigned");
    })
   test("Cleanup", async () => {
            if (page) await page.close();
            if (context) await context.close();
        });

});