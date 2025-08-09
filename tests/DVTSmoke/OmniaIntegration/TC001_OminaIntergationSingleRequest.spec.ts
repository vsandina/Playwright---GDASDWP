import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import ReportUtils from "../../../utils/reportUtils.spec";
import ServerSelection  from "../../../PageObjectsTest/ServerSelection.spec";
import FiltersPage from "../../../PageObjectsTest/FiltersPage";
import RequestCreationforOmina from "../../../PageObjectsTest/RequestCreationforOmnia";
import NavigatetoOmniaPage from "../../../PageObjectsTest/qnxomnia";
import qnxomnia from '../../../PageObjectsTest/qnxomnia';

test.use({
  viewport: { width: 1920, height: 1080 },
});

test.describe.serial("TC011_OminaIntergationSingleRequest", () => {
    let login: LoginPage;
    let page;
    let context;
    let serverSelection: ServerSelection;
    let filtersPage: FiltersPage;
    let requestCreationPage: RequestCreationforOmina;
    let OmniaPage: NavigatetoOmniaPage;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(Env.QDWP);
        login = new LoginPage(page);
        serverSelection = new ServerSelection(page);
        filtersPage = new FiltersPage(page);
        requestCreationPage = new RequestCreationforOmina(page);
        OmniaPage = new NavigatetoOmniaPage(page);
    });

    test("DWP_UserLoginpage", async () => {
        await login.enterUserName(data.email);
        await login.nxtButton();
        await login.enterUserPassword(data.pass);
        await login.clickSignBtn();
        await page.locator("//button[@class='onetrust-close-btn-handler banner-close-button ot-close-icon']").click();
        console.log("Login completed successfully");
    });

    test("serverSelection", async () => {
        await serverSelection.selectAndHandleServer();
        console.log("Server selection completed successfully");
        await page.waitForTimeout(5000);
    });

    test("Filters and Dropdowns", async () => {
        await filtersPage.applyFiltersAndSelect("Omnia", data.OmniaFilename);
    
     
    });

    test("TC011_TC011_OminaIntergationSingleRequest", async () => {
        await requestCreationPage.createRequestomnia(data.requesttemplate);
        await requestCreationPage.CreateSingleRequest();
        // Wait for the request created success toaster before taking screenshot
        await expect(page.locator("//div[contains(@class,'sn-content') and contains(.,'New Request Created')]")).toBeVisible({ timeout: 15000 });
        await ReportUtils.screenshot(page, "Request_Creation_Success");
        await page.waitForSelector('.datatable-body-row');
        const firstRow = page.locator('.datatable-body-row').first();
        let requestId = await firstRow.locator('.datatable-body-cell').first().innerText();
        console.log('Buffered requestId:', requestId);
        // Write the buffered requestId to buffer.json for use in other tests
        fs.writeFileSync('data/buffer.json', JSON.stringify({ requestId}));
              
    });
        test("Open Omnia URL", async () => {
        await OmniaPage.NavigatetoOmniaPage();
        //read the buffered requestid and verify in the omnia portal that request id is present
        const buffer = JSON.parse(fs.readFileSync('data/buffer.json', 'utf-8'));
        const requestId = buffer.requestId;
        console.log('Read buffered requestId:', requestId); 
        //if the requestid is not present in the omnia portal then throw an error
        const requestIdLocator = page.locator(`text=${requestId}`);
        await expect(requestIdLocator).toBeVisible({ timeout: 15000 });
    });

    test.afterAll(async () => {
        if (page) await page.close();
        if (context) await context.close();
    });
});
