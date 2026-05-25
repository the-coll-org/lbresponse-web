export type LocalizedText = {
  ar: string;
  en: string;
};

export type NeedHelpFilterIcon =
  | 'location'
  | 'food'
  | 'medical'
  | 'shelter'
  | 'clothes';

export type NeedHelpServiceIcon = 'shelter' | 'food' | 'medical' | 'clothes';

export type NeedHelpActionType = 'phone' | 'whatsapp';

export interface NeedHelpFilter {
  id: string;
  icon: NeedHelpFilterIcon;
  label: LocalizedText;
  active?: boolean;
}

export interface NeedHelpAction {
  type: NeedHelpActionType;
  label: LocalizedText;
  value: string;
  href: string;
}

export interface NeedHelpService {
  id: string;
  icon: NeedHelpServiceIcon;
  title: LocalizedText;
  category: LocalizedText;
  description: LocalizedText;
  location: LocalizedText;
  updatedAtLabel: LocalizedText;
  mapLabel: LocalizedText;
  action: NeedHelpAction;
}

export interface NeedHelpResponse {
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  pageLabel: LocalizedText;
  searchPlaceholder: LocalizedText;
  resultsLabel: LocalizedText;
  showMoreLabel: LocalizedText;
  filters: NeedHelpFilter[];
  services: NeedHelpService[];
}

export interface OrganizationApiItem {
  id: string;
  title: string;
  title_ar: string | null;
  description: string | null;
  description_ar: string | null;
  email: string | null;
  verified: boolean;
  phone_numbers: string[];
  whatsapp: string | null;
  social_media: unknown[];
  type: string | null;
  locations: string[];
  sectors: string[];
  services: unknown[];
  service_count: number;
  primary_contact_name: string | null;
  secondary_contact: string | null;
  map_url: string | null;
  organization_type: string | null;
  updated_at: string | null;
}

export interface OrganizationsApiResponse {
  data: OrganizationApiItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface NeedHelpOrganizationViewModel {
  id: string;
  icon: NeedHelpServiceIcon;
  title: string;
  category: string;
  description: string;
  locations: string[];
  mapUrl: string | null;
  mapLabel: string;
  updatedAtLabel: string | null;
  actionType: 'phone' | 'whatsapp';
  actionLabel: string;
  actionHref: string;
  actionDisabled: boolean;
}
