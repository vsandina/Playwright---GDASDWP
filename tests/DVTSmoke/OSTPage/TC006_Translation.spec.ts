import { test, expect } from '@playwright/test';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import ServerSelection from '../../../PageObjectsTest/ServerSelection.spec';
import DeliveryCenterPopup from "../../../PageObjectsTest/DeliveryCenterPopup.spec";
import ReportUtils from "../../../utils/reportUtils.spec";
import { Locators } from '../../../PageObjectsTest/locators';    

test.use({
  viewport: { width: 1920, height: 1080 },
});

test.describe.serial("Translation", () => {
    // Describe the test suite for

    let login: LoginPage;// Declare the LoginPage object
    let page;
    let context;
    let serverSelection: ServerSelection;// Declare the ServerSelection object
    let deliveryCenterPopup: DeliveryCenterPopup;// Declare the DeliveryCenterPopup object
     
    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();// Create a new browser context
        page = await context.newPage();// Open a new page in the browser context
        await page.goto(Env.QDWP);// Navigate to the DWP login page
        login = new LoginPage(page);// Initialize the LoginPage object with the current page context
        serverSelection = new ServerSelection(page);// Initialize the ServerSelection object with the current page context
            
    });

    test("TC007_Translation", async () => { // Test case for user login on DWP
        
        await login.enterUserName(data.email);// Fill the email text field with the provided email
        await login.nxtButton(); // Click the next button after entering username
        await login.enterUserPassword(data.pass);// Fill the password text field with the provided password
        await login.clickSignBtn();// Click the sign-in button to submit the login form
        console.log("Login completed successfully");// Log a message indicating that the login was completed successfully
           
        // Server Selection
        await serverSelection.selectAndHandleServer();
        console.log("Server selection completed successfully");

        await page.locator(Locators.initial).click();
        await page.getByText("Language and Locale").click();
        await page.locator(Locators.languagedropdown).first().click();
        await page.getByText('中文(台灣)').click();
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }),
            page.locator("//button[normalize-space()='Save']").click()
        ]);
        console.log("Language selection completed successfully");
        await page.waitForTimeout(5000);
        await ReportUtils.screenshot(page, "Translation");
        console.log("Page refreshed and Chinese language is visible");
        // Switch language back to English
        await page.locator(Locators.initial).click();
        await page.getByText("語言和區域設置").click();
        await page.locator(Locators.languagedropdown).first().click();
        await page.locator("//div[@title='English (United States)']").click();
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }),
            page.locator("//button[contains(text(),'救')]").click()
        ]);
        console.log("Language switched back to English");
        
    });
        test("Cleanup", async () => {
            if (page) await page.close();
            if (context) await context.close();
        }); 
});
