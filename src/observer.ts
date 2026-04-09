import { announce } from './announcer';
import {
  DEFAULT_SELECTORS,
  alreadyHasLiveRegion,
  extractText,
  getPoliteness,
  isVisible,
  matchesSelectors,
} from './detector';
import { AutoAnnounceOptions, Politeness } from './types';

let observer: MutationObserver | null = null;

function checkElement(
  el: Element,
  selectors: string[],
  ignoreSelectors: string[],
  politenessOverride?: Politeness,
): void {
  // Skip if already handled by aria-live
  if (alreadyHasLiveRegion(el)) return;

  // Skip ignored selectors
  if (ignoreSelectors.length > 0 && matchesSelectors(el, ignoreSelectors)) return;

  // Must match one of our selectors
  if (!matchesSelectors(el, selectors)) return;

  // Must be visible
  if (!isVisible(el)) return;

  const text = extractText(el);
  if (!text) return;

  const politeness = politenessOverride ?? getPoliteness(el);
  announce(text, politeness);
}

function walkTree(
  node: Node,
  selectors: string[],
  ignoreSelectors: string[],
  politenessOverride?: Politeness,
): void {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const el = node as Element;

  // Check the node itself
  checkElement(el, selectors, ignoreSelectors, politenessOverride);

  // Check its descendants
  const descendants = el.querySelectorAll(selectors.join(','));
  descendants.forEach((child) =>
    checkElement(child, selectors, ignoreSelectors, politenessOverride),
  );
}

export function startObserver(options: AutoAnnounceOptions = {}): void {
  if (typeof document === 'undefined') return;
  if (observer) return; // already running

  const selectors = [...DEFAULT_SELECTORS, ...(options.selectors ?? [])];
  const ignoreSelectors = options.ignore ?? [];
  const politenessOverride = options.politeness;

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) =>
        walkTree(node, selectors, ignoreSelectors, politenessOverride),
      );
    }
  });

  observer.observe(document.body ?? document.documentElement, {
    childList: true,
    subtree: true,
  });
}

export function stopObserver(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}
