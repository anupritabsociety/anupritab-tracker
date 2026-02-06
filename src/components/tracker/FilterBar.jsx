import { FILTERS } from '../../lib/constants';
import { getFilterCounts } from '../../lib/filters';

export default function FilterBar({ issues, current, onChange }) {
  const counts = getFilterCounts(issues);

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3.5 scrollbar-none">
      {FILTERS.map((f) => {
        const isActive = current === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`py-1.5 px-3.5 border rounded-full text-[0.75rem] font-medium cursor-pointer whitespace-nowrap flex items-center gap-1.5 [-webkit-tap-highlight-color:transparent] transition-all duration-200 ${
              isActive
                ? 'bg-accent text-white border-accent'
                : 'bg-bg-primary text-text-secondary border-border hover:border-accent hover:text-accent'
            }`}
          >
            {f.label}
            {counts[f.key] > 0 && (
              <span
                className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-[9px] text-[0.65rem] font-semibold px-1.5 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-bg-tertiary text-text-secondary'
                }`}
              >
                {counts[f.key]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
