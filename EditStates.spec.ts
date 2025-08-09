import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import LoginPage from "../../pages/LoginPage.spec";
import Env from "../../utils/environment";
import * as data from "../../data/login.cred.json";
import ReportUtils from "../../utils/reportUtils.spec";
import ServerSelection  from "../../pages/ServerSelection.spec";
import FiltersPage from "../../pages/FiltersPage";
import RequestCreationPage from "../../pages/RequestCreationPage";
import DeliveryCenterPopup from '../../pages/DeliveryCenterPopup.spec';

test.use({
  viewport: { width: 1920, height: 1080 },
});

test.describe.serial("EMSRequestCreation", () => {
    let login: LoginPage;
    let page;
    let context;
    let serverSelection: ServerSelection;
    let filtersPage: FiltersPage;
    let requestCreationPage: RequestCreationPage;
    let deliveryCenterPopup: DeliveryCenterPopup;
    let requestId: string;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(Env.QDWP);
        login = new LoginPage(page);
        serverSelection = new ServerSelection(page);
        filtersPage = new FiltersPage(page);
        requestCreationPage = new RequestCreationPage(page);
        deliveryCenterPopup = new DeliveryCenterPopup(page);
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
     });

test("All Request page", async () => {
    await deliveryCenterPopup.handlePopup();
    // Wait for the loader to disappear before proceeding
    await page.waitForSelector('.nova-ui-loader-strapline', { state: 'detached', timeout: 75000 });
    // // Wait for the text 'Requests found' to be visible after loading
    // await expect(page.locator('text=Requests found')).toBeVisible({ timeout: 60000 });

    // Read the buffered requestId from buffer.json
    const buffer = JSON.parse(fs.readFileSync('data/buffer.json', 'utf-8'));
    requestId = buffer.requestId;
    console.log('Read buffered requestId:', requestId);

    // Filter for the request
    await page.fill('#quick-filter-textbox', '');
    await page.fill('#quick-filter-textbox', requestId);

    // Select the row
    await page.locator("//label[@for='radc-requests-list-table-checkbox-selected-0']").click();

    // Open the actions menu (ellipsis)
    await page.locator("//div[@class='dicon dicon-ellipsis-nc text-primary']").click();
    //div[@class='mat-mdc-tooltip-trigger radc-icon-button text-primary']
    await page.locator("//div[contains(@class,'mat-mdc-tooltip-trigger') and contains(@class,'radc-icon-button') and contains(@class,'text-primary')]").click();
    await page.locator("//div[@class='dicon dicon-ellipsis-nc text-primary']").click();

    // Open the state dropdown
    await page.click("//input[@aria-expanded='true']");
    
    // Select the new state
    const newState = 'In Progress'; // Change as needed
    await page.click(`text=${newState}`);

    // Optionally, confirm or save if required
    // await page.click("//div[@class='dicon dicon-save-nc text-primary']");

    await page.pause();
});

    test.afterAll(async () => {
        if (page) await page.close();
        if (context) await context.close();
    });
});