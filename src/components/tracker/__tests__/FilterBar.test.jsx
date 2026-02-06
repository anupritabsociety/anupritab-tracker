import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBar from '../FilterBar';
import { CAT_BUILDER, CAT_SOCIETY, STATUS_NEW, STATUS_RESOLVED } from '../../../lib/constants';

const issues = [
  { issueNo: 1, category: CAT_BUILDER, status: STATUS_NEW },
  { issueNo: 2, category: CAT_SOCIETY, status: STATUS_RESOLVED },
];

describe('FilterBar', () => {
  it('renders all filter buttons', () => {
    render(<FilterBar issues={issues} current="all" onChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(5);
  });

  it('highlights active filter', () => {
    render(<FilterBar issues={issues} current="all" onChange={vi.fn()} />);
    const allBtn = screen.getAllByRole('button')[0];
    expect(allBtn.className).toContain('bg-accent');
    expect(allBtn.className).toContain('text-white');
  });

  it('calls onChange on filter click', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<FilterBar issues={issues} current="all" onChange={onChange} />);

    const builderBtn = screen.getAllByRole('button')[1];
    await user.click(builderBtn);
    expect(onChange).toHaveBeenCalledWith('builder');
  });

  it('shows count badges', () => {
    const { container } = render(<FilterBar issues={issues} current="all" onChange={vi.fn()} />);
    // Should have count badges for non-zero counts
    const countBadges = container.querySelectorAll('.min-w-\\[18px\\]');
    expect(countBadges.length).toBeGreaterThan(0);
  });

  it('non-active filters have border styling', () => {
    render(<FilterBar issues={issues} current="all" onChange={vi.fn()} />);
    const builderBtn = screen.getAllByRole('button')[1];
    expect(builderBtn.className).toContain('border-border');
  });
});
