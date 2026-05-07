import { formatRelativeTime } from './helpCenter.utils';
import type {
  HelpCenterFiltersResponse,
  HelpCenterOrganizationApiItem,
} from './helpCenter.types';

export type FindHelpPrimaryActionType =
  | 'phone'
  | 'whatsapp'
  | 'email'
  | 'unavailable';

export interface FindHelpOfferedItem {
  key: 'sector' | 'service' | 'shelter' | 'type';
  label: string;
}

export interface FindHelpListingViewModel {
  id: string;
  title: string;
  description: string;
  /** Service line shown as the dominant title on the card (description with humanitarian-code prefix stripped). */
  serviceHeadline: string;
  /** Org name shown beneath the service line; null when there is no service to show. */
  orgSecondaryName: string | null;
  sectorId: string | null;
  sectorLabel: string;
  locations: string[];
  primaryActionType: FindHelpPrimaryActionType;
  primaryActionValue: string;
  primaryActionLabel: string;
  primaryActionDisabled: boolean;
  hasPhone: boolean;
  phoneDisplay: string;
  whatsappDisplay: string;
  emailDisplay: string;
  mapUrl: string | null;
  updatedRelative: string;
  verified: boolean;
  confidential: boolean;
  offered: FindHelpOfferedItem[];
  organizationShortName: string;
}

export interface FindHelpFilterOption {
  id: string;
  label: string;
}

export interface FindHelpFilterGroup {
  id: string;
  label: string;
  options: FindHelpFilterOption[];
}

export interface FindHelpFilterCatalog {
  needs: FindHelpFilterGroup | null;
  areas: FindHelpFilterGroup | null;
  others: FindHelpFilterGroup[];
}

export interface FindHelpAdapterLabels {
  call: string;
  whatsapp: string;
  email: string;
  unavailable: string;
  uncategorized: string;
  offeredSector: (value: string) => string;
  offeredService: (value: string) => string;
  offeredShelter: (value: string) => string;
  offeredType: (value: string) => string;
}

const NEEDS_GROUP_ID = 'sector';
const AREAS_GROUP_ID = 'location';
const CONFIDENTIAL_SECTOR_IDS = new Set(['gbv', 'child-protection']);
const CONFIDENTIAL_SERVICE_SUBTYPE_IDS = new Set(['gbv', 'child-protection']);

function pickLocalized(
  primary: string | null | undefined,
  fallback: string | null | undefined,
  isArabic: boolean
): string {
  if (isArabic) {
    return (primary ?? fallback ?? '').trim();
  }
  return (fallback ?? primary ?? '').trim();
}

function humanize(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const HUMANITARIAN_CODE_PREFIX = /^[A-Z]{1,4}\d{1,3}\s*[-–—:·]\s*/;

function stripHumanitarianCodePrefix(text: string): string {
  return text.replace(HUMANITARIAN_CODE_PREFIX, '').trim();
}

function findFilterOptionLabel(
  catalog: FindHelpFilterCatalog,
  groupId: string,
  optionId: string | null | undefined
): string | null {
  if (!optionId) return null;
  const groups = [catalog.needs, catalog.areas, ...catalog.others].filter(
    (g): g is FindHelpFilterGroup => g !== null
  );
  for (const group of groups) {
    if (group.id !== groupId) continue;
    const option = group.options.find((o) => o.id === optionId);
    if (option) return option.label;
  }
  return null;
}

export function buildFindHelpFilterCatalog(
  filters: HelpCenterFiltersResponse | null,
  language: string
): FindHelpFilterCatalog {
  if (!filters) {
    return { needs: null, areas: null, others: [] };
  }

  const isArabic = language.startsWith('ar');
  const groups: FindHelpFilterGroup[] = filters.data.map((g) => ({
    id: g.group_id,
    label:
      (isArabic ? g.group_label_ar : g.group_label) ??
      g.group_label ??
      g.group_id,
    options: [...g.options]
      .sort((a, b) => a.display_order - b.display_order)
      .map((o) => ({
        id: o.id,
        label: (isArabic ? o.label_ar : o.label) ?? o.label ?? o.id,
      })),
  }));

  const needs = groups.find((g) => g.id === NEEDS_GROUP_ID) ?? null;
  const areas = groups.find((g) => g.id === AREAS_GROUP_ID) ?? null;
  const others = groups.filter(
    (g) => g.id !== NEEDS_GROUP_ID && g.id !== AREAS_GROUP_ID
  );

  return { needs, areas, others };
}

export function buildFindHelpListingViewModel(
  organization: HelpCenterOrganizationApiItem,
  language: string,
  catalog: FindHelpFilterCatalog,
  labels: FindHelpAdapterLabels
): FindHelpListingViewModel {
  const isArabic = language.startsWith('ar');
  const title =
    pickLocalized(organization.title_ar, organization.title, isArabic) || '';
  const description = pickLocalized(
    organization.description_ar,
    organization.description,
    isArabic
  );

  const sectorId = organization.sector ?? null;
  const sectorLabel =
    findFilterOptionLabel(catalog, NEEDS_GROUP_ID, sectorId) ??
    humanize(sectorId) ??
    labels.uncategorized;

  const phone =
    organization.phone_numbers.map((n) => n.trim()).find((n) => n.length > 0) ??
    '';
  const whatsapp = organization.whatsapp?.trim() ?? '';
  const email = organization.email?.trim() ?? '';

  let primaryActionType: FindHelpPrimaryActionType = 'unavailable';
  let primaryActionValue = '';
  let primaryActionLabel = labels.unavailable;
  let primaryActionDisabled = true;

  if (phone) {
    primaryActionType = 'phone';
    primaryActionValue = phone;
    primaryActionLabel = `${labels.call} ${phone}`;
    primaryActionDisabled = false;
  } else if (whatsapp) {
    primaryActionType = 'whatsapp';
    primaryActionValue = whatsapp;
    primaryActionLabel = `${labels.whatsapp} ${whatsapp}`;
    primaryActionDisabled = false;
  } else if (email) {
    primaryActionType = 'email';
    primaryActionValue = email;
    primaryActionLabel = `${labels.email} ${email}`;
    primaryActionDisabled = false;
  }

  const offered: FindHelpOfferedItem[] = [];
  const sectorLabelForOffered = sectorId
    ? (findFilterOptionLabel(catalog, NEEDS_GROUP_ID, sectorId) ??
      humanize(sectorId))
    : '';
  if (sectorLabelForOffered) {
    offered.push({
      key: 'sector',
      label: labels.offeredSector(sectorLabelForOffered),
    });
  }
  const serviceSubtypeLabel = organization.service_subtype
    ? (findFilterOptionLabel(
        catalog,
        'service_subtype',
        organization.service_subtype
      ) ?? humanize(organization.service_subtype))
    : '';
  if (serviceSubtypeLabel) {
    offered.push({
      key: 'service',
      label: labels.offeredService(serviceSubtypeLabel),
    });
  }
  const shelterTypeLabel = organization.shelter_type
    ? (findFilterOptionLabel(
        catalog,
        'shelter_type',
        organization.shelter_type
      ) ?? humanize(organization.shelter_type))
    : '';
  if (shelterTypeLabel) {
    offered.push({
      key: 'shelter',
      label: labels.offeredShelter(shelterTypeLabel),
    });
  }
  const typeLabel = organization.type ? humanize(organization.type) : '';
  if (
    typeLabel &&
    typeLabel.toLowerCase() !== sectorLabelForOffered.toLowerCase() &&
    typeLabel.toLowerCase() !== serviceSubtypeLabel.toLowerCase()
  ) {
    offered.push({ key: 'type', label: labels.offeredType(typeLabel) });
  }

  const confidential =
    (sectorId !== null && CONFIDENTIAL_SECTOR_IDS.has(sectorId)) ||
    (organization.service_subtype !== null &&
      organization.service_subtype !== undefined &&
      CONFIDENTIAL_SERVICE_SUBTYPE_IDS.has(organization.service_subtype));

  const cleanedDescription = stripHumanitarianCodePrefix(description);
  const serviceHeadline = cleanedDescription || title;
  const orgSecondaryName = cleanedDescription && title ? title : null;

  return {
    id: organization.id,
    title,
    description: cleanedDescription,
    serviceHeadline,
    orgSecondaryName,
    sectorId,
    sectorLabel,
    locations: organization.locations.filter(
      (l): l is string => typeof l === 'string' && l.trim().length > 0
    ),
    primaryActionType,
    primaryActionValue,
    primaryActionLabel,
    primaryActionDisabled,
    hasPhone: phone.length > 0,
    phoneDisplay: phone,
    whatsappDisplay: whatsapp,
    emailDisplay: email,
    mapUrl: organization.map_url,
    updatedRelative: formatRelativeTime(organization.updated_at),
    verified: organization.verified,
    confidential,
    offered,
    organizationShortName: title,
  };
}
