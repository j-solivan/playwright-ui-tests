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

    async setHomeFilter(filterName: string): Promise<number> {
        const sectionFilter = this.page.getByRole('link', { name: filterName, exact: true });
        await sectionFilter.click();
        await this.verifyFilterEnabled(sectionFilter);
        return await this.getSearchResultsCount();
    }

    async selectFilter(filterLocator: Locator): Promise<void> {
        await this.page.waitForLoadState('load');
        await filterLocator.click();
        await this.page.waitForLoadState('load');
    }

    async setMonthlyPaymentFilter(minPayment: string, maxPayment: string): Promise<number> {
        await this.selectFilter(this.page.locator('button').filter({ hasText: '$500' }));
        await this.selectFilter(this.page.getByRole('link', { name: `$${minPayment} /m` }));
        await this.selectFilter(this.page.locator('button').filter({ hasText: '$2700' }));
        await this.selectFilter(this.page.getByRole('link', { name: `$${maxPayment} /m` }));
        return await this.getSearchResultsCount();
    }

    async setSquareFootFilter(minSqft: string, maxSqft: string): Promise<number> {
        await this.selectFilter(this.page.locator('button').filter({ hasText: '400 /ft2' }));
        await this.selectFilter(this.page.getByRole('link', { name: `${minSqft} /ft2`, exact: true }));
        await this.selectFilter(this.page.locator('button').filter({ hasText: '2500 /ft2' }));
        await this.selectFilter(this.page.getByRole('link', { name: `${maxSqft} /ft2`, exact: true }));
        return await this.getSearchResultsCount();
    }

    async setDimensionsFilter(maxWidth: string, maxLength: string): Promise<number> {
        await this.selectFilter(this.page.locator('button').filter({ hasText: '32 ft' }));
        await this.selectFilter(this.page.getByRole('link', { name: `${maxWidth} ft`, exact: true }));
        await this.selectFilter(this.page.locator('button').filter({ hasText: '80 ft' }));
        await this.selectFilter(this.page.getByRole('link', { name: `${maxLength} ft`, exact: true }));
        return await this.getSearchResultsCount();
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
        await this.page.waitForLoadState('load');
        await expect(async () => {
            await this.page.waitForSelector('text=No items match your filters');
            await expect(this.noResultsMessage).toBeVisible();
            await expect(this.searchResults).toHaveCount(0);
        }).toPass({ timeout: 8000 });
    }

    async waitForUpdatedResults(initialResults: number){
        await expect(async () => {
            await this.page.getByText(new RegExp(`^${initialResults} Home(s)?$`)).waitFor({ state: 'detached' });
            ({ timeout: 10000 });
        }).toPass({ timeout: 15000 });
    }
}
