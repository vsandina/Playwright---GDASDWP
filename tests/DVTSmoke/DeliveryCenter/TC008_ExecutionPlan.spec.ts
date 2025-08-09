import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import ReportUtils from "../../../utils/reportUtils.spec";
import ServerSelection  from "../../../PageObjectsTest/ServerSelection.spec";
import FiltersPage from "../../../PageObjectsTest/FiltersPage";
import RequestCreationPage from "../../../PageObjectsTest/RequestCreationPage";
import { Locators } from '../../../PageObjectsTest/locators';
import ExecutionPlan  from "../../../PageObjectsTest/ExecutionPlan.spec";

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
    let executionPlan: ExecutionPlan;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(Env.QDWP);
        login = new LoginPage(page);
        serverSelection = new ServerSelection(page);
        filtersPage = new FiltersPage(page);
        requestCreationPage = new RequestCreationPage(page);
        executionPlan = new ExecutionPlan(page);
    });

    test("DWP_UserLoginpage", async () => {
        await login.enterUserName(data.email);
        await login.nxtButton();
        await login.enterUserPassword(data.pass);
        await login.clickSignBtn();
        await page.locator(Locators.popup).click();
        console.log("Login completed successfully");
    });

    test("serverSelection", async () => {
        await serverSelection.selectAndHandleServer();
        console.log("Server selection completed successfully");
        await page.waitForTimeout(5000);
    });
    test("AuditDeliveryCenterExecutionPlan", async () => {
        await executionPlan.AuditDeliveryCenterExecutionPlan();
       
    });
    test("DefineEntities", async () => {
        await executionPlan.DefineEntities();
       
    });
    test("ClientDetails", async () => {
        await executionPlan.ClientDetails();
    });
    test("ClientContactDetails", async () => {
        await executionPlan.ClientContactDetails();
    }); 
});
