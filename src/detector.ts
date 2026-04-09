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
  // Skip if the element itself has aria-live
  if (el.hasAttribute('aria-live')) return true;
  // Walk up the tree manually — el.closest() not available in IE11
  let parent = el.parentElement;
  while (parent) {
    if (parent.hasAttribute('aria-live')) return true;
    parent = parent.parentElement;
  }
  return false;
}

export function extractText(el: Element): string {
  // Prefer aria-label, then aria-labelledby, then textContent
  const label = el.getAttribute('aria-label');
  if (label) return label.trim();

  const labelledBy = el.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelEl = document.getElementById(labelledBy);
    // Only read from elements that are descendants of the notification itself
    // or siblings — never from arbitrary page elements to prevent announcing
    // unintended sensitive content
    if (labelEl && el.contains(labelEl)) {
      return labelEl.textContent?.trim() ?? '';
    }
  }

  return el.textContent?.trim() ?? '';
}

export function matchesSelectors(el: Element, selectors: string[]): boolean {
  // Support IE11's vendor-prefixed version
  const matchFn: ((sel: string) => boolean) | undefined =
    el.matches?.bind(el) ??
    (el as Element & { msMatchesSelector?: (s: string) => boolean }).msMatchesSelector?.bind(el);

  if (!matchFn) return false;

  return selectors.some((sel) => {
    try {
      return matchFn(sel);
    } catch {
      return false;
    }
  });
}
