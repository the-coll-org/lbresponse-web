export type { HotlineServiceOption } from '../../lib/crnCategories';
export { HOTLINE_SERVICE_OPTIONS } from '../../lib/crnCategories';
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

// Only district comes from /api/filters — maps directly to ?city= on /api/hotlines.
// Service type uses HOTLINE_SERVICE_OPTIONS from crnCategories (re-exported above).
export const FILTER_SECTIONS: HelpCenterFilterSectionConfig[] = [
  {
    id: 'district',
    titleKey: 'filtersSections.location',
    icon: 'pin',
  },
];

export const MAX_PINNED_ORGANIZATIONS = 5;
export const ORGANIZATIONS_PAGE_SIZE = 12;
