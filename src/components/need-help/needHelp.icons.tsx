/* eslint-disable react-refresh/only-export-components */
import { SvgIcon } from '../ui/SvgIcon';
import arrowUpSvg from '../../assets/help-center/arrow-up.svg?raw';
import chatSvg from '../../assets/help-center/whatsapp.svg?raw';
import locationSvg from '../../assets/help-center/location.svg?raw';
import phoneSvg from '../../assets/help-center/phone.svg?raw';
import searchSvg from '../../assets/help-center/search.svg?raw';

function SearchIcon() {
  return <SvgIcon svg={searchSvg} className="size-20" />;
}

function MapIcon() {
  return <SvgIcon svg={locationSvg} className="size-16" />;
}

function PhoneIcon() {
  return <SvgIcon svg={phoneSvg} className="size-16" />;
}

function WhatsappIcon() {
  return <SvgIcon svg={chatSvg} className="size-16" />;
}

function ArrowUpIcon() {
  return <SvgIcon svg={arrowUpSvg} className="size-24" />;
}

function ShelterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

function FoodIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 4v8" />
      <path d="M8 4v8" />
      <path d="M5 8h3" />
      <path d="M6.5 12v8" />
      <path d="M15 4v7" />
      <path d="M18.5 4c0 5-1.5 7-3.5 7" />
      <path d="M15 11v9" />
    </svg>
  );
}

function MedicalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20s-6-3.8-6-9a3.5 3.5 0 0 1 6-2.2A3.5 3.5 0 0 1 18 11c0 5.2-6 9-6 9Z" />
      <path d="M12 9v4" />
      <path d="M10 11h4" />
    </svg>
  );
}

function ClothesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 5c.7 1 1.8 1.5 3 1.5S14.3 6 15 5l4 2.5-2 4-2-1V20H9v-9.5l-2 1-2-4z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 2.5" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.8-3 4.1-4.5 7-4.5S17.2 17 19 20" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21c0 0-7-6.75-7-11a7 7 0 1 1 14 0c0 4.25-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export const needHelpIcons = {
  search: SearchIcon,
  map: MapIcon,
  phone: PhoneIcon,
  whatsapp: WhatsappIcon,
  arrowUp: ArrowUpIcon,
  shelter: ShelterIcon,
  food: FoodIcon,
  medical: MedicalIcon,
  clothes: ClothesIcon,
  clock: ClockIcon,
  person: PersonIcon,
  locationPin: LocationPinIcon,
} as const;
