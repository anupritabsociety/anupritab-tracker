import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SubmitPage from '../SubmitPage';

const mockNavigateTo = vi.fn();
const mockDispatch = vi.fn();

vi.mock('../../../App', () => ({
  useAppContext: () => ({
    navigateTo: mockNavigateTo,
    dispatch: mockDispatch,
    showToast: vi.fn(),
  }),
}));

vi.mock('../ComplaintForm', () => ({
  default: ({ onSuccess }) => (
    <button data-testid="mock-form" onClick={() => onSuccess([{ issueNo: 1 }])}>
      Submit
    </button>
  ),
}));

vi.mock('../SuccessCard', () => ({
  default: ({ onViewTracker, onClose }) => (
    <div data-testid="success-card">
      <button onClick={onViewTracker}>View</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock('../../layout/Footer', () => ({
  default: () => <div data-testid="footer" />,
}));

describe('SubmitPage', () => {
  it('renders complaint form', () => {
    render(<SubmitPage />);
    expect(screen.getByTestId('mock-form')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<SubmitPage />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders page title', () => {
    const { container } = render(<SubmitPage />);
    expect(container.textContent).toContain('\u0924\u0915\u094d\u0930\u093e\u0930');
  });

  it('shows success card after submission', async () => {
    const { getByTestId, findByTestId } = render(<SubmitPage />);
    const form = getByTestId('mock-form');
    form.click();
    const card = await findByTestId('success-card');
    expect(card).toBeInTheDocument();
  });

  it('dispatches RESET_TRACKER on success', () => {
    const { getByTestId } = render(<SubmitPage />);
    getByTestId('mock-form').click();
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RESET_TRACKER' });
  });
});
