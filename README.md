# playwright-ui-tests

This project is designed to test navigation, content verification, and dynamic UI functionality using Playwright.

Requirements:
Install node.js

Setup Instructions
Clone the Repository:

git clone <repository-url>
cd <repository-folder>
Install Dependencies:

npm install
Install Playwright Browsers:

npx playwright install
Running Tests

Run All Tests:  npx playwright test

Run a Specific Test: Mark the test as test.only


Run a Specific test Spec:  npx playwright test tests/<test-file-name>.spec.ts

Run in Headed Mode:  npx playwright test --headed

Generate and View Report:   npx playwright show-report

Debugging
Use the following command to debug tests:
npx playwright test --debug

To step through the test, add:
await page.pause();

Project Structure
tests/: Contains test files.
data/: Test data 
pages/: Page objects, reusable methods and common page actions
fixtures/: This module extends Playwright's base test to include custom page objects for improved modularity and reusability.

There is a workflow configure with GitHub Actions to run the test on merge to master

Additionally, a run may be triggered via the UI

The reports (test results) will be placed in the artifacts section of the run-playwright-test action

