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

Run a Specific Test:


npx playwright test tests/<test-file-name>.spec.ts

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

