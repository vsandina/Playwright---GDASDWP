import { Page } from "playwright";

export default class ServerSelection {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    public async selectAndHandleServer(index: number = 0) {
        // Close OneTrust popup if present
        const closeBtn = this.page.locator('#onetrust-close-btn-container > button');
        if (await closeBtn.isVisible()) {
         await closeBtn.click();
    }
        // Decide server based on which DWP is launched (match by hostname)
        const currentUrl = this.page.url();
        const host = (() => {
            try { return new URL(currentUrl).host.toLowerCase(); } catch { return currentUrl.toLowerCase(); }
        })();

        // Defaults (QDWP)
        let searchTerm = 'SEMS65';
        let optionText = 'SEMS65';

        if (host.includes('qadcportal.aaps.deloitte.com')) {
            // QDWP => SEMS65
            searchTerm = 'SEMS65';
            optionText = 'SEMS65';
        } else if (host.includes('uadcportal.aaps.deloitte.com')) {
            // UDWP => SEMS8
            searchTerm = 'SEMS8';
            optionText = 'SEMS8';
        } else if (host.includes('uatadcportal.aaps.deloitte.com')) {
            // UATDWP => SEMS103
            searchTerm = 'SEMS103';
            optionText = 'SEMS103';
        } else if (host.includes('sadcportal.aaps.deloitte.com')) {
            // STGDWP => SEMS9 Tech Deployment
            searchTerm = 'SEMS9';
            optionText = 'SEMS9 Tech Deployment';
        } else if (host.includes('adc.aaps.deloitte.com')) {
            // PROD => GP4
            searchTerm = 'GP4';
            optionText = 'GP4';
        }

        // Enter the server code determined by environment
        await this.page.locator("#searchRequest").pressSequentially(searchTerm);
        // Try to click the matching option from the dropdown
        const option = this.page.locator(`text=${optionText}`).first();
        try {
            await option.waitFor({ state: 'visible', timeout: 5000 });
            await option.click();
        } catch {
            // Fallback: press Enter to select first suggestion if specific text not found
            await this.page.locator('#searchRequest').press('Enter');
        }
    }
}