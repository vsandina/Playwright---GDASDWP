import { Page, expect } from '@playwright/test';

export default class DeliveryCenterPopup {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async handlePopup() {
        // Helper to select all in a dropdown and close it, with robust waits
        const selectAllAndClose = async (dropdownSelector: string, selectAllSelector: string, closeSelector: string) => {
            const dropdown = this.page.locator(dropdownSelector);
            await dropdown.click();
            const selectAll = this.page.locator(selectAllSelector).first();
            await selectAll.click();
            const closeBtn = this.page.locator(closeSelector);
            await closeBtn.click();
        };

        
        await this.page.click('text=Delivery Center Portal');
        await this.page.click('text=Princeton Development Delivery Center');
        
        await selectAllAndClose(
            "#mfDropdownForPreFilter",
            "//a[normalize-space()='Select All']",
            "#closeMfDropdown"
        );

        await selectAllAndClose(
            "#requestTypeDropdownForPreFilter",
            "//a[normalize-space()='Select All']",
            "#closeMfRequestTypeDropdown"
        );

        await selectAllAndClose(
            "#teamTypeDropdownForPreFilter",
            "//a[normalize-space()='Select All']",
            "#closeMfDeliveryTeamTypeDropdown"
        );

        await selectAllAndClose(
            "#teamDropdownForPreFilter",
            "//a[normalize-space()='Select All']",
            "#closemfTeamDropdown"
        );
        await this.page.locator("//button[normalize-space()='Save']").click();
    
    }
}
