import { test, expect } from '@playwright/test';
import LoginPage from "../../PageObjectsTest/LoginPage.spec";
import Env from "../../utils/environment";
import * as data from "../../data/login.cred.json";
import ServerSelection from '../../PageObjectsTest/ServerSelection.spec';
import DeliveryCenterPopup from "../../PageObjectsTest/DeliveryCenterPopup.spec";
import ReportUtils from "../../utils/reportUtils.spec";
import GlobalDeiveryCenter from "../../PageObjectsTest/GlobalDeliveryCenter";
import * as fs from 'fs';
import { Locators } from '../../PageObjectsTest/locators';

test.use({
    viewport: { width: 1521, height: 791 },
});

test.describe.serial("QuickFind", () => {// Describe the test suite for QuickFind

    let login: LoginPage;// Declare the LoginPage object
    let page;
    let context;
    let serverSelection: ServerSelection;// Declare the ServerSelection object
    let deliveryCenterPopup: DeliveryCenterPopup;// Declare the DeliveryCenterPopup object
    let globalDeiveryCenter: GlobalDeiveryCenter;// Declare the GlobalDeliveryCenter object

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();// Create a new browser context
        page = await context.newPage();// Open a new page in the browser context
        await page.goto(Env.QDWP);// Navigate to the DWP login page
        login = new LoginPage(page);// Initialize the LoginPage object with the current page context
        serverSelection = new ServerSelection(page);// Initialize the ServerSelection object with the current page context
        deliveryCenterPopup = new DeliveryCenterPopup(page);// Initialize the DeliveryCenterPopup object with the current page context
        globalDeiveryCenter = new GlobalDeiveryCenter(page);// Initialize the GlobalDeliveryCenter object with the current page context
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
    test.setTimeout(100000);
    test("DueDateChange", async () => {
        // Login
        await login.enterUserName(data.email);
        await login.nxtButton();
        await login.enterUserPassword(data.pass);
        await login.clickSignBtn();
        console.log("Login completed successfully");

        // Home page Server Selection
        await serverSelection.selectAndHandleServer();
        console.log("Server selection completed successfully");

        // Delivery Center Selection
        await deliveryCenterPopup.handlePopup();
        // Wait for full page load after popup is handled
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
        await waitForLoaderToDisappear(page);
        // Read buffered requestId
        const buffer = JSON.parse(fs.readFileSync('data/buffer.json', 'utf-8'));
        const requestId = buffer.requestId;
        console.log('Read buffered requestId:', requestId);
        await page.locator('#quick-filter-textbox').pressSequentially(requestId);
        await expect(page.locator(`text=${requestId}`)).toBeVisible();
        await page.locator("label[for='radc-requests-list-table-checkbox-selected-0']").click();
        await page.locator(".radc-request-list-link").click();
        await page.waitForTimeout(5000);
        if (await page.locator("text=Please confirm independence to view the details of this request").isVisible()) {
            const ConfirmIndependence = page.getByRole('button', { name: '  Confirm Independence   ' });
            await ConfirmIndependence.click();
            await page.locator(".checkBox-Text").click();
            const Agree = page.getByRole('button', { name: 'Agree' });
            await Agree.click();
            const independenceSuccesspopup = page.locator("text=You have successfully saved the independence");
            await expect(independenceSuccesspopup).toBeVisible();
            console.log("You have successfully saved the independence");
            //need to give a screenshot
            await independenceSuccesspopup.click();
        } else {
            await page.waitForTimeout(1000);
        };
        await page.locator(".input-group").nth(2).click();
        await expect(page.locator(".ngb-dp-month.ng-star-inserted")).toBeVisible();
        await page.locator('text="15"').click();
        const checkbox1 = page.getByText('CheckpointisTru CheckpointisTru');
        if (await checkbox1.isChecked()) {

            await checkbox1.uncheck();
            await checkbox1.check();
        } else {
            await checkbox1.check();
        };
        await page.locator('#DynamicFieldParentDivContainer').getByRole('textbox').first().fill('test');
        // await page.getByText('CheckpointisFalse CheckpointisFalse').click();
        // await page.getByText('thridSOW thridSOW').click();
        // await page.getByText('FourthSOW FourthSOW').click();
        // // await page.locator("text= CheckpointisFalse ").click()
        await page.locator("text=Save Changes").click();
        const AdjustAssignments = page.locator("text=Would you like to adjust the assigned resource plan based on dates ?");
        if (await expect(AdjustAssignments).toBeVisible) {
            await page.getByRole('button', { name: 'Yes' }).click();
        } else {
            await page.waitForTimeout(3000);
        };
        const requestUpdatedPopup = page.locator(Locators.requestUpdatedsucessPopup);
        await expect(requestUpdatedPopup).toBeVisible();
        const successMessage = "Request Updated / Your request has been updated successfully";
        await ReportUtils.screenshot(page, successMessage);
        await requestUpdatedPopup.click();
        console.log(successMessage);


    });

});