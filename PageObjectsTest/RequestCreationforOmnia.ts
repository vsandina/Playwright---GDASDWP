import { Page } from '@playwright/test';
import { Locators } from './locators';
import path from 'path';

export default class RequestCreationPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async createRequestomnia(requestName: string = 'checkpoint-vinod') {
        // await this.page.locator(Locators.addbutton1).click();
        await this.page.click(Locators.engagementselection);
        await this.page.getByText('Information', { exact: true }).click();
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
        await this.page.getByText('Information', { exact: true }).click();
        await this.page.locator(Locators.requestDetailsTab).click();
        await this.page.locator(Locators.entityDropdown).click();
    // Append text to the existing value in the request name textbox
         await this.page.locator(Locators.EntityNameDropdown).getByText('@!3@^%').first().click();
        await this.page.locator("#request-name").clear();
        await this.page.locator('#request-name').fill(" Playwright1");
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
        await this.page.locator("(//span[@class='aoui-select-selection__placeholder'][normalize-space()='Select a Team Member'])[1]").click();
        await this.page.locator("//div[@class='aoui-select-results__option-label ng-star-inserted'][normalize-space()='US AUDIT Test User03']").click();
        // await this.page.locator(Locators.partnerDropdown).click();
        await this.page.locator(Locators.ManagerDropdown).click();
        // Select the first available option in the dropdown
        await this.page.locator('.aoui-select-results__options div').first().click();
        // Fill in the request name and description
        await this.page.locator('#addDetails .aoui-form-control').nth(0).fill('Test1');
        await this.page.locator('#addDetails .aoui-form-control').nth(1).fill('Test2');
        // Submit the request
        await this.page.locator("//span[normalize-space()='Submit Request']").click();
          console.log("Omnia Single Request created successfully");
    }
}


