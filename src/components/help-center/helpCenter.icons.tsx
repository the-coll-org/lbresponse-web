/* eslint-disable react-refresh/only-export-components */
import { SvgIcon } from '../ui/SvgIcon';
import waterSvg from '../../assets/help-center/water.svg?raw';
import shieldSvg from '../../assets/help-center/shield.svg?raw';
import sirenSvg from '../../assets/help-center/siren.svg?raw';
import crossSvg from '../../assets/help-center/cross.svg?raw';
import filterSvg from '../../assets/help-center/filter.svg?raw';
import filterLocationSvg from '../../assets/help-center/filter-location.svg?raw';
import filterProviderSvg from '../../assets/help-center/filter-provider.svg?raw';
import filterCategorySvg from '../../assets/help-center/filter-category.svg?raw';
import searchSvg from '../../assets/help-center/search.svg?raw';
import chevronDownSvg from '../../assets/help-center/chevron-down.svg?raw';
import phoneSvg from '../../assets/help-center/phone.svg?raw';
import whatsappSvg from '../../assets/help-center/whatsapp.svg?raw';
import pinSvg from '../../assets/help-center/pin.svg?raw';
import arrowUpSvg from '../../assets/help-center/arrow-up.svg?raw';

function WaterIcon() {
  return <SvgIcon svg={waterSvg} className="size-24" />;
}

function ShieldIcon() {
  return <SvgIcon svg={shieldSvg} className="size-24" />;
}

function SirenIcon() {
  return <SvgIcon svg={sirenSvg} className="size-24" />;
}

function CrossIcon() {
  return <SvgIcon svg={crossSvg} className="size-24" />;
}

function FilterIcon() {
  return <SvgIcon svg={filterSvg} className="size-24" />;
}

function SearchIcon() {
  return <SvgIcon svg={searchSvg} className="size-16" />;
}

function ChevronDownIcon() {
  return <SvgIcon svg={chevronDownSvg} className="size-16" />;
}

function PhoneIcon() {
  return <SvgIcon svg={phoneSvg} className="size-16" />;
}

function WhatsappIcon() {
  return <SvgIcon svg={whatsappSvg} className="size-16" />;
}

function PinIcon() {
  return <SvgIcon svg={pinSvg} className="size-16" />;
}

function FilledPinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 12 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 15.25V11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 11.25C11.161 10.551 10.932 9.49 10.281 8.375C9.946 7.801 9.578 7.347 9.25 7V2.75C9.25 1.645 8.355 0.75 7.25 0.75H4.75C3.645 0.75 2.75 1.645 2.75 2.75V7C2.421 7.347 2.053 7.801 1.719 8.375C1.069 9.49 0.839004 10.551 0.750004 11.25H11.25Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VerifyIcon() {
  return <SvgIcon svg={shieldSvg} className="size-16" />;
}

function ArrowUpIcon() {
  return <SvgIcon svg={arrowUpSvg} className="size-24" />;
}

function SmallPinIcon() {
  return <SvgIcon svg={filterLocationSvg} className="size-16" />;
}

function SmallShieldIcon() {
  return <SvgIcon svg={filterProviderSvg} className="size-16" />;
}

function SmallPhoneIcon() {
  return <SvgIcon svg={filterCategorySvg} className="size-16" />;
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6 9 4l6 2 6-2v14l-6 2-6-2-6 2z" />
      <path d="M9 4v16" />
      <path d="M15 6v16" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3c0 5.21 4.23 9.44 9.44 9.79z" />
    </svg>
  );
}

export const helpCenterIcons = {
  water: WaterIcon,
  shield: ShieldIcon,
  siren: SirenIcon,
  cross: CrossIcon,
  filter: FilterIcon,
  search: SearchIcon,
  chevronDown: ChevronDownIcon,
  phone: PhoneIcon,
  whatsapp: WhatsappIcon,
  pin: PinIcon,
  pinFilled: FilledPinIcon,
  verify: VerifyIcon,
  arrowUp: ArrowUpIcon,
  smallPin: SmallPinIcon,
  smallShield: SmallShieldIcon,
  smallPhone: SmallPhoneIcon,
  sun: SunIcon,
  moon: MoonIcon,
  mail: MailIcon,
  map: MapIcon,
} as const;
