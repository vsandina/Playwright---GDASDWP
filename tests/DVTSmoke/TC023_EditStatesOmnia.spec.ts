// Select the checkbox for the row matching OmniarequestId
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import LoginPage from "../../PageObjectsTest/LoginPage.spec";
import Env from "../../utils/environment";
import * as data from "../../data/login.cred.json";
import ReportUtils from "../../utils/reportUtils.spec";
import ServerSelection  from "../../PageObjectsTest/ServerSelection.spec";
import FiltersPage from "../../PageObjectsTest/FiltersPage";
import RequestCreationforOmina from "../../PageObjectsTest/RequestCreationforOmnia";
import NavigatetoOmniaPage from "../../PageObjectsTest/qnxomnia";
import NavigatetoDWPPage from '../../PageObjectsTest/DWPLogin';
import DeliveryCenterPopup from "../../PageObjectsTest/DeliveryCenterPopup.spec";

test.use({
  viewport: { width: 1920, height: 1080 },
});

test.describe.serial("TC023_OmniaPortalLogin", () => {
    let login: LoginPage;
    let page;
    let context;
    let OmniaPage: NavigatetoOmniaPage;
    let DWPPage: NavigatetoDWPPage;
    let serverSelection: ServerSelection;
    let filtersPage: FiltersPage;
    let deliveryCenterPopup: DeliveryCenterPopup;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(Env.qnxomnia);
        login = new LoginPage(page);
        OmniaPage = new NavigatetoOmniaPage(page);
        DWPPage = new NavigatetoDWPPage(page);
        serverSelection = new ServerSelection(page);
        filtersPage = new FiltersPage(page);
        deliveryCenterPopup = new DeliveryCenterPopup(page);
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

        test("OminaPageLogin", async () => {
            await login.enterUserName(data.email);
            await login.nxtButton();
            await login.enterUserPassword(data.pass);
            await login.clickSignBtn();
            console.log("Login completed successfully");
        });

    test.setTimeout(300000)
    test("Open Omnia URL", async () => {
        await OmniaPage.NavigatetoOmniaPage();
        await OmniaPage.RequestStatusFilter();
        await page.waitForTimeout(4000);
        await page.getByRole('gridcell', { name: 'Checkbox not checked' }).first().click();
        // Buffer the requestID value right after clicking the checkbox
        const requestID = await page.locator('.dataTableRow .truncatedContent').nth(0).textContent();
        const buffer = { RequestID: requestID?.trim() };
        fs.writeFileSync('./data/OmniaStatebuffer.json', JSON.stringify(buffer, null, 2));
        console.log('OmniaStatebuffer.json:', buffer);
        //await page.locator('.dataTableCell').first().click();
        const editDatesBtn = page.locator("//button[normalize-space()='Cancel Request']");
        await editDatesBtn.scrollIntoViewIfNeeded();
        await editDatesBtn.click({ force: true });
        // Cancel request on Omnia portal
        await page.locator(".v2modalInner .v2modalContent .inputWrapperContainer #dropdownParentContainer .coreSelectDropdown").click();
        await page.locator("//li[@aria-label='Duplicate tickets in existence']").click();
        await page.locator("//span[@class='text']").click();
        await page.waitForTimeout(5000);
        console.log('The state is changed to Cancelled');
        await ReportUtils.screenshot(page, "State is changed to Cancelled");
    });
    test.setTimeout(300000);
        test("Open DWP URL", async () => {
        await page.goto(Env.QDWP);
        await serverSelection.selectAndHandleServer();
        await deliveryCenterPopup.handlePopup();
        await waitForLoaderToDisappear(page);
        // Read buffered requestId
        const buffer = JSON.parse(fs.readFileSync('data/OmniaStatebuffer.json', 'utf-8'));
        const RequestID = buffer.RequestID;
        console.log('Read buffered requestId:', RequestID);    
        await page.locator('#quick-filter-textbox').pressSequentially(RequestID);
        await waitForLoaderToDisappear(page);
        const actualState = await page.locator('.radc-request-column').nth(6).textContent();
        console.log('The Request status is changed in DWP:', actualState);
        await ReportUtils.screenshot(page, "In DWP and Omnia the status is changed");
    });

    test.afterAll(async () => {
        if (page) await page.close();
        if (context) await context.close();
    });
});