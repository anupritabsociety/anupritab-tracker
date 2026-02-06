import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIssues } from '../useIssues';

vi.mock('../../api/issues', () => ({
  getIssues: vi.fn(),
}));

vi.mock('../../lib/encoding', () => ({
  normalizeIssue: vi.fn((issue) => issue),
}));

import { getIssues } from '../../api/issues';

describe('useIssues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with empty state', () => {
    const { result } = renderHook(() => useIssues());
    expect(result.current.issues).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('loads issues successfully', async () => {
    const mockIssues = [{ issueNo: 1, issue: 'test' }];
    getIssues.mockResolvedValue({ success: true, issues: mockIssues });

    const { result } = renderHook(() => useIssues());
    await act(async () => {
      await result.current.loadIssues();
    });

    expect(result.current.issues).toHaveLength(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles API error (success: false)', async () => {
    getIssues.mockResolvedValue({ success: false });

    const { result } = renderHook(() => useIssues());
    await act(async () => {
      await result.current.loadIssues();
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.issues).toEqual([]);
  });

  it('handles network error', async () => {
    getIssues.mockRejectedValue(new Error('Network fail'));

    const { result } = renderHook(() => useIssues());
    await act(async () => {
      await result.current.loadIssues();
    });

    expect(result.current.error).toBeTruthy();
  });

  it('updateIssueLocally changes issue status', async () => {
    const mockIssues = [{ issueNo: 1, status: 'old' }];
    getIssues.mockResolvedValue({ success: true, issues: mockIssues });

    const { result } = renderHook(() => useIssues());
    await act(async () => {
      await result.current.loadIssues();
    });

    act(() => {
      result.current.updateIssueLocally(1, 'new_status');
    });

    expect(result.current.issues[0].status).toBe('new_status');
  });

  it('revertIssues restores previous state', async () => {
    const mockIssues = [{ issueNo: 1, status: 'original' }];
    getIssues.mockResolvedValue({ success: true, issues: mockIssues });

    const { result } = renderHook(() => useIssues());
    await act(async () => {
      await result.current.loadIssues();
    });

    act(() => {
      result.current.updateIssueLocally(1, 'changed');
    });
    expect(result.current.issues[0].status).toBe('changed');

    act(() => {
      result.current.revertIssues();
    });
    expect(result.current.issues[0].status).toBe('original');
  });

  it('handles timeout', async () => {
    vi.useFakeTimers();
    getIssues.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useIssues());
    let loadPromise;
    act(() => {
      loadPromise = result.current.loadIssues();
    });

    await act(async () => {
      vi.advanceTimersByTime(16000);
    });

    await act(async () => {
      try { await loadPromise; } catch {}
    });

    expect(result.current.error).toBeTruthy();
    vi.useRealTimers();
  });
});
