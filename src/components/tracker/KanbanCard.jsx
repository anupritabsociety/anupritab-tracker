import { memo, useRef, useCallback } from 'react';

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

const KanbanCard = memo(function KanbanCard({ issue, draggable, onDragStart, onDragEnd, onTouchStart, onClick }) {
  const hasDraggedRef = useRef(false);

  const rb = issue.reportedBy ? String(issue.reportedBy) : '';
  const flats = rb ? rb.split(',').map((f) => f.trim()) : [];

  const handleDragStart = useCallback((e) => {
    hasDraggedRef.current = true;
    onDragStart?.(e);
  }, [onDragStart]);

  const handleDragEnd = useCallback((e) => {
    onDragEnd?.(e);
  }, [onDragEnd]);

  const handleClick = useCallback(() => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    onClick?.(issue);
  }, [onClick, issue]);

  const handleTouchStart = useCallback((e) => {
    hasDraggedRef.current = false;
    onTouchStart?.(e);
  }, [onTouchStart]);

  return (
    <div
      className={`bg-bg-primary border border-border rounded-lg py-2 px-2.5 mb-1.5 text-[0.72rem] shadow-sm hover:shadow-md transition-shadow duration-150 ${
        draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
      }`}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      data-issue-no={issue.issueNo}
      data-category={issue.category}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-1.5 mb-1">
        <span className="text-[0.62rem] font-semibold text-text-muted flex items-center gap-1">
          {draggable && (
            <svg viewBox="0 0 6 10" className="w-[6px] h-[10px] text-text-muted/50">
              <circle cx="1.5" cy="1.5" r="1" fill="currentColor" />
              <circle cx="4.5" cy="1.5" r="1" fill="currentColor" />
              <circle cx="1.5" cy="5" r="1" fill="currentColor" />
              <circle cx="4.5" cy="5" r="1" fill="currentColor" />
              <circle cx="1.5" cy="8.5" r="1" fill="currentColor" />
              <circle cx="4.5" cy="8.5" r="1" fill="currentColor" />
            </svg>
          )}
          #{issue.issueNo}
        </span>
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-[9px] bg-accent text-white text-[0.6rem] font-semibold px-1 shrink-0">
          {issue.count || 0}
        </span>
      </div>

      {/* Title */}
      <div
        className="font-medium text-text-primary leading-snug line-clamp-2"
        dangerouslySetInnerHTML={{ __html: escapeHtml(issue.issue) }}
      />

      {/* Flat chips */}
      {flats.length > 0 && (
        <div className="flex gap-[3px] flex-wrap mt-1.5">
          {flats.slice(0, 3).map((flat) => (
            <span
              key={flat}
              className="inline-block px-1.5 bg-bg-tertiary rounded text-[0.6rem] font-medium text-text-muted"
            >
              {flat}
            </span>
          ))}
          {flats.length > 3 && (
            <span className="inline-block px-1.5 bg-bg-tertiary rounded text-[0.6rem] font-medium text-text-muted">
              +{flats.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}, (prev, next) => {
  return (
    prev.issue.issueNo === next.issue.issueNo &&
    prev.issue.issue === next.issue.issue &&
    prev.issue.category === next.issue.category &&
    prev.issue.status === next.issue.status &&
    prev.issue.count === next.issue.count &&
    prev.issue.reportedBy === next.issue.reportedBy &&
    prev.draggable === next.draggable
  );
});

export default KanbanCard;
