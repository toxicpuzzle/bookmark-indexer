# Testing Guide

This document covers how to run and write tests for the Bookmark Organizer extension.

## Overview

We use two testing frameworks:
- **Vitest**: Unit tests for utilities and business logic
- **Playwright**: End-to-end tests for the extension UI and flows

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### E2E Tests (Playwright)

**Important**: You must build the extension before running E2E tests!

```bash
# Build the extension first
npm run build

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI mode (interactive)
npm run test:e2e:ui
```

### Run All Tests

```bash
# Build and run all tests
npm run build && npm test && npm run test:e2e
```

## Test Structure

### Unit Tests

Unit tests are located alongside the files they test with a `.test.ts` or `.spec.ts` suffix:

```
src/
├── lib/
│   ├── semantic-search.ts
│   ├── semantic-search.test.ts  ← Unit tests
│   ├── utils.ts
│   └── utils.test.ts            ← Unit tests
```

### E2E Tests

E2E tests are in the `tests/e2e` directory:

```
tests/
└── e2e/
    └── extension.spec.ts
```

## Writing Unit Tests

### Example: Testing a Utility Function

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { truncate } from './utils';

describe('truncate', () => {
  it('should truncate long text', () => {
    const text = 'This is a very long text';
    const result = truncate(text, 10);
    expect(result).toBe('This is...');
  });

  it('should not truncate short text', () => {
    const text = 'Short';
    const result = truncate(text, 10);
    expect(result).toBe('Short');
  });
});
```

### Mocking Chrome APIs

Since we're testing extension code, we need to mock Chrome APIs:

```typescript
import { vi } from 'vitest';

// Mock chrome.storage
global.chrome = {
  storage: {
    local: {
      get: vi.fn().mockResolvedValue({}),
      set: vi.fn().mockResolvedValue(undefined),
    },
  },
} as any;
```

### Testing Async Functions

```typescript
it('should load bookmarks', async () => {
  const mockBookmarks = [{ id: '1', title: 'Test' }];

  global.chrome.runtime.sendMessage = vi.fn().mockResolvedValue(mockBookmarks);

  const result = await loadBookmarks();
  expect(result).toEqual(mockBookmarks);
});
```

## Writing E2E Tests

### Basic Extension Test

```typescript
import { test, expect } from '@playwright/test';

test('should open popup', async ({ page }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);

  await expect(page.locator('h1')).toContainText('Bookmark Organizer');
});
```

### Testing User Interactions

```typescript
test('should switch tabs', async ({ page }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);

  // Click Statistics tab
  await page.locator('.tab').nth(2).click();

  // Verify active state
  await expect(page.locator('.tab').nth(2)).toHaveClass(/active/);

  // Verify content changed
  await expect(page.locator('.stat-card')).toHaveCount(3);
});
```

### Testing Forms

```typescript
test('should save settings', async ({ page }) => {
  await page.goto(`chrome-extension://${extensionId}/options.html`);

  // Fill form
  await page.selectOption('#apiProvider', 'openai');
  await page.fill('#apiKey', 'test-key');

  // Submit
  await page.click('button:has-text("Save Settings")');

  // Verify success
  await expect(page.locator('.alert-success')).toBeVisible();
});
```

## Test Coverage

### Current Coverage

Unit tests cover:
- ✅ Semantic search utilities (cosine similarity, fallback search)
- ✅ HTML escaping and XSS prevention
- ✅ Date formatting
- ✅ Text truncation
- ✅ Debouncing
- ✅ URL validation and parsing
- ✅ Array grouping utilities

E2E tests cover:
- ✅ Extension loading
- ✅ Popup UI rendering
- ✅ Tab switching
- ✅ Search functionality
- ✅ Options page rendering
- ✅ Settings persistence
- ✅ API key visibility toggle

### Areas Not Covered (Future Work)

- Background service worker logic
- Chrome bookmarks API integration
- AI description generation
- Actual semantic search (requires transformers.js integration)
- Svelte component rendering (would need @testing-library/svelte setup)

## Best Practices

### 1. Keep Tests Focused

Each test should verify one behavior:

```typescript
// ❌ Bad - tests multiple things
it('should work', async () => {
  const result = await doSomething();
  expect(result.name).toBe('test');
  expect(result.count).toBe(5);
  expect(result.active).toBe(true);
});

// ✅ Good - focused tests
it('should have correct name', () => {
  expect(result.name).toBe('test');
});

it('should have correct count', () => {
  expect(result.count).toBe(5);
});
```

### 2. Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => { ... });

// ✅ Good
it('should return empty array when no bookmarks match', () => { ... });
```

### 3. Arrange-Act-Assert Pattern

```typescript
it('should format date correctly', () => {
  // Arrange
  const timestamp = new Date('2024-01-15').getTime();

  // Act
  const formatted = formatDate(timestamp);

  // Assert
  expect(formatted).toContain('Jan 15');
});
```

### 4. Clean Up After Tests

```typescript
import { afterEach } from 'vitest';

afterEach(() => {
  vi.clearAllMocks();
});
```

### 5. Use Fixtures for Complex Setup

```typescript
const createMockBookmark = (id: string, title: string) => ({
  id,
  title,
  url: `https://example.com/${id}`,
  enhanced: null,
});

it('should filter bookmarks', () => {
  const bookmarks = [
    createMockBookmark('1', 'JavaScript'),
    createMockBookmark('2', 'Python'),
  ];

  // ... test code
});
```

## Debugging Tests

### Unit Tests

```bash
# Run specific test file
npm test src/lib/utils.test.ts

# Run tests matching pattern
npm test -- --grep "truncate"

# Run in debug mode
npm test -- --inspect-brk
```

### E2E Tests

```bash
# Run specific test
npm run test:e2e -- extension.spec.ts

# Run with headed browser (see what's happening)
npm run test:e2e -- --headed

# Run in debug mode
npm run test:e2e -- --debug

# Run with UI mode (best for debugging)
npm run test:e2e:ui
```

### View Test Results

```bash
# Unit test coverage
npm run test:coverage
# Opens ./coverage/index.html

# E2E test report
npm run test:e2e
# Opens ./playwright-report/index.html
```

## Continuous Integration

### Running Tests in CI

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run type-check
      - run: npm test

      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

## Troubleshooting

### "Extension could not be loaded"

Make sure to build first:
```bash
npm run build
```

### "chrome is not defined"

You need to mock Chrome APIs:
```typescript
global.chrome = { /* mock */ } as any;
```

### "Timeout waiting for service worker"

Playwright tests need the extension to be built and the browser to run in non-headless mode:
```typescript
headless: false
```

### Tests Pass Locally but Fail in CI

- Ensure Playwright browsers are installed: `npx playwright install`
- Check for timing issues - add appropriate waits
- Verify environment variables are set

## Contributing Tests

When adding new features:

1. **Write unit tests** for pure functions and utilities
2. **Write E2E tests** for user-facing features
3. **Aim for 80%+ coverage** on new code
4. **Run all tests** before submitting PR

```bash
# Pre-commit checklist
npm run type-check  # TypeScript check
npm test            # Unit tests
npm run build       # Build extension
npm run test:e2e    # E2E tests
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Extension Testing Best Practices](https://developer.chrome.com/docs/extensions/mv3/tut_testing/)
