import { test, expect } from '@playwright/test';
import LoginPage from "../../PageObjectsTest/LoginPage.spec";
import Env from "../../utils/environment";
import * as data from "../../data/login.cred.json";
import ReportUtils from "../../utils/reportUtils.spec";
import ServerSelection from "../../PageObjectsTest/ServerSelection.spec";
import { Locators } from '../../PageObjectsTest/locators';

test.use({ viewport: { width: 1521, height: 791 } });


test.describe.serial("EmsCreation", () => {
  test.setTimeout(300000); // Set a timeout for the entire test suite

  async function createContextAndPage(browser) {
    const context = await browser.newContext({
      recordVideo: {
        dir: 'videos/',
        size: { width: 1521, height: 791 }
      }
    });
    const page = await context.newPage();
    await page.goto(Env.QDWP);
    return { context, page };
  }

  async function login(page) {
    const login = new LoginPage(page);
    await login.enterUserName(data.email);
    await login.nxtButton();
    await login.enterUserPassword(data.pass);
    await login.clickSignBtn();
        const closeButton = page.getByRole('button', { name: 'Close' });
        if (await closeButton.isVisible().catch(() => false)) {
            await closeButton.click();
        }
    console.log("Login completed successfully");
  }

  async function selectServer(page) {
    const serverSelection = new ServerSelection(page);
    await serverSelection.selectAndHandleServer();
    console.log("Server selection completed successfully");
    await page.waitForTimeout(5000);
  }

  test("DWP_UserLoginpage", async ({ browser }) => {
    const { context, page } = await createContextAndPage(browser);
    await login(page);
    await context.close();
  });

  test("serverSelection", async ({ browser }) => {
    const { context, page } = await createContextAndPage(browser);
    await login(page);
    await selectServer(page);
    await context.close();
  });

  test("DataExtract", async ({ browser }) => {
    const { context, page } = await createContextAndPage(browser);
    await login(page);
    await selectServer(page);

    // Data Extract Workflow
    await page.locator(Locators.ADCPortalReporting).click();
    await page.locator(Locators.requestListDropDown).click();
    await page.locator(Locators.SelectRequestlist).first().click();
    await page.locator(Locators.SubmitRequestType).click();
    await page.waitForTimeout(3000);

    await page.waitForSelector(Locators.DataExtractFirstcell);
    const firstCell = await page.locator(Locators.DataExtractFirstcell).first().textContent();
    console.log('First cell (Document ID):', firstCell);

    // Check status and reload if needed
    let finalStatus = await page.locator(Locators.DataExtractLastcell).first().textContent();
    console.log(finalStatus);
    const ProcessingComplete = "Processing Complete";
    let reloadAttempts = 0;

    while (reloadAttempts < 10 && !(finalStatus && finalStatus.includes(ProcessingComplete))) {
      await page.locator(Locators.ReloadButton).click();
      reloadAttempts++;
      finalStatus = await page.locator(Locators.DataExtractLastcell).first().textContent();
    }

    expect(finalStatus).toBeTruthy();
    if (finalStatus && finalStatus.includes(ProcessingComplete)) {
      console.log("Processing Complete");
      await ReportUtils.screenshot(page, "DataExtracts_Success");
      
      console.log("ADC Portal Request selection completed successfully");
    } else {
      console.log("Failed");
    }
    await context.close();
  });
});