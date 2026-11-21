import { test } from '@playwright/test';
import {
  goToNextPageIfAvailable,
  launchApplication,
  searchTable,
  sortTextColumn,
  verifyEmployeeDetails,
  verifyHeaders,
  verifyNegativeSearch,
  verifyOfficeCells,
} from '../helper/datatableHelper';

const expectedHeader = ['Name', 'Position', 'Office', 'Extn.', 'Start date', 'Salary'];
test.beforeEach(async ({ page }) => {
  await test.step('Launch the application', async () => {
    await launchApplication(page);
  });
});

test('Verify the order of the header', async ({ page }) => {
  await test.step('Verify the header', async () => {
    await verifyHeaders(page, expectedHeader);
  });
});

test('Finds the employee and verifies the details', async ({ page }) => {
  await test.step('Search for the employee', async () => {
    await searchTable(page, 'Tiger Nixon');
    await page.screenshot({ path: 'search_result.png', fullPage: true });
  });
  await test.step('Verify the employee details', async () => {
    await verifyEmployeeDetails(page);
  });
});
test('Search Reasult Validate by London', async ({ page }) => {
  const container = page.locator('#myTable_wrapper');

  await test.step('Search for the London', async () => {
    await container.getByRole('searchbox', { name: 'Search:' }).fill('London');
    await page.screenshot({ path: 'search_result_london.png', fullPage: true });
  });
  await test.step('Verify the first page contains only London employees', async () => {
    await verifyOfficeCells(page, 'London');
  });

  await test.step('Go to the next page and verify it contains only London employees', async () => {
    if (await goToNextPageIfAvailable(page)) {
      await page.screenshot({ path: 'search_result_london_page2.png', fullPage: true });
      await test.step('Verify the second page contains only London employees', async () => {
        await verifyOfficeCells(page, 'London');
      });
    }
  });
});
test('Negative Search', async ({ page }) => {
  await test.step('Search for a non-existent employee', async () => {
    await page.getByRole('searchbox', { name: 'Search:' }).fill('QA_NO_MATCH_98765');
    await page.screenshot({ path: 'search_result_negative.png', fullPage: true });
    await verifyNegativeSearch(page);
  });
});
test('sort text',async ({ page }) => {
  await test.step('Sort the table by Name column', async () => {
    await test.step('Click the sort button to sort in ascending order', async () => {
      await sortTextColumn(page);
    });
  });
});