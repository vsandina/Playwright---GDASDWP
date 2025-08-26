import { Page, expect } from '@playwright/test';
import { Locators } from './locators';
import ReportUtils from "../utils/reportUtils.spec";
import * as fs from 'fs';

export default class RequestCreationPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async createRequestproject(requestName: string = 'checkpoint-vinod') {
        // await this.page.locator(Locators.addbutton1).click();
        await this.page.click(Locators.engagementselection);
        await this.page.click(Locators.createrequestaddButton);
        await this.page.click(Locators.Singlerequest);
        await this.page.locator(Locators.thirdDropdown).click();
        await this.page.locator(Locators.searchField).pressSequentially(requestName);
        await this.page.locator(Locators.resultOption).click();
        await this.page.click(Locators.confirmButton);
    }
    async CreateSingleRequest() {
        const radio = this.page.locator(Locators.radioPcaobFalse);
        if (!(await radio.isChecked())) {
            await this.page.locator(Locators.radioPcaobFalseLabel).click();
        }
        await this.page.locator(Locators.requestDetailsTab).click();
                const hasPlaceholder = await this.page
            .locator('#EntityNameDropdown .aoui-select-selection__placeholder')
            .isVisible()
            .catch(() => false);
        if (hasPlaceholder) {
            await this.page.locator('.aoui-select-results__option-label').nth(0).click();
        }
        // await this.page.locator(Locators.entityDropdown).click();
        // await this.page.locator(Locators.EntityNameDropdown).getByText('@!3@^%').first().click();
        await this.page.locator(Locators.chargeCodeTextbox).getByRole('textbox').click();
        await this.page.locator(Locators.chargeCodeTextbox).getByRole('textbox').fill('char');
        await this.page.locator(Locators.chargeCodeListItem).getByRole('listitem').locator('span').click();
        await this.page.getByText(Locators.chargeCodeText).click();
        // Fill Data Due Date (today) and Request Due Date (tomorrow) directly in the input fields
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${mm}/${dd}/${yyyy}`;
       
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const yyyy2 = tomorrow.getFullYear();
        const mm2 = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd2 = String(tomorrow.getDate()).padStart(2, '0');
        const formattedTomorrow = `${mm2}/${dd2}/${yyyy2}`;
        
        // Data Due Date
        await this.page.locator(Locators.dataduedatecalendarSelector).fill(formattedDate);
        // Request Due Date
        await this.page.locator(Locators.requestDueDateCalendarSelector).fill(formattedTomorrow);
        // Phase Dropdown
        await this.page.locator(Locators.phasedropdown).click();
        await this.page.locator(Locators.phaseselection).click();
        //aoui-typeahead[@name='lead-engagement-manager']//input[@id='']
        // await this.page.locator(Locators.projectmanager).click();
        await this.page.locator("(//span[@class='aoui-select-selection--multiple ng-star-inserted'])[4]").click();
        await this.page.locator('#ngb-typeahead-3-0').click();
    
        // Fill in the request name and description
        await this.page.locator('#addDetails .aoui-form-control').nth(0).fill('Test1');
        await this.page.locator('#addDetails .aoui-form-control').nth(1).fill('Test2');
        // Dismiss cookie consent overlay if present
        const consentBanner = this.page.locator('#onetrust-policy-text');
        if (await consentBanner.isVisible().catch(() => false)) {
            await consentBanner.click();
        }
        // Optionally, wait for overlay to disappear
        await this.page.locator('#onetrust-consent-sdk').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
        // Submit the request
        // await this.page.locator('#onetrust-close-btn-container').click();
        await this.page.locator("//span[normalize-space()='Submit Request']").click();
        // Wait for the request created success toaster before taking screenshot
        await expect(this.page.locator("//div[contains(@class,'sn-content') and contains(.,'New Request Created')]")).toBeVisible({ timeout: 15000 });
        await ReportUtils.screenshot(this.page, "Request_Creation_Success");
        await this.page.waitForTimeout(5000);
        await this.page.waitForSelector('.datatable-body-row');
        const firstRow = this.page.locator('.datatable-body-row').first();
        let requestId = await firstRow.locator('.datatable-body-cell').first().innerText();
        console.log('Buffered Project requestId:', requestId);
        // Write the buffered Project requestId to buffer.json for use in other tests
        fs.writeFileSync('data/buffer.json', JSON.stringify({ requestId }));
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(7000); // Adjust the timeout as necessary
        console.log("Project Single Request created successfully");
    }
}


