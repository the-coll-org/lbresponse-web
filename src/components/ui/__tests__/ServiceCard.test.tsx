import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ServiceCard } from '../ServiceCard';

describe('ServiceCard', () => {
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
  });

  it('renders the main card content', () => {
    act(() => {
      root.render(
        <ServiceCard
          title="وزارة الصحة"
          category="حكومي"
          description="الخدمات الصحية والاستشارات الطبية"
          locations="بيروت، طرابلس، صيدا"
          actionLabel="اتصل 1900"
        />
      );
    });

    expect(container.textContent).toContain('وزارة الصحة');
    expect(container.textContent).toContain('حكومي');
    expect(container.textContent).toContain(
      'الخدمات الصحية والاستشارات الطبية'
    );
    expect(container.textContent).toContain('اتصل 1900');
  });

  it('renders action buttons when provided', () => {
    act(() => {
      root.render(
        <ServiceCard
          title="وزارة الصحة"
          actionLabel="اتصل 1900"
          primaryAction={{
            ariaLabel: 'Pin service',
            icon: <span>P</span>,
          }}
          secondaryAction={{
            ariaLabel: 'Verify service',
            icon: <span>V</span>,
            variant: 'outline',
          }}
        />
      );
    });

    expect(
      container.querySelector('button[aria-label="Pin service"]')
    ).not.toBeNull();
    expect(
      container.querySelector('button[aria-label="Verify service"]')
    ).not.toBeNull();
  });

  it('invokes callbacks for the card actions', () => {
    const onPrimaryClick = vi.fn();
    const onSecondaryClick = vi.fn();
    const onActionClick = vi.fn();

    act(() => {
      root.render(
        <ServiceCard
          title="وزارة الصحة"
          actionLabel="اتصل 1900"
          onActionClick={onActionClick}
          primaryAction={{
            ariaLabel: 'Pin service',
            icon: <span>P</span>,
            onClick: onPrimaryClick,
          }}
          secondaryAction={{
            ariaLabel: 'Verify service',
            icon: <span>V</span>,
            onClick: onSecondaryClick,
          }}
        />
      );
    });

    const [primaryButton, secondaryButton, ctaButton] = Array.from(
      container.querySelectorAll('button')
    );

    act(() => {
      primaryButton?.click();
      secondaryButton?.click();
      ctaButton?.click();
    });

    expect(onPrimaryClick).toHaveBeenCalledTimes(1);
    expect(onSecondaryClick).toHaveBeenCalledTimes(1);
    expect(onActionClick).toHaveBeenCalledTimes(1);
  });

  it('respects explicit text direction', () => {
    act(() => {
      root.render(
        <ServiceCard
          title="Ministry of Health"
          actionLabel="Call 1900"
          dir="ltr"
        />
      );
    });

    const card = container.firstElementChild as HTMLDivElement | null;

    expect(card?.getAttribute('dir')).toBe('ltr');
  });
});
