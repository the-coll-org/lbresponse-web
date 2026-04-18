import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ToastProvider } from '../../context/ToastContext';
import '../../i18n';
import HelpCenterScreen from '../HelpCenterScreen';

describe('HelpCenterScreen', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    (
      globalThis as typeof globalThis & {
        IS_REACT_ACT_ENVIRONMENT?: boolean;
      }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: false,
        media: '(min-width: 768px)',
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });

    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    document.body.innerHTML = '';
  });

  it('opens the replacement sheet on the first press when trying to pin beyond five organizations', () => {
    act(() => {
      root.render(
        <ToastProvider>
          <HelpCenterScreen
            theme="light"
            onToggleTheme={() => undefined}
            onToggleLanguage={() => undefined}
          />
        </ToastProvider>
      );
    });

    const clickFirstPinButton = () => {
      const button = document.body.querySelector<HTMLButtonElement>(
        'button[aria-label="Pin organization"]'
      );

      if (!button) throw new Error('Missing pin button');

      act(() => {
        button.click();
      });
    };

    clickFirstPinButton();
    clickFirstPinButton();
    clickFirstPinButton();
    clickFirstPinButton();

    const loadMoreButton = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent?.includes('Show more'));

    act(() => {
      loadMoreButton?.click();
    });

    clickFirstPinButton();
    clickFirstPinButton();

    expect(document.body.textContent).toContain('Replace pinned organization');
  });
});
