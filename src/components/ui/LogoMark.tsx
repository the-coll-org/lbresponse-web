import type { SVGProps } from 'react';

export interface LogoMarkProps extends SVGProps<SVGSVGElement> {
  /** Render mode: inverse shows a white tile with navy letters (for dark headers). */
  tone?: 'brand' | 'inverse';
}

export function LogoMark({
  tone = 'brand',
  className = '',
  ...props
}: LogoMarkProps) {
  const bg = tone === 'inverse' ? '#fcfbfa' : '#2e4369';
  const fg = tone === 'inverse' ? '#2e4369' : '#fcfbfa';

  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="LB Response"
      className={className}
      {...props}
    >
      <rect width="64" height="64" rx="14" fill={bg} />
      <text
        x="50%"
        y="50%"
        dy="0.36em"
        textAnchor="middle"
        fontFamily="Roboto, system-ui, -apple-system, sans-serif"
        fontSize="30"
        fontWeight="700"
        fill={fg}
        letterSpacing="-1"
      >
        LB
      </text>
    </svg>
  );
}
