Feature: Playwright demo test

  @demo
  Scenario: Verify the LoginPage
    Given A Navigate to "https://qadcportal.aaps.deloitte.com/"
    When A Enter email ID in the email textbox
    Then A click on next button
    When A enter password in the password textbox
    Then A click on signin button