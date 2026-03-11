# Complete UI Development Protocol

A system for building production-quality UI with Claude, using iterative Playwright validation.

## The Problem

When using AI to build UI:
- Claude can't see what it's building
- Features are technically functional but not human-friendly
- Input methods are often impractical at scale
- Changes break other parts of the UI
- Testing happens after everything is built (too late)

## The Solution

This protocol enforces:
1. **Iterative visual checks** - Playwright screenshots after each component
2. **Human-centric input design** - Practical inputs for real-world use
3. **Affected entity tracking** - Update all connected parts on every change
4. **End-to-end verification** - Full flow testing at completion

## Quick Start

### 1. Copy to Your Project

```bash
# Copy the playwright folder and config to your project
cp -r playwright/ your-project/playwright/
cp playwright.config.ts your-project/
cp CLAUDE.md your-project/  # Or merge into existing
```

### 2. Install Playwright

```bash
cd your-project
npm install -D @playwright/test
npx playwright install chromium
```

### 3. Follow the Protocol

See `CLAUDE.md` for full instructions. Key commands:

```bash
# During development (run often)
npm run ui-check

# Optional: Analyze a reference UI
REFERENCE_URL=https://example.com npm run analyze-ref

# After all features complete
npm run e2e
```

## Workflow Summary

```
┌───────────────────────────────────────────────────────┐
│ OPTIONAL: Analyze reference UI                        │
│ REFERENCE_URL=... npm run analyze-ref                 │
└───────────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────┐
│ FOR EACH COMPONENT                                    │
│ 1. Build with human-centric inputs                    │
│ 2. Run: npm run ui-check                              │
│ 3. Review screenshots in ./screenshots/               │
│ 4. Fix issues before continuing                       │
│ 5. Check & update affected entities                   │
└───────────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────┐
│ AFTER ALL FEATURES                                    │
│ 1. Run: npm run e2e                                   │
│ 2. Fix any failures                                   │
│ 3. UI is complete when E2E passes                     │
└───────────────────────────────────────────────────────┘
```

## Key Principles

### Human-Centric Inputs

Every input must be practical for real use:

| Scenario | Bad | Good |
|----------|-----|------|
| Weight (0-300kg) | +/- 1kg arrows | Scroll wheel, 5kg steps |
| Quantity (1-1000) | Text field | Presets + text fallback |
| Date | Manual typing | Date picker |
| Rating (1-5) | Dropdown | Star buttons |

### Affected Entity Check

On EVERY change, search for and update:
- All imports of the changed item
- Navigation/routes pointing to it
- Shared state referencing it
- Tests covering it

### When Uncertain

Claude must ASK, not assume:
- "What range is realistic for this input?"
- "What should happen when this is empty?"
- "I found [similar UI] - should I use that pattern?"

## Files

```
complete-ui-development/
├── CLAUDE.md                      # Main protocol (copy to projects)
├── README.md                      # This file
├── package.json                   # Scripts and deps
├── playwright.config.ts           # Playwright config
└── playwright/
    ├── ui-check.spec.ts           # Visual check during development
    ├── analyze-reference.spec.ts  # Optional reference UI analyzer
    └── e2e/
        └── flows.spec.ts          # E2E test template
```

## Customization

1. Update `BASE_URL` in playwright.config.ts or set via environment
2. Modify breakpoints in ui-check.spec.ts for your needs
3. Replace TODO sections in e2e/flows.spec.ts with your actual flows
4. Add project-specific checks to CLAUDE.md
