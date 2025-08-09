import { Page, expect } from '@playwright/test';
import * as data from "../data/login.cred.json";

export default class OmniaPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async NavigatetoOmniaPage() {
        // Navigate to the Omnia page
        // await this.page.goto('https://qnxomniaame.deloitte.com');
        await this.page.waitForLoadState('domcontentloaded');

        // Search for the work file
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
}