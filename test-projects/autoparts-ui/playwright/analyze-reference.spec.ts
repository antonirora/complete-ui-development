/**
 * Reference UI Analyzer - OPTIONAL
 *
 * Use when you have a reference UI you want to learn from.
 *
 * Usage:
 *   REFERENCE_URL=https://example.com npx playwright test playwright/analyze-reference.spec.ts
 *
 * This extracts:
 * - Design tokens (colors, spacing, typography, shadows)
 * - Screenshots of key sections
 * - Component patterns
 *
 * Output saved to ./reference-design-tokens.json and ./screenshots/reference/
 */

import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const REFERENCE_URL = process.env.REFERENCE_URL || 'https://linear.app';

const outputDir = path.join(__dirname, '../screenshots/reference');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

test.describe('Reference UI Analysis', () => {

  test('Extract design tokens', async ({ page }) => {
    await page.goto(REFERENCE_URL);
    await page.waitForLoadState('networkidle');

    // Wait a bit for any animations to settle
    await page.waitForTimeout(2000);

    const designTokens = await page.evaluate(() => {
      const tokens: any = {
        colors: new Set<string>(),
        fontSizes: new Set<string>(),
        fontWeights: new Set<string>(),
        borderRadii: new Set<string>(),
        shadows: new Set<string>(),
        spacing: new Set<string>(),
        components: [],
      };

      // Sample various elements
      const selectors = [
        'button',
        'a',
        'input',
        'h1', 'h2', 'h3', 'h4',
        'p',
        '[class*="card"]',
        '[class*="modal"]',
        '[class*="dropdown"]',
        '[class*="menu"]',
        'nav',
        'header',
        'footer',
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
          if (index > 5) return; // Sample first 5 of each

          const styles = getComputedStyle(el);

          // Colors
          tokens.colors.add(styles.color);
          tokens.colors.add(styles.backgroundColor);
          tokens.colors.add(styles.borderColor);

          // Typography
          tokens.fontSizes.add(styles.fontSize);
          tokens.fontWeights.add(styles.fontWeight);

          // Borders & Radius
          tokens.borderRadii.add(styles.borderRadius);

          // Shadows
          if (styles.boxShadow !== 'none') {
            tokens.shadows.add(styles.boxShadow);
          }

          // Spacing (padding/margin)
          tokens.spacing.add(styles.padding);
          tokens.spacing.add(styles.margin);

          // Component details
          if (['BUTTON', 'INPUT', 'A'].includes(el.tagName) && index < 3) {
            tokens.components.push({
              type: el.tagName.toLowerCase(),
              selector: selector,
              styles: {
                fontSize: styles.fontSize,
                fontWeight: styles.fontWeight,
                color: styles.color,
                backgroundColor: styles.backgroundColor,
                borderRadius: styles.borderRadius,
                padding: styles.padding,
                border: styles.border,
                boxShadow: styles.boxShadow,
                transition: styles.transition,
              }
            });
          }
        });
      });

      // Convert Sets to arrays and filter empties
      return {
        colors: [...tokens.colors].filter(c => c && c !== 'rgba(0, 0, 0, 0)'),
        fontSizes: [...tokens.fontSizes].filter(Boolean),
        fontWeights: [...tokens.fontWeights].filter(Boolean),
        borderRadii: [...tokens.borderRadii].filter(r => r && r !== '0px'),
        shadows: [...tokens.shadows].filter(Boolean),
        components: tokens.components,
        analyzedUrl: window.location.href,
        analyzedAt: new Date().toISOString(),
      };
    });

    // Save tokens
    fs.writeFileSync(
      path.join(__dirname, '../reference-design-tokens.json'),
      JSON.stringify(designTokens, null, 2)
    );

    console.log('Design tokens extracted:');
    console.log(`- ${designTokens.colors.length} unique colors`);
    console.log(`- ${designTokens.fontSizes.length} font sizes`);
    console.log(`- ${designTokens.borderRadii.length} border radii`);
    console.log(`- ${designTokens.shadows.length} shadow styles`);
    console.log(`- ${designTokens.components.length} component samples`);
  });

  test('Screenshot reference UI', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(REFERENCE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Full page
    await page.screenshot({
      path: path.join(outputDir, 'full-page.png'),
      fullPage: true,
    });

    // Viewport
    await page.screenshot({
      path: path.join(outputDir, 'viewport.png'),
    });

    // Try to capture specific components
    const componentSelectors = [
      { name: 'header', selector: 'header, [class*="header"], nav' },
      { name: 'buttons', selector: 'button' },
      { name: 'cards', selector: '[class*="card"]' },
      { name: 'forms', selector: 'form, [class*="form"]' },
      { name: 'sidebar', selector: '[class*="sidebar"], aside' },
    ];

    for (const comp of componentSelectors) {
      const element = await page.locator(comp.selector).first();
      if (await element.isVisible().catch(() => false)) {
        try {
          await element.screenshot({
            path: path.join(outputDir, `${comp.name}.png`),
          });
          console.log(`Captured: ${comp.name}`);
        } catch (e) {
          console.log(`Could not capture ${comp.name}`);
        }
      }
    }
  });

  test('Analyze input patterns', async ({ page }) => {
    await page.goto(REFERENCE_URL);
    await page.waitForLoadState('networkidle');

    const inputAnalysis = await page.evaluate(() => {
      const analysis: any[] = [];

      // Analyze all input types
      const inputs = document.querySelectorAll('input, select, textarea, [role="slider"], [role="spinbutton"]');

      inputs.forEach((input, i) => {
        if (i > 20) return;

        const el = input as HTMLInputElement;
        const styles = getComputedStyle(el);

        analysis.push({
          type: el.type || el.tagName.toLowerCase(),
          role: el.getAttribute('role'),
          hasLabel: !!document.querySelector(`label[for="${el.id}"]`),
          placeholder: el.placeholder,
          min: el.min,
          max: el.max,
          step: el.step,
          styles: {
            height: styles.height,
            padding: styles.padding,
            fontSize: styles.fontSize,
            borderRadius: styles.borderRadius,
          }
        });
      });

      return analysis;
    });

    console.log('Input patterns found:');
    inputAnalysis.forEach((input, i) => {
      console.log(`${i + 1}. ${input.type}${input.role ? ` (role: ${input.role})` : ''}`);
      if (input.min || input.max) {
        console.log(`   Range: ${input.min || '?'} - ${input.max || '?'}, step: ${input.step || '1'}`);
      }
    });

    // Save analysis
    fs.writeFileSync(
      path.join(__dirname, '../reference-input-patterns.json'),
      JSON.stringify(inputAnalysis, null, 2)
    );
  });

  test('Mobile reference', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(REFERENCE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: path.join(outputDir, 'mobile-full.png'),
      fullPage: true,
    });

    await page.screenshot({
      path: path.join(outputDir, 'mobile-viewport.png'),
    });
  });
});
