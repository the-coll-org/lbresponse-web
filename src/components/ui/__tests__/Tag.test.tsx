import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tag } from '../Tag';

describe('Tag', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    document.documentElement.removeAttribute('dir');
  });

  it('renders the tag label', () => {
    act(() => {
      root.render(<Tag>ملصق</Tag>);
    });

    expect(container.textContent).toContain('ملصق');
  });

  it('renders optional leading and trailing icons', () => {
    act(() => {
      root.render(
        <Tag
          leadingIcon={<span data-testid="leading-icon">L</span>}
          trailingIcon={<span data-testid="trailing-icon">T</span>}
        >
          Label
        </Tag>
      );
    });

    expect(
      container.querySelector('[data-testid="leading-icon"]')
    ).not.toBeNull();
    expect(
      container.querySelector('[data-testid="trailing-icon"]')
    ).not.toBeNull();
  });

  it('renders the clear action only when onClear is provided', () => {
    act(() => {
      root.render(<Tag>Label</Tag>);
    });

    expect(
      container.querySelector('button[aria-label="Clear tag"]')
    ).toBeNull();

    act(() => {
      root.render(<Tag onClear={() => undefined}>Label</Tag>);
    });

    expect(
      container.querySelector('button[aria-label="Clear tag"]')
    ).not.toBeNull();
  });

  it('invokes onClear when the clear button is clicked', () => {
    const onClear = vi.fn();

    act(() => {
      root.render(<Tag onClear={onClear}>Label</Tag>);
    });

    const clearButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Clear tag"]'
    );

    expect(clearButton).not.toBeNull();

    act(() => {
      clearButton?.click();
    });

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('keeps Arabic content accessible in RTL layouts', () => {
    document.documentElement.setAttribute('dir', 'rtl');

    act(() => {
      root.render(<Tag onClear={() => undefined}>ملصق</Tag>);
    });

    expect(container.textContent).toContain('ملصق');
    expect(
      container.querySelector('button[aria-label="Clear tag"]')
    ).not.toBeNull();
  });
});
