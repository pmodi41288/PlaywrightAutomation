import { expect, type Page } from '@playwright/test';

export async function launchApplication(page: Page): Promise<void> {
  await page.goto('https://datatables.net/');
  await expect(page.locator('#myTable')).toBeVisible();
}

export async function verifyHeaders(
  page: Page,
  expectedHeader: string[]
): Promise<void> {
  const header = page.locator('#myTable thead th .dt-column-title').filter({ hasText: /\S/ });
  await expect(header).toHaveText(expectedHeader);
}

export async function searchTable(page: Page, searchText: string): Promise<void> {
  await page.getByRole('searchbox', { name: 'Search:' }).fill(searchText);
}

export async function verifyEmployeeDetails(page: Page): Promise<void> {
  const table = page.locator('#myTable');
  const row = table.locator('tbody tr').filter({ hasText: 'Tiger Nixon' });

  await expect(row.locator('td').nth(3)).toHaveText('Tiger Nixon');
  await expect(row.locator('td').nth(4)).toHaveText('System Architect');
  await expect(row.locator('td').nth(5)).toHaveText('Edinburgh');
  await expect(row.locator('td').nth(8)).toHaveText('$320,800');
}

export async function verifyOfficeCells(page: Page, office: string): Promise<void> {
  const officeCells = page.locator(
    '#myTable tbody tr td:nth-child(6) .dt-pill'
  );
  const count = await officeCells.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(officeCells.nth(i)).toHaveText(office);
  }
}

export async function goToNextPageIfAvailable(page: Page): Promise<boolean> {
  const nextPage = page.getByRole('link', { name: 'next', exact: true });

  if (await nextPage.isVisible()) {
    await nextPage.click();
    return true;
  }

  return false;
}

export async function verifyNegativeSearch(page: Page): Promise<void> {
  const table = page.locator('#myTable');

  await expect(table.getByText('No matching records found')).toBeVisible();
  await expect(table.locator(
    '#myTable tbody tr:not(:has(td.dt-empty))'
  )).toHaveCount(0);
}

export async function sortTextColumn(page: Page): Promise<void> {
  const table = page.locator('#myTable');
  const nameHeader = table.locator('thead th').nth(3);

  for (let i = 0; i < 3; i++) {
    await nameHeader.click();
    if (await nameHeader.getAttribute('aria-sort') === 'ascending') {
      return;
    }
  }

  const ariaSort = await nameHeader.getAttribute('aria-sort');
  if (ariaSort === 'descending') {
    await nameHeader.click();
  }
  await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
}
