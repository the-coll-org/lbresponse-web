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

export const FILTER_SECTIONS: HelpCenterFilterSectionConfig[] = [
  {
    id: 'provider_type',
    titleKey: 'filtersSections.serviceType',
    icon: 'shield',
  },
  {
    id: 'sector',
    titleKey: 'filtersSections.contact',
    icon: 'phone',
  },
  {
    id: 'service_subtype',
    titleKey: 'filtersSections.contact',
    icon: 'phone',
  },
  {
    id: 'shelter_type',
    titleKey: 'filtersSections.location',
    icon: 'pin',
  },
];

export const MAX_PINNED_ORGANIZATIONS = 5;
export const ORGANIZATIONS_PAGE_SIZE = 20;
