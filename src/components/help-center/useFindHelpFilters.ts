import { useCallback, useEffect, useState } from 'react';
import type { HelpCenterFilterSelection } from './helpCenter.types';

export function toggleFilterValue(
  selection: HelpCenterFilterSelection,
  groupId: string,
  optionId: string
): HelpCenterFilterSelection {
  const currentValues = selection[groupId] ?? [];
  const next = currentValues.includes(optionId)
    ? currentValues.filter((v) => v !== optionId)
    : [...currentValues, optionId];
  return { ...selection, [groupId]: next };
}

export function clearAllFilterValues(
  selection: HelpCenterFilterSelection
): HelpCenterFilterSelection {
  return Object.fromEntries(
    Object.keys(selection).map((k) => [k, [] as string[]])
  ) as HelpCenterFilterSelection;
}

export function copyFilterSelection(
  selection: HelpCenterFilterSelection
): HelpCenterFilterSelection {
  return Object.fromEntries(
    Object.entries(selection).map(([k, v]) => [k, [...v]])
  ) as HelpCenterFilterSelection;
}

const URL_KEY_PREFIX = 'f.';
const URL_QUERY_KEY = 'q';

function readFromUrl(): {
  filters: HelpCenterFilterSelection;
  query: string;
} {
  if (typeof window === 'undefined') {
    return { filters: {}, query: '' };
  }
  const params = new URLSearchParams(window.location.search);
  const filters: HelpCenterFilterSelection = {};
  for (const [key, value] of params.entries()) {
    if (!key.startsWith(URL_KEY_PREFIX) || !value) continue;
    const groupId = key.slice(URL_KEY_PREFIX.length);
    filters[groupId] = value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  }
  const query = params.get(URL_QUERY_KEY) ?? '';
  return { filters, query };
}

function writeToUrl(filters: HelpCenterFilterSelection, query: string): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  for (const key of Array.from(params.keys())) {
    if (key.startsWith(URL_KEY_PREFIX) || key === URL_QUERY_KEY) {
      params.delete(key);
    }
  }
  for (const [groupId, values] of Object.entries(filters)) {
    if (values.length === 0) continue;
    params.set(`${URL_KEY_PREFIX}${groupId}`, values.join(','));
  }
  if (query.trim().length > 0) {
    params.set(URL_QUERY_KEY, query.trim());
  }
  const next = params.toString();
  const nextUrl = `${window.location.pathname}${next ? `?${next}` : ''}${window.location.hash}`;
  window.history.replaceState(null, '', nextUrl);
}

export interface UseFindHelpUrlSyncOptions {
  filters: HelpCenterFilterSelection;
  query: string;
}

export function useFindHelpUrlSync({
  filters,
  query,
}: UseFindHelpUrlSyncOptions) {
  useEffect(() => {
    writeToUrl(filters, query);
  }, [filters, query]);
}

export function readFindHelpInitialState() {
  return readFromUrl();
}

export interface UseFindHelpDraftFiltersResult {
  draftFilters: HelpCenterFilterSelection;
  setDraftFilters: React.Dispatch<
    React.SetStateAction<HelpCenterFilterSelection>
  >;
  resetDraftTo: (next: HelpCenterFilterSelection) => void;
  toggleDraftOption: (groupId: string, optionId: string) => void;
  clearDraft: () => void;
}

export function useFindHelpDraftFilters(
  initial: HelpCenterFilterSelection
): UseFindHelpDraftFiltersResult {
  const [draftFilters, setDraftFilters] =
    useState<HelpCenterFilterSelection>(initial);

  const resetDraftTo = useCallback((next: HelpCenterFilterSelection) => {
    setDraftFilters(copyFilterSelection(next));
  }, []);

  const toggleDraftOption = useCallback((groupId: string, optionId: string) => {
    setDraftFilters((current) => toggleFilterValue(current, groupId, optionId));
  }, []);

  const clearDraft = useCallback(() => {
    setDraftFilters(clearAllFilterValues);
  }, []);

  return {
    draftFilters,
    setDraftFilters,
    resetDraftTo,
    toggleDraftOption,
    clearDraft,
  };
}
