import { test as base } from '@playwright/test';
import { NavigationPage } from '@pages/NavigationPage';
import { AllModelsPage } from '@pages/AllModelsPage';

// Extend the base test to include custom page objects
type TestFixtures = {
  navPage: NavigationPage;
  allModelsPage: AllModelsPage;
};

export const test = base.extend<TestFixtures>({
  // Define fixtures for the page objects
  navPage: async ({ page }, use) => {
    const navPage = new NavigationPage(page);
    await use(navPage);
  },
  allModelsPage: async ({ page }, use) => {
    const allModelsPage = new AllModelsPage(page);
    await use(allModelsPage);
  },
});

export const expect = test.expect;
