import { test, expect } from '@fixtures/fixtures';
import validCombinations from '@data/valid-filters.json';
import invalidCombinations from '@data/invalid-filters.json';

  test.describe.serial('Home Filters Tests', () => {
    test.beforeEach(async ({ navPage }) => {
      await navPage.navigateToPage('/shop/all-models');
    });
  
    test.afterEach(async ({ allModelsPage }) => {
      await allModelsPage.resetFilters();
    });
  
    test('Filter by sections & reset filters', async ({ page, allModelsPage }) => {
      const initialResults = await allModelsPage.getSearchResultsCount();
      const initialHomesText = page.getByText(new RegExp(`^${initialResults} Home(s)?$`));
  
      await expect(initialHomesText).toBeVisible();
  
      const expectedFilteredCount = await allModelsPage.setHomeFilter('Single');
      await expect(initialHomesText).not.toBeVisible();
      await allModelsPage.waitForUpdatedResults(initialResults);
  
      await expect(allModelsPage.searchResults).toHaveCount(expectedFilteredCount);
      await expect(allModelsPage.searchResults).not.toHaveCount(initialResults);
  
      await page.waitForURL(/sectionCount=1/);
  
      await allModelsPage.resetFilters();
      await expect(page.getByText(new RegExp(`^${initialResults} Home(s)?$`))).toBeVisible();
  
      await allModelsPage.setHomeFilter('Multi');
      await allModelsPage.waitForUpdatedResults(initialResults);
      const filteredResultsMulti = await allModelsPage.getSearchResultsCount();
      expect(filteredResultsMulti).toBeLessThanOrEqual(initialResults);
      await page.waitForURL(/sectionCount=2/);
    });
  
    test('Filter by Manufacturer', async ({ page, allModelsPage }) => {
      const initialResults = await allModelsPage.getSearchResultsCount();
      const initialHomesText = page.getByText(new RegExp(`^${initialResults} Home(s)?$`));
  
      await expect(initialHomesText).toBeVisible();
  
      const expectedFilteredCount = await allModelsPage.setHomeFilter('Oak Creek');
      await expect(initialHomesText).not.toBeVisible();
      await allModelsPage.waitForUpdatedResults(initialResults);
  
      await expect(allModelsPage.searchResults).toHaveCount(expectedFilteredCount);
      await expect(allModelsPage.searchResults).not.toHaveCount(initialResults);
  
      await page.waitForURL(/manufacturer=oak-creek/);
    });
  
    test('Filter by square footage', async ({ page, allModelsPage }) => {
      const initialResults = await allModelsPage.getSearchResultsCount();
      const initialHomesText = page.getByText(new RegExp(`^${initialResults} Home(s)?$`));
  
      await expect(initialHomesText).toBeVisible();
  
      await allModelsPage.setSquareFootFilter('900', '1500');
      await expect(initialHomesText).not.toBeVisible();
      await allModelsPage.waitForUpdatedResults(initialResults);
  
      await expect(allModelsPage.searchResults).not.toHaveCount(initialResults);
    });
  
    test('Filter by Dimensions', async ({ page, allModelsPage }) => {
      const initialResults = await allModelsPage.getSearchResultsCount();
      const initialHomesText = page.getByText(new RegExp(`^${initialResults} Home(s)?$`));
  
      await expect(initialHomesText).toBeVisible();
  
      await allModelsPage.setDimensionsFilter('18', '70');
      await expect(initialHomesText).not.toBeVisible();
      await allModelsPage.waitForUpdatedResults(initialResults);
  
      await expect(allModelsPage.searchResults).not.toHaveCount(initialResults);
    });
  
    test('Out of range filtering returns no results', async ({ page, allModelsPage }) => {
        await allModelsPage.searchModelByName('Clayton');
        await expect(allModelsPage.searchResults).toHaveCount(50)
        await expect(allModelsPage.searchResults.first()).toContainText('Clayton');
        const initialResults = await allModelsPage.getSearchResultsCount();
        const initialHomesText = page.getByText(new RegExp(`^${initialResults} Home(s)?$`));
        await expect(initialHomesText).toBeVisible();
  
        const expectedFilteredCount = await allModelsPage.setMonthlyPaymentFilter('1800', '2500');
        
        await page.waitForLoadState('load');

        await expect(initialHomesText).not.toBeVisible();
        await allModelsPage.waitForUpdatedResults(initialResults);
        
        
        await allModelsPage.assertNoResults();
    });
  });
  
  test.describe.serial('Valid Bed and Bath Combinations', () => {
    test.beforeEach(async ({ navPage }) => {
      await navPage.navigateToPage('/shop/all-models');
    });
  
    test.afterEach(async ({ allModelsPage }) => {
      await allModelsPage.resetFilters();
    });
  
    for (const { bedroom, bathroom } of validCombinations) {
      test(`Filter by ${bedroom.value} bedroom(s) and ${bathroom.value} bathroom(s)`, async ({ page, allModelsPage }) => {
        const initialResults = await allModelsPage.getSearchResultsCount();
        const initialHomesText = page.getByText(new RegExp(`^${initialResults} Home(s)?$`));
  
        await expect(initialHomesText).toBeVisible();
  
        await allModelsPage.selectBedrooms(bedroom.value);
        await allModelsPage.selectBathrooms(bathroom.value);
        await allModelsPage.waitForUpdatedResults(initialResults);
  
        const filteredResults = await allModelsPage.getSearchResultsCount();
        expect(filteredResults).toBeLessThanOrEqual(initialResults);
      });
    }
  });
  
  test.describe.serial('Invalid Bed and Bath Combinations', () => {
    test.beforeEach(async ({ navPage }) => {
      await navPage.navigateToPage('/shop/all-models');
    });
  
    test.afterEach(async ({ allModelsPage }) => {
      await allModelsPage.resetFilters();
    });
  
    for (const { bedroom, bathroom } of invalidCombinations) {
      test(`Invalid combination: ${bedroom.value} bedroom(s), ${bathroom.value} bathroom(s)`, async ({ page, allModelsPage }) => {
        const initialResults = await allModelsPage.getSearchResultsCount();
        const initialHomesText = page.getByText(new RegExp(`^${initialResults} Home(s)?$`));
  
        await expect(initialHomesText).toBeVisible();
  
        await allModelsPage.selectBedrooms(bedroom.value);
        await allModelsPage.selectBathrooms(bathroom.value);
        await allModelsPage.waitForUpdatedResults(initialResults);
  
        await allModelsPage.assertNoResults();
      });
    }
  });
