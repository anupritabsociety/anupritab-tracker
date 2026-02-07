import { memo } from 'react';

const KanbanColumn = memo(function KanbanColumn({
  status,
  statusKey,
  category,
  count,
  children,
  onDragOver,
  onDragLeave,
  onDrop,
}) {
  return (
    <div
      data-kanban-col=""
      data-category={category}
      data-status-key={statusKey}
      className="p-2 border-r border-border-light last:border-r-0 min-h-[80px] max-[640px]:min-w-[160px] transition-all duration-150 ring-0 ring-accent/0 data-[drag-over]:ring-2 data-[drag-over]:ring-accent/20"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="text-[0.68rem] font-semibold text-text-muted py-1 px-1.5 pb-2 flex items-center gap-1.5 bg-gradient-to-r from-bg-tertiary/60 to-transparent rounded-md">
        {status}
        <span className="inline-flex items-center justify-center min-w-[16px] h-4 rounded-lg bg-bg-tertiary text-[0.6rem] font-bold text-text-muted px-1">
          {count}
        </span>
      </div>
      {children}
    </div>
  );
});

export default KanbanColumn;
