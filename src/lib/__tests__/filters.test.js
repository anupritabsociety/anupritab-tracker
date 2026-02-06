import { describe, it, expect } from 'vitest';
import { filterIssues, getFilterCounts } from '../filters';
import { STATUS_NEW, STATUS_PROGRESS, STATUS_RESOLVED, CAT_BUILDER, CAT_SOCIETY } from '../constants';

const mockIssues = [
  { issueNo: 1, category: CAT_BUILDER, status: STATUS_NEW },
  { issueNo: 2, category: CAT_BUILDER, status: STATUS_PROGRESS },
  { issueNo: 3, category: CAT_SOCIETY, status: STATUS_NEW },
  { issueNo: 4, category: CAT_SOCIETY, status: STATUS_RESOLVED },
  { issueNo: 5, category: CAT_BUILDER, status: STATUS_RESOLVED },
];

describe('filterIssues', () => {
  it('returns all issues for "all" filter', () => {
    expect(filterIssues(mockIssues, 'all')).toHaveLength(5);
  });

  it('filters builder issues', () => {
    const result = filterIssues(mockIssues, 'builder');
    expect(result).toHaveLength(3);
    result.forEach(i => expect(i.category).toBe(CAT_BUILDER));
  });

  it('filters society issues', () => {
    const result = filterIssues(mockIssues, 'society');
    expect(result).toHaveLength(2);
    result.forEach(i => expect(i.category).toBe(CAT_SOCIETY));
  });

  it('filters progress issues', () => {
    const result = filterIssues(mockIssues, 'progress');
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe(STATUS_PROGRESS);
  });

  it('filters resolved issues', () => {
    const result = filterIssues(mockIssues, 'resolved');
    expect(result).toHaveLength(2);
    result.forEach(i => expect(i.status).toBe(STATUS_RESOLVED));
  });

  it('returns all for unknown filter', () => {
    expect(filterIssues(mockIssues, 'unknown')).toHaveLength(5);
  });
});

describe('getFilterCounts', () => {
  it('returns correct counts', () => {
    const counts = getFilterCounts(mockIssues);
    expect(counts.all).toBe(5);
    expect(counts.builder).toBe(3);
    expect(counts.society).toBe(2);
    expect(counts.progress).toBe(1);
    expect(counts.resolved).toBe(2);
  });

  it('handles empty array', () => {
    const counts = getFilterCounts([]);
    expect(counts.all).toBe(0);
    expect(counts.builder).toBe(0);
  });
});
