import { describe, expect, it } from 'vitest';
import {
  clearAllFilterValues,
  copyFilterSelection,
  toggleFilterValue,
} from '../useFindHelpFilters';

describe('useFindHelpFilters reducers', () => {
  it('toggleFilterValue adds an unknown option', () => {
    const next = toggleFilterValue(
      { sector: [], location: [] },
      'sector',
      'shelter'
    );
    expect(next.sector).toEqual(['shelter']);
  });

  it('toggleFilterValue removes an existing option', () => {
    const next = toggleFilterValue(
      { sector: ['shelter', 'food'], location: [] },
      'sector',
      'shelter'
    );
    expect(next.sector).toEqual(['food']);
  });

  it('toggleFilterValue does not mutate the input selection', () => {
    const before = { sector: ['shelter'], location: [] };
    const next = toggleFilterValue(before, 'sector', 'food');
    expect(before.sector).toEqual(['shelter']);
    expect(next.sector).toEqual(['shelter', 'food']);
  });

  it('toggleFilterValue creates a new group key when missing', () => {
    const next = toggleFilterValue({}, 'service_subtype', 'pharmacy');
    expect(next.service_subtype).toEqual(['pharmacy']);
  });

  it('clearAllFilterValues empties every group while preserving keys', () => {
    const next = clearAllFilterValues({
      sector: ['a', 'b'],
      location: ['beirut'],
    });
    expect(next).toEqual({ sector: [], location: [] });
  });

  it('copyFilterSelection deep-clones value arrays', () => {
    const before = { sector: ['shelter'], location: [] };
    const next = copyFilterSelection(before);
    next.sector.push('food');
    expect(before.sector).toEqual(['shelter']);
    expect(next.sector).toEqual(['shelter', 'food']);
  });
});
