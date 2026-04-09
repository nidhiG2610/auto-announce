# @a11y_craft/auto-announce

> Zero-config screen reader announcements. Import once — VoiceOver, NVDA, TalkBack and Narrator just work.

[![npm version](https://img.shields.io/npm/v/@a11y_craft/auto-announce)](https://www.npmjs.com/package/@a11y_craft/auto-announce)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@a11y_craft/auto-announce)](https://bundlephobia.com/package/@a11y_craft/auto-announce)
[![license](https://img.shields.io/npm/l/@a11y_craft/auto-announce)](./LICENSE)

---

## The Problem

Most apps have toasts, banners, and notifications that sighted users can see — but screen reader users never hear. Making them accessible requires manually wiring up `aria-live` regions, managing politeness levels, and handling timing quirks across different screen readers.

That's a lot of work. Most teams skip it.

**`@a11y_craft/auto-announce` does it for you.**

---

## How It Works

The package silently watches your DOM using a `MutationObserver`. When a notification, toast, banner, or alert appears, it automatically reads it aloud to screen reader users — with no extra code required from you or your team.

---

## Install

```bash
npm install @a11y_craft/auto-announce
# or
yarn add @a11y_craft/auto-announce
# or
pnpm add @a11y_craft/auto-announce
```

---

## Usage

Add one import to your app entry point and you're done.

```js
// main.js / index.js / App.tsx — just once, anywhere at the top
import '@a11y_craft/auto-announce';
```

That's it. No setup. No providers. No function calls. Your entire app is now more accessible.

---

## What Gets Announced Automatically

The package detects notifications by their ARIA roles, class names, and data attributes:

| Element | Detected by | Politeness |
|---------|------------|------------|
| `<div role="alert">` | ARIA role | Assertive (interrupts) |
| `<div role="status">` | ARIA role | Polite |
| `<div role="log">` | ARIA role | Polite |
| `<div class="toast">` | Class name | Polite |
| `<div class="notification">` | Class name | Polite |
| `<div class="banner">` | Class name | Polite |
| `<div class="snackbar">` | Class name | Polite |
| `<div class="flash">` | Class name | Polite |
| `<div data-announce>` | Data attribute | Polite |

Elements that already have `aria-live` set are skipped — no double-announcing.

---

## Framework Examples

### React

```tsx
// index.tsx
import '@a11y_craft/auto-announce';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

Now every toast, alert, or notification in your React app is automatically announced.

```tsx
// Somewhere in your app — no extra code needed
function saveFile() {
  await upload();
  showToast('File uploaded successfully.'); // ← screen readers hear this automatically
}
```

### Vue

```js
// main.js
import '@a11y_craft/auto-announce';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

### Svelte

```js
// main.js
import '@a11y_craft/auto-announce';
import App from './App.svelte';

new App({ target: document.body });
```

### Vanilla JS / HTML

```html
<script type="module">
  import '@a11y_craft/auto-announce';
</script>
```

---

## Custom Configuration

No configuration is needed for most apps. For advanced use cases:

```js
import { autoAnnounce } from '@a11y_craft/auto-announce';

autoAnnounce({
  // Add your own selectors on top of the defaults
  selectors: ['.my-custom-toast', '[data-notify]'],

  // Never announce these, even if they match
  ignore: ['.silent-banner', '.marketing-popup'],

  // Override politeness for all announcements
  politeness: 'assertive',
});
```

---

## Stopping the Observer

Useful for cleanup in tests or single-page app teardown:

```js
import { stopAutoAnnounce } from '@a11y_craft/auto-announce';

stopAutoAnnounce();
```

---

## Screen Reader Support

Tested against the most widely used screen reader and browser combinations:

| Screen Reader | Browser | Support |
|---|---|---|
| NVDA | Firefox | ✅ |
| JAWS | Chrome | ✅ |
| VoiceOver | Safari (macOS) | ✅ |
| VoiceOver | Safari (iOS) | ✅ |
| TalkBack | Chrome (Android) | ✅ |
| Narrator | Edge (Windows) | ✅ |

---

## WCAG Compliance

Helps satisfy [WCAG 2.2 — Success Criterion 4.1.3: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html), which requires that status messages be announced to screen readers without receiving focus.

---

## Zero Dependencies

No runtime dependencies. The package is self-contained and uses only native browser APIs (`MutationObserver`, `aria-live`).

---

## TypeScript

Full TypeScript support out of the box:

```ts
import { autoAnnounce } from '@a11y_craft/auto-announce';
import type { AutoAnnounceOptions } from '@a11y_craft/auto-announce';

const options: AutoAnnounceOptions = {
  selectors: ['.my-toast'],
  ignore: ['.quiet'],
};

autoAnnounce(options);
```

---

## License

MIT © [Nidhi Gajera](https://github.com/nidhiG2610)
