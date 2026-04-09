import { Politeness } from './types';

const DEDUPE_MS = 500;
const MAX_MESSAGE_LENGTH = 10_000;

let politeRegion: HTMLElement | null = null;
let assertiveRegion: HTMLElement | null = null;
const recentMessages = new Map<string, number>();

function createRegion(politeness: Politeness): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  el.setAttribute('aria-live', politeness);
  el.setAttribute('aria-atomic', 'true');
  el.setAttribute('data-a11y-craft', 'live-region');
  el.style.position = 'absolute';
  el.style.width = '1px';
  el.style.height = '1px';
  el.style.padding = '0';
  el.style.margin = '-1px';
  el.style.overflow = 'hidden';
  el.style.clip = 'rect(0,0,0,0)';
  el.style.whiteSpace = 'nowrap';
  el.style.border = '0';
  const target = document.body ?? document.documentElement;
  target.appendChild(el);
  return el;
}

function ensureRegions(): void {
  if (!politeRegion) politeRegion = createRegion('polite');
  if (!assertiveRegion) assertiveRegion = createRegion('assertive');
}

function isDuplicate(message: string): boolean {
  const now = Date.now();
  const last = recentMessages.get(message);
  if (last !== undefined && now - last < DEDUPE_MS) return true;
  if (recentMessages.size >= 200) {
    const oldest = recentMessages.keys().next().value;
    if (oldest !== undefined) recentMessages.delete(oldest);
  }
  recentMessages.set(message, now);
  return false;
}

export function announce(message: string, politeness: Politeness = 'polite'): void {
  if (typeof document === 'undefined') return;
  if (!message || typeof message !== 'string') return;

  const safe = message.length > MAX_MESSAGE_LENGTH ? message.slice(0, MAX_MESSAGE_LENGTH) : message;
  if (isDuplicate(safe)) return;

  ensureRegions();
  let el = politeness === 'assertive' ? assertiveRegion! : politeRegion!;

  // If the region was removed from the DOM (e.g. innerHTML reset), recreate it
  // Use ownerDocument.contains() instead of isConnected for broader browser support
  if (!el.ownerDocument || !el.ownerDocument.documentElement.contains(el)) {
    if (politeness === 'assertive') {
      assertiveRegion = createRegion('assertive');
      el = assertiveRegion;
    } else {
      politeRegion = createRegion('polite');
      el = politeRegion;
    }
  }

  el.textContent = '';
  setTimeout(() => { el.textContent = safe; }, 0);
}
