import { test, expect } from '@playwright/test';
import LoginPage from "../../PageObjectsTest/LoginPage.spec";
import Env from "../../utils/environment";
import * as data from "../../data/login.cred.json";
import ServerSelection  from "../../PageObjectsTest/ServerSelection.spec";
import FiltersPage from "../../PageObjectsTest/FiltersPage";
import RequestCreationforOmina from "../../PageObjectsTest/RequestCreationforOmnia";
import NavigatetoOmniaPage from "../../PageObjectsTest/qnxomnia";

test.use({
  viewport: { width: 1920, height: 937 },
});

test.describe.serial("EMSRequestCreation", () => {
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
        await filtersPage.applyFiltersAndSelect("Omnia", data.OmniaFilename);
        
     });
    test.setTimeout(100000);
    test("TC004_RequestCreationForOmnia", async () => {
        await requestCreationPage.createRequestomnia(data.requesttemplate);
        await requestCreationPage.CreateSingleRequest();
    });

test.afterAll(async () => {
        if (page) await page.close();
        if (context) await context.close();
    });
});
