import { CATEGORY_OPTIONS } from '../../lib/constants';

export default function CategorySelector({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {CATEGORY_OPTIONS.map((opt) => {
        const isActive = value === opt.key;
        let colorClasses = 'border-border text-text-secondary hover:border-accent hover:text-accent';
        if (isActive) {
          if (opt.color === 'builder') colorClasses = 'border-builder bg-[#F5F3FF] text-[#6D28D9]';
          else if (opt.color === 'society') colorClasses = 'border-society bg-[#F0F9FF] text-[#0369A1]';
          else colorClasses = 'border-accent bg-accent text-white';
        }

        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={`flex-1 py-2 px-3 rounded-lg border text-[0.78rem] font-medium cursor-pointer transition-all duration-200 [-webkit-tap-highlight-color:transparent] ${colorClasses}`}
          >
            <div>{opt.label}</div>
            {opt.description && (
              <div className={`text-[0.65rem] mt-0.5 ${isActive && !opt.color ? 'text-white/70' : 'text-text-muted'}`}>
                {opt.description}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
