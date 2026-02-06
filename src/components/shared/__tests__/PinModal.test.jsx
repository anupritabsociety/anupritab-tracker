import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PinModal from '../PinModal';

const mockVerifyPin = vi.fn();
const mockDispatch = vi.fn();

vi.mock('../../../api/issues', () => ({
  verifyPin: (...args) => mockVerifyPin(...args),
}));

vi.mock('../../../App', () => ({
  useAppContext: () => ({ dispatch: mockDispatch }),
}));

describe('PinModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<PinModal open={false} onClose={vi.fn()} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders lock icon when open', () => {
    render(<PinModal open={true} onClose={vi.fn()} />);
    expect(screen.getByText(/MC/)).toBeInTheDocument();
  });

  it('renders 4 digit boxes', () => {
    const { container } = render(<PinModal open={true} onClose={vi.fn()} />);
    const digitBoxes = container.querySelectorAll('.w-10.h-12');
    expect(digitBoxes).toHaveLength(4);
  });

  it('renders numeric keypad (0-9)', () => {
    render(<PinModal open={true} onClose={vi.fn()} />);
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it('fills digit on keypad click', async () => {
    const user = userEvent.setup();
    const { container } = render(<PinModal open={true} onClose={vi.fn()} />);

    await user.click(screen.getByText('1'));

    const dots = container.querySelectorAll('.w-3.h-3.rounded-full.bg-accent');
    expect(dots).toHaveLength(1);
  });

  it('removes digit on backspace click', async () => {
    const user = userEvent.setup();
    const { container } = render(<PinModal open={true} onClose={vi.fn()} />);

    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('2'));

    const buttons = container.querySelectorAll('button');
    const backspaceBtn = Array.from(buttons).find(b => b.querySelector('svg line'));
    await user.click(backspaceBtn);

    const dots = container.querySelectorAll('.w-3.h-3.rounded-full.bg-accent');
    expect(dots).toHaveLength(1);
  });

  it('auto-submits on 4th digit', async () => {
    mockVerifyPin.mockResolvedValue({ valid: true });
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<PinModal open={true} onClose={onClose} />);

    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('2'));
    await user.click(screen.getByText('3'));
    await user.click(screen.getByText('4'));

    await waitFor(() => {
      expect(mockVerifyPin).toHaveBeenCalledWith('1234');
    });
  });

  it('calls onClose on cancel click', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<PinModal open={true} onClose={onClose} />);

    const cancelBtn = screen.getByRole('button', { name: /\u0930\u0926\u094d\u0926/ });
    await user.click(cancelBtn);

    expect(onClose).toHaveBeenCalled();
  });

  it('shows error on wrong PIN', async () => {
    mockVerifyPin.mockResolvedValue({ valid: false });
    const user = userEvent.setup();
    const { container } = render(<PinModal open={true} onClose={vi.fn()} />);

    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('1'));
    await user.click(screen.getByText('1'));

    await waitFor(() => {
      const errorEl = container.querySelector('.text-critical');
      expect(errorEl.textContent).toContain('PIN');
    });
  });
});
