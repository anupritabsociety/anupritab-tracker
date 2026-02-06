import { describe, it, expect } from 'vitest';
import {
  STATUS_NEW, STATUS_PROGRESS, STATUS_RESOLVED,
  CAT_BUILDER, CAT_SOCIETY,
  STATUS_TO_KEY, KEY_TO_STATUS,
  VALID_CATEGORIES, FLAT_LIST, FILTERS,
} from '../constants';

describe('constants', () => {
  it('STATUS_TO_KEY and KEY_TO_STATUS are inverses', () => {
    for (const [status, key] of Object.entries(STATUS_TO_KEY)) {
      expect(KEY_TO_STATUS[key]).toBe(status);
    }
    for (const [key, status] of Object.entries(KEY_TO_STATUS)) {
      expect(STATUS_TO_KEY[status]).toBe(key);
    }
  });

  it('has all three statuses mapped', () => {
    expect(STATUS_TO_KEY[STATUS_NEW]).toBe('new');
    expect(STATUS_TO_KEY[STATUS_PROGRESS]).toBe('progress');
    expect(STATUS_TO_KEY[STATUS_RESOLVED]).toBe('resolved');
  });

  it('VALID_CATEGORIES contains builder and society', () => {
    expect(VALID_CATEGORIES).toContain(CAT_BUILDER);
    expect(VALID_CATEGORIES).toContain(CAT_SOCIETY);
    expect(VALID_CATEGORIES).toHaveLength(2);
  });

  it('FLAT_LIST has expected entries', () => {
    expect(FLAT_LIST).toContain('101');
    expect(FLAT_LIST).toContain('903');
    expect(FLAT_LIST).toHaveLength(27);
    // 9 floors × 3 flats per floor
    for (let floor = 1; floor <= 9; floor++) {
      expect(FLAT_LIST).toContain(`${floor}01`);
      expect(FLAT_LIST).toContain(`${floor}02`);
      expect(FLAT_LIST).toContain(`${floor}03`);
    }
  });

  it('FILTERS has expected keys', () => {
    const keys = FILTERS.map(f => f.key);
    expect(keys).toContain('all');
    expect(keys).toContain('builder');
    expect(keys).toContain('society');
    expect(keys).toContain('progress');
    expect(keys).toContain('resolved');
  });
});
