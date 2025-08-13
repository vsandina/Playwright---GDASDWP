import { test, expect } from '@playwright/test';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import ServerSelection from '../../../PageObjectsTest/ServerSelection.spec';
import DeliveryCenterPopup from "../../../PageObjectsTest/DeliveryCenterPopup.spec";
import ReportUtils from "../../../utils/reportUtils.spec";
import GlobalDeiveryCenter from "../../../PageObjectsTest/GlobalDeliveryCenter";
import { Locators } from '../../../PageObjectsTest/locators';


test.use({
  viewport: { width: 1920, height: 1080 },
});

test.describe.serial("ManageRequestTypes", () =>
{// Describe the test suite for 

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
    test.setTimeout(100000);
    test("TC006_ManageRequestTypes", async () => {
        // Login
        await login.enterUserName(data.email);
        await login.nxtButton();
        await login.enterUserPassword(data.pass);
        await login.clickSignBtn();
        console.log("Login completed successfully");

        // Server Selection
        await serverSelection.selectAndHandleServer();
        console.log("Server selection completed successfully");

        // Global Server Selection
        await globalDeiveryCenter.GlobalDeliveryCenter(data.EMSFilename);
        // Wait for the activity type table to be visible before proceeding
        await page.locator(Locators.ManageRequesttypesGrid).filter({ hasText: 'Edit' }).waitFor({ state: 'visible', timeout: 20000 });
        await ReportUtils.screenshot(page, "ManageRequestTypes");
    });
        test("Cleanup", async () => {
            if (page) await page.close();
            if (context) await context.close();
        }); 
});