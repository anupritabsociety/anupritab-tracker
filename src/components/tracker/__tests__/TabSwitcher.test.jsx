import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabSwitcher from '../TabSwitcher';

describe('TabSwitcher', () => {
  it('renders two tabs', () => {
    render(<TabSwitcher current="table" onChange={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('highlights active tab', () => {
    render(<TabSwitcher current="table" onChange={vi.fn()} />);
    const tableBtn = screen.getAllByRole('button')[0];
    expect(tableBtn.className).toContain('bg-bg-primary');
    expect(tableBtn.className).toContain('font-semibold');
  });

  it('calls onChange when switching', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TabSwitcher current="table" onChange={onChange} />);

    const kanbanBtn = screen.getAllByRole('button')[1];
    await user.click(kanbanBtn);
    expect(onChange).toHaveBeenCalledWith('kanban');
  });

  it('non-active tab has transparent background', () => {
    render(<TabSwitcher current="table" onChange={vi.fn()} />);
    const kanbanBtn = screen.getAllByRole('button')[1];
    expect(kanbanBtn.className).toContain('bg-transparent');
  });
});
