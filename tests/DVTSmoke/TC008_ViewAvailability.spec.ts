import { test, expect } from '@playwright/test';
import LoginPage from "../../PageObjectsTest/LoginPage.spec";
import Env from "../../utils/environment";
import * as data from "../../data/login.cred.json";
import ServerSelection from '../../PageObjectsTest/ServerSelection.spec';
import DeliveryCenterPopup from "../../PageObjectsTest/DeliveryCenterPopup.spec";
import ReportUtils from "../../utils/reportUtils.spec";
import GlobalDeiveryCenter from "../../PageObjectsTest/GlobalDeliveryCenter";
import { Locators } from '../../PageObjectsTest/locators';

test.use({
  viewport: { width: 1920, height: 1080 },
});

test.describe.serial("View Availability", () => {
    // Declare the test suite for View Availability

    let login: LoginPage;
    let page;
    let context;
    let serverSelection: ServerSelection;
    let deliveryCenterPopup: DeliveryCenterPopup;
    let globalDeiveryCenter: GlobalDeiveryCenter;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(Env.QDWP);
        login = new LoginPage(page);
        serverSelection = new ServerSelection(page);
        deliveryCenterPopup = new DeliveryCenterPopup(page);
        globalDeiveryCenter = new GlobalDeiveryCenter(page);
    });

    // Utility function to wait for loader to disappear
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
    test.setTimeout(300000); // Set a timeout of 5 minutes for the entire test
    test("TC009_ViewAvailability", async () => {
        // Login
        await login.enterUserName(data.email);
        await login.nxtButton();
        await login.enterUserPassword(data.pass);
        await login.clickSignBtn(); 
        console.log("Login completed successfully");

        // Server Selection
        await serverSelection.selectAndHandleServer();
        console.log("Server selection completed successfully");

        // Delivery Center Popup (if needed)
        await deliveryCenterPopup.handlePopup?.();

        // Wait for loader before clicking calendar icon
        await waitForLoaderToDisappear(page);
  
        await page.locator("//div[@class='dicon dicon-calendar-nc text-primary']").click();

        // Wait for loader again if it might reappear
        await waitForLoaderToDisappear(page);

        await page.locator("//input[@title='Team Filter']").click();
        await waitForLoaderToDisappear(page);

        await page.locator('text=Select All').nth(1).click();
        // If loader can appear again, repeat wait as needed
        
        await page.locator("//button[normalize-space()='Show Availability']").click();
        await waitForLoaderToDisappear(page);

        console.log("Availability shown successfully");
        await ReportUtils.screenshot(page, "ViewAvailability");
    });
   
    test("Cleanup", async () => {
        if (page) await page.close();
        if (context) await context.close();
    });
});