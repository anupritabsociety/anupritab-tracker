import { describe, it, expect } from 'vitest';
import { normalizeIssue } from '../encoding';
import { STATUS_NEW, STATUS_PROGRESS, STATUS_RESOLVED, CAT_BUILDER, CAT_SOCIETY } from '../constants';

describe('normalizeIssue', () => {
  it('preserves valid status', () => {
    const issue = { status: STATUS_NEW, category: CAT_BUILDER, issue: 'test' };
    const result = normalizeIssue({ ...issue });
    expect(result.status).toBe(STATUS_NEW);
  });

  it('uses statusKey when available', () => {
    const issue = { status: 'corrupted', statusKey: 'progress', category: CAT_BUILDER, issue: 'test' };
    const result = normalizeIssue({ ...issue });
    expect(result.status).toBe(STATUS_PROGRESS);
  });

  it('defaults to new for unknown status without statusKey', () => {
    const issue = { status: 'garbage', category: CAT_BUILDER, issue: 'test' };
    const result = normalizeIssue({ ...issue });
    expect(result.status).toBe(STATUS_NEW);
  });

  it('preserves valid category', () => {
    const issue = { status: STATUS_NEW, category: CAT_SOCIETY, issue: 'test' };
    const result = normalizeIssue({ ...issue });
    expect(result.category).toBe(CAT_SOCIETY);
  });

  it('detects builder from hint words when category is corrupted', () => {
    const issue = { status: STATUS_NEW, category: 'corrupted_text', issue: 'The lift is broken' };
    const result = normalizeIssue({ ...issue });
    expect(result.category).toBe(CAT_BUILDER);
  });

  it('defaults to society when category is corrupted and no builder hints', () => {
    const issue = { status: STATUS_NEW, category: 'corrupted_text', issue: 'Parking is an issue' };
    const result = normalizeIssue({ ...issue });
    expect(result.category).toBe(CAT_SOCIETY);
  });

  it('handles missing issue text gracefully', () => {
    const issue = { status: STATUS_NEW, category: 'corrupted', issue: '' };
    const result = normalizeIssue({ ...issue });
    expect(result.category).toBe(CAT_SOCIETY);
  });
});
