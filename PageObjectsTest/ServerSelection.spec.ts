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

        // Enter the server code
        await this.page.locator("#searchRequest").pressSequentially("SEMS65");
        // Wait for dropdown to appear (optional, adjust selector as needed)
        await this.page.locator("text= SEMS65nonproduction").click();
    }
}