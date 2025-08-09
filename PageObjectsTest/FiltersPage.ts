import { Page } from '@playwright/test';

export default class FiltersPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

async applyFiltersAndSelect(filterType: string, filename: string) {
    await this.page.waitForTimeout(2000);
    await this.page.locator("//div[@class='dicon dicon-filter icon-leftspace text-primary']").click();
    await this.page.locator("//span[@class='aoui-select-selection__rendered ng-star-inserted']").click();
    if (filterType.toLowerCase() === 'projects') {
        await this.page.locator("//div[normalize-space()='Projects']").click();
    } else {
        await this.page.locator(`//div[contains(text(),'${filterType}')]`).click();
    }
    switch (filterType.toLowerCase()) {
       
        case 'ems':
        case 'projects':
            // For Omnia, EMS, and Projects, fill engagement name and click Apply
            await this.page.locator("//input[@placeholder='Engagement Name']").fill(filename);
            await this.page.waitForTimeout(2000);
            await this.page.locator("div.clear-all-button", { hasText: "Apply" }).click();
            break;
        case 'levvia':
            await this.page.locator("//div[contains(text(),'APA')]").click();
            await this.page.locator("//div[normalize-space()='EMA']").click();
            await this.page.locator("div.clear-all-button", { hasText: "Apply" }).click();
            break;
        case 'omnia':
            await this.page.waitForTimeout(2000);
            // await this.page.locator("//div[contains(text(),'APA')]").click();
            // await this.page.locator("//div[contains(text(),'AME')]").click();
            await this.page.locator("//input[@placeholder='Engagement Name']").fill(filename);
            await this.page.locator("div.clear-all-button", { hasText: "Apply" }).click();
            break;
        default:
            // For other types, fill engagement name and select filename
            await this.page.locator("//input[@placeholder='Engagement Name']").fill(filename);
            await this.page.locator("div.clear-all-button", { hasText: "Apply" }).click();
            await this.page.locator(`//span[normalize-space()='${filename}']`).click();
            break;
    }
 }
}
