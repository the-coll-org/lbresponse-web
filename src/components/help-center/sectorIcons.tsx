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

function WheatIcon() {
  return (
    <Svg>
      <path d="M12 21V8" />
      <path d="M12 8c0-2 1.5-4 4-4 0 2-1.5 4-4 4Z" />
      <path d="M12 8c0-2-1.5-4-4-4 0 2 1.5 4 4 4Z" />
      <path d="M12 13c0-2 1.5-4 4-4 0 2-1.5 4-4 4Z" />
      <path d="M12 13c0-2-1.5-4-4-4 0 2 1.5 4 4 4Z" />
      <path d="M12 18c0-2 1.5-4 4-4 0 2-1.5 4-4 4Z" />
      <path d="M12 18c0-2-1.5-4-4-4 0 2 1.5 4 4 4Z" />
    </Svg>
  );
}

function HeartShieldIcon() {
  return (
    <Svg>
      <path d="M12 21s-7-4.35-7-10V6l7-3 7 3v5c0 5.65-7 10-7 10z" />
      <path d="M9.5 11a1.7 1.7 0 0 1 2.5-1.4 1.7 1.7 0 0 1 2.5 1.4c0 1.5-2.5 3-2.5 3s-2.5-1.5-2.5-3z" />
    </Svg>
  );
}

function NutritionIcon() {
  return (
    <Svg>
      <path d="M12 4c-3 0-5 3-5 7s2 9 5 9 5-5 5-9-2-7-5-7Z" />
      <path d="M12 4V2" />
      <path d="M9 5l-1-1" />
      <path d="M15 5l1-1" />
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

function HomeShelterIcon() {
  return (
    <Svg>
      <path d="M3 12 12 4l9 8" />
      <path d="M5 11v9h14v-9" />
      <path d="M10 20v-5h4v5" />
      <path d="M9 8h6" />
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

function ShieldCheckIcon() {
  return (
    <Svg>
      <path d="M12 21s-7-4.35-7-10V6l7-3 7 3v5c0 5.65-7 10-7 10z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  );
}

const SECTOR_ICONS: Record<string, ComponentType> = {
  shelter: HomeShelterIcon,
  education: BookIcon,
  'food-security-agriculture': WheatIcon,
  nutrition: NutritionIcon,
  gbv: HeartShieldIcon,
  protection: ShieldIcon,
  'social-stability': PeopleIcon,
  livelihoods: BriefcaseIcon,
  wash: WaterDropIcon,
  cwg: CashIcon,
  'child-protection': ShieldCheckIcon,
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
