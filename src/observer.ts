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

  // Check its descendants — use for loop instead of NodeList.forEach for broader compat
  const descendants = el.querySelectorAll(selectors.join(','));
  for (let i = 0; i < descendants.length; i++) {
    checkElement(descendants[i], selectors, ignoreSelectors, politenessOverride);
  }
}

export function startObserver(options: AutoAnnounceOptions = {}): void {
  if (typeof document === 'undefined') return;
  if (observer) return; // already running

  const MAX_CUSTOM_SELECTORS = 20;
  const customSelectors = (options.selectors ?? []).slice(0, MAX_CUSTOM_SELECTORS);
  const selectors = [...DEFAULT_SELECTORS, ...customSelectors];
  const ignoreSelectors = (options.ignore ?? []).slice(0, MAX_CUSTOM_SELECTORS);
  const politenessOverride = options.politeness;

  observer = new MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const added = mutations[i].addedNodes;
      for (let j = 0; j < added.length; j++) {
        walkTree(added[j], selectors, ignoreSelectors, politenessOverride);
      }
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
