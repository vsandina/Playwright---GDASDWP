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
  viewport: { width: 1920, height: 937 },
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
        await OmniaPage.FilterwithRequestName();
        await page.getByRole('gridcell', { name: 'Checkbox not checked' }).first().click();
       
        const editDatesBtn = page.locator("//button[normalize-space()='Edit Dates']");
        await editDatesBtn.scrollIntoViewIfNeeded();
        await editDatesBtn.click({ force: true });

    // Click calendar icon and select today's date for Data Due Date
        await page.locator("//div[@aria-label='Data Due Date']//button[@aria-label='Calendar']//*[name()='svg']").click();
        const today = new Date();
        const todayDay = today.getDate() + 1;
        await page.locator(`.rc-calendar-cell:not(.rc-calendar-cell-disabled) >> text='${todayDay}'`).click();

        // Click calendar icon and select tomorrow's date for Request Due Date
        await page.locator("//div[@aria-label='Request Due Date']//button[@aria-label='Calendar']//*[name()='svg']").click();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 5);
        const tomorrowDay = tomorrow.getDate();
        await page.locator(`.rc-calendar-cell:not(.rc-calendar-cell-disabled) >> text='${tomorrowDay}'`).click();
        await page.locator('text = SUBMIT').click();
        await expect(page.locator('text = 1 of 1 request(s) due dates updated successfully')).toBeVisible({ timeout: 10000 });
        // After update, capture the updated Data Due Date and Request Due Date in omniadatebuffer.json file
                const updatedDataDueDateRaw = await page.locator('.dataTableRow .truncatedContent').nth(3).textContent();
                const updatedRequestDueDateRaw = await page.locator('.dataTableRow .truncatedContent').nth(4).textContent();
                function convertToMMDDYYYY(dateStr) {
                    const parts = (dateStr || '').trim().split('/');
                    if (parts.length === 3) {
                        return `${parts[1].padStart(2, '0')}/${parts[0].padStart(2, '0')}/${parts[2]}`;
                    }
                    return dateStr;
                }
                const updatedBuffer = {
                    DataDueDate: convertToMMDDYYYY(updatedDataDueDateRaw),
                    RequestDueDate: convertToMMDDYYYY(updatedRequestDueDateRaw)
                };
        
        fs.writeFileSync('./data/OmniaDatebuffer.json', JSON.stringify(updatedBuffer, null, 2));
        console.log('OmniaDatebuffer.json:', updatedBuffer);
        await ReportUtils.screenshot(page, "DataDueDate and RequestDueDate is updated successfully");
        });
    test.setTimeout(300000);
        test("Open DWP URL", async () => {
        await page.goto(Env.QDWP);
        await serverSelection.selectAndHandleServer();
        await deliveryCenterPopup.handlePopup();
        await waitForLoaderToDisappear(page);
        await page.locator('#quick-filter-textbox').pressSequentially(data.OmniarequestID);
        const actualDataDueDateRaw = await page.locator('.radc-request-column').nth(38).textContent();
        const actualRequestDueDateRaw = await page.locator('.radc-request-column').nth(37).textContent();

        // Format actual dates to mm/dd/yyyy
        function convertToMMDDYYYY(dateStr) {
            const parts = (dateStr || '').trim().split('/');
            if (parts.length === 3) {
                return `${parts[1].padStart(2, '0')}/${parts[0].padStart(2, '0')}/${parts[2]}`;
            }
            return dateStr;
        }
        const actualDataDueDate = convertToMMDDYYYY(actualDataDueDateRaw);
        const actualRequestDueDate = convertToMMDDYYYY(actualRequestDueDateRaw);

        // Read dates from buffer file
        const buffer = JSON.parse(fs.readFileSync('./data/OmniaDatebuffer.json', 'utf-8'));
        const expectedDataDueDate = buffer.DataDueDate;
        const expectedRequestDueDate = buffer.RequestDueDate;

        // Compare and log result
        if (actualDataDueDate === expectedDataDueDate && actualRequestDueDate === expectedRequestDueDate) {
            console.log('Both DataDueDate and RequestDueDate are matched:', expectedDataDueDate, expectedRequestDueDate);
        } else {
            console.log('Dates do not match:', {
                expectedDataDueDate,
                actualDataDueDate,
                expectedRequestDueDate,
                actualRequestDueDate
            });
        }
        await ReportUtils.screenshot(page, "Both DataDueDate and RequestDueDate are matched");
    });

    test.afterAll(async () => {
        if (page) await page.close();
        if (context) await context.close();
    });
});