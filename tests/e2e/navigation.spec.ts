import { test } from '@playwright/test';
import { NavigationPage } from '@pages/NavigationPage';
import navigationData from '@data/navigation-data.json';

type NavigationData = {
  [key: string]: 
    | { sublinks: { [href: string]: string } } // Menus with sublinks
    | { [href: string]: string };             // Direct links without sublinks
};

const data: NavigationData = navigationData;

test.describe('Navigation and heading validation', () => {
  test('Validate navigation on all main links and expected content', async ({ page }) => {
    const navPage = new NavigationPage(page);

    navPage.navigateToPage('/')

    // Validate all menu items
    for (const [menuName, menuData] of Object.entries(data)) {
      if ('sublinks' in menuData) {
        console.log(`Validating menu: ${menuName}`);

        await navPage.hoverOverNavButton(menuName);

        const sublinks = Object.keys(menuData.sublinks);
        await navPage.validateSublinksVisible(sublinks);

        // Navigate and validate content for each sublink
        for (const [href, expectedHeading] of Object.entries(menuData.sublinks)) {
          await navPage.navigateAndValidateContent(href, expectedHeading);
        }
      } else {
        console.log('Validating direct links');
        for (const [href, expectedHeading] of Object.entries(menuData)) {
          await navPage.navigateAndValidateContent(href, expectedHeading);
        }
      }
    }
  });
});
