import { createContext, useReducer, useContext, useCallback } from 'react';
import { useHashRouter } from './hooks/useHashRouter';
import { useIssues } from './hooks/useIssues';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import SubmitPage from './components/submit/SubmitPage';
import TrackerPage from './components/tracker/TrackerPage';
import Toast from './components/shared/Toast';

const AppContext = createContext();

const initialState = {
  currentFilter: 'all',
  currentTab: 'table',
  isMcAuthenticated: false,
  trackerDataLoaded: false,
  toast: null,
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
    case 'RESET_TRACKER':
      return { ...state, trackerDataLoaded: false };
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

export function useAppContext() {
  return useContext(AppContext);
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { page, navigateTo } = useHashRouter('submit');
  const issuesHook = useIssues();

  const navigate = useCallback(
    (target) => {
      navigateTo(target);
      if (target === 'tracker' && !state.trackerDataLoaded) {
        issuesHook.loadIssues();
        dispatch({ type: 'SET_TRACKER_LOADED' });
      }
    },
    [navigateTo, state.trackerDataLoaded, issuesHook.loadIssues],
  );

  const showToast = useCallback(
    (message, type = 'info') => {
      dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
    },
    [],
  );

  const contextValue = {
    ...state,
    dispatch,
    page,
    navigateTo: navigate,
    showToast,
    ...issuesHook,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <Header />
      <div className="animate-page-fade-in">
        {page === 'submit' && <SubmitPage />}
        {page === 'tracker' && <TrackerPage />}
      </div>
      <BottomNav />
      <Toast
        toast={state.toast}
        onDismiss={() => dispatch({ type: 'HIDE_TOAST' })}
      />
    </AppContext.Provider>
  );
}
