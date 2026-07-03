# Creating E2E Testing

## Overview

Use this guide to test complete user journeys and page interactions with Playwright. Use the Page Object Model for maintainable test code focused on critical user workflows.

## Guidelines

### Core principles

1. **Test complete journeys** — Focus on full page interactions and user flows.
2. **Use Page Object Model** — Encapsulate page interactions in reusable objects.
3. **Organize by structure** — Maintain clear directories for scalability.
4. **Use TestId locators** — Apply `data-testid` with namespace conventions.
5. **Configure browser projects** — Set up different viewports in config, not mid-test.

### When to create E2E tests

Choose the test type based on what you are protecting.

**Single page test** — Use for mostly static marketing or informational pages (for example home, about us, contact us). Assert that key content, layout, and interactive elements render correctly on one route. These are visual and content smoke tests; they do not cross routes.

**Flow page test** — Prefer this when testing user behavior or a feature end to end (for example logging in, booking, checking out). The test navigates across pages and verifies the full workflow. Flow tests are the most valuable E2E coverage because they catch routing, state, and integration issues that single-page tests miss.

| Test type | Best for | Examples |
| --- | --- | --- |
| Single page | One-route content and layout | Home hero, about page copy, contact form visible |
| Flow page | Multi-step user behavior | Login → dashboard, browse → book → confirm |

**Use E2E for:**

- Complete user journeys (login → navigate → action)
- Cross-page navigation and routing
- Critical business workflows
- Marketing page content and layout smoke checks (single page tests)

**Do not use E2E for:**

- Component logic (use unit tests)
- API validation (use integration tests)
- Individual form field validation
- CSS styling details

### Test organization

Keep E2E code at the project root under `tests/` (see [managing-project-structure.md](./managing-project-structure.md)).

```text
tests/
├── e2e/
│   ├── home.spec.ts          # Single page tests
│   └── user-login.spec.ts    # Flow tests
├── pages/                    # Page Object Model
│   ├── BasePage.ts
│   └── HomePage.ts
├── fixtures/                 # Test data
│   └── auth.ts
└── utils/                    # Test utilities
    └── helpers.ts
```

### File naming

- **Single page tests**: `{page-name}.spec.ts`
- **Flow tests**: `{journey-name}.spec.ts`
- **Page objects**: `{PageName}Page.ts`

### TestId conventions

Use namespaced `data-testid` attributes on interactive and assertion targets in `src/`:

```text
// Pattern: {feature}:{component}:{element}
data-testid="auth:login:submit"
data-testid="workshops:list:create-button"
data-testid="nav:header:logo"
```

Add `data-testid` in feature or route components when building UI that E2E tests must target. Prefer test IDs over CSS selectors or brittle text matches.

### Review checklist

- Focus on pages and user journeys only
- Choose single page vs flow test type deliberately
- Use Page Object Model for all page interactions
- Organize tests in the proper directory structure
- Follow file naming conventions
- Use fixtures for test data management
- Implement proper wait strategies
- Use `data-testid` locators with namespace conventions
- Test complete user workflows for flow tests

## Examples

### Page object

```typescript
// tests/pages/HomePage.ts
import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
  private readonly heading: Locator;

  constructor(private page: Page) {
    this.heading = page.getByTestId('home:hero:heading');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async verifyContent(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }
}
```

### Single page test

```typescript
// tests/e2e/home.spec.ts
import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('displays page content correctly', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.verifyContent();
});
```

### Flow page test

```typescript
// tests/e2e/user-login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { authFixture } from '../fixtures/auth';

test.describe('User Login Journey', () => {
  test('user can login and navigate to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.loginWith(authFixture.validUser);

    await expect(page).toHaveURL('/');
    await homePage.verifyContent();
    await expect(page.getByText('Welcome, John Doe')).toBeVisible();
  });

  test('login failure shows error and stays on login page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginWith(authFixture.invalidUser);

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
```

### Test fixtures

```typescript
// tests/fixtures/auth.ts
export const authFixture = {
  validUser: {
    email: 'test@example.com',
    password: 'password123',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'admin123',
  },
};
```

### Test utilities

```typescript
// tests/utils/helpers.ts
import type { Page } from '@playwright/test';

export class TestHelpers {
  static async clearStorage(page: Page): Promise<void> {
    await page.evaluate(() => localStorage.clear());
  }

  static async mockApi(page: Page, url: string, response: object): Promise<void> {
    await page.route(url, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      }),
    );
  }
}
```
