import { test, expect } from '@playwright/test';
import LoginPage from "../../PageObjectsTest/LoginPage.spec";
import Env from "../../utils/environment";
import * as data from "../../data/login.cred.json";
import ReportUtils from "../../utils/reportUtils.spec";
import ServerSelection from "../../PageObjectsTest/ServerSelection.spec";
import FiltersPage from "../../PageObjectsTest/FiltersPage";
import RequestCreationPage from "../../PageObjectsTest/RequestCreationforEMS";
import { Locators } from '../../PageObjectsTest/locators';

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
    test.setTimeout(10000); // Set a timeout for the entire test suite
    test("DWP_UserLoginpage", async () => {
        await login.enterUserName(data.email);
        await login.nxtButton();
        await login.enterUserPassword(data.pass);
        await login.clickSignBtn();
        const closeButton = page.getByRole('button', { name: 'Close' });
        if (await closeButton.isVisible().catch(() => false)) {
            await closeButton.click();
        }
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
    test.setTimeout(100000)
    test("uploadDocument", async () => {
        await page.click(Locators.engagementselection);
        const firstRow = page.locator('.datatable-body-row').first();
        let requestIdCell = firstRow.locator('.datatable-body-cell').first();
        let requestId = await requestIdCell.innerText();
        console.log('Clicking on the first EngagementID:', requestId);
        await requestIdCell.click();
        // Write the buffered requestId to buffer.json for use in other tests
        // fs.writeFileSync('data/buffer.json', JSON.stringify({ requestId }));
        await page.locator("text=Upload Documents").click();
        const documentName = page.locator("text=ADC 1.4.1.docx");
        await page.locator("#file").setInputFiles('uploads/ADC 1.4.1.docx');
        await page.waitForTimeout(5000);
        await page.locator("text=Save Changes").click();
        const requestUpdatedPopup = page.locator("text=Your request has been updated successfully");
        await expect(requestUpdatedPopup).toBeVisible();
        console.log("Your request has been updated successfully");
        await ReportUtils.screenshot(page, "UploadDocument");
        await requestUpdatedPopup.click();
        await expect(requestIdCell).toBeVisible();
        await requestIdCell.click();
        await page.locator("text=Upload Documents").click();
        await documentName.click();
        await page.waitForLoadState('networkidle');
        await ReportUtils.screenshot(page, "DownloadDocument");
    });

    // Remove afterAll hook to avoid test.info() error in Allure
    test("Cleanup", async () => {
        if (page) await page.close();
        if (context) await context.close();
    });
});