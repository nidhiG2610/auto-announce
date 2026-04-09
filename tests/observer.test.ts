function getLiveRegion(politeness: 'polite' | 'assertive'): HTMLElement | null {
  return document.querySelector(
    `[data-a11y-craft="live-region"][aria-live="${politeness}"]`,
  );
}

async function wait(ms = 100): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

function addElement(html: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  const child = wrapper.firstElementChild as HTMLElement;
  document.body.appendChild(child);
  return child;
}

beforeEach(() => {
  jest.resetModules();
  document.body.innerHTML = '';
  // Fresh module load — triggers auto-init
  require('../src/index');
});

afterEach(() => {
  const { stopAutoAnnounce } = require('../src/index');
  stopAutoAnnounce();
});

describe('auto-announce observer', () => {
  it('announces role="alert" assertively', async () => {
    addElement('<div role="alert">Session expiring.</div>');
    await wait();
    expect(getLiveRegion('assertive')?.textContent).toBe('Session expiring.');
  });

  it('announces role="status" politely', async () => {
    addElement('<div role="status">File saved.</div>');
    await wait();
    expect(getLiveRegion('polite')?.textContent).toBe('File saved.');
  });

  it('announces .toast elements', async () => {
    addElement('<div class="toast">Changes saved.</div>');
    await wait();
    expect(getLiveRegion('polite')?.textContent).toBe('Changes saved.');
  });

  it('announces .notification elements', async () => {
    addElement('<div class="notification">3 new messages.</div>');
    await wait();
    expect(getLiveRegion('polite')?.textContent).toBe('3 new messages.');
  });

  it('announces .banner elements', async () => {
    addElement('<div class="banner">Maintenance tonight.</div>');
    await wait();
    expect(getLiveRegion('polite')?.textContent).toBe('Maintenance tonight.');
  });

  it('announces .snackbar elements', async () => {
    addElement('<div class="snackbar">Item deleted.</div>');
    await wait();
    expect(getLiveRegion('polite')?.textContent).toBe('Item deleted.');
  });

  it('announces [data-announce] elements', async () => {
    addElement('<div data-announce>Custom announcement.</div>');
    await wait();
    expect(getLiveRegion('polite')?.textContent).toBe('Custom announcement.');
  });

  it('skips elements that already have aria-live', async () => {
    addElement('<div class="toast" aria-live="polite">Already handled.</div>');
    await wait();
    expect(getLiveRegion('polite')?.textContent ?? '').toBe('');
  });

  it('skips elements with no text content', async () => {
    addElement('<div class="toast"></div>');
    await wait();
    expect(getLiveRegion('polite')?.textContent ?? '').toBe('');
  });

  it('uses aria-label when present', async () => {
    addElement('<div role="status" aria-label="Upload complete"></div>');
    await wait();
    expect(getLiveRegion('polite')?.textContent).toBe('Upload complete');
  });

  it('announces nested matching elements inside added nodes', async () => {
    addElement('<div><div class="toast">Nested toast.</div></div>');
    await wait();
    expect(getLiveRegion('polite')?.textContent).toBe('Nested toast.');
  });

  it('suppresses duplicate messages within dedupe window', async () => {
    addElement('<div class="toast">Saved.</div>');
    await wait(50);
    addElement('<div class="toast">Saved.</div>');
    await wait(50);
    expect(getLiveRegion('polite')?.textContent).toBe('Saved.');
  });
});
