import { startObserver, stopObserver } from './observer';
import { AutoAnnounceOptions } from './types';

export type { AutoAnnounceOptions } from './types';

/**
 * Manually configure and start auto-announce with custom options.
 * Only needed if you want to override defaults.
 *
 * @example
 * import { autoAnnounce } from '@a11y_craft/auto-announce';
 * autoAnnounce({ selectors: ['.my-toast'], ignore: ['.silent'] });
 */
export function autoAnnounce(options: AutoAnnounceOptions = {}): void {
  startObserver(options);
}

/**
 * Stop observing the DOM. Useful for cleanup in tests or unmounting.
 */
export { stopObserver as stopAutoAnnounce };

// ─── Auto-initialize on import ───────────────────────────────────────────────
// This is the magic — just importing this package starts the observer.
// Works with DOMContentLoaded so it's safe to import at the top of any file.
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => startObserver());
  } else {
    startObserver();
  }
}
