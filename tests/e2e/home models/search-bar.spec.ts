import { test, expect } from '@fixtures/fixtures';

test.describe('All Models Page Tests', () => {


  test.beforeEach(async ({ navPage }) => {
    await navPage.navigateToPage('/shop/all-models')
  });

  test('Search for home model containing text', async ({ allModelsPage }) => {
    const searchInput = 'austin';

    await test.step(`Search for model containing text: ${searchInput}`, async () => {
      await allModelsPage.searchModelByName(searchInput);
      const searchResults = await allModelsPage.getSearchResultsCount();
      expect(searchResults).toEqual(1);
      await expect(allModelsPage.searchResults).toContainText('RGN The Braustin');
      await expect(allModelsPage.searchResults).toContainText(searchInput);
    });
  });

  test('Invalid search returns no results', async ({ allModelsPage }) => {
    await test.step('Perform an invalid search', async () => {
      await allModelsPage.searchModelByName('NonexistentModelName');
      await allModelsPage.assertNoResults(); // Ensure no results are returned
    });
  });

  test('Clearing search bar returns all results', async ({ allModelsPage }) => {
    let unfilteredCount: number;

    await test.step('Get unfiltered results count', async () => {
      unfilteredCount = await allModelsPage.getSearchResultsCount();
    });

    await test.step('Perform a search', async () => {
      await allModelsPage.searchModelByName('Clayton Tempo');
      const filteredCount = await allModelsPage.getSearchResultsCount();
      expect(filteredCount).toEqual(10);
    });

    await test.step('Clear search bar and verify all results', async () => {
      await allModelsPage.clearSearchBar();
      const allResults = await allModelsPage.getSearchResultsCount();
      expect(allResults).toEqual(unfilteredCount);
    });
  });
});