import { test, expect, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';

let context: BrowserContext;
let extensionId: string;

test.beforeAll(async () => {
  const pathToExtension = path.join(process.cwd(), 'dist');

  context = await chromium.launchPersistentContext('', {
    headless: false, // Extensions require non-headless mode
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });

  // Get extension ID
  let [background] = context.serviceWorkers();
  if (!background) {
    background = await context.waitForEvent('serviceworker');
  }

  extensionId = background.url().split('/')[2];
  console.log('Extension ID:', extensionId);
});

test.afterAll(async () => {
  await context.close();
});

test.describe('Extension Installation', () => {
  test('should load extension successfully', async () => {
    expect(extensionId).toBeTruthy();
    expect(extensionId).toMatch(/^[a-z]{32}$/);
  });

  test('should have correct manifest', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/manifest.json`);

    const content = await page.textContent('body');
    const manifest = JSON.parse(content || '{}');

    expect(manifest.name).toBe('Bookmark Organizer & Semantic Search');
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.permissions).toContain('bookmarks');
    expect(manifest.permissions).toContain('storage');

    await page.close();
  });
});

test.describe('Popup UI', () => {
  test('should open popup', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);

    await expect(page.locator('h1')).toContainText('Bookmark Organizer');

    await page.close();
  });

  test('should display search box', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);

    const searchInput = page.locator('input[placeholder="Search bookmarks..."]');
    await expect(searchInput).toBeVisible();

    await page.close();
  });

  test('should have three tabs', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);

    await expect(page.locator('.tab')).toHaveCount(3);
    await expect(page.locator('.tab').first()).toContainText('All Bookmarks');
    await expect(page.locator('.tab').nth(1)).toContainText('Uncategorized');
    await expect(page.locator('.tab').nth(2)).toContainText('Statistics');

    await page.close();
  });

  test('should switch between tabs', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);

    // Click Statistics tab
    await page.locator('.tab').nth(2).click();
    await expect(page.locator('.tab').nth(2)).toHaveClass(/active/);

    // Should show stats
    await expect(page.locator('.stat-card')).toHaveCount(3);

    await page.close();
  });
});

test.describe('Options Page', () => {
  test('should open options page', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    await expect(page.locator('h1')).toContainText('Settings');

    await page.close();
  });

  test('should display settings sections', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    await expect(page.locator('.section-title').first()).toContainText('AI Description Generation');

    await page.close();
  });

  test('should have API provider dropdown', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    const dropdown = page.locator('#apiProvider');
    await expect(dropdown).toBeVisible();

    // Check options
    const options = await dropdown.locator('option').allTextContents();
    expect(options).toContain('None (Manual descriptions only)');
    expect(options).toContain('OpenAI (GPT-3.5/GPT-4)');
    expect(options).toContain('Anthropic (Claude)');

    await page.close();
  });

  test('should toggle API key visibility', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    const apiKeyInput = page.locator('#apiKey');
    const toggleButton = page.locator('.toggle-visibility');

    // Should be password by default
    await expect(apiKeyInput).toHaveAttribute('type', 'password');

    // Click to show
    await toggleButton.click();
    await expect(apiKeyInput).toHaveAttribute('type', 'text');

    // Click to hide
    await toggleButton.click();
    await expect(apiKeyInput).toHaveAttribute('type', 'password');

    await page.close();
  });

  test('should save settings', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    // Change API provider
    await page.selectOption('#apiProvider', 'openai');

    // Enter API key
    await page.fill('#apiKey', 'test-api-key-123');

    // Save
    await page.click('button:has-text("Save Settings")');

    // Should show success message
    await expect(page.locator('.alert-success')).toBeVisible();

    await page.close();
  });
});

test.describe('Search Functionality', () => {
  test('should handle search input', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);

    const searchInput = page.locator('input[placeholder="Search bookmarks..."]');

    // Type in search
    await searchInput.fill('test');

    // Wait a bit for debounce
    await page.waitForTimeout(400);

    // Should trigger search (even if no results)
    await expect(searchInput).toHaveValue('test');

    await page.close();
  });

  test('should clear search when switching tabs', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);

    const searchInput = page.locator('input[placeholder="Search bookmarks..."]');

    // Enter search
    await searchInput.fill('test query');

    // Switch tab
    await page.locator('.tab').nth(1).click();

    // Search should be cleared
    await expect(searchInput).toHaveValue('');

    await page.close();
  });
});
