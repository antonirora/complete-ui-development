/**
 * UI Visual Check - Run during development after each significant UI addition
 *
 * Usage: npx playwright test playwright/ui-check.spec.ts
 *
 * This captures screenshots at multiple breakpoints and checks basic interactions.
 * Review the screenshots in ./screenshots/ before proceeding with more work.
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Configure your local dev URL
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Breakpoints to test
const BREAKPOINTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

// Ensure screenshots directory exists
const screenshotDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

test.describe('Visual Check', () => {

  for (const bp of BREAKPOINTS) {
    test(`Screenshot at ${bp.name} (${bp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Full page screenshot
      await page.screenshot({
        path: path.join(screenshotDir, `${bp.name}-full.png`),
        fullPage: true,
      });

      // Viewport screenshot
      await page.screenshot({
        path: path.join(screenshotDir, `${bp.name}-viewport.png`),
      });
    });
  }

  test('Interactive elements check', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Find all buttons
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons`);

    // Check each button has visible text or aria-label
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const btn = buttons[i];
      const text = await btn.textContent();
      const ariaLabel = await btn.getAttribute('aria-label');
      const isVisible = await btn.isVisible();

      if (isVisible && !text?.trim() && !ariaLabel) {
        console.warn(`Button ${i} has no accessible text or aria-label`);
      }
    }

    // Find all inputs
    const inputs = await page.locator('input, textarea, select').all();
    console.log(`Found ${inputs.length} input elements`);

    // Check inputs have labels
    for (let i = 0; i < Math.min(inputs.length, 10); i++) {
      const input = inputs[i];
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');

      if (!id && !ariaLabel && !placeholder) {
        console.warn(`Input ${i} may be missing accessibility attributes`);
      }
    }

    // Screenshot hover states of first few buttons
    for (let i = 0; i < Math.min(buttons.length, 3); i++) {
      const btn = buttons[i];
      if (await btn.isVisible()) {
        await btn.hover();
        await page.screenshot({
          path: path.join(screenshotDir, `button-${i}-hover.png`),
        });
      }
    }
  });

  test('Keyboard navigation check', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Tab through first 10 focusable elements
    const focusOrder: string[] = [];

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');

      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        return {
          tag: el.tagName,
          text: el.textContent?.slice(0, 30),
          hasVisibleFocus: getComputedStyle(el).outlineWidth !== '0px' ||
                          getComputedStyle(el).boxShadow !== 'none',
        };
      });

      if (focused) {
        focusOrder.push(`${focused.tag}: ${focused.text}`);
        if (!focused.hasVisibleFocus) {
          console.warn(`Element may lack visible focus indicator: ${focused.tag}`);
        }
      }
    }

    console.log('Focus order:', focusOrder);

    // Screenshot showing focus state
    await page.screenshot({
      path: path.join(screenshotDir, 'focus-state.png'),
    });
  });
});

test.describe('Input Usability Check', () => {

  test('Analyze number inputs', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // Find number inputs
    const numberInputs = await page.locator('input[type="number"]').all();

    for (let i = 0; i < numberInputs.length; i++) {
      const input = numberInputs[i];
      const min = await input.getAttribute('min');
      const max = await input.getAttribute('max');
      const step = await input.getAttribute('step');

      console.log(`Number input ${i}:`, { min, max, step });

      // Flag potentially bad UX
      if (max && parseInt(max) > 100 && (!step || step === '1')) {
        console.warn(`Number input ${i} has large range (max: ${max}) but step is 1. Consider larger step or different input method.`);
      }
    }

    // Find custom input components (wheels, sliders, etc.)
    const sliders = await page.locator('input[type="range"], [role="slider"]').all();
    console.log(`Found ${sliders.length} slider/range inputs`);

    // Screenshot all inputs area
    await page.screenshot({
      path: path.join(screenshotDir, 'inputs-overview.png'),
      fullPage: true,
    });
  });
});
