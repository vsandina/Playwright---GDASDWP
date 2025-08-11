import { test, expect } from '@playwright/test';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import ServerSelection from "../../../PageObjectsTest/ServerSelection.spec";
import { Locators } from '../../../PageObjectsTest/locators';    
import ReportUtils from '../../../utils/reportUtils.spec';

test.use({
  viewport: { width: 1920, height: 1080 }, 
});

let context: any;
let page: any;

test.describe.serial("TC001", () => {
  test("TC003_DataExtract", async ({ browser }) => {
    // Setup
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(Env.QDWP);

    // Login
    const login = new LoginPage(page);
    await login.enterUserName(data.email);
    await login.nxtButton();
    await login.enterUserPassword(data.pass);
    await login.clickSignBtn();
    console.log("Login completed successfully");

    // Server Selection
    const serverSelection = new ServerSelection(page);
    await serverSelection.selectAndHandleServer();
    console.log("Server selection completed successfully");
    await page.waitForTimeout(5000);

    // Data Extract Workflow
    await page.locator(Locators.ADCPortalReporting).click();
    await page.locator(Locators.requestListDropDown).click();
    await page.locator(Locators.SelectRequestlist).click();
    await page.locator(Locators.SubmitRequestType).click();
  
    // Wait for new document ID
    await page.waitForSelector("div[class='aoui-tableRowsContainer'] div:nth-child(1) div:nth-child(1)", { timeout: 30000 });
    const firstCell = await page.locator("div[class='aoui-tableRowsContainer'] div:nth-child(1) div:nth-child(1)").first().textContent();
    console.log('First cell (Document ID):', firstCell);

    // Check status and reload if needed
    let finalStatus = await page.locator(Locators.Lastcell).first().textContent();
    const ProcessingComplete = "Processing Complete";
    let reloadAttempts = 0;

    while (reloadAttempts < 10 && !(finalStatus && finalStatus.includes(ProcessingComplete))) {
      await page.locator(Locators.ReloadButton).click();
      await page.waitForSelector("div[class='aoui-tableRowsContainer'] div:nth-child(1) div:nth-child(1)", { timeout: 30000 });
      reloadAttempts++;
      finalStatus = await page.locator(Locators.Lastcell).first().textContent();
    }

    expect(finalStatus).toBeTruthy();
    if (finalStatus && finalStatus.includes(ProcessingComplete)) {
      console.log("Processing Complete after reload");
      await ReportUtils.screenshot(page, "DataExtracts_Success");
      console.log("ADC Portal Request selection completed successfully");
    } else {
      console.log("Processing Complete status not reached after maximum reloads.");
    }

    await context.close();
  });
// Use afterAll hook for cleanup
  test.afterAll(async () => {
    if (page) await page.close();
    if (context) await context.close();
  });
});