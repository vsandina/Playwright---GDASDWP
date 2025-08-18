import { test, expect } from '@playwright/test';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import ServerSelection from '../../../PageObjectsTest/ServerSelection.spec';
import DeliveryCenterPopup from "../../../PageObjectsTest/DeliveryCenterPopup.spec";
import ReportUtils from "../../../utils/reportUtils.spec";
import GlobalDeiveryCenter from "../../../PageObjectsTest/GlobalDeliveryCenter";
import * as fs from 'fs';
import AllRequestsPage from '../../../PageObjectsTest/BasicInformationandScope';

test.use({
  viewport: { width: 1920, height: 1080 },
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
    test.setTimeout(300000);
    test("TC010_QuickFind", async () => {
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
    await expect(page.locator(`text=${requestId}`)).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(7000); // Wait for the search results to stabilize
    // await page.pause(); // Pause for manual inspection if needed
    await ReportUtils.screenshot(page, "QuickFind_Search_RequestId");
    
    })
    test.setTimeout(200000);
        test("TC025_RequestPage", async () => {
            const requestPage = new AllRequestsPage(page);
            await requestPage.BasicInformationandScope();
        });
   
   test("Cleanup", async () => {
            if (page) await page.close();
            if (context) await context.close();
        });
        
});