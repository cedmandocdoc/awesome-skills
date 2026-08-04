# Creating E2E Testing

## Overview

Tests complete user journeys and page interactions with Playwright using the Page Object Model.

## Guidelines

### Core principles

1. **Test complete journeys** — full page interactions and user flows.
2. **Use Page Object Model** — encapsulate page interactions in reusable objects.
3. **Organize by structure** — keep specs, page objects, fixtures, and utils under `tests/`.
4. **Use TestId locators** — `data-testid` with namespace conventions.
5. **Configure browser projects** — set up viewports in config, not mid-test.

### Test types

| Test type | Best for | Examples |
| --- | --- | --- |
| Single page | One-route content and layout | Home hero, about page copy, contact form visible |
| Flow page | Multi-step user behavior | Login → dashboard, browse → book → confirm |

**Single page test** — asserts that key content, layout, and interactive elements render correctly on one route. Does not cross routes.

**Flow page test** — navigates across pages and verifies the full workflow. Prefer flow tests for multi-step user behavior.

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

Add `data-testid` in feature or route components when building UI that E2E tests target. Prefer test IDs over CSS selectors or brittle text matches.

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
