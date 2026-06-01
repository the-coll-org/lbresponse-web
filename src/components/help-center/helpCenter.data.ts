import type {
  HelpCenterFilterSectionConfig,
  HelpCenterHotline,
} from './helpCenter.types';

export const HOTLINES: HelpCenterHotline[] = [
  {
    id: 'ambulance',
    labelKey: 'hotlines.ambulance',
    number: '140',
    icon: 'cross',
  },
  {
    id: 'civil',
    labelKey: 'hotlines.civilDefense',
    number: '125',
    icon: 'siren',
  },
  {
    id: 'medical',
    labelKey: 'hotlines.medicalAid',
    number: '129',
    icon: 'shield',
  },
  {
    id: 'marine',
    labelKey: 'hotlines.marineRescue',
    number: '1714',
    icon: 'water',
  },
];

// Only district comes from /api/filters — it maps directly to ?city= on /api/hotlines.
// Service type uses static options below so we control the labels and hotline mapping.
export const FILTER_SECTIONS: HelpCenterFilterSectionConfig[] = [
  {
    id: 'district',
    titleKey: 'filtersSections.location',
    icon: 'pin',
  },
];

// Static service-type filter for Help Center. Each option's `hotlineCategories`
// are the raw values the /api/hotlines ?category= param accepts (lowercase).
export interface HotlineServiceOption {
  id: string;
  label: string;
  label_ar: string;
  hotlineCategories: string[];
}

export const HOTLINE_SERVICE_OPTIONS: HotlineServiceOption[] = [
  {
    id: 'medical',
    label: 'Medical care',
    label_ar: 'طبي وصحي',
    hotlineCategories: [
      'hospital',
      'medical',
      'medical / fire',
      'mental health',
    ],
  },
  {
    id: 'safety',
    label: 'Safety & Protection',
    label_ar: 'الحماية والسلامة',
    hotlineCategories: ['gbv', 'child protection', 'security'],
  },
  {
    id: 'cash',
    label: 'Cash and Livelihood',
    label_ar: 'نقد ومعيشة',
    hotlineCategories: ['financial assistance'],
  },
  {
    id: 'emergency',
    label: 'Emergency',
    label_ar: 'طوارئ',
    hotlineCategories: ['fire'],
  },
];

export const MAX_PINNED_ORGANIZATIONS = 5;
export const ORGANIZATIONS_PAGE_SIZE = 12;
