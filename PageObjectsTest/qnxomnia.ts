import { Page, expect } from '@playwright/test';
import * as data from "../data/login.cred.json";
import Env from "../utils/environment";

export default class OmniaPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async NavigatetoOmniaPage() {
    // Navigate to the Omnia page
    await this.page.goto(Env.qnxomnia);
    // Wait until the page is fully loaded before any actions
    await this.page.waitForLoadState('load');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');

    // Now perform actions after full page load
    const searchInput = this.page.locator("//input[@placeholder='Search work files']");
    await expect(searchInput).toBeVisible();
    await searchInput.pressSequentially(data.OmniaFilename);

    // Wait for the search result and click it
    const reportLink = this.page.getByText('Audit Report SEMS65', { exact: true });
    await expect(reportLink).toBeVisible();
    await reportLink.click();

    // Wait for the Live Index button and click it
    const liveIndexBtn = this.page.locator("//button[@aria-label='Live Index']//div[@class='root-class']//*[name()='svg']");
    await expect(liveIndexBtn).toBeVisible();
    await liveIndexBtn.click();

    // Wait for the next button and click it
    const nextBtn = this.page.locator("//div[@id='pageContent']//div[4]//div[1]//button[1]");
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    }
    public async verifyRequestIdPresent() {
        // Read the buffered requestId and verify in the Omnia portal that requestId is present
        const buffer = JSON.parse(require('fs').readFileSync('data/buffer.json', 'utf-8'));
        const OmniarequestId = buffer.OmniarequestId;
        console.log('DWP requestId and Omnia requestId are same:', OmniarequestId);
        // If the requestId is not present in the Omnia portal then throw an error
        const requestIdLocator = this.page.locator(`text=${OmniarequestId}`);
        await expect(requestIdLocator).toBeVisible({ timeout: 15000 });
    }
}