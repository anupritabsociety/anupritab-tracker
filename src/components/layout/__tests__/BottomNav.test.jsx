import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BottomNav from '../BottomNav';

const mockNavigateTo = vi.fn();

vi.mock('../../../App', () => ({
  useAppContext: () => ({
    page: 'submit',
    navigateTo: mockNavigateTo,
  }),
}));

describe('BottomNav', () => {
  it('renders two tab buttons', () => {
    render(<BottomNav />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('shows active styling for current page', () => {
    render(<BottomNav />);
    const submitBtn = screen.getAllByRole('button')[0];
    expect(submitBtn.className).toContain('text-accent');
  });

  it('calls navigateTo on tab click', async () => {
    const user = userEvent.setup();
    render(<BottomNav />);
    const trackerBtn = screen.getAllByRole('button')[1];
    await user.click(trackerBtn);
    expect(mockNavigateTo).toHaveBeenCalledWith('tracker');
  });

  it('has backdrop-blur-lg class', () => {
    const { container } = render(<BottomNav />);
    const nav = container.querySelector('nav');
    expect(nav.className).toContain('backdrop-blur-lg');
  });

  it('has active indicator for current tab', () => {
    const { container } = render(<BottomNav />);
    const indicator = container.querySelector('.bg-accent.rounded-b-full');
    expect(indicator).toBeTruthy();
  });
});
