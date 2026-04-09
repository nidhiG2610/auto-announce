import { Politeness } from './types';

export const DEFAULT_SELECTORS = [
  '[role="alert"]',
  '[role="status"]',
  '[role="log"]',
  '.toast',
  '.toast-message',
  '.notification',
  '.banner',
  '.alert',
  '.snackbar',
  '.flash',
  '.flash-message',
  '[data-announce]',
  '[data-notification]',
  '[data-toast]',
];

export function getPoliteness(el: Element): Politeness {
  const role = el.getAttribute('role');
  return role === 'alert' ? 'assertive' : 'polite';
}

export function isVisible(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

export function alreadyHasLiveRegion(el: Element): boolean {
  // Skip if the element itself or any ancestor is already an aria-live region
  return el.hasAttribute('aria-live') || !!el.closest('[aria-live]');
}

export function extractText(el: Element): string {
  // Prefer aria-label, then aria-labelledby, then textContent
  const label = el.getAttribute('aria-label');
  if (label) return label.trim();

  const labelledBy = el.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    if (labelEl) return labelEl.textContent?.trim() ?? '';
  }

  return el.textContent?.trim() ?? '';
}

export function matchesSelectors(el: Element, selectors: string[]): boolean {
  return selectors.some((sel) => {
    try {
      return el.matches(sel);
    } catch {
      return false;
    }
  });
}
