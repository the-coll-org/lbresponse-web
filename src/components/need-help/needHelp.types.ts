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
