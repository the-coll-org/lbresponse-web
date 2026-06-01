/**
 * CRN Category Taxonomy
 *
 * Single source of truth for:
 *  1. Filter chip id → CRN category ids  (what the API receives as ?category=)
 *  2. CRN category id → official CRN label  (what is displayed on cards, EN + AR)
 *  3. Help Center service type options  (hotline-specific, maps to raw DB categories)
 *
 * To add/change a mapping edit this file only — both Need Help and Map screens
 * import from here.
 *
 * Data flow:
 *   PowerBI/UN sector names  ──(serviceCategoryMap.ts, API)──►  CRN category id
 *   CRN category id          ──(CRN_CATEGORY_LABEL below)──►    UI label on cards
 *   Filter chip id           ──(FILTER_CHIP_TO_CATEGORY)──►     ?category= API param
 */

// ---------------------------------------------------------------------------
// 1. Filter chip id → CRN category ids sent as ?category= to /api/organizations
// ---------------------------------------------------------------------------
export const FILTER_CHIP_TO_CATEGORY: Record<string, string[]> = {
  food: ['food_nutrition'],
  wash: ['wash_hygiene'],
  medical: ['health_medical'],
  shelter: ['shelter_nfi'],
  clothes: ['shelter_nfi'], // clothes/blankets = NFI
  cash: ['cash_livelihood'],
  safety: ['safety_protection'],
};

// ---------------------------------------------------------------------------
// 2. CRN category id → official CRN label (EN + AR) — shown on org cards
//    IDs match what lbresponse-api/src/lib/serviceCategoryMap.ts produces.
// ---------------------------------------------------------------------------
export const CRN_CATEGORY_LABEL: Record<string, { en: string; ar: string }> = {
  food_nutrition: { en: 'Food and Nutrition', ar: 'الغذاء والتغذية' },
  wash_hygiene: { en: 'WASH and Hygiene', ar: 'مياه ونظافة شخصية' },
  health_medical: { en: 'Health / Medical', ar: 'الصحة والرعاية الطبية' },
  shelter_nfi: { en: 'Shelter / NFI', ar: 'مأوى / مواد غير غذائية' },
  cash_livelihood: { en: 'Cash and Livelihood', ar: 'دعم نقدي / معيشي' },
  safety_protection: { en: 'Safety & Protection', ar: 'الحماية والسلامة' },
  education: { en: 'Education', ar: 'التعليم' },
  transportation_logistics: {
    en: 'Transportation & Logistics',
    ar: 'النقل والخدمات اللوجستية',
  },
  emergency_hotlines: { en: 'Emergency Hotlines', ar: 'خطوط الطوارئ' },
};

// ---------------------------------------------------------------------------
// 3. Help Center: raw hotline DB category → friendly display label
//    Covers the Help Center (hotlines) cards and the service-type filter.
// ---------------------------------------------------------------------------
export const HOTLINE_CATEGORY_LABEL: Record<
  string,
  { en: string; ar: string }
> = {
  // Health / Medical
  Hospital: { en: 'Health / Medical', ar: 'الصحة والرعاية الطبية' },
  Medical: { en: 'Health / Medical', ar: 'الصحة والرعاية الطبية' },
  'Medical / Fire': { en: 'Health / Medical', ar: 'الصحة والرعاية الطبية' },
  'Mental Health': { en: 'Health / Medical', ar: 'الصحة والرعاية الطبية' },
  // Safety & Protection
  GBV: { en: 'Safety & Protection', ar: 'الحماية والسلامة' },
  'Child Protection': { en: 'Safety & Protection', ar: 'الحماية والسلامة' },
  Security: { en: 'Safety & Protection', ar: 'الحماية والسلامة' },
  // Cash & Livelihood
  'Financial Assistance': { en: 'Cash and Livelihood', ar: 'دعم نقدي / معيشي' },
  // Emergency
  Fire: { en: 'Emergency', ar: 'طوارئ' },
  // Transportation & Logistics
  'Heavy Equipment': {
    en: 'Transportation & Logistics',
    ar: 'النقل والخدمات اللوجستية',
  },
  Airport: { en: 'Transportation & Logistics', ar: 'النقل والخدمات اللوجستية' },
  'Territorial Border': {
    en: 'Transportation & Logistics',
    ar: 'النقل والخدمات اللوجستية',
  },
  'Travel Agency': {
    en: 'Transportation & Logistics',
    ar: 'النقل والخدمات اللوجستية',
  },
};

// ---------------------------------------------------------------------------
// 4. Help Center service-type filter options (static — not from /api/filters)
//    Each option's hotlineCategories are the raw DB values the API matches on.
// ---------------------------------------------------------------------------
export interface HotlineServiceOption {
  id: string;
  label: string;
  label_ar: string;
  hotlineCategories: string[];
}

export const HOTLINE_SERVICE_OPTIONS: HotlineServiceOption[] = [
  {
    id: 'medical',
    label: 'Health / Medical',
    label_ar: 'الصحة والرعاية الطبية',
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
    label_ar: 'دعم نقدي / معيشي',
    hotlineCategories: ['financial assistance'],
  },
  {
    id: 'emergency',
    label: 'Emergency',
    label_ar: 'طوارئ',
    hotlineCategories: ['fire'],
  },
  {
    id: 'transport',
    label: 'Transportation & Logistics',
    label_ar: 'النقل والخدمات اللوجستية',
    hotlineCategories: [
      'heavy equipment',
      'airport',
      'territorial border',
      'travel agency',
    ],
  },
];
