import { test, expect } from '@playwright/test';
import LoginPage from "../../../PageObjectsTest/LoginPage.spec";
import Env from "../../../utils/environment";
import * as data from "../../../data/login.cred.json";
import NavigatetoOmniaPage from "../../../PageObjectsTest/qnxomnia";

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

  test("DWP_UserLoginpage and Open Omnia URL", async () => {
    await login.enterUserName(data.email);
    await login.nxtButton();
    await login.enterUserPassword(data.pass);
    await login.clickSignBtn();
    console.log("Login completed successfully");

    // Now continue on the same page
    await OmniaPage.NavigatetoOmniaPage();
    // Optionally, add assertions or further steps here
    // await page.pause();
  });

  test.afterAll(async () => {
    if (page) await page.close();
    if (context) await context.close();
  });
});