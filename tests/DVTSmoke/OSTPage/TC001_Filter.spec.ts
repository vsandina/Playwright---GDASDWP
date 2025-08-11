import { test, expect } from '@playwright/test';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import ServerSelection from '../../../PageObjectsTest/ServerSelection.spec';
import DeliveryCenterPopup from "../../../PageObjectsTest/DeliveryCenterPopup.spec";
import FiltersPage from '../../../PageObjectsTest/FiltersPage';
import ReportUtils from "../../../utils/reportUtils.spec";
import { Locators } from '../../../PageObjectsTest/locators';   


test.use({
  viewport: { width: 1920, height: 937 },
});

test.describe.serial("TC001_FiltersOnHomepage", () =>
{// Describe the test suite for FiltersOnHomepage

    let login: LoginPage;// Declare the LoginPage object
    let page;
    let context;
    let serverSelection: ServerSelection;// Declare the ServerSelection object
    let deliveryCenterPopup: DeliveryCenterPopup;// Declare the DeliveryCenterPopup object
     
    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext({
            recordVideo: { 
            dir: 'videos/', 
            size: { width: 1920, height: 937 } // Set high resolution for clear video
        } // Enable video recording
        });
        page = await context.newPage();
        await page.goto(Env.QDWP);
        login = new LoginPage(page);
        serverSelection = new ServerSelection(page);
    });

test("TC001_FiltersOnHomepage", async () => {
    // Login
    await login.enterUserName(data.email);
    await login.nxtButton();
    await login.enterUserPassword(data.pass);
    await login.clickSignBtn();
    await page.locator(Locators.popup).click();
    console.log("Login completed successfully");

    // Server Selection
    await serverSelection.selectAndHandleServer();
    console.log("Server selection completed successfully");

    // Filter on Homepage
    await page.waitForTimeout(8000);
    await page.locator(Locators.filtericon).click();
    await page.locator(Locators.fiterdropdown).click();
    // Check for required product types in the dropdown
    const requiredProductTypes = ['EMS', 'Projects', 'Levvia', 'Omnia', 'EP Project'];
    const dropdownOptions = (await page.locator(Locators.fiterdropdownOptions).allTextContents())
        .map(option => option.trim().toLowerCase());
    for (const productType of requiredProductTypes) {
        expect(
            dropdownOptions.some(option => option === productType.toLowerCase()),
            `Product type "${productType}" is NOT present in the filter dropdown!`)
    }
    console.log("All required product types are present in the filter dropdown");
    await ReportUtils.screenshot(page, "All the product types are loading");
});
    test("Cleanup", async () => {
        if (page) await page.close();
        if (context) await context.close();
    }); 
});

