import { Page, expect } from '@playwright/test';
import * as data from "../data/login.cred.json";
import Env from "../utils/environment";
import LoginPage from "../PageObjectsTest/LoginPage.spec";
import { Locators } from './locators';

export default class DWPLoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async NavigatetoDWPPage() {
    // Navigate to the DWP page
    await this.page.goto(Env.QDWP);
    // Wait until the page is fully loaded before any actions
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
        const login = new LoginPage(this.page);
        await login.enterUserName(data.email);
        await login.nxtButton();
        await login.enterUserPassword(data.pass);
        await login.clickSignBtn();
        await this.page.locator(Locators.popup).click();
        console.log("Login completed successfully");
   
    }
}
