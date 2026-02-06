import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TableView from '../TableView';
import { CAT_BUILDER, CAT_SOCIETY, STATUS_NEW, STATUS_PROGRESS } from '../../../lib/constants';

const issues = [
  { issueNo: 1, issue: 'Lift broken', category: CAT_BUILDER, status: STATUS_NEW, priority: 'High', count: 3 },
  { issueNo: 2, issue: 'Parking issue', category: CAT_SOCIETY, status: STATUS_PROGRESS, priority: 'Medium', count: 1 },
];

describe('TableView', () => {
  it('renders correct number of rows', () => {
    render(<TableView issues={issues} />);
    const rows = screen.getAllByRole('row');
    // 1 header + 2 data rows
    expect(rows).toHaveLength(3);
  });

  it('shows issue numbers', () => {
    const { container } = render(<TableView issues={issues} />);
    const numberCells = container.querySelectorAll('td.w-9');
    expect(numberCells[0].textContent.trim()).toBe('1');
    expect(numberCells[1].textContent.trim()).toBe('2');
  });

  it('shows issue descriptions', () => {
    render(<TableView issues={issues} />);
    expect(screen.getByText('Lift broken')).toBeInTheDocument();
    expect(screen.getByText('Parking issue')).toBeInTheDocument();
  });

  it('shows count badges', () => {
    render(<TableView issues={issues} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('has sticky header', () => {
    const { container } = render(<TableView issues={issues} />);
    const th = container.querySelector('th');
    expect(th.className).toContain('sticky');
  });

  it('has backdrop-blur on header', () => {
    const { container } = render(<TableView issues={issues} />);
    const th = container.querySelector('th');
    expect(th.className).toContain('backdrop-blur');
  });

  it('rows have hover highlight', () => {
    const { container } = render(<TableView issues={issues} />);
    const tr = container.querySelectorAll('tbody tr')[0];
    expect(tr.className).toContain('hover:bg-accent-light');
  });

  it('renders empty table with no issues', () => {
    render(<TableView issues={[]} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1); // just header
  });
});
