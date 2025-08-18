import { test, expect } from '@playwright/test';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import ReportUtils from "../../../utils/reportUtils.spec";
import ServerSelection  from "../../../PageObjectsTest/ServerSelection.spec";
import FiltersPage from "../../../PageObjectsTest/FiltersPage";
import RequestCreationPage from "../../../PageObjectsTest/RequestCreationforEMS";
import { Locators } from '../../../PageObjectsTest/locators';    

test.use({
  viewport: { width: 1940, height: 937 },
});

test.describe.serial("EntitiesLoadingLevvia", () => {
    let login: LoginPage;
    let page;
    let context;
    let serverSelection: ServerSelection;
    let filtersPage: FiltersPage;
    let requestCreationPage: RequestCreationPage;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(Env.QDWP);
        login = new LoginPage(page);
        serverSelection = new ServerSelection(page);
        filtersPage = new FiltersPage(page);
        requestCreationPage = new RequestCreationPage(page);
    });
    test.setTimeout(100000);
    test("TC004_EntitiesLoadingLevvia", async () => {
        // Login
        await login.enterUserName(data.email);
        await login.nxtButton();
        await login.enterUserPassword(data.pass);
        await login.clickSignBtn();
        await page.locator(Locators.popup).click();
        console.log("Login completed successfully");

        // Server Selection
        await serverSelection.selectAndHandleServer();
        console.log("Server selection completed successfully");
        await page.waitForTimeout(5000);

        // Filters and Dropdowns
        await filtersPage.applyFiltersAndSelect("Levvia", data.LevviaFilename);
              
        // Engagement selection
        await page.locator(Locators.LevviEngagementSelection).first().click();

        // Wait until the page is loaded successfully (loader disappears)
        await expect(page.locator('.nova-ui-loader-container')).toBeHidden({ timeout: 30000 });
          
        // Open actions dropdown and select the first item
        await page.locator(Locators.ActionDropdownEntities).click();
        await expect(page.locator("//div[normalize-space()='ACTIONS']")).toBeVisible();
        await page.locator(Locators.IdentifyEntities).click();
        
        // Wait until the text 'Identify entities for this engagement' is visible
        await expect(page.getByText(/Identify entities/)).toBeVisible({ timeout: 40000 });

        // Take a screenshot after entities are loaded
        await ReportUtils.screenshot(page, "Entities_are_loading");
        console.log("Entities are loaded");
    });
    test("Cleanup", async () => {
        if (page) await page.close();
        if (context) await context.close();
    }); 
});
