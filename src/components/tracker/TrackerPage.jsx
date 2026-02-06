import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../../App';
import { updateStatus } from '../../api/issues';
import { KEY_TO_STATUS, STATUS_TO_KEY } from '../../lib/constants';
import { filterIssues } from '../../lib/filters';
import StatsGrid from './StatsGrid';
import FilterBar from './FilterBar';
import TabSwitcher from './TabSwitcher';
import TableView from './TableView';
import KanbanBoard from './KanbanBoard';
import EmptyState from './EmptyState';
import PinModal from '../shared/PinModal';
import Footer from '../layout/Footer';

export default function TrackerPage() {
  const {
    issues,
    loading,
    error,
    loadIssues,
    updateIssueLocally,
    revertIssues,
    currentFilter,
    currentTab,
    isMcAuthenticated,
    dispatch,
    showToast,
  } = useAppContext();
  const [pinOpen, setPinOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (issues.length === 0 && !loading && !error) {
      loadIssues();
    }
  }, []);

  const filtered = filterIssues(issues, currentFilter);

  const handleMcLogin = () => {
    if (isMcAuthenticated) {
      dispatch({ type: 'SET_MC_AUTH', payload: false });
    } else {
      setPinOpen(true);
    }
  };

  const handleStatusUpdate = useCallback(
    async (issueNo, statusKey) => {
      if (updating) return;
      const newStatus = KEY_TO_STATUS[statusKey];
      if (!newStatus) return;

      setUpdating(true);
      updateIssueLocally(issueNo, newStatus);

      try {
        const result = await updateStatus(issueNo, statusKey);
        if (result.success) {
          showToast('\u0938\u094d\u0925\u093f\u0924\u0940 \u0905\u0926\u094d\u092f\u092f\u093e\u0935\u0924 \u0915\u0947\u0932\u0940', 'success');
        } else {
          revertIssues();
          showToast('\u0938\u094d\u0925\u093f\u0924\u0940 \u092c\u0926\u0932\u0924\u093e \u0906\u0932\u0940 \u0928\u093e\u0939\u0940', 'error');
        }
      } catch {
        revertIssues();
        showToast('\u0928\u0947\u091f\u0935\u0930\u094d\u0915 \u0924\u094d\u0930\u0941\u091f\u0940 \u2014 \u092a\u0941\u0928\u094d\u0939\u093e \u092a\u094d\u0930\u092f\u0924\u094d\u0928 \u0915\u0930\u093e', 'error');
      } finally {
        setUpdating(false);
      }
    },
    [updating, updateIssueLocally, revertIssues, showToast],
  );

  return (
    <div className="max-w-[640px] mx-auto px-3.5 py-3 pb-[calc(56px+16px+env(safe-area-inset-bottom,0px))]">
      <StatsGrid issues={issues} />

      {/* Issues Section */}
      <div
        className="bg-bg-primary rounded-2xl py-[18px] px-4 mb-3 border border-border animate-fade-in-up"
        style={{ animationDelay: '0.1s' }}
      >
        {/* Section header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="text-[0.92rem] font-semibold text-text-primary flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
            {'\u0938\u0926\u094d\u092f\u0938\u094d\u0925\u093f\u0924\u0940'}
          </div>
          <button
            onClick={handleMcLogin}
            className={`py-1.5 px-2.5 border rounded-lg text-[0.68rem] font-medium cursor-pointer transition-all duration-150 ${
              isMcAuthenticated
                ? 'bg-accent text-white border-accent'
                : 'bg-bg-primary text-text-muted border-border hover:border-accent hover:text-accent'
            }`}
          >
            {isMcAuthenticated ? 'MC \u092e\u094b\u0921' : 'MC \u0932\u0949\u0917\u093f\u0928'}
          </button>
        </div>

        <TabSwitcher
          current={currentTab}
          onChange={(tab) => dispatch({ type: 'SET_TAB', payload: tab })}
        />

        <FilterBar
          issues={issues}
          current={currentFilter}
          onChange={(f) => dispatch({ type: 'SET_FILTER', payload: f })}
        />

        {loading && <SkeletonTable />}
        {error && <EmptyState type="error" message={error} onRetry={loadIssues} />}
        {!loading && !error && filtered.length === 0 && <EmptyState type="empty" />}

        {!loading && !error && filtered.length > 0 && (
          <>
            {currentTab === 'table' && <TableView issues={filtered} />}
            {currentTab === 'kanban' && (
              <KanbanBoard
                issues={filtered}
                isMcAuthenticated={isMcAuthenticated}
                onStatusUpdate={handleStatusUpdate}
                updating={updating}
              />
            )}
          </>
        )}
      </div>

      <Footer />
      <PinModal open={pinOpen} onClose={() => setPinOpen(false)} />
    </div>
  );
}

function SkeletonTable() {
  return (
    <table className="w-full border-collapse">
      <tbody>
        {[...Array(5)].map((_, i) => (
          <tr key={i}>
            <td className="py-2.5 px-3 border-b border-border-light">
              <div className="h-3 w-[30px] rounded-md animate-shimmer" />
            </td>
            <td className="py-2.5 px-3 border-b border-border-light">
              <div className={`h-3 rounded-md animate-shimmer ${i % 2 === 0 ? 'w-[90%]' : 'w-[70%]'}`} />
            </td>
            <td className="py-2.5 px-3 border-b border-border-light">
              <div className="inline-block w-[50px] h-5 rounded-full animate-shimmer" />
            </td>
            <td className="py-2.5 px-3 border-b border-border-light">
              <div className="inline-block w-[50px] h-5 rounded-full animate-shimmer" />
            </td>
            <td className="py-2.5 px-3 border-b border-border-light">
              <div className="h-3 w-[30px] rounded-md animate-shimmer" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
