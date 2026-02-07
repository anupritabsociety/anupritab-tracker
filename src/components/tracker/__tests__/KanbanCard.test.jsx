import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import KanbanCard from '../KanbanCard';

const mockIssue = {
  issueNo: 42,
  issue: 'Water leaking',
  category: 'Builder',
  status: 'New',
  count: 5,
  reportedBy: '101, 201, 301, 401',
};

describe('KanbanCard', () => {
  it('renders issue number', () => {
    render(<KanbanCard issue={mockIssue} draggable={false} />);
    expect(screen.getByText('#42')).toBeInTheDocument();
  });

  it('renders issue title', () => {
    render(<KanbanCard issue={mockIssue} draggable={false} />);
    expect(screen.getByText('Water leaking')).toBeInTheDocument();
  });

  it('renders count badge', () => {
    render(<KanbanCard issue={mockIssue} draggable={false} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows max 3 flat chips + overflow', () => {
    render(<KanbanCard issue={mockIssue} draggable={false} />);
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('201')).toBeInTheDocument();
    expect(screen.getByText('301')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('has cursor-grab when draggable', () => {
    const { container } = render(<KanbanCard issue={mockIssue} draggable={true} />);
    expect(container.firstChild.className).toContain('cursor-grab');
  });

  it('has cursor-pointer when not draggable', () => {
    const { container } = render(<KanbanCard issue={mockIssue} draggable={false} />);
    expect(container.firstChild.className).toContain('cursor-pointer');
  });

  it('shows grip dots when draggable', () => {
    const { container } = render(<KanbanCard issue={mockIssue} draggable={true} />);
    const gripSvg = container.querySelector('svg');
    expect(gripSvg).toBeTruthy();
  });

  it('does not show grip dots when not draggable', () => {
    const { container } = render(<KanbanCard issue={mockIssue} draggable={false} />);
    const grips = container.querySelectorAll('svg');
    expect(grips).toHaveLength(0);
  });

  it('has shadow-sm class', () => {
    const { container } = render(<KanbanCard issue={mockIssue} draggable={false} />);
    expect(container.firstChild.className).toContain('shadow-sm');
  });

  it('handles empty reportedBy', () => {
    const issue = { ...mockIssue, reportedBy: '' };
    const { container } = render(<KanbanCard issue={issue} draggable={false} />);
    expect(container.textContent).not.toContain('+');
  });

  it('handles count of 0', () => {
    const issue = { ...mockIssue, count: 0 };
    render(<KanbanCard issue={issue} draggable={false} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('escapes HTML in issue text', () => {
    const issue = { ...mockIssue, issue: '<script>alert("xss")</script>' };
    const { container } = render(<KanbanCard issue={issue} draggable={false} />);
    expect(container.innerHTML).not.toContain('<script>');
  });
});
