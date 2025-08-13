import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import ReportUtils from "../../../utils/reportUtils.spec";
import ServerSelection  from "../../../PageObjectsTest/ServerSelection.spec";
import FiltersPage from "../../../PageObjectsTest/FiltersPage";
import RequestCreationPage from "../../../PageObjectsTest/RequestCreationforEMS";
import { Locators } from '../../../PageObjectsTest/locators';

test.use({
  viewport: { width: 1920, height: 937 },
});

test.describe.serial("EMSRequestCreation", () => {
    let login: LoginPage;
    let page;
    let context;
    let serverSelection: ServerSelection;
    let filtersPage: FiltersPage;
    let requestCreationPage: RequestCreationPage;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext({
            recordVideo: { 
            dir: 'videos/', 
            size: { width: 1920, height: 937 } // Set high resolution for clear video
            }
        });
        page = await context.newPage();
        await page.goto(Env.QDWP);
        login = new LoginPage(page);
        serverSelection = new ServerSelection(page);
    });
    test.setTimeout(30000); // Set a timeout for the entire test suite
    test("DWP_UserLoginpage", async () => {
        await login.enterUserName(data.email);
        await login.nxtButton();
        await login.enterUserPassword(data.pass);
        await login.clickSignBtn();
        await page.locator(Locators.popup).click();
        console.log("Login completed successfully");
    });

    test("serverSelection", async () => {
        await serverSelection.selectAndHandleServer();
        console.log("Server selection completed successfully");
        await page.waitForTimeout(5000);
    });

    test("Filters and Dropdowns", async () => {
        filtersPage = new FiltersPage(page);
        await filtersPage.applyFiltersAndSelect("EMS", data.EMSFilename);
    });
    test.setTimeout(200000);
    test("SingleRequestCreation", async () => {
    requestCreationPage = new RequestCreationPage(page);
    await requestCreationPage.createRequestEMS(data.requesttemplate);
    await requestCreationPage.CreateSingleRequest();
    // Wait for the request created success toaster
           // Wait for the request created success toaster before taking screenshot
           await expect(page.locator("//div[contains(@class,'sn-content') and contains(.,'New Request Created')]")).toBeVisible({ timeout: 15000 });
           await ReportUtils.screenshot(page, "Request_Creation_Success");
           await page.waitForSelector('.datatable-body-row');

           const firstRow = page.locator('.datatable-body-row').first();
           let requestId = await firstRow.locator('.datatable-body-cell').first().innerText();
           console.log('Buffered EMS requestId:', requestId);
           // Write the buffered EMS requestId to buffer.json for use in other tests
           fs.writeFileSync('data/buffer.json', JSON.stringify({ requestId }));
        });

    test("Cleanup", async () => {
        if (page) await page.close();
        if (context) await context.close();
    });
});