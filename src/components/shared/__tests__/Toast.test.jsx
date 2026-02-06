import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when toast is null', () => {
    const { container } = render(<Toast toast={null} onDismiss={vi.fn()} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders success toast', () => {
    render(<Toast toast={{ message: 'Success!', type: 'success' }} onDismiss={vi.fn()} />);
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('renders error toast', () => {
    render(<Toast toast={{ message: 'Error!', type: 'error' }} onDismiss={vi.fn()} />);
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  it('renders info toast', () => {
    render(<Toast toast={{ message: 'Info', type: 'info' }} onDismiss={vi.fn()} />);
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('defaults to info type', () => {
    const { container } = render(<Toast toast={{ message: 'Test' }} onDismiss={vi.fn()} />);
    expect(container.querySelector('.bg-\\[\\#3B82F6\\]')).toBeTruthy();
  });

  it('has animate-toast-in class initially', () => {
    const { container } = render(<Toast toast={{ message: 'Test', type: 'success' }} onDismiss={vi.fn()} />);
    expect(container.firstChild.className).toContain('animate-toast-in');
  });

  it('auto-dismisses after 3 seconds', () => {
    const onDismiss = vi.fn();
    render(<Toast toast={{ message: 'Test', type: 'success' }} onDismiss={onDismiss} />);

    act(() => {
      vi.advanceTimersByTime(3300);
    });

    expect(onDismiss).toHaveBeenCalled();
  });

  it('calls onDismiss on click', async () => {
    vi.useRealTimers();
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(<Toast toast={{ message: 'Click me', type: 'info' }} onDismiss={onDismiss} />);

    await user.click(screen.getByText('Click me'));
    expect(onDismiss).toHaveBeenCalled();
  });
});
