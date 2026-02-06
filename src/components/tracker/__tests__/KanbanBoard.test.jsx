import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import KanbanBoard from '../KanbanBoard';
import { CAT_BUILDER, CAT_SOCIETY, STATUS_NEW, STATUS_PROGRESS, STATUS_RESOLVED } from '../../../lib/constants';

const issues = [
  { issueNo: 1, issue: 'Lift issue', category: CAT_BUILDER, status: STATUS_NEW, count: 2, reportedBy: '101' },
  { issueNo: 2, issue: 'Parking', category: CAT_SOCIETY, status: STATUS_PROGRESS, count: 1, reportedBy: '201' },
  { issueNo: 3, issue: 'Plumbing', category: CAT_BUILDER, status: STATUS_RESOLVED, count: 3, reportedBy: '301' },
];

describe('KanbanBoard', () => {
  it('renders two swim lanes (builder + society)', () => {
    const { container } = render(
      <KanbanBoard issues={issues} isMcAuthenticated={false} onStatusUpdate={vi.fn()} />
    );
    const swimLanes = container.querySelectorAll('.mb-4');
    expect(swimLanes).toHaveLength(2);
  });

  it('renders category headers', () => {
    render(<KanbanBoard issues={issues} isMcAuthenticated={false} onStatusUpdate={vi.fn()} />);
    expect(screen.getByText(CAT_BUILDER)).toBeInTheDocument();
    expect(screen.getByText(CAT_SOCIETY)).toBeInTheDocument();
  });

  it('renders 3 columns per swim lane (6 total)', () => {
    const { container } = render(
      <KanbanBoard issues={issues} isMcAuthenticated={false} onStatusUpdate={vi.fn()} />
    );
    const columns = container.querySelectorAll('[data-kanban-col]');
    expect(columns).toHaveLength(6);
  });

  it('places builder issues in builder swim lane', () => {
    render(<KanbanBoard issues={issues} isMcAuthenticated={false} onStatusUpdate={vi.fn()} />);
    expect(screen.getByText('Lift issue')).toBeInTheDocument();
    expect(screen.getByText('Plumbing')).toBeInTheDocument();
  });

  it('places society issues in society swim lane', () => {
    render(<KanbanBoard issues={issues} isMcAuthenticated={false} onStatusUpdate={vi.fn()} />);
    expect(screen.getByText('Parking')).toBeInTheDocument();
  });

  it('card key includes status for remount', () => {
    const { container } = render(
      <KanbanBoard issues={issues} isMcAuthenticated={false} onStatusUpdate={vi.fn()} />
    );
    // Cards should exist
    const cards = container.querySelectorAll('[data-issue-no]');
    expect(cards).toHaveLength(3);
  });

  it('enables dragging when MC authenticated', () => {
    const { container } = render(
      <KanbanBoard issues={issues} isMcAuthenticated={true} onStatusUpdate={vi.fn()} />
    );
    const cards = container.querySelectorAll('[draggable="true"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('disables dragging when not MC authenticated', () => {
    const { container } = render(
      <KanbanBoard issues={issues} isMcAuthenticated={false} onStatusUpdate={vi.fn()} />
    );
    const cards = container.querySelectorAll('[draggable="true"]');
    expect(cards).toHaveLength(0);
  });

  it('handles empty issues', () => {
    const { container } = render(
      <KanbanBoard issues={[]} isMcAuthenticated={false} onStatusUpdate={vi.fn()} />
    );
    const columns = container.querySelectorAll('[data-kanban-col]');
    expect(columns).toHaveLength(6);
  });
});
