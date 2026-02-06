import { CAT_BUILDER, CAT_SOCIETY, STATUS_NEW, STATUS_PROGRESS, STATUS_RESOLVED, STATUS_TO_KEY } from '../../lib/constants';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { useDragDrop } from '../../hooks/useDragDrop';

const CATEGORIES = [
  { key: CAT_BUILDER, dotClass: 'bg-builder' },
  { key: CAT_SOCIETY, dotClass: 'bg-society' },
];

const STATUSES = [
  { status: STATUS_NEW, key: 'new' },
  { status: STATUS_PROGRESS, key: 'progress' },
  { status: STATUS_RESOLVED, key: 'resolved' },
];

export default function KanbanBoard({ issues, isMcAuthenticated, onStatusUpdate }) {
  const {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleTouchStart,
  } = useDragDrop({
    onDrop: onStatusUpdate,
    enabled: isMcAuthenticated,
  });

  return (
    <div>
      {CATEGORIES.map((cat) => {
        const catIssues = issues.filter((i) => i.category === cat.key);

        return (
          <div key={cat.key} className="mb-4 border border-border rounded-xl overflow-hidden">
            {/* Swim lane header */}
            <div className="bg-bg-tertiary py-2.5 px-3.5 text-[0.82rem] font-semibold text-text-primary border-b border-border flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${cat.dotClass}`} />
              {cat.key}
            </div>

            {/* Columns */}
            <div className="grid grid-cols-3 min-h-[100px] max-[640px]:overflow-x-auto max-[640px]:[-webkit-overflow-scrolling:touch] scrollbar-none">
              {STATUSES.map((s) => {
                const colIssues = catIssues.filter((i) => i.status === s.status);
                return (
                  <KanbanColumn
                    key={s.key}
                    status={s.status}
                    statusKey={s.key}
                    category={cat.key}
                    count={colIssues.length}
                    onDragOver={(e) => handleDragOver(e, cat.key)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, cat.key, s.key)}
                  >
                    {colIssues.map((issue) => (
                      <KanbanCard
                        key={`${issue.issueNo}-${issue.status}`}
                        issue={issue}
                        draggable={isMcAuthenticated}
                        onDragStart={(e) => handleDragStart(e, issue.issueNo, cat.key)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={(e) => handleTouchStart(e, issue.issueNo, cat.key)}
                      />
                    ))}
                  </KanbanColumn>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
