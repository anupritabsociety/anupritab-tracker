import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrackerPage from '../TrackerPage';
import { CAT_BUILDER, STATUS_NEW } from '../../../lib/constants';

const mockIssues = [
  { issueNo: 1, issue: 'Test issue', category: CAT_BUILDER, status: STATUS_NEW, priority: 'High', count: 2, reportedBy: '101', statusKey: 'new' },
];

const mockDispatch = vi.fn();
const mockLoadIssues = vi.fn();
const mockShowToast = vi.fn();

vi.mock('../../../App', () => ({
  useAppContext: () => ({
    issues: mockIssues,
    loading: false,
    error: null,
    loadIssues: mockLoadIssues,
    updateIssueLocally: vi.fn(),
    revertIssues: vi.fn(),
    currentFilter: 'all',
    currentTab: 'table',
    isMcAuthenticated: false,
    dispatch: mockDispatch,
    showToast: mockShowToast,
  }),
}));

vi.mock('../../../api/issues', () => ({
  updateStatus: vi.fn(() => Promise.resolve({ success: true })),
}));

vi.mock('../../shared/PinModal', () => ({
  default: () => null,
}));

describe('TrackerPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders stats grid', () => {
    const { container } = render(<TrackerPage />);
    expect(container.querySelector('.grid')).toBeTruthy();
  });

  it('renders filter bar', () => {
    render(<TrackerPage />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(3);
  });

  it('renders table view by default', () => {
    render(<TrackerPage />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows MC login button', () => {
    render(<TrackerPage />);
    const mcBtn = screen.getByText(/MC/);
    expect(mcBtn).toBeInTheDocument();
  });

  it('renders footer', () => {
    const { container } = render(<TrackerPage />);
    expect(container.textContent).toContain('\u0905\u0928\u0941\u092a\u094d\u0930\u093f\u0924\u093e');
  });

  it('shows issue data in table', () => {
    render(<TrackerPage />);
    expect(screen.getByText('Test issue')).toBeInTheDocument();
  });
});
