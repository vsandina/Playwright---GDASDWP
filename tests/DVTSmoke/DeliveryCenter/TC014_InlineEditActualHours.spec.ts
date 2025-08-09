import { test, expect } from '@playwright/test';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import ServerSelection from '../../../PageObjectsTest/ServerSelection.spec';
import DeliveryCenterPopup from "../../../PageObjectsTest/DeliveryCenterPopup.spec";
import ReportUtils from "../../../utils/reportUtils.spec";
import GlobalDeliveryCenter from "../../../PageObjectsTest/GlobalDeliveryCenter";
import * as fs from 'fs';

test.use({
  viewport: { width: 1920, height: 1080 },
});

test.describe.serial("InlineEditActualHours", () => {
  let login: LoginPage;
  let page;
  let context;
  let serverSelection: ServerSelection;
  let deliveryCenterPopup: DeliveryCenterPopup;
  let globalDeliveryCenter: GlobalDeliveryCenter;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(Env.QDWP);
    login = new LoginPage(page);
    serverSelection = new ServerSelection(page);
    deliveryCenterPopup = new DeliveryCenterPopup(page);
    globalDeliveryCenter = new GlobalDeliveryCenter(page);
  });

  test("TC014_InlineEditActualHours", async () => {
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
    await page.waitForLoadState('load');

    // Wait for loader to be hidden
    const loader = page.locator('.nova-ui-loader-container');
    if (await loader.count() > 0) {
      console.log('Waiting for loader to be hidden...');
      await loader.waitFor({ state: 'hidden', timeout: 30000 });
    }

    // Wait for modal/dialog to be hidden if present
    const modal = page.locator('.aoui-model.show');
    if (await modal.count() > 0 && await modal.isVisible()) {
      console.log('Waiting for modal/dialog to be hidden...');
      await modal.waitFor({ state: 'detached', timeout: 50000 });
    }

    // Read buffered requestId
    const buffer = JSON.parse(fs.readFileSync('data/buffer.json', 'utf-8'));
    const requestId = buffer.requestId;
    console.log('Read buffered requestId:', requestId);

    // Search for requestId
    await page.locator('#quick-filter-textbox').pressSequentially(requestId);

    // Wait for search results to appear
    // const row = page.locator('.datatable-body-row');
    // await row.first().waitFor({ state: 'visible', timeout: 70000 });

    // const rowCount = await row.count();
    // if (rowCount === 0) {
    //   throw new Error(`No search results found for requestId: ${requestId}`);
    // }

    // Click the checkbox for the first row
    const checkboxLabel = page.locator("(//label[@for='radc-requests-list-table-checkbox-selected-0'])[1]");
    await checkboxLabel.waitFor({ state: 'visible', timeout: 60000 });
    await checkboxLabel.click();

    // Click the clock icon to open inline edit
    await page.locator("//div[@class='dicon dicon-clock text-primary']").click();

    // Handle IC icon and agreement if present
    const icIcon = page.locator("(//div[@class='dicon dicon-information dicon-inline text-danger'])[1]");
    if (await icIcon.isVisible()) {
      await icIcon.click();
      const checkbox = page.locator(".aoui-checkbox-label");
      if (await checkbox.isVisible()) {
        await checkbox.click();
      }
      const agreeBtn = page.locator("//button[normalize-space()='Agree']");
      if (await agreeBtn.isVisible()) {
        await agreeBtn.click();
      }
    }

    // Enter actual hours for each day
    for (let i = 1; i <= 5; i++) {
      const input = page.locator(`//input[starts-with(@id, 'day${i}_') and contains(@id, '_Preparer')]`);
      if (await input.count() > 0) {
        const value = (Math.floor(Math.random() * 8) + 1).toString();
        await input.first().fill(value);
      } else {
        console.warn(`Input for day${i} not found`);
        
      }
    }

    // Optionally take a screenshot
    // await ReportUtils.screenshot(page, "QuickFind_Search_RequestId");
    await page.locator("//div[@class='dicon dicon-save-nc text-primary']").click(); 
    await page.pause();
  });

  test("Cleanup", async () => {
    if (page) await page.close();
    if (context) await context.close();
  });
});