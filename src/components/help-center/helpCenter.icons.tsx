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

function GlobeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 15.75C9.88642 15.75 10.7642 15.5754 11.5831 15.2362C12.4021 14.897 13.1462 14.3998 13.773 13.773C14.3998 13.1462 14.897 12.4021 15.2362 11.5831C15.5754 10.7642 15.75 9.88642 15.75 9C15.75 8.11358 15.5754 7.23583 15.2362 6.41689C14.897 5.59794 14.3998 4.85382 13.773 4.22703C13.1462 3.60023 12.4021 3.10303 11.5831 2.76381C10.7642 2.42459 9.88642 2.25 9 2.25M9 15.75C8.11358 15.75 7.23583 15.5754 6.41689 15.2362C5.59794 14.897 4.85382 14.3998 4.22703 13.773C3.60023 13.1462 3.10303 12.4021 2.76381 11.5831C2.42459 10.7642 2.25 9.88642 2.25 9C2.25 8.11358 2.42459 7.23583 2.76381 6.41689C3.10303 5.59794 3.60023 4.85382 4.22703 4.22703C4.85382 3.60023 5.59794 3.10303 6.41689 2.76381C7.23583 2.42459 8.11358 2.25 9 2.25M9 15.75C11.0707 15.75 11.9557 11.8777 11.9557 9C11.9557 6.12225 11.0707 2.25 9 2.25M9 15.75C6.92925 15.75 6.04425 11.8777 6.04425 9C6.04425 6.12225 6.92925 2.25 9 2.25M2.625 6.75H15.375M2.625 11.25H15.375" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="3" />
      <path d="M9 1.5V3" />
      <path d="M9 15V16.5" />
      <path d="M3.697 3.697L4.757 4.757" />
      <path d="M13.243 13.243L14.303 14.303" />
      <path d="M1.5 9H3" />
      <path d="M15 9H16.5" />
      <path d="M4.757 13.243L3.697 14.303" />
      <path d="M14.303 3.697L13.243 4.757" />
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
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.00001 2.25H9.29476C8.33126 3.14528 7.71195 4.34989 7.54447 5.65442C7.377 6.95895 7.67195 8.28093 8.37806 9.39055C9.08416 10.5002 10.1568 11.3273 11.4095 11.7281C12.6621 12.1289 14.0157 12.0781 15.2348 11.5845C14.7658 12.7129 13.9993 13.6928 13.0171 14.4197C12.0349 15.1466 10.8738 15.5933 9.65769 15.712C8.44153 15.8308 7.21595 15.6172 6.11167 15.0941C5.00739 14.5709 4.06584 13.7578 3.38745 12.7415C2.70905 11.7251 2.31927 10.5437 2.25967 9.32323C2.20007 8.10275 2.47289 6.88898 3.04903 5.81139C3.62517 4.7338 4.48302 3.83282 5.53108 3.20455C6.57913 2.57629 7.77807 2.2443 9.00001 2.244V2.25Z" />
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
  globe: GlobeIcon,
  sun: SunIcon,
  moon: MoonIcon,
  mail: MailIcon,
  map: MapIcon,
} as const;
