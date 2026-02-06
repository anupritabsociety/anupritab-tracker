import { render } from '@testing-library/react';
import { createContext, useReducer, useContext, useCallback } from 'react';
import { STATUS_NEW, STATUS_PROGRESS, STATUS_RESOLVED, CAT_BUILDER, CAT_SOCIETY } from '../lib/constants';

const AppContext = createContext();

const defaultState = {
  currentFilter: 'all',
  currentTab: 'table',
  isMcAuthenticated: false,
  trackerDataLoaded: false,
  toast: null,
  page: 'submit',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, currentFilter: action.payload };
    case 'SET_TAB':
      return { ...state, currentTab: action.payload };
    case 'SET_MC_AUTH':
      return { ...state, isMcAuthenticated: action.payload };
    case 'SET_TRACKER_LOADED':
      return { ...state, trackerDataLoaded: true };
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

function TestProvider({ children, overrides = {} }) {
  const [state, dispatch] = useReducer(reducer, { ...defaultState, ...overrides });

  const contextValue = {
    ...state,
    dispatch,
    navigateTo: vi.fn(),
    showToast: vi.fn(),
    issues: overrides.issues || [],
    loading: overrides.loading || false,
    error: overrides.error || null,
    loadIssues: vi.fn(),
    updateIssueLocally: vi.fn(),
    revertIssues: vi.fn(),
    ...overrides,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}

export function renderWithContext(ui, { overrides = {}, ...options } = {}) {
  function Wrapper({ children }) {
    return <TestProvider overrides={overrides}>{children}</TestProvider>;
  }
  return render(ui, { wrapper: Wrapper, ...options });
}

export function createMockIssue(overrides = {}) {
  return {
    issueNo: 1,
    issue: 'Test issue description',
    category: CAT_BUILDER,
    status: STATUS_NEW,
    priority: 'High',
    reportedBy: '101',
    count: 2,
    statusKey: 'new',
    ...overrides,
  };
}

export function createMockIssues(count = 5) {
  const categories = [CAT_BUILDER, CAT_SOCIETY];
  const statuses = [STATUS_NEW, STATUS_PROGRESS, STATUS_RESOLVED];
  const statusKeys = ['new', 'progress', 'resolved'];
  const priorities = ['High', 'Medium', 'Low'];

  return Array.from({ length: count }, (_, i) => ({
    issueNo: i + 1,
    issue: `Test issue ${i + 1}`,
    category: categories[i % 2],
    status: statuses[i % 3],
    priority: priorities[i % 3],
    reportedBy: `${(i + 1) * 100 + 1}`,
    count: i + 1,
    statusKey: statusKeys[i % 3],
  }));
}
