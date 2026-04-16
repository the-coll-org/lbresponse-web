import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BottomSheet } from '../BottomSheet';

describe('BottomSheet', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;
  let desktopMatches = false;

  function installMatchMediaMock() {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: desktopMatches,
        media: '(min-width: 768px)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  beforeEach(() => {
    desktopMatches = false;
    installMatchMediaMock();
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

  it('does not render when closed', () => {
    act(() => {
      root.render(
        <BottomSheet
          open={false}
          title="القيمة"
          secondaryActionLabel="ملصق"
          primaryActionLabel="ملصق"
          onOpenChange={() => undefined}
        />
      );
    });

    expect(document.body.textContent).not.toContain('القيمة');
  });

  it('renders the sheet content when open', () => {
    act(() => {
      root.render(
        <BottomSheet
          open
          title="القيمة"
          description="السطر 2"
          secondaryActionLabel="ملصق"
          primaryActionLabel="ملصق"
          onOpenChange={() => undefined}
        >
          <div>Body content</div>
        </BottomSheet>
      );
    });

    expect(document.body.textContent).toContain('القيمة');
    expect(document.body.textContent).toContain('السطر 2');
    expect(document.body.textContent).toContain('Body content');
  });

  it('renders as a full-width bottom sheet on mobile', () => {
    act(() => {
      root.render(
        <BottomSheet
          open
          title="القيمة"
          secondaryActionLabel="ملصق"
          primaryActionLabel="ملصق"
          onOpenChange={() => undefined}
        />
      );
    });

    const overlay = document.body.querySelector('[data-layout="bottom-sheet"]');
    const dialog = document.body.querySelector('[role="dialog"]');

    expect(overlay?.className).toContain('items-end');
    expect(dialog?.className).toContain('w-full');
    expect(dialog?.className).toContain('rounded-t-2xl');
  });

  it('renders as a centered popup on desktop', () => {
    desktopMatches = true;
    installMatchMediaMock();

    act(() => {
      root.render(
        <BottomSheet
          open
          title="القيمة"
          secondaryActionLabel="ملصق"
          primaryActionLabel="ملصق"
          onOpenChange={() => undefined}
        />
      );
    });

    const overlay = document.body.querySelector('[data-layout="popup"]');
    const dialog = document.body.querySelector('[role="dialog"]');

    expect(overlay?.className).toContain('items-center');
    expect(dialog?.className).toContain('w-[390px]');
    expect(dialog?.className).toContain('rounded-2xl');
    expect(document.body.querySelector('.h-6.w-48')).toBeNull();
  });

  it('calls onOpenChange when the close button is clicked', () => {
    const onOpenChange = vi.fn();

    act(() => {
      root.render(
        <BottomSheet
          open
          title="القيمة"
          secondaryActionLabel="ملصق"
          primaryActionLabel="ملصق"
          onOpenChange={onOpenChange}
        />
      );
    });

    const closeButton = document.body.querySelector(
      'button[aria-label="Close bottom sheet"]'
    );

    act(() => {
      closeButton?.click();
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange when escape is pressed', () => {
    const onOpenChange = vi.fn();

    act(() => {
      root.render(
        <BottomSheet
          open
          title="القيمة"
          secondaryActionLabel="ملصق"
          primaryActionLabel="ملصق"
          onOpenChange={onOpenChange}
        />
      );
    });

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Escape',
        })
      );
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders the primary action as disabled when requested', () => {
    act(() => {
      root.render(
        <BottomSheet
          open
          title="القيمة"
          secondaryActionLabel="ملصق"
          primaryActionLabel="ملصق"
          primaryDisabled
          onOpenChange={() => undefined}
        />
      );
    });

    const buttons = Array.from(document.body.querySelectorAll('button'));
    const primaryButton = buttons.find(
      (button) =>
        button.textContent?.trim() === 'ملصق' && button.hasAttribute('disabled')
    );

    expect(primaryButton).toBeDefined();
  });
});
