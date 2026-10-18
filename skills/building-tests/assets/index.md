---
doc_type: tests-index
generated_by: building-tests
author: 5d56e398-7e61-4ce9-9da5-2f8429285959
app: "[App name]"
backend:
  start: "[command that brings the local stack up]"
  reset: "[command that restores the seed]"
health:
  - "[command that succeeds only when the stack is up]"
routes: "[command that prints {\"<surface>\": [\"/path\"]}, e.g. tsx support/routes.ts]"
surfaces:
  "[surface-id, e.g. web]":
    ext: "[implementation suffix, e.g. .web.spec.ts]"
    run: "[command with {file}, {case}, {envArgs}]"
    requires: "[command that succeeds when the runtime is installed]"
---

# Tests — [App name]

## Run

```bash
npm run test                                   # everything
npm run test -- area <area>
npm run test -- segment <id> --surface <s> --case <c>
npm run test -- journey <id>
npm run test -- property <id>
npm run check                                  # validate and refresh coverage
```

## Coverage

<!-- tests:coverage:start -->
<!-- tests:coverage:end -->
