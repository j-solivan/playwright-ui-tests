import { Page, Locator, expect } from '@playwright/test';

export class NavigationPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToPage(path: string) {
        await this.page.goto(path);
        await this.page.waitForLoadState();
    }

    async hoverOverNavButton(buttonName: string) {
        await this.page.getByRole('button', { name: buttonName, exact: true }).first().hover();

        const locator: Locator = this.page.locator('#header').getByLabel('Link to home page');
        await locator.waitFor();

        await expect(locator).toBeVisible();
        await this.page.waitForLoadState('load');
    }

    // Validate that sublinks are visible
    async validateSublinksVisible(expectedLinks: string[]) {
        
        for (const link of expectedLinks) {
            const locator: Locator = this.page.locator(`a[href="${link}"]:visible`).first();
            await expect(locator).toBeVisible();
        }
    }

    async navigateAndValidateContent(link: string, expectedHeading: string): Promise<void> {
        const linkLocator: Locator = this.page.locator(`li[role="menuitem"] a[href="${link}"]:visible`);

        await expect(async () => {
            await linkLocator.click();

            await this.page.waitForLoadState('load');

            // Build a locator for h1 or h2 with the expected text and wait for it to be visible
            const headingLocator: Locator = this.page.locator(`h1:has-text("${expectedHeading}"), h2:has-text("${expectedHeading}")`).first();


            await expect(headingLocator).toBeVisible();
        }).toPass({
            timeout: 10000,
        });
    }
}  