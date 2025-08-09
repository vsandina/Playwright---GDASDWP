Feature: QADC Portal Login and SEMS65 Selection

  Scenario: Login and select SEMS65 member firm
    Given I open the QADC portal
    When I enter email "USAUDITTestUser03@deloitte.com"
    And I click the Next button
    And I enter password "c0#GV>zC6A%)jwUq^d%y"
    And I click the Signin button
    And I close any popups that may appear
    And I click on the globe icon
    And I select the 'SEMS65' member firm from the list
    Then I should see that SEMS65 is selected or the popup is closed
    And if the globe icon is not found, an error message is displayed 