import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryBadge, StatusBadge, PriorityBadge } from '../Badge';
import { CAT_BUILDER, CAT_SOCIETY, STATUS_NEW, STATUS_PROGRESS, STATUS_RESOLVED } from '../../../lib/constants';

describe('CategoryBadge', () => {
  it('renders builder badge with solid purple', () => {
    const { container } = render(<CategoryBadge category={CAT_BUILDER} />);
    const badge = container.querySelector('span');
    expect(badge).toHaveTextContent(CAT_BUILDER);
    expect(badge.className).toContain('bg-[#7C3AED]');
    expect(badge.className).toContain('text-white');
  });

  it('renders society badge with solid blue', () => {
    const { container } = render(<CategoryBadge category={CAT_SOCIETY} />);
    const badge = container.querySelector('span');
    expect(badge).toHaveTextContent(CAT_SOCIETY);
    expect(badge.className).toContain('bg-[#0284C7]');
    expect(badge.className).toContain('text-white');
  });

  it('returns null for empty category', () => {
    const { container } = render(<CategoryBadge category={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('has shadow-sm class', () => {
    const { container } = render(<CategoryBadge category={CAT_BUILDER} />);
    expect(container.querySelector('span').className).toContain('shadow-sm');
  });

  it('has font-bold class', () => {
    const { container } = render(<CategoryBadge category={CAT_BUILDER} />);
    expect(container.querySelector('span').className).toContain('font-bold');
  });
});

describe('StatusBadge', () => {
  it('renders new status', () => {
    render(<StatusBadge status={STATUS_NEW} />);
    expect(screen.getByText(STATUS_NEW)).toBeInTheDocument();
  });

  it('renders progress status', () => {
    render(<StatusBadge status={STATUS_PROGRESS} />);
    expect(screen.getByText(STATUS_PROGRESS)).toBeInTheDocument();
  });

  it('renders resolved status', () => {
    render(<StatusBadge status={STATUS_RESOLVED} />);
    expect(screen.getByText(STATUS_RESOLVED)).toBeInTheDocument();
  });

  it('returns null for empty status', () => {
    const { container } = render(<StatusBadge status={null} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('PriorityBadge', () => {
  it('renders high priority with red', () => {
    const { container } = render(<PriorityBadge priority="High" />);
    const badge = container.querySelector('span');
    expect(badge.className).toContain('bg-[#FEF2F2]');
  });

  it('renders medium priority with amber', () => {
    const { container } = render(<PriorityBadge priority="Medium" />);
    const badge = container.querySelector('span');
    expect(badge.className).toContain('bg-[#FFFBEB]');
  });

  it('renders low priority with green', () => {
    const { container } = render(<PriorityBadge priority="Low" />);
    const badge = container.querySelector('span');
    expect(badge.className).toContain('bg-[#F0FDF4]');
  });

  it('returns null for empty priority', () => {
    const { container } = render(<PriorityBadge priority={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('handles case-insensitive priority', () => {
    const { container } = render(<PriorityBadge priority="HIGH PRIORITY" />);
    const badge = container.querySelector('span');
    expect(badge.className).toContain('bg-[#FEF2F2]');
  });
});
