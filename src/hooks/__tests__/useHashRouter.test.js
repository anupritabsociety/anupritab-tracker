import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHashRouter } from '../useHashRouter';

describe('useHashRouter', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('defaults to submit page', () => {
    const { result } = renderHook(() => useHashRouter('submit'));
    expect(result.current.page).toBe('submit');
  });

  it('reads tracker from hash', () => {
    window.location.hash = 'tracker';
    const { result } = renderHook(() => useHashRouter('submit'));
    expect(result.current.page).toBe('tracker');
  });

  it('navigateTo changes hash', () => {
    const { result } = renderHook(() => useHashRouter('submit'));
    act(() => {
      result.current.navigateTo('tracker');
    });
    expect(window.location.hash).toBe('#tracker');
  });

  it('does not navigate to same page', () => {
    const { result } = renderHook(() => useHashRouter('submit'));
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    act(() => {
      result.current.navigateTo('submit');
    });
    expect(scrollSpy).not.toHaveBeenCalled();
    scrollSpy.mockRestore();
  });

  it('responds to hashchange events', () => {
    const { result } = renderHook(() => useHashRouter('submit'));
    act(() => {
      window.location.hash = 'tracker';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(result.current.page).toBe('tracker');
  });
});
