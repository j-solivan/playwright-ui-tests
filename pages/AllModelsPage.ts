import { Page, Locator, expect } from '@playwright/test';

export class AllModelsPage {
    readonly page: Page;
    readonly searchBar: Locator;
    readonly resetFiltersButton: Locator;
    readonly noResultsMessage: Locator;
    readonly searchResults: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchBar = page.getByRole('searchbox');
        this.resetFiltersButton = page.getByRole('link', { name: 'Reset Filters' });
        this.noResultsMessage = page.locator('text=No items match your filters');
        this.searchResults = page.locator('[id^="homecard-"]');
    }

    async searchModelByName(name: string): Promise<void> {
        await this.searchBar.fill(name);
        await expect(this.searchBar).toHaveValue(name);
    }

    async clearSearchBar(): Promise<void> {
        await this.searchBar.fill('');
    }

    async resetFilters(): Promise<void> {
        await this.resetFiltersButton.click();
        await this.page.waitForLoadState('load');
        
        const anyLinks = this.page.getByRole('link', { name: 'Any' });
        const count = await anyLinks.count();
        for (let i = 0; i < count; i++) {
            await expect(anyLinks.nth(i)).toHaveCSS('border-color', 'rgb(0, 149, 250)');
        }
    }

    async getSearchResultsCount(): Promise<number> {
        await this.page.waitForLoadState('load');
        return await this.searchResults.count();
    }

    async setHomeFilter(filterName: string) {
        const sectionFilter = this.page.getByRole('link', { name: filterName, exact: true });
        await sectionFilter.click();
        await this.verifyFilterEnabled(sectionFilter);
    }

    async selectFilter(filterLocator: Locator): Promise<void> {
        await this.page.waitForLoadState('load')
        await expect(async () => {
            await filterLocator.click();
        }).toPass({ timeout: 15000 });
    }

    async setMonthlyPaymentFilter(minPayment: string, maxPayment: string): Promise<void> {
        const minPaymentLocator = this.page.locator(`//span[contains(text(), '$${minPayment} /m')]`).nth(0);
        const maxPaymentLocator = this.page.locator(`//span[contains(text(), '$${maxPayment} /m')]`).nth(1);
        const lowButtonLocator = this.page.locator('button').filter({ hasText: '$500' }).first();
        const highButtonLocator = this.page.locator('button').filter({ hasText: '$2700' }).first();
    
        await this.selectFilter(lowButtonLocator);
        await this.selectFilter(minPaymentLocator);
        await this.selectFilter(highButtonLocator);
        await this.selectFilter(maxPaymentLocator);
    }
    
    async setSquareFootFilter(minSqft: string, maxSqft: string): Promise<void> {
        const lowButtonLocator = this.page.locator('button').filter({ hasText: '400 /ft2' });
        const minSqftLocator = this.page.locator(`//span[contains(text(), '${minSqft} /ft2')]`).nth(0);
        const highButtonLocator = this.page.locator('button').filter({ hasText: '2500 /ft2' });
        const maxSqftLocator = this.page.locator(`//span[contains(text(), '${maxSqft} /ft2')]`).nth(1);
    
        await this.selectFilter(lowButtonLocator);
        await this.selectFilter(minSqftLocator);
        await this.selectFilter(highButtonLocator);
        await this.selectFilter(maxSqftLocator);
    }
    
    async setDimensionsFilter(maxWidth: string, maxLength: string): Promise<void> {
        const widthButtonLocator = this.page.locator('button').filter({ hasText: '32 ft' });
        const maxWidthLocator = this.page.locator(`//span[contains(text(), '${maxWidth} ft')]`).first();
        const lengthButtonLocator = this.page.locator('button').filter({ hasText: '80 ft' });
        const maxLengthLocator = this.page.locator(`//span[contains(text(), '${maxLength} ft')]`).first();
    
        await this.selectFilter(widthButtonLocator);
        await this.selectFilter(maxWidthLocator);
        await this.selectFilter(lengthButtonLocator);
        await this.selectFilter(maxLengthLocator);
    }
    
    async selectBedrooms(bedrooms: string): Promise<number> {
        const bedroomFilter = this.page.locator(
            `//span[normalize-space()='Bedrooms']/following-sibling::div//a[contains(@href, 'bedroomCount=${bedrooms}')]`
        );

        await this.page.waitForLoadState('domcontentloaded');

        await expect(async () => {
            await bedroomFilter.click();
            await this.verifyFilterEnabled(bedroomFilter);
        }).toPass({ timeout: 10000 });

        return await this.getSearchResultsCount();
    }

    async selectBathrooms(bathrooms: string): Promise<number> {
        const bathroomFilter = this.page.locator(
            `//span[normalize-space()='Baths']/following-sibling::div//a[contains(@href, 'bathroomCount=${bathrooms}')]`
        );

        await this.page.waitForLoadState('domcontentloaded');

        await expect(async () => {
            await bathroomFilter.click();
            await this.verifyFilterEnabled(bathroomFilter);
        }).toPass({ timeout: 10000 });

        return await this.getSearchResultsCount();
    }

    private async verifyFilterEnabled(filter: Locator) {
        await expect(async () => {
            await expect(filter).toHaveCSS('border-color', 'rgb(0, 149, 250)');
        }).toPass({
            timeout: 20000,
        });
    }

    async assertNoResults(): Promise<void> {
        await expect(async () => {
            await this.page.waitForSelector('text=No items match your filters');
            await expect(this.noResultsMessage).toBeVisible();
            await expect(this.searchResults).toHaveCount(0);
        }).toPass({ timeout: 8000 });
    }

    async waitForUpdatedResults(initialResults: number): Promise<void> {
        await expect(async () => {
            const updatedResults = await this.getSearchResultsCount();
            if (updatedResults === initialResults) {
                throw new Error('Results count did not update');
            }
        }).toPass({ timeout: 15000 });
    }
}
