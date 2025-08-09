---
mode: agent
---
Step 1: Immediate Analysis & Test Creation
1. Open [AADC](https://qadcportal.aaps.deloitte.com/) in your browser 
2. click on another account and Login with email `USAUDITTestUser03@deloitte.com` and password `c0#GV>zC6A%)jwUq^d%y`
2. logout if you are already logged in 
3. Quickly scan for 5-7 critical test scenarios (prioritize visible elements)
4. Create both positive and negative cases for each significant feature
5. Make sure you logout of the application before proceeding if logout is present
6. Before starting every test execution, ensure you are logged out of the application

*Focus Areas:*
Visible UI elements
Core functionality
User workflows
Form validations
Navigation

Step 2: Instant Execution & Validation
1. Before creating actual spec file, execute identified scenarios using Playwright MCP
2. Verify all tests pass in the first run
3. For any failures:
Fix assertions or selectors
Rerun until all tests pass
Repeat the fix-and-rerun process until a 100% pass rate is achieved.
Before starting every test execution, ensure you are logged out of the application


*Validation Criteria:*
100% pass rate
Accurate selectors
Proper assertions

Step 3: Rapid Test Implementation
1. Generate a single `testMCP.spec.ts` file in tests folder with all tests
2. Keep tests simple and direct
3. Focus on Chromium only
4. Include essential assertions for each test