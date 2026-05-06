import type { ComponentType, SVGProps } from 'react';

const STROKE: SVGProps<SVGSVGElement> = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" {...STROKE} aria-hidden="true">
      {children}
    </svg>
  );
}

function BookIcon() {
  return (
    <Svg>
      <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 5v14" />
      <path d="M8 7h7" />
      <path d="M8 11h7" />
    </Svg>
  );
}

function ForkKnifeIcon() {
  return (
    <Svg>
      <path d="M7 3v8a2 2 0 0 0 2 2" />
      <path d="M9 3v18" />
      <path d="M5 3v6" />
      <path d="M17 3c-1.5 0-3 1.5-3 4s1.5 4 3 4" />
      <path d="M17 3v18" />
    </Svg>
  );
}

function HeartCrossIcon() {
  return (
    <Svg>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
      <path d="M12 9.5v4" />
      <path d="M10 11.5h4" />
    </Svg>
  );
}

function AppleIcon() {
  return (
    <Svg>
      <path d="M16.5 3.5c-1.6 0-2.9 1-3.5 2-.6-1-1.9-2-3.5-2C7 3.5 4 6 4 10s4 11 8 11 8-7 8-11-3-6.5-3.5-6.5Z" />
      <path d="M12 5.5c0-1.5 1-3 2.5-3" />
    </Svg>
  );
}

function BriefcaseIcon() {
  return (
    <Svg>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </Svg>
  );
}

function ShieldIcon() {
  return (
    <Svg>
      <path d="M12 21s-7-4.35-7-10V6l7-3 7 3v5c0 5.65-7 10-7 10z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  );
}

function HouseIcon() {
  return (
    <Svg>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M10 20v-5h4v5" />
    </Svg>
  );
}

function PeopleIcon() {
  return (
    <Svg>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c0-3.5 3-6 6-6s6 2.5 6 6" />
      <path d="M14 20c0-2.5 1.5-4.5 4-4.5S22 17.5 22 20" />
    </Svg>
  );
}

function WaterDropIcon() {
  return (
    <Svg>
      <path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11Z" />
      <path d="M9 14a3 3 0 0 0 3 3" />
    </Svg>
  );
}

function CashIcon() {
  return (
    <Svg>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9h.01M18 15h.01" />
    </Svg>
  );
}

function TshirtIcon() {
  return (
    <Svg>
      <path d="M9 3 6.5 5 4 7l1.5 3L8 9v11h8V9l2.5 1L20 7l-2.5-2L15 3" />
      <path d="M9 3a3 3 0 0 0 6 0" />
    </Svg>
  );
}

const SECTOR_ICONS: Record<string, ComponentType> = {
  shelter: HouseIcon,
  education: BookIcon,
  'food-security-agriculture': ForkKnifeIcon,
  nutrition: AppleIcon,
  gbv: HeartCrossIcon,
  protection: ShieldIcon,
  'social-stability': PeopleIcon,
  livelihoods: BriefcaseIcon,
  wash: WaterDropIcon,
  cwg: CashIcon,
  clothing: TshirtIcon,
  'child-protection': HeartCrossIcon,
};

function slugifySector(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function SectorIcon({ sector }: { sector: string | null | undefined }) {
  const key = sector ? slugifySector(sector) : '';
  const Icon = SECTOR_ICONS[key] ?? ShieldIcon;
  return <Icon />;
}
