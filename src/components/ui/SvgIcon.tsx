import type { CSSProperties } from 'react';

interface SvgIconProps {
  svg: string;
  className?: string;
  title?: string;
  style?: CSSProperties;
}

export function SvgIcon({ svg, className = '', title, style }: SvgIconProps) {
  const baseSvgAttrs =
    'width="100%" height="100%" preserveAspectRatio="xMidYMid meet" focusable="false"';
  const markup = title
    ? svg.replace(
        '<svg ',
        `<svg ${baseSvgAttrs} aria-label="${title}" role="img" `
      )
    : svg.replace('<svg ', `<svg ${baseSvgAttrs} aria-hidden="true" `);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center leading-none ${className}`.trim()}
      style={style}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
