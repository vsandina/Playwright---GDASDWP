import { Page } from "playwright";



export default class Execution {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async AuditDeliveryCenterExecutionPlan(index: number = 0) {
        // Navigate to the Execution Plan page
        await this.page.locator("text=Audit Delivery Center Execution Plan").click();
        // Wait for the page to load
        await this.page.waitForTimeout(5000);
        await this.page.locator("(//button[@class='component-aoui-button primary'][normalize-space()='Create Plan'])[2]").click();
        await this.page.locator("(//span[@class='aoui-select-selection__rendered ng-star-inserted'])[1]").click();
        await this.page.locator("//div[normalize-space()='EMS']").click();
        await this.page.locator("(//span)[113]").click();
        await this.page.locator("//div[normalize-space()='United States']").click();
        await this.page.locator("//button[normalize-space()='Create']").click();
    }
    public async DefineEntities() {
        // Define entities for the execution plan
        await this.page.locator(".switchBackground").click();
        await this.page.locator("//button[normalize-space()='ADD ENTITY']").click();
        await this.page.locator("//input[@placeholder='Enter']").fill("New Entity");
        await this.page.locator("//button[contains(text(),'NEXT STEP →')]").click();
    }
       public async ClientDetails() {
        // Client Details for the execution plan
        await this.page.locator("//input[@name='client-name']").fill("New Client");
        await this.page.locator("//div[@class='second-col']//span[@class='aoui-select-selection__rendered']").click();
        await this.page.locator("//div[normalize-space()='Corporate']").click();
        await this.page.locator("//div[@class='first-col']//span[@class='aoui-select-selection__rendered']").click();
        await this.page.locator("//div[@class='aoui-select-results__option-label']").click();
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${mm}/${dd}/${yyyy}`;
        await this.page.locator("//input[@class='input-date-control datepicker-input ng-valid ng-touched ng-dirty']").fill(formattedDate);
        await this.page.locator("//input[@name='eng-hours']").fill("8");
        await this.page.locator("//label[@for='radio-isPcaobfalse']").click();
        await this.page.locator("//button[contains(text(),'NEXT STEP →')]").click();
    }
    public async ClientContactDetails() {
        // Client Contact Details for the execution plan
        await this.page.locator("//input[@id='partner-contact']").fill("vsandina");
        await this.page.locator("//div[@class='row mt-4 ng-star-inserted']//div[@class='first-col']//div//div[1]").click();
        await this.page.locator("//input[@id='manager-contact']").fill("jdoe");
        await this.page.locator("//span[@id='ngb-typeahead-3-0']//div[1]").click();
        await this.page.locator("//button[contains(text(),'NEXT STEP →')]").click();
    }

}