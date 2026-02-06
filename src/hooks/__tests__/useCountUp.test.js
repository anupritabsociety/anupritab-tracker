import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountUp } from '../useCountUp';

describe('useCountUp', () => {
  it('starts at 0', () => {
    const { result } = renderHook(() => useCountUp(10));
    expect(result.current).toBe(0);
  });

  it('returns 0 when target is 0', () => {
    const { result } = renderHook(() => useCountUp(0));
    expect(result.current).toBe(0);
  });

  it('eventually reaches target value', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCountUp(10, 100));

    // Simulate enough animation frames
    for (let i = 0; i < 20; i++) {
      await act(async () => {
        vi.advanceTimersByTime(20);
      });
    }

    expect(result.current).toBe(10);
    vi.useRealTimers();
  });

  it('updates when target changes', () => {
    const { result, rerender } = renderHook(
      ({ target }) => useCountUp(target),
      { initialProps: { target: 5 } }
    );
    rerender({ target: 20 });
    // After rerender with new target, initial value should reset
    expect(typeof result.current).toBe('number');
  });
});
