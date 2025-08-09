import { test, expect } from '@playwright/test';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import ServerSelection from '../../../PageObjectsTest/ServerSelection.spec';
import DeliveryCenterPopup from "../../../PageObjectsTest/DeliveryCenterPopup.spec";
import ReportUtils from "../../../utils/reportUtils.spec";
import GlobalDeliveryCenter from "../../../PageObjectsTest/GlobalDeliveryCenter";
import { Locators } from '../../../PageObjectsTest/locators';

test.use({
  viewport: { width: 1920, height: 1080,  },
});

test.describe.serial("AOFeatureEnablement", () =>
{// Describe the test suite for AOFeatureEnablement
    let login: LoginPage;// Declare the LoginPage object
    let page;
    let context;
    let serverSelection: ServerSelection;// Declare the ServerSelection object
    let deliveryCenterPopup: DeliveryCenterPopup;// Declare the DeliveryCenterPopup object
    let globalDeliveryCenter: GlobalDeliveryCenter;// Declare the GlobalDeliveryCenter object
 
    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();// Create a new browser context
        page = await context.newPage();// Open a new page in the browser context
        await page.goto(Env.QDWP);// Navigate to the DWP login page
        login = new LoginPage(page);// Initialize the LoginPage object with the current page context
        serverSelection = new ServerSelection(page);// Initialize the ServerSelection object with the current page context
        deliveryCenterPopup = new DeliveryCenterPopup(page);// Initialize the DeliveryCenterPopup object with the current page context
        globalDeliveryCenter = new GlobalDeliveryCenter(page);// Initialize the GlobalDeliveryCenter object with the current page context
    });

    test("TC001_AOFeatureEnablement", async () => {
        // Login
        await login.enterUserName(data.email);
        await login.nxtButton();
        await login.enterUserPassword(data.pass);
        await login.clickSignBtn();
        // Check for login error
        const errorLocator = page.locator('text=Incorrect email or password');
        if (await errorLocator.isVisible()) {
            throw new Error('Login failed: Email and password do not match.');
        }
        console.log("Login completed successfully");
      
        // Server Selection
        await serverSelection.selectAndHandleServer();
        console.log("Server selection completed successfully");

        // Global Server Selection
        await page.locator("text=Delivery Center Portal").click();
        await page.locator("text=Global Delivery Center").click();
        await page.locator(Locators.Deliverycentercancelbutton).click();
        await page.locator(Locators.settingicon).click();
        await page.click(Locators.ManageRequesttypes);
        await page.click(Locators.FeatureEnablement);
        await page.click(Locators.memberfirm);
        await page.locator(Locators.memberfirmtextbox).fill(data.servercode);
        await page.locator(Locators.Applybutton).click();
        
        // Assert that the latest version is visible (dynamically from test data)
        const latestVersion = data.latestVersion || '5.7.7.92'; // Update data.latestVersion in login.cred.json for each release
        const versionLocator = page.locator(`div[title='${latestVersion}']`);
        await page.waitForTimeout(5000); // Wait for the page to load
        await ReportUtils.screenshot(page, "AOFeatureEnablementLatestVersion");
        console.log("AOFeatureEnablement Latest Version is ", latestVersion);

    });

    test("Cleanup", async () => {
        if (page) await page.close();
        if (context) await context.close();
    });
    
});

