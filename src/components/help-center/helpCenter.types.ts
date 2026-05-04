export interface HelpCenterScreenProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

export interface HelpCenterHotline {
  id: string;
  labelKey: string;
  number: string;
  icon: 'cross' | 'siren' | 'shield' | 'water';
}

export interface HelpCenterOrganizationApiItem {
  id: string;
  title: string;
  title_ar: string | null;
  description: string | null;
  description_ar: string | null;
  email: string | null;
  pinned: boolean;
  verified: boolean;
  phone_numbers: string[];
  whatsapp: string | null;
  type: string | null;
  locations: string[];
  map_url: string | null;
  organization_type: string | null;
  provider_type?: string | null;
  sector?: string | null;
  service_subtype?: string | null;
  shelter_type?: string | null;
  updated_at: string | null;
}

export interface HelpCenterOrganizationsResponse {
  data: HelpCenterOrganizationApiItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface HelpCenterFilterOptionApiItem {
  id: string;
  label: string;
  label_ar: string | null;
  result_count: number;
  display_order: number;
}

export interface HelpCenterFilterGroupApiItem {
  group_id: string;
  group_label: string;
  group_label_ar: string;
  options: HelpCenterFilterOptionApiItem[];
}

export interface HelpCenterFiltersResponse {
  data: HelpCenterFilterGroupApiItem[];
}

export interface HelpCenterOrganizationViewModel {
  id: string;
  title: string;
  category: string;
  description: string;
  locations: string;
  primaryActionLabel: string;
  primaryActionType: 'phone' | 'whatsapp' | 'email' | 'unavailable';
  primaryActionValue: string;
  primaryActionDisabled: boolean;
  mapUrl: string | null;
  timeLabel: string;
  verified: boolean;
  isPinned: boolean;
}

export type HelpCenterOrganizationType =
  | 'ngo'
  | 'un'
  | 'local_organization'
  | 'government'
  | 'private_donor'
  | 'private_company';

export type HelpCenterContactType =
  | 'phone'
  | 'whatsapp'
  | 'email'
  | 'telegram'
  | 'sms'
  | 'other';

export type HelpCenterContactMode = 'neutral' | 'email' | 'phone';

export interface HelpCenterOrganizationRequestPayload {
  name: string;
  name_ar: string;
  contact_type: 'phone' | 'email';
  organization_type: HelpCenterOrganizationType;
  email?: string;
  phone_number?: string;
}

export interface HelpCenterOrganizationRequestFormValues {
  organizationName: string;
  organizationType: HelpCenterOrganizationType | '';
  contactValue: string;
  contactMode: HelpCenterContactMode;
}

export type HelpCenterOrganizationRequestField =
  | 'organizationName'
  | 'organizationType'
  | 'contactValue';

export type HelpCenterOrganizationRequestErrors = Partial<
  Record<HelpCenterOrganizationRequestField | 'submit', string>
>;

export interface HelpCenterFilterSectionConfig {
  id: string;
  titleKey: string;
  icon: 'pin' | 'shield' | 'phone';
}

export type HelpCenterFilterSelection = Record<string, string[]>;
