import { Page } from '@playwright/test';

export default class Global {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

   async GlobalDeliveryCenter(emsFilename: string) {
            await this.page.locator("text=Delivery Center Portal").click();
            await this.page.locator("text=Global Delivery Center").click();
            await this.page.waitForTimeout(5000);// Wait for 5 seconds to ensure the server selection process completes
            await this.page.locator("//button[@type='button'][normalize-space()='Cancel']").click();

            await this.page.locator('#nav-list-item-admin-settings').click();
            await this.page.click('#submenu-item-global-requests');
            await this.page.click('#submenu-item-manage-request-types');
            
            console.log("Request Types are loading successfully");
         
    }
}
 