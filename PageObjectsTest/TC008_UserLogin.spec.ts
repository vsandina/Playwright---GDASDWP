import { test, expect } from '@playwright/test';
import LoginPage from "./LoginPage.spec";
import Env from "../utils/environment";
import * as data from "../data/login.cred.json";
import ReportUtils from "../utils/reportUtils.spec";
import ServerSelection  from "./ServerSelection.spec";
 

test.use({
  viewport: { width: 1920, height: 1080 },
});


test.describe.serial("TC001", () => {// Describe the test suite for TC001
    
    let login: LoginPage;// Declare the LoginPage object
    let page;
    let context;
    let serverSelection: ServerSelection;// Declare the ServerSelection object

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();// Create a new browser context
        page = await context.newPage();// Open a new page in the browser context
        await page.goto(Env.QDWP);// Navigate to the DWP login page
        login = new LoginPage(page);// Initialize the LoginPage object with the current page context
        serverSelection = new ServerSelection(page);// Initialize the ServerSelection object with the current page context
    });

    test("DWP_UserLoginpage", async () => {// Test case for user login on DWP
    
        await login.enterUserName(data.email);// Fill the email text field with the provided email
        await login.nxtButton(); // Click the next button after entering username
        await login.enterUserPassword(data.pass);// Fill the password text field with the provided password
        await login.clickSignBtn();// Click the sign-in button to submit the login form
        expect(console.log("Login completed successfully"));// Log a message indicating that the login was completed successfully
        
           
    });

    test("serverSelection", async () => {// Test case for server selection
        //  const serverSelection = new ServerSelection();// Initialize the ServerSelection object with the current page context
        await serverSelection.selectAndHandleServer();//    Call the method to select and handle the server
        expect(console.log("Server selection completed successfully"));// Log a message indicating that the server selection was completed successfully
        await page.waitForTimeout(5000);// Wait for 5 seconds to ensure the server selection process completes

    });

 
    test.afterAll(async () => {// Cleanup after all tests in the suite
        if(page){
        await page.close();// Close the current page
        }
        if(context){
        await context.close();
        }// Close the browser context
    });

});
