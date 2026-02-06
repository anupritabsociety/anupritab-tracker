import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComplaintForm from '../ComplaintForm';

const mockShowToast = vi.fn();

vi.mock('../../../App', () => ({
  useAppContext: () => ({
    showToast: mockShowToast,
  }),
}));

vi.mock('../../../api/issues', () => ({
  submitComplaint: vi.fn(() => Promise.resolve({ success: true, results: [] })),
}));

vi.mock('../FlatSelector', () => ({
  default: ({ value, onChange }) => (
    <select data-testid="flat-selector" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select</option>
      <option value="101">101</option>
    </select>
  ),
}));

vi.mock('../CategorySelector', () => ({
  default: ({ value, onChange }) => (
    <select data-testid="category-selector" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="auto">Auto</option>
    </select>
  ),
}));

vi.mock('../PhotoUpload', () => ({
  default: () => <div data-testid="photo-upload" />,
}));

vi.mock('../ProcessingOverlay', () => ({
  default: ({ show }) => show ? <div data-testid="processing" /> : null,
}));

describe('ComplaintForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<ComplaintForm onSuccess={vi.fn()} />);
    expect(screen.getByPlaceholderText(/\u0928\u093e\u0935/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/98/)).toBeInTheDocument();
  });

  it('shows error toast on empty submission', () => {
    render(<ComplaintForm onSuccess={vi.fn()} />);
    const form = screen.getByRole('button', { name: /\u0938\u092c\u092e\u093f\u091f/ }).closest('form');
    // Submit the form directly to bypass browser validation
    fireEvent.submit(form);
    expect(mockShowToast).toHaveBeenCalledWith(expect.any(String), 'error');
  });

  it('accepts phone number input (digits only)', async () => {
    const user = userEvent.setup();
    render(<ComplaintForm onSuccess={vi.fn()} />);

    const phoneInput = screen.getByPlaceholderText(/98/);
    await user.type(phoneInput, 'abc123');
    expect(phoneInput).toHaveValue('123');
  });

  it('limits phone to 10 digits', async () => {
    const user = userEvent.setup();
    render(<ComplaintForm onSuccess={vi.fn()} />);

    const phoneInput = screen.getByPlaceholderText(/98/);
    await user.type(phoneInput, '12345678901234');
    expect(phoneInput.value.length).toBeLessThanOrEqual(10);
  });

  it('renders submit button', () => {
    render(<ComplaintForm onSuccess={vi.fn()} />);
    expect(screen.getByRole('button', { name: /\u0938\u092c\u092e\u093f\u091f/ })).toBeInTheDocument();
  });
});
