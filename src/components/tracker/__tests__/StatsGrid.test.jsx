import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import StatsGrid from '../StatsGrid';
import { CAT_BUILDER, CAT_SOCIETY, STATUS_RESOLVED, STATUS_NEW } from '../../../lib/constants';

// Mock useCountUp to return target immediately
vi.mock('../../../hooks/useCountUp', () => ({
  useCountUp: (target) => target,
}));

const issues = [
  { issueNo: 1, category: CAT_BUILDER, status: STATUS_NEW },
  { issueNo: 2, category: CAT_BUILDER, status: STATUS_RESOLVED },
  { issueNo: 3, category: CAT_SOCIETY, status: STATUS_NEW },
  { issueNo: 4, category: CAT_SOCIETY, status: STATUS_RESOLVED },
  { issueNo: 5, category: CAT_BUILDER, status: STATUS_NEW },
];

describe('StatsGrid', () => {
  it('renders 4 stat cards', () => {
    const { container } = render(<StatsGrid issues={issues} />);
    const cards = container.querySelectorAll('.bg-bg-primary');
    expect(cards.length).toBe(4);
  });

  it('shows correct total count', () => {
    const { container } = render(<StatsGrid issues={issues} />);
    expect(container.textContent).toContain('5');
  });

  it('shows correct builder count', () => {
    const { container } = render(<StatsGrid issues={issues} />);
    expect(container.textContent).toContain('3');
  });

  it('shows correct society count', () => {
    const { container } = render(<StatsGrid issues={issues} />);
    expect(container.textContent).toContain('2');
  });

  it('shows correct resolved count', () => {
    const { container } = render(<StatsGrid issues={issues} />);
    expect(container.textContent).toContain('2');
  });

  it('has accent stripe (border-l)', () => {
    const { container } = render(<StatsGrid issues={issues} />);
    const card = container.querySelector('.border-l-\\[3px\\]');
    expect(card).toBeTruthy();
  });

  it('handles empty issues array', () => {
    const { container } = render(<StatsGrid issues={[]} />);
    const cards = container.querySelectorAll('.bg-bg-primary');
    expect(cards.length).toBe(4);
  });
});
