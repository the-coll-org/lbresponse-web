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

export interface HelpCenterOrganization {
  id: string;
  nameKey: string;
  categoryKey: string;
  descriptionKey: string;
  locationsKey: string;
  actionLabelKey: string;
  actionType: 'phone' | 'whatsapp';
  regionValues: string[];
  providerTypeValues: string[];
  contactMethodValues: string[];
}

export type HelpCenterFilterField =
  | 'regionValues'
  | 'providerTypeValues'
  | 'contactMethodValues';

export interface HelpCenterFilterSectionConfig {
  id: string;
  titleKey: string;
  field: HelpCenterFilterField;
  icon: 'pin' | 'shield' | 'phone';
  options: Array<{
    id: string;
    labelKey: string;
    value: string;
  }>;
}

export type HelpCenterFilterSelection = Record<string, string[]>;
