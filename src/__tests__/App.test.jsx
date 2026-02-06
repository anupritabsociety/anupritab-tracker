import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock API to prevent real network calls
vi.mock('../api/issues', () => ({
  getIssues: vi.fn(() => Promise.resolve({ success: true, issues: [] })),
  verifyPin: vi.fn(),
  submitComplaint: vi.fn(),
  updateStatus: vi.fn(),
}));

// Mock child components for isolation
vi.mock('../components/layout/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../components/layout/BottomNav', () => ({
  default: () => <div data-testid="bottom-nav">Nav</div>,
}));

vi.mock('../components/submit/SubmitPage', () => ({
  default: () => <div data-testid="submit-page">Submit</div>,
}));

vi.mock('../components/tracker/TrackerPage', () => ({
  default: () => <div data-testid="tracker-page">Tracker</div>,
}));

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders header', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders bottom navigation', () => {
    render(<App />);
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();
  });

  it('defaults to submit page', () => {
    render(<App />);
    expect(screen.getByTestId('submit-page')).toBeInTheDocument();
  });

  it('shows tracker page when hash is tracker', () => {
    window.location.hash = 'tracker';
    render(<App />);
    expect(screen.getByTestId('tracker-page')).toBeInTheDocument();
  });

  it('does not render Toast when no toast state', () => {
    const { container } = render(<App />);
    // Toast renders nothing when null
    const toasts = container.querySelectorAll('.fixed.top-4');
    expect(toasts).toHaveLength(0);
  });

  it('provides context via useAppContext', () => {
    // App renders without error means context is provided
    expect(() => render(<App />)).not.toThrow();
  });

  it('has page fade-in animation wrapper', () => {
    const { container } = render(<App />);
    const animDiv = container.querySelector('.animate-page-fade-in');
    expect(animDiv).toBeTruthy();
  });
});
