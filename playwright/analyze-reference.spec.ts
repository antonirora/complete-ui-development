/**
 * Reference UI Analyzer - Interactive Explorer
 *
 * Fully explores any website by clicking through navigation, menus, dropdowns,
 * and interactive elements to extract comprehensive design information.
 *
 * Usage:
 *   REFERENCE_URL=https://example.com npx playwright test playwright/analyze-reference.spec.ts
 *
 * Output:
 *   - ./reference-analysis/design-tokens.json - Colors, typography, spacing
 *   - ./reference-analysis/pages/ - Screenshots of each discovered page
 *   - ./reference-analysis/components/ - Screenshots of UI components
 *   - ./reference-analysis/interactions/ - Hover states, dropdowns, modals
 *   - ./reference-analysis/report.json - Full analysis report
 *   - ./reference-analysis/summary.md - Human-readable summary
 */

import { test, Page, Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const REFERENCE_URL = process.env.REFERENCE_URL || 'https://linear.app';

// Output directories
const outputDir = path.join(__dirname, '../reference-analysis');
const pagesDir = path.join(outputDir, 'pages');
const componentsDir = path.join(outputDir, 'components');
const interactionsDir = path.join(outputDir, 'interactions');
const responsiveDir = path.join(outputDir, 'responsive');

// Create directories
[outputDir, pagesDir, componentsDir, interactionsDir, responsiveDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Store discovered information
interface AnalysisReport {
  url: string;
  analyzedAt: string;
  pages: PageInfo[];
  designTokens: DesignTokens;
  components: ComponentInfo[];
  interactions: InteractionInfo[];
  inputs: InputInfo[];
  navigation: NavigationInfo;
  responsiveness: ResponsivenessInfo;
}

interface PageInfo {
  url: string;
  title: string;
  screenshot: string;
  description?: string;
}

interface DesignTokens {
  colors: { value: string; usage: string; count: number }[];
  fontSizes: string[];
  fontFamilies: string[];
  fontWeights: string[];
  borderRadii: string[];
  shadows: string[];
  spacing: string[];
  transitions: string[];
}

interface ComponentInfo {
  type: string;
  selector: string;
  count: number;
  screenshot?: string;
  styles: Record<string, string>;
  variants?: string[];
}

interface InteractionInfo {
  type: 'dropdown' | 'modal' | 'hover' | 'accordion' | 'tab' | 'tooltip';
  trigger: string;
  screenshot?: string;
  description?: string;
}

interface InputInfo {
  type: string;
  role?: string;
  label?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
  options?: string[];
  styles: Record<string, string>;
  inputMethod: string; // Recommended input method
}

interface NavigationInfo {
  type: 'sidebar' | 'topbar' | 'hamburger' | 'tabs' | 'mixed';
  mainItems: { label: string; href: string }[];
  hasSearch: boolean;
  hasMobileMenu: boolean;
}

interface ResponsivenessInfo {
  breakpoints: { width: number; screenshot: string; layoutChanges: string[] }[];
  mobileNavigation: string;
  stackingBehavior: string;
}

// Utility: sanitize filename
function sanitize(str: string): string {
  return str.replace(/[^a-z0-9]/gi, '-').toLowerCase().substring(0, 50);
}

// Utility: wait with timeout
async function safeWait(page: Page, ms: number = 500): Promise<void> {
  await page.waitForTimeout(ms);
}

// Utility: safe click that handles navigation or no-op
async function safeClick(locator: Locator, page: Page): Promise<boolean> {
  try {
    const isVisible = await locator.isVisible().catch(() => false);
    if (!isVisible) return false;

    await locator.click({ timeout: 3000 });
    await safeWait(page, 500);
    return true;
  } catch {
    return false;
  }
}

test.describe('Interactive Reference UI Analysis', () => {
  let report: AnalysisReport;

  test.beforeAll(() => {
    report = {
      url: REFERENCE_URL,
      analyzedAt: new Date().toISOString(),
      pages: [],
      designTokens: {
        colors: [],
        fontSizes: [],
        fontFamilies: [],
        fontWeights: [],
        borderRadii: [],
        shadows: [],
        spacing: [],
        transitions: [],
      },
      components: [],
      interactions: [],
      inputs: [],
      navigation: {
        type: 'mixed',
        mainItems: [],
        hasSearch: false,
        hasMobileMenu: false,
      },
      responsiveness: {
        breakpoints: [],
        mobileNavigation: '',
        stackingBehavior: '',
      },
    };
  });

  test.afterAll(() => {
    // Save full report
    fs.writeFileSync(
      path.join(outputDir, 'report.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate human-readable summary
    const summary = generateSummary(report);
    fs.writeFileSync(path.join(outputDir, 'summary.md'), summary);

    console.log('\n========================================');
    console.log('ANALYSIS COMPLETE');
    console.log('========================================');
    console.log(`Output directory: ${outputDir}`);
    console.log(`Pages discovered: ${report.pages.length}`);
    console.log(`Components found: ${report.components.length}`);
    console.log(`Interactions captured: ${report.interactions.length}`);
    console.log(`Input patterns: ${report.inputs.length}`);
    console.log('========================================\n');
  });

  test('1. Initial page analysis and design tokens', async ({ page }) => {
    console.log(`\nAnalyzing: ${REFERENCE_URL}\n`);

    await page.goto(REFERENCE_URL, { waitUntil: 'networkidle' });
    await safeWait(page, 2000);

    // Screenshot initial page
    await page.screenshot({
      path: path.join(pagesDir, 'home.png'),
      fullPage: true
    });

    report.pages.push({
      url: page.url(),
      title: await page.title(),
      screenshot: 'pages/home.png',
    });

    // Extract comprehensive design tokens
    const tokens = await page.evaluate(() => {
      const colorMap = new Map<string, { usage: string; count: number }>();
      const fontSizes = new Set<string>();
      const fontFamilies = new Set<string>();
      const fontWeights = new Set<string>();
      const borderRadii = new Set<string>();
      const shadows = new Set<string>();
      const spacing = new Set<string>();
      const transitions = new Set<string>();

      // Walk through all elements
      const allElements = document.querySelectorAll('*');

      allElements.forEach(el => {
        const styles = getComputedStyle(el);

        // Colors - track usage
        const bgColor = styles.backgroundColor;
        const textColor = styles.color;
        const borderColor = styles.borderColor;

        [
          { color: bgColor, usage: 'background' },
          { color: textColor, usage: 'text' },
          { color: borderColor, usage: 'border' },
        ].forEach(({ color, usage }) => {
          if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
            const existing = colorMap.get(color);
            if (existing) {
              existing.count++;
            } else {
              colorMap.set(color, { usage, count: 1 });
            }
          }
        });

        // Typography
        fontSizes.add(styles.fontSize);
        fontFamilies.add(styles.fontFamily.split(',')[0].trim().replace(/"/g, ''));
        fontWeights.add(styles.fontWeight);

        // Border radius
        if (styles.borderRadius && styles.borderRadius !== '0px') {
          borderRadii.add(styles.borderRadius);
        }

        // Shadows
        if (styles.boxShadow && styles.boxShadow !== 'none') {
          shadows.add(styles.boxShadow);
        }

        // Spacing (sample padding/margin)
        if (styles.padding && styles.padding !== '0px') {
          spacing.add(styles.padding);
        }

        // Transitions
        if (styles.transition && styles.transition !== 'all 0s ease 0s') {
          transitions.add(styles.transition);
        }
      });

      // Convert and sort colors by usage count
      const colors = Array.from(colorMap.entries())
        .map(([value, data]) => ({ value, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 30); // Top 30 colors

      return {
        colors,
        fontSizes: [...fontSizes].filter(Boolean).sort(),
        fontFamilies: [...fontFamilies].filter(f => f && f !== 'inherit'),
        fontWeights: [...fontWeights].filter(Boolean).sort(),
        borderRadii: [...borderRadii].sort(),
        shadows: [...shadows].slice(0, 10),
        spacing: [...spacing].slice(0, 20),
        transitions: [...transitions].slice(0, 10),
      };
    });

    report.designTokens = tokens;

    // Save design tokens separately
    fs.writeFileSync(
      path.join(outputDir, 'design-tokens.json'),
      JSON.stringify(tokens, null, 2)
    );

    console.log(`Found ${tokens.colors.length} colors, ${tokens.fontSizes.length} font sizes`);
  });

  test('2. Discover and explore navigation', async ({ page }) => {
    await page.goto(REFERENCE_URL, { waitUntil: 'networkidle' });
    await safeWait(page, 1000);

    // Find navigation structure
    const navInfo = await page.evaluate(() => {
      const nav = document.querySelector('nav, [role="navigation"], header');
      const sidebar = document.querySelector('[class*="sidebar"], aside, [class*="menu"]');

      // Determine navigation type
      let type: 'sidebar' | 'topbar' | 'hamburger' | 'tabs' | 'mixed' = 'mixed';
      if (sidebar) type = 'sidebar';
      else if (nav?.closest('header')) type = 'topbar';

      // Extract main nav items
      const mainItems: { label: string; href: string }[] = [];
      const links = document.querySelectorAll('nav a, [role="navigation"] a, header a, aside a');

      links.forEach(link => {
        const href = link.getAttribute('href');
        const label = link.textContent?.trim();
        if (href && label && !mainItems.some(i => i.href === href)) {
          mainItems.push({ label, href });
        }
      });

      // Check for search
      const hasSearch = !!document.querySelector('input[type="search"], [class*="search"], [placeholder*="search" i]');

      // Check for mobile menu button
      const hasMobileMenu = !!document.querySelector('[class*="hamburger"], [class*="mobile-menu"], [aria-label*="menu" i]');

      return { type, mainItems: mainItems.slice(0, 20), hasSearch, hasMobileMenu };
    });

    report.navigation = navInfo;
    console.log(`Navigation type: ${navInfo.type}, ${navInfo.mainItems.length} items found`);

    // Click through each navigation item and screenshot
    const visitedUrls = new Set<string>();
    visitedUrls.add(page.url());

    for (const item of navInfo.mainItems.slice(0, 10)) { // Limit to first 10
      try {
        // Skip external links, anchors, javascript:
        if (!item.href || item.href.startsWith('http') && !item.href.includes(new URL(REFERENCE_URL).hostname)) {
          continue;
        }
        if (item.href.startsWith('#') || item.href.startsWith('javascript:')) {
          continue;
        }

        const targetUrl = new URL(item.href, REFERENCE_URL).href;
        if (visitedUrls.has(targetUrl)) continue;

        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 10000 });
        await safeWait(page, 1000);

        visitedUrls.add(page.url());

        const filename = `page-${sanitize(item.label)}.png`;
        await page.screenshot({
          path: path.join(pagesDir, filename),
          fullPage: true
        });

        report.pages.push({
          url: page.url(),
          title: await page.title(),
          screenshot: `pages/${filename}`,
          description: item.label,
        });

        console.log(`Captured: ${item.label}`);
      } catch (e) {
        console.log(`Could not navigate to: ${item.label}`);
      }
    }
  });

  test('3. Discover and interact with dropdowns/menus', async ({ page }) => {
    await page.goto(REFERENCE_URL, { waitUntil: 'networkidle' });
    await safeWait(page, 1000);

    // Find dropdown triggers
    const dropdownSelectors = [
      '[class*="dropdown"] > button',
      '[class*="dropdown"] > [role="button"]',
      'button[aria-haspopup]',
      '[aria-expanded]',
      '[class*="menu-trigger"]',
      '[class*="select"]',
      'select',
      '[data-dropdown]',
      '[data-menu]',
    ];

    let dropdownIndex = 0;

    for (const selector of dropdownSelectors) {
      const triggers = await page.locator(selector).all();

      for (const trigger of triggers.slice(0, 5)) { // Limit per selector type
        try {
          const isVisible = await trigger.isVisible();
          if (!isVisible) continue;

          // Screenshot before
          const beforeFile = `dropdown-${dropdownIndex}-closed.png`;
          await page.screenshot({ path: path.join(interactionsDir, beforeFile) });

          // Click to open
          await trigger.click({ timeout: 2000 });
          await safeWait(page, 500);

          // Screenshot after
          const afterFile = `dropdown-${dropdownIndex}-open.png`;
          await page.screenshot({ path: path.join(interactionsDir, afterFile) });

          const label = await trigger.textContent().catch(() => 'Unknown');

          report.interactions.push({
            type: 'dropdown',
            trigger: label?.trim() || selector,
            screenshot: `interactions/${afterFile}`,
            description: `Dropdown triggered by: ${label?.trim() || selector}`,
          });

          console.log(`Captured dropdown: ${label?.trim() || selector}`);

          // Close by clicking elsewhere or pressing Escape
          await page.keyboard.press('Escape');
          await safeWait(page, 300);

          dropdownIndex++;
        } catch {
          // Skip failed interactions
        }
      }
    }
  });

  test('4. Discover hover states', async ({ page }) => {
    await page.goto(REFERENCE_URL, { waitUntil: 'networkidle' });
    await safeWait(page, 1000);

    // Elements that commonly have hover states
    const hoverSelectors = [
      'button',
      'a',
      '[class*="card"]',
      '[class*="item"]',
      '[role="button"]',
      '[class*="btn"]',
    ];

    let hoverIndex = 0;

    for (const selector of hoverSelectors) {
      const elements = await page.locator(selector).all();

      for (const element of elements.slice(0, 3)) { // First 3 of each type
        try {
          const isVisible = await element.isVisible();
          if (!isVisible) continue;

          // Get initial styles
          const beforeStyles = await element.evaluate(el => {
            const s = getComputedStyle(el);
            return {
              backgroundColor: s.backgroundColor,
              color: s.color,
              transform: s.transform,
              boxShadow: s.boxShadow,
            };
          });

          // Hover
          await element.hover();
          await safeWait(page, 300);

          // Get hover styles
          const afterStyles = await element.evaluate(el => {
            const s = getComputedStyle(el);
            return {
              backgroundColor: s.backgroundColor,
              color: s.color,
              transform: s.transform,
              boxShadow: s.boxShadow,
            };
          });

          // Check if styles changed
          const hasChange = JSON.stringify(beforeStyles) !== JSON.stringify(afterStyles);

          if (hasChange) {
            const filename = `hover-${hoverIndex}.png`;
            await page.screenshot({ path: path.join(interactionsDir, filename) });

            const label = await element.textContent().catch(() => '');

            report.interactions.push({
              type: 'hover',
              trigger: label?.trim().substring(0, 30) || selector,
              screenshot: `interactions/${filename}`,
              description: `Hover changes: bg ${beforeStyles.backgroundColor} → ${afterStyles.backgroundColor}`,
            });

            hoverIndex++;
          }
        } catch {
          // Skip failed
        }
      }
    }

    console.log(`Captured ${hoverIndex} hover state changes`);
  });

  test('5. Discover modals and dialogs', async ({ page }) => {
    await page.goto(REFERENCE_URL, { waitUntil: 'networkidle' });
    await safeWait(page, 1000);

    // Find modal triggers
    const modalTriggerSelectors = [
      'button[class*="modal"]',
      '[data-modal]',
      '[data-dialog]',
      'button:has-text("Sign")',
      'button:has-text("Login")',
      'button:has-text("Create")',
      'button:has-text("New")',
      'button:has-text("Add")',
      '[aria-haspopup="dialog"]',
    ];

    let modalIndex = 0;

    for (const selector of modalTriggerSelectors) {
      try {
        const trigger = page.locator(selector).first();
        const isVisible = await trigger.isVisible().catch(() => false);

        if (!isVisible) continue;

        await trigger.click({ timeout: 2000 });
        await safeWait(page, 800);

        // Check if modal appeared
        const modal = page.locator('[role="dialog"], [class*="modal"], [class*="dialog"]').first();
        const modalVisible = await modal.isVisible().catch(() => false);

        if (modalVisible) {
          const filename = `modal-${modalIndex}.png`;
          await page.screenshot({ path: path.join(interactionsDir, filename) });

          const label = await trigger.textContent().catch(() => 'Unknown');

          report.interactions.push({
            type: 'modal',
            trigger: label?.trim() || selector,
            screenshot: `interactions/${filename}`,
          });

          console.log(`Captured modal: ${label?.trim()}`);

          // Close modal
          await page.keyboard.press('Escape');
          await safeWait(page, 500);

          modalIndex++;
        }
      } catch {
        // Skip failed
      }
    }
  });

  test('6. Discover tabs and accordions', async ({ page }) => {
    await page.goto(REFERENCE_URL, { waitUntil: 'networkidle' });
    await safeWait(page, 1000);

    // Find tab containers
    const tabSelectors = [
      '[role="tablist"] [role="tab"]',
      '[class*="tab"]',
      '[class*="tabs"] button',
      '[data-tab]',
    ];

    let tabIndex = 0;

    for (const selector of tabSelectors) {
      const tabs = await page.locator(selector).all();

      if (tabs.length > 1) {
        // Screenshot each tab
        for (const tab of tabs.slice(0, 5)) {
          try {
            const isVisible = await tab.isVisible();
            if (!isVisible) continue;

            await tab.click();
            await safeWait(page, 500);

            const label = await tab.textContent();
            const filename = `tab-${tabIndex}-${sanitize(label || 'unknown')}.png`;

            await page.screenshot({ path: path.join(interactionsDir, filename) });

            report.interactions.push({
              type: 'tab',
              trigger: label?.trim() || 'Tab',
              screenshot: `interactions/${filename}`,
            });

            tabIndex++;
          } catch {
            // Skip
          }
        }

        if (tabIndex > 0) break; // Found tabs, stop looking
      }
    }

    // Find accordions
    const accordionSelectors = [
      '[class*="accordion"] button',
      '[class*="accordion"] summary',
      '[class*="collapse"] button',
      'details summary',
      '[aria-expanded]',
    ];

    let accordionIndex = 0;

    for (const selector of accordionSelectors) {
      const accordions = await page.locator(selector).all();

      for (const accordion of accordions.slice(0, 3)) {
        try {
          const isVisible = await accordion.isVisible();
          if (!isVisible) continue;

          // Click to expand
          await accordion.click();
          await safeWait(page, 500);

          const label = await accordion.textContent();
          const filename = `accordion-${accordionIndex}-${sanitize(label || 'unknown')}.png`;

          await page.screenshot({ path: path.join(interactionsDir, filename) });

          report.interactions.push({
            type: 'accordion',
            trigger: label?.trim() || 'Accordion',
            screenshot: `interactions/${filename}`,
          });

          accordionIndex++;
        } catch {
          // Skip
        }
      }

      if (accordionIndex > 0) break;
    }

    console.log(`Captured ${tabIndex} tabs, ${accordionIndex} accordions`);
  });

  test('7. Analyze all input patterns', async ({ page }) => {
    await page.goto(REFERENCE_URL, { waitUntil: 'networkidle' });
    await safeWait(page, 1000);

    // Also check other pages for forms
    const pagesToCheck = [REFERENCE_URL, ...report.pages.slice(0, 5).map(p => p.url)];

    for (const url of pagesToCheck) {
      try {
        if (page.url() !== url) {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
          await safeWait(page, 500);
        }

        const inputs = await page.evaluate(() => {
          const results: InputInfo[] = [];

          const inputElements = document.querySelectorAll(
            'input, select, textarea, [role="slider"], [role="spinbutton"], [role="combobox"], [contenteditable="true"]'
          );

          inputElements.forEach(el => {
            const input = el as HTMLInputElement;
            const styles = getComputedStyle(el);

            // Get associated label
            let label = '';
            const labelEl = document.querySelector(`label[for="${input.id}"]`);
            if (labelEl) {
              label = labelEl.textContent?.trim() || '';
            } else {
              // Check for parent label or aria-label
              const parentLabel = el.closest('label');
              if (parentLabel) {
                label = parentLabel.textContent?.trim() || '';
              } else {
                label = input.getAttribute('aria-label') || '';
              }
            }

            // Get options for select
            let options: string[] | undefined;
            if (el.tagName === 'SELECT') {
              options = Array.from((el as HTMLSelectElement).options).map(o => o.text);
            }

            // Determine recommended input method
            let inputMethod = 'text';
            const type = input.type || el.tagName.toLowerCase();

            if (type === 'range' || el.getAttribute('role') === 'slider') {
              inputMethod = 'slider';
            } else if (type === 'number') {
              const min = parseFloat(input.min) || 0;
              const max = parseFloat(input.max) || 100;
              const range = max - min;

              if (range <= 10) {
                inputMethod = 'stepper or buttons';
              } else if (range <= 100) {
                inputMethod = 'slider or scroll wheel';
              } else {
                inputMethod = 'direct input with numpad';
              }
            } else if (type === 'select' || el.getAttribute('role') === 'combobox') {
              inputMethod = 'dropdown';
            } else if (type === 'checkbox' || type === 'radio') {
              inputMethod = type;
            } else if (type === 'date' || type === 'datetime-local') {
              inputMethod = 'date picker';
            }

            results.push({
              type,
              role: el.getAttribute('role') || undefined,
              label: label || undefined,
              placeholder: input.placeholder || undefined,
              min: input.min || undefined,
              max: input.max || undefined,
              step: input.step || undefined,
              options,
              styles: {
                height: styles.height,
                padding: styles.padding,
                fontSize: styles.fontSize,
                borderRadius: styles.borderRadius,
                border: styles.border,
              },
              inputMethod,
            });
          });

          return results;
        });

        // Add unique inputs to report
        for (const input of inputs) {
          const exists = report.inputs.some(i =>
            i.type === input.type && i.label === input.label
          );
          if (!exists) {
            report.inputs.push(input);
          }
        }
      } catch {
        // Skip failed pages
      }
    }

    console.log(`Found ${report.inputs.length} input patterns`);
  });

  test('8. Capture component library', async ({ page }) => {
    await page.goto(REFERENCE_URL, { waitUntil: 'networkidle' });
    await safeWait(page, 1000);

    // Common component selectors
    const componentTypes = [
      { name: 'buttons', selector: 'button, [role="button"], [class*="btn"]' },
      { name: 'cards', selector: '[class*="card"]' },
      { name: 'inputs', selector: 'input, textarea' },
      { name: 'badges', selector: '[class*="badge"], [class*="tag"], [class*="chip"]' },
      { name: 'avatars', selector: '[class*="avatar"]' },
      { name: 'alerts', selector: '[class*="alert"], [role="alert"]' },
      { name: 'progress', selector: 'progress, [class*="progress"]' },
      { name: 'tables', selector: 'table' },
      { name: 'lists', selector: 'ul, ol, [role="list"]' },
      { name: 'nav', selector: 'nav, [role="navigation"]' },
      { name: 'header', selector: 'header' },
      { name: 'footer', selector: 'footer' },
      { name: 'sidebar', selector: '[class*="sidebar"], aside' },
      { name: 'modals', selector: '[class*="modal"], [role="dialog"]' },
      { name: 'tooltips', selector: '[class*="tooltip"]' },
      { name: 'breadcrumbs', selector: '[class*="breadcrumb"]' },
      { name: 'pagination', selector: '[class*="pagination"]' },
    ];

    for (const comp of componentTypes) {
      try {
        const elements = await page.locator(comp.selector).all();
        const count = elements.length;

        if (count === 0) continue;

        // Get first visible element
        let capturedElement: Locator | null = null;
        for (const el of elements) {
          if (await el.isVisible().catch(() => false)) {
            capturedElement = el;
            break;
          }
        }

        if (capturedElement) {
          // Screenshot component
          const filename = `${comp.name}.png`;
          try {
            await capturedElement.screenshot({
              path: path.join(componentsDir, filename)
            });
          } catch {
            // Element might be too large or have issues, skip screenshot
          }

          // Get styles
          const styles = await capturedElement.evaluate(el => {
            const s = getComputedStyle(el);
            return {
              backgroundColor: s.backgroundColor,
              color: s.color,
              padding: s.padding,
              borderRadius: s.borderRadius,
              boxShadow: s.boxShadow,
              fontSize: s.fontSize,
              fontWeight: s.fontWeight,
            };
          });

          report.components.push({
            type: comp.name,
            selector: comp.selector,
            count,
            screenshot: `components/${filename}`,
            styles,
          });

          console.log(`Captured ${comp.name}: ${count} found`);
        }
      } catch {
        // Skip failed components
      }
    }
  });

  test('9. Test responsiveness at breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop-small' },
      { width: 1440, height: 900, name: 'desktop' },
    ];

    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto(REFERENCE_URL, { waitUntil: 'networkidle' });
      await safeWait(page, 1000);

      const filename = `${bp.name}-${bp.width}x${bp.height}.png`;
      await page.screenshot({
        path: path.join(responsiveDir, filename),
        fullPage: true,
      });

      // Detect layout changes
      const layoutInfo = await page.evaluate(() => {
        const changes: string[] = [];

        // Check if sidebar is visible
        const sidebar = document.querySelector('[class*="sidebar"], aside');
        if (sidebar) {
          const display = getComputedStyle(sidebar).display;
          if (display === 'none') {
            changes.push('Sidebar hidden');
          }
        }

        // Check for hamburger menu
        const hamburger = document.querySelector('[class*="hamburger"], [class*="mobile-menu"]');
        if (hamburger && getComputedStyle(hamburger).display !== 'none') {
          changes.push('Mobile menu visible');
        }

        // Check grid layout
        const grids = document.querySelectorAll('[class*="grid"]');
        grids.forEach(grid => {
          const cols = getComputedStyle(grid).gridTemplateColumns;
          if (cols && cols !== 'none') {
            const colCount = cols.split(' ').length;
            changes.push(`Grid: ${colCount} columns`);
          }
        });

        return changes;
      });

      report.responsiveness.breakpoints.push({
        width: bp.width,
        screenshot: `responsive/${filename}`,
        layoutChanges: layoutInfo,
      });

      console.log(`Captured ${bp.name}: ${layoutInfo.join(', ') || 'No major changes detected'}`);
    }

    // Check mobile navigation specifically
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(REFERENCE_URL, { waitUntil: 'networkidle' });

    // Try to find and click mobile menu
    const mobileMenuBtn = page.locator('[class*="hamburger"], [class*="mobile-menu"], [aria-label*="menu" i]').first();
    if (await mobileMenuBtn.isVisible().catch(() => false)) {
      await mobileMenuBtn.click();
      await safeWait(page, 500);

      await page.screenshot({
        path: path.join(responsiveDir, 'mobile-menu-open.png')
      });

      report.responsiveness.mobileNavigation = 'Hamburger menu';
      console.log('Captured mobile menu');
    }
  });

  test('10. Generate final summary', async ({ page }) => {
    // Just a placeholder - actual summary generated in afterAll
    console.log('\nGenerating summary report...');
  });
});

function generateSummary(report: AnalysisReport): string {
  return `# UI Analysis Report

**URL:** ${report.url}
**Analyzed:** ${report.analyzedAt}

---

## Navigation Structure

- **Type:** ${report.navigation.type}
- **Search:** ${report.navigation.hasSearch ? 'Yes' : 'No'}
- **Mobile Menu:** ${report.navigation.hasMobileMenu ? 'Yes' : 'No'}

### Main Navigation Items
${report.navigation.mainItems.map(item => `- [${item.label}](${item.href})`).join('\n')}

---

## Pages Discovered (${report.pages.length})

${report.pages.map(p => `- **${p.description || p.title}**: \`${p.url}\``).join('\n')}

---

## Design Tokens

### Colors (Top 10)
${report.designTokens.colors.slice(0, 10).map(c =>
  `- \`${c.value}\` (${c.usage}, used ${c.count}x)`
).join('\n')}

### Typography
- **Font Families:** ${report.designTokens.fontFamilies.join(', ')}
- **Font Sizes:** ${report.designTokens.fontSizes.slice(0, 8).join(', ')}
- **Font Weights:** ${report.designTokens.fontWeights.join(', ')}

### Border Radii
${report.designTokens.borderRadii.slice(0, 5).map(r => `- \`${r}\``).join('\n')}

### Shadows
${report.designTokens.shadows.slice(0, 3).map(s => `- \`${s.substring(0, 60)}...\``).join('\n')}

---

## Components Found (${report.components.length})

| Component | Count | Key Styles |
|-----------|-------|------------|
${report.components.map(c =>
  `| ${c.type} | ${c.count} | bg: ${c.styles.backgroundColor?.substring(0, 20)}, radius: ${c.styles.borderRadius} |`
).join('\n')}

---

## Interactions Captured (${report.interactions.length})

${report.interactions.map(i =>
  `- **${i.type}:** ${i.trigger} ${i.description ? `- ${i.description}` : ''}`
).join('\n')}

---

## Input Patterns (${report.inputs.length})

${report.inputs.map(i =>
  `- **${i.type}** ${i.label ? `(${i.label})` : ''}: Recommended → ${i.inputMethod}${i.min || i.max ? ` [${i.min || '?'} - ${i.max || '?'}]` : ''}`
).join('\n')}

---

## Responsiveness

${report.responsiveness.breakpoints.map(bp =>
  `### ${bp.width}px
${bp.layoutChanges.length > 0 ? bp.layoutChanges.map(c => `- ${c}`).join('\n') : '- No major layout changes'}
`).join('\n')}

**Mobile Navigation:** ${report.responsiveness.mobileNavigation || 'Not detected'}

---

## Files Generated

- \`reference-analysis/report.json\` - Complete analysis data
- \`reference-analysis/design-tokens.json\` - Extracted design tokens
- \`reference-analysis/pages/\` - Page screenshots
- \`reference-analysis/components/\` - Component screenshots
- \`reference-analysis/interactions/\` - Interaction state screenshots
- \`reference-analysis/responsive/\` - Responsive breakpoint screenshots
`;
}
