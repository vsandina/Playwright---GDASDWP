import { Page, expect } from '@playwright/test';
import * as data from "../data/login.cred.json";
import Env from "../utils/environment";

export default class AllRequestsPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

public async BasicInformationandScope() {
           // Implement the test logic for NextWeekSelection
        await this.page.locator('.radc-request-list-link .ng-star-inserted').click();
        if (await this.page.locator("text=Please confirm independence to view the details of this request").isVisible()) {
            const ConfirmIndependence = this.page.getByRole('button', { name: '  Confirm Independence   ' });
            await ConfirmIndependence.click();
            await this.page.locator(".checkBox-Text").click();
            const Agree = this.page.getByRole('button', { name: 'Agree' });
            await Agree.click();
            const independenceSuccesspopup = this.page.locator("text=You have successfully saved the independence");
            await expect(independenceSuccesspopup).toBeVisible();
            console.log("You have successfully saved the independence");
            //need to give a screenshot
            await independenceSuccesspopup.click();
        } else {
            await this.page.waitForTimeout(5000);
        };
        await this.page.waitForTimeout(5000);
        await this.page.locator('#processing-team span').first().click();
        // Team selection
        await this.page.locator('#processing-team').getByRole('combobox').fill('prince');
        await this.page.getByText('Team Princeton', { exact: true }).click();

        // User selection helper
        await this.page.waitForTimeout(5000);
        await this.page.locator('.rounded-div .col-sm-5 .select2-selection--single').nth(0).click();
        await this.page.locator('.select2-search__field').click();
        await this.page.click('text= US AUDIT Test User03 (US - Hermitage_SM) ');

        await this.page.locator('#preparer > .rounded-div > div:nth-child(2) > .form-group.col-sm-5 > nova-ui-select > div > .select2 > .selection > .select2-selection').click();
        await this.page.locator('nova-ui-select-dropdown').getByRole('textbox').click();
        await this.page.locator('nova-ui-select-dropdown').getByRole('textbox').fill('user03');
        await this.page.locator('#preparer').getByText('US AUDIT Test User03 (US -').click();

        await this.page.locator('#reviewer > .rounded-div > div:nth-child(2) > .form-group.col-sm-5 > nova-ui-select > div > .select2 > .selection > .select2-selection').click();
        await this.page.locator('nova-ui-select-dropdown').getByRole('textbox').click();
        await this.page.locator('nova-ui-select-dropdown').getByRole('textbox').fill('user03');
        await this.page.locator('#reviewer').getByText('US AUDIT Test User03 (US -').click();

        //Add actual hours for team lead, preparer and reviewer
        await this.page.locator('#team-lead .rounded-div .col-sm-1 .hand-cursor .dicon-add').first().click();
        for (let i = 2; i <= 6; i++) {
            const input = this.page.locator(`th:nth-child(${i}) > #actual-hours`);
            await input.fill(''); // Clear any existing value
            await input.fill('8'); // Enter new value
        }
        await this.page.locator("//button[normalize-space()='Ok']").click();

        //Preparer planned hours
        await this.page.locator('#preparer .rounded-div .col-sm-1 .hand-cursor .dicon-add').first().click();
        for (let i = 2; i <= 6; i++) {
            const input = this.page.locator(`th:nth-child(${i}) > #actual-hours`);
            await input.fill(''); // Clear any existing value
            await input.fill('8'); // Enter new value
        }
        await this.page.locator("//button[normalize-space()='Ok']").click();

        //reviewer planned hours
        await this.page.locator('#reviewer .rounded-div .col-sm-1 .hand-cursor .dicon-add').first().click();
        for (let i = 2; i <= 6; i++) {
            const input = this.page.locator(`th:nth-child(${i}) > #actual-hours`);
            await input.fill(''); // Clear any existing value
            await input.fill('8'); // Enter new value
        }
        await this.page.locator("//button[normalize-space()='Ok']").click();


        //Add actual hours for team lead, preparer and reviewer
        await this.page.locator("//nova-ui-person-hours[@id='team-lead']//div[@class='form-group col-sm-1 hand-cursor ng-star-inserted']//div[@class='dicon dicon-add text-primary']").click();
        for (let i = 2; i <= 6; i++) {
            const input = this.page.locator(`th:nth-child(${i}) > #actual-hours`);
            await input.fill(''); // Clear any existing value
            await input.fill('8'); // Enter new value
        }
        await this.page.locator("//button[normalize-space()='Ok']").click();
        await this.page.locator("//nova-ui-person-hours[@id='preparer']//div[@class='form-group col-sm-1 hand-cursor ng-star-inserted']//div[@class='dicon dicon-add text-primary']").click();
        for (let i = 2; i <= 6; i++) {
            const input = this.page.locator(`th:nth-child(${i}) > #actual-hours`);
            await input.fill(''); // Clear any existing value
            await input.fill('7'); // Enter new value
            await input.press('Tab');
            await this.page.locator(`th:nth-child(${i + 1}) > #actual-hours`).fill('7');
            await this.page.locator(`th:nth-child(${i + 1}) > #actual-hours`).press('Tab');
        }
        await this.page.locator("//button[normalize-space()='Ok']").click();
        await this.page.locator("//nova-ui-person-hours[@id='reviewer']//div[@class='form-group col-sm-1 hand-cursor ng-star-inserted']//div[@class='dicon dicon-add text-primary']").click();
        for (let i = 2; i <= 6; i++) {
            const input = this.page.locator(`th:nth-child(${i}) > #actual-hours`);
            await input.fill(''); // Clear any existing value
            await input.fill('6'); // Enter new value
            await input.press('Tab');
            await this.page.locator(`th:nth-child(${i + 1}) > #actual-hours`).fill('6');
        }
        await this.page.locator("//button[normalize-space()='Ok']").click();
        await this.page.locator("//a[normalize-space()='Save Changes']").click();
        await this.page.waitForTimeout(5000);

}
}