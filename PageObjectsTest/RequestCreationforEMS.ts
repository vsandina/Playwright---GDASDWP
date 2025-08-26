import { Page, expect } from '@playwright/test';
import { Locators } from './locators';
import ReportUtils from "../utils/reportUtils.spec";
import * as fs from 'fs';

export default class RequestCreationPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async createRequestEMS(requestName: string = 'checkpoint-vinod') {
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
        await this.page.locator(Locators.entityDropdown).click();
        // Select the first visible option in the dropdown dynamically
        await this.page.locator(Locators.EntityNameDropdown).click();
        // Only select the first option if nothing is selected (placeholder is visible)
        const hasPlaceholder = await this.page
            .locator('#EntityNameDropdown .aoui-select-selection__placeholder')
            .isVisible()
            .catch(() => false);
        if (hasPlaceholder) {
            await this.page.locator('.aoui-select-results__option-label').nth(0).click();
        }
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
        // Tomorrow's date
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
        await this.page.locator('#lead-engagement-manager').click();
        await this.page.locator(".aoui-select-results__option-label").nth(0).click();
        // Fill in the request name and description
        await this.page.locator('#addDetails .aoui-form-control').nth(0).fill('Test1');
        await this.page.locator('#addDetails .aoui-form-control').nth(1).fill('Test2');
        // Submit the request
        
        await this.page.locator('button:has-text("Submit Request")').click();
        await this.page.waitForLoadState('domcontentloaded');
        // await this.page.locator('#onetrust-close-btn-container').click();
        await this.page.waitForTimeout(6000);
    // Wait for the request created success toaster
           // Wait for the request created success toaster before taking screenshot
        await expect(this.page.locator("//div[contains(@class,'sn-content') and contains(.,'New Request Created')]")).toBeVisible({ timeout: 15000 });
        await ReportUtils.screenshot(this.page, "Request_Creation_Success");
        await this.page.waitForTimeout(5000);
        //await this.page.locator('.radc-list-div-table .datatable-body').waitFor();
        await this.page.waitForSelector('.datatable-body-row');
        const firstRow = this.page.locator('.datatable-body-row').first();
        let requestId = await firstRow.locator('.datatable-body-cell').first().innerText();
        console.log('Buffered EMS requestId:', requestId);
        // Write the buffered EMS requestId to buffer.json for use in other tests
        fs.writeFileSync('data/buffer.json', JSON.stringify({ requestId }));
    }
}


