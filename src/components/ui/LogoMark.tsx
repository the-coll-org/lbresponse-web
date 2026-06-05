import type { HTMLAttributes } from 'react';
import markUrl from '../../assets/crn-mark.png';

export type LogoMarkProps = HTMLAttributes<HTMLSpanElement>;

export function LogoMark({ className = '', ...props }: LogoMarkProps) {
  // White tile gives the dark, multi-color CRN mark the contrast it needs on
  // the navy header.
  return (
    <span
      className={[
        'inline-flex items-center justify-center bg-solid-white-400 overflow-hidden',
        className,
      ].join(' ')}
      {...props}
    >
      <img
        src={markUrl}
        alt="CRN — The Collective Relief Network"
        className="size-[80%] object-contain"
        draggable={false}
      />
    </span>
  );
}
