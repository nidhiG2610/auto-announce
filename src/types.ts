export type Politeness = 'polite' | 'assertive';

export interface AutoAnnounceOptions {
  /** Additional CSS selectors to watch. Merged with defaults. */
  selectors?: string[];
  /** Elements matching these selectors will never be announced. */
  ignore?: string[];
  /** Override politeness for all announcements. */
  politeness?: Politeness;
}
