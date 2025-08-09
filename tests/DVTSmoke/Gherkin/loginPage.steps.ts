import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';

let browser: Browser;
let page: Page;

setDefaultTimeout(60 * 1000);

Before(async function () {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
  this.page = page;
});

After(async function () {
  if (browser) {
    await browser.close();
  }
});

Given('A Navigate to {string}', async function (url: string) {
  await this.page.goto(url);
});

When('A Enter email ID in the email textbox', async function () {
  await this.page.fill('input[type="email"]', 'your_email_here'); // Replace with your email
});

Then('A click on next button', async function () {
  await this.page.click('input[type="submit"], button:has-text("Next")');
});

When('A enter password in the password textbox', async function () {
  await this.page.fill('input[type="password"]', 'your_password_here'); // Replace with your password
});

Then('A click on signin button', async function () {
  await this.page.click('input[type="submit"], button:has-text("Sign in")');
});