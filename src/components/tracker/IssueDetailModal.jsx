import { CategoryBadge, StatusBadge, PriorityBadge } from '../shared/Badge';

export default function IssueDetailModal({ issue, onClose }) {
  if (!issue) return null;

  const rb = issue.reportedBy ? String(issue.reportedBy) : '';
  const flats = rb ? rb.split(',').map((f) => f.trim()) : [];

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-[3px] z-[3000]"
      onClick={onClose}
    >
      <div
        className="fixed bottom-0 inset-x-0 max-h-[85vh] bg-bg-primary rounded-t-2xl overflow-y-auto animate-slide-up border-t border-border shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-bg-primary z-[1]">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-5 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[0.82rem] font-bold text-text-muted">
              #{issue.issueNo}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-tertiary text-text-muted cursor-pointer border-none hover:bg-border transition-colors duration-150"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Full issue text */}
          <p className="text-[0.88rem] font-medium text-text-primary leading-relaxed mb-4">
            {issue.issue}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <CategoryBadge category={issue.category} />
            <PriorityBadge priority={issue.priority} />
            <StatusBadge status={issue.status} />
          </div>

          {/* Details */}
          <div className="space-y-3 text-[0.78rem]">
            {/* Reported By */}
            {flats.length > 0 && (
              <div>
                <div className="text-text-muted text-[0.7rem] font-semibold mb-1.5">
                  {'\u0924\u0915\u094d\u0930\u093e\u0930\u0926\u093e\u0930'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {flats.map((flat) => (
                    <span
                      key={flat}
                      className="inline-block px-2.5 py-1 bg-bg-tertiary rounded-lg text-[0.72rem] font-medium text-text-secondary"
                    >
                      {flat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Count */}
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-[0.7rem] font-semibold">
                {'\u0924\u0915\u094d\u0930\u093e\u0930\u0940 \u0938\u0902\u0916\u094d\u092f\u093e'}:
              </span>
              <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-xl bg-accent text-white text-[0.7rem] font-semibold px-1.5">
                {issue.count || 0}
              </span>
            </div>

            {/* Last Updated */}
            {issue.lastUpdated && (
              <div className="flex items-center gap-2">
                <span className="text-text-muted text-[0.7rem] font-semibold">
                  {'\u0936\u0947\u0935\u091f\u091a\u0947 \u0905\u0926\u094d\u092f\u092f\u093e\u0935\u0924'}:
                </span>
                <span className="text-text-secondary text-[0.72rem]">
                  {issue.lastUpdated}
                </span>
              </div>
            )}

            {/* AI Notes */}
            {issue.aiNotes && (
              <div className="mt-3 pt-3 border-t border-border-light">
                <div className="text-text-muted text-[0.7rem] font-semibold mb-1.5 flex items-center gap-1">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-accent">
                    <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm0 3a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 4zm0 7a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                  AI Notes
                </div>
                <p className="text-[0.75rem] text-text-secondary leading-relaxed bg-bg-secondary rounded-lg p-3">
                  {issue.aiNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
