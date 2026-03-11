# Complete UI Development Protocol

This document defines mandatory practices for building production-quality UI with Claude. These instructions are non-negotiable and must be followed on every UI task.

---

## Core Philosophy

1. **Question before assuming** - If uncertain, ask. Do not guess.
2. **Validate iteratively** - Check as you build, not after.
3. **Design for real humans** - Every input and interaction must be practical at scale.
4. **Maintain consistency** - Changes ripple; track and update all affected parts.

---

## PHASE 1: Before Starting

### If Reference UI Exists (Optional)
When the user provides a reference URL or mentions a UI they like:
```bash
REFERENCE_URL=https://example.com npx playwright test playwright/analyze-reference.spec.ts
```

The interactive analyzer will:
1. **Discover pages** - Click through navigation and screenshot each page
2. **Extract design tokens** - Colors, typography, spacing, shadows, transitions
3. **Capture interactions** - Open dropdowns, modals, tabs, accordions
4. **Detect hover states** - Compare before/after styles on interactive elements
5. **Analyze inputs** - Find all form inputs with recommended input methods
6. **Test responsiveness** - Screenshot at mobile, tablet, desktop breakpoints
7. **Open mobile menus** - Find and capture hamburger menu states

**Output files:**
- `reference-analysis/summary.md` - Human-readable report
- `reference-analysis/report.json` - Complete analysis data
- `reference-analysis/design-tokens.json` - Extracted design system
- `reference-analysis/pages/` - Page screenshots
- `reference-analysis/components/` - Component screenshots
- `reference-analysis/interactions/` - Dropdown, modal, hover screenshots
- `reference-analysis/responsive/` - Breakpoint screenshots

Review `summary.md` before designing to understand the reference UI's patterns.

### Clarify Requirements
Before writing any code, confirm:
- What are the primary user actions?
- What data will be displayed/inputted?
- What are the realistic ranges for any numeric inputs?
- What's the target device (mobile-first? desktop?)

---

## PHASE 2: During Development

### Per-Feature Checklist

After creating ANY UI element, verify before proceeding:

#### Visual States
- [ ] Default state
- [ ] Hover state
- [ ] Focus state (keyboard navigation)
- [ ] Active/pressed state
- [ ] Disabled state
- [ ] Loading state (if async)
- [ ] Empty state (if displays data)
- [ ] Error state (if can fail)

#### Responsiveness
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)

#### Accessibility
- [ ] Keyboard navigable (Tab, Enter, Escape, Arrow keys where appropriate)
- [ ] ARIA labels on all interactive elements
- [ ] Sufficient color contrast
- [ ] Focus indicators visible

### Playwright Visual Check
Run after each significant component or section:
```bash
npx playwright test playwright/ui-check.spec.ts
```
**Review the screenshots.** Fix issues immediately before continuing.

---

## PHASE 3: Human-Centric Input Design (CRITICAL)

### The Problem
AI tends to implement the simplest technical solution, not the best human solution.

**Bad Example:** Weight input with +/- 1kg arrows
- User needs to tap 200+ times to enter 200kg
- Frustrating, slow, unusable

**Good Example:** Weight input with scroll wheel or smart stepper
- Scroll wheel with 5kg increments
- Or: tap to type directly with numpad
- Or: preset quick-select buttons (60, 80, 100, 120kg...)
- Or: slider with range based on exercise type

### Mandatory Self-Check for Every Input

When adding ANY user input, ask yourself:

1. **What's the realistic range?**
   - Age: 0-120 (but mostly 18-80)
   - Weight lifted: 0-500kg (but varies by exercise)
   - Price: $0-$10,000+ (depends on context)
   - Quantity: 1-100? 1-10000?

2. **What's the fastest way for a human to input this?**
   - Small range (1-10): Buttons or segmented control
   - Medium range (1-100): Slider or scroll wheel
   - Large range (1-1000+): Direct text input with numpad
   - Predefined options: Dropdown or chips

3. **What increment makes sense?**
   - Weight: 2.5kg or 5kg steps, not 1kg
   - Money: $1, $5, $10 steps depending on range
   - Time: 5 or 15 minute increments, not 1 minute

4. **Can we offer shortcuts?**
   - Recent values
   - Common presets
   - "Same as last time" button
   - Smart defaults based on context

### If You Can't Design It Well

If you cannot create an elegant input solution from scratch:
1. Search for similar apps/UIs that solve this problem
2. Describe what you find to the user
3. Ask if they want you to implement that pattern
4. Or use Playwright to analyze a reference: `npx playwright test playwright/analyze-reference.spec.ts`

**Do NOT ship a bad input just because it's technically functional.**

---

## PHASE 4: On Every Change - Affected Entity Check

### MANDATORY on every modification or removal:

When you change ANY element, immediately:

1. **Search for all references**
   ```
   Search: import, require, or usage of [changed item]
   ```

2. **Check shared state**
   - Global state/stores referencing this?
   - Context providers affected?
   - Props being passed from parent components?

3. **Verify navigation**
   - Routes pointing to changed component?
   - Links/buttons navigating here?
   - Breadcrumbs or menus listing this?

4. **Update ALL affected files**
   Do not leave broken imports or dead references.

5. **Report to user**
   "I also updated [file1], [file2] because they referenced [changed item]."

### When Removing Features

Complete removal checklist:
- [ ] Delete the component/function
- [ ] Remove all imports
- [ ] Remove navigation links/routes
- [ ] Remove from menus/sidebars
- [ ] Clean up related state management
- [ ] Remove or update related tests
- [ ] Check for orphaned styles/CSS

---

## PHASE 5: After Completion - End-to-End Testing

Once all features are implemented:

```bash
npx playwright test playwright/e2e/
```

### E2E Tests Must Cover:

1. **Complete user flows**
   - New user signup → first action → success
   - Returning user login → use feature → logout

2. **Cross-feature interactions**
   - Data created in Feature A appears in Feature B
   - Settings changes affect all relevant areas

3. **State persistence**
   - Refresh page → state maintained
   - Navigate away and back → data preserved

4. **Error recovery**
   - Network fails → appropriate error shown → retry works
   - Invalid input → clear error message → can fix and proceed

5. **All device sizes**
   - Full flows work on mobile
   - Full flows work on desktop

**UI is not complete until E2E passes.**

---

## When Uncertain: ASK

Do not assume. Ask the user:

- "What should happen when [X] is empty?"
- "What's the typical range for [input]?"
- "How should this behave on mobile?"
- "Is [Feature A] connected to [Feature B]?"
- "I found [similar UI] that handles this well - should I use that pattern?"

**Proceeding with unknowns creates bad UI. Question first.**

---

## Quick Reference Commands

```bash
# Visual check during development
npx playwright test playwright/ui-check.spec.ts

# Full E2E test after completion
npx playwright test playwright/e2e/

# Analyze reference UI (optional)
npx playwright test playwright/analyze-reference.spec.ts
```

---

## Summary Checklist

Before considering ANY UI work complete:

- [ ] All states implemented (hover, focus, loading, empty, error)
- [ ] Responsive at all breakpoints
- [ ] Keyboard accessible
- [ ] Human-centric inputs (practical for real use)
- [ ] All affected entities updated
- [ ] Visual check passed
- [ ] E2E tests passed
