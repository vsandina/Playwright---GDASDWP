// Select the checkbox for the row matching OmniarequestId
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
    let OmniaPage: NavigatetoOmniaPage;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(Env.qnxomnia);
        login = new LoginPage(page);
        OmniaPage = new NavigatetoOmniaPage(page);
    });

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
        await page.getByRole('gridcell', { name: 'Checkbox not checked' }).locator('label').click();
  
    });
    test("EditStates", async () => {
                // Implement the test logic for editing states
        




    });
    test.afterAll(async () => {
        if (page) await page.close();
        if (context) await context.close();
    });
});
