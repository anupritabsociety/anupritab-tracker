import { useCountUp } from '../../hooks/useCountUp';
import { CAT_BUILDER, CAT_SOCIETY, STATUS_RESOLVED } from '../../lib/constants';

const ACCENT_COLORS = {
  'text-text-primary': 'border-l-accent bg-accent-light/30',
  'text-builder': 'border-l-builder bg-builder-light/30',
  'text-society': 'border-l-society bg-society-light/30',
  'text-success': 'border-l-success bg-success-light/30',
};

function StatCard({ value, label, colorClass }) {
  const count = useCountUp(value);
  return (
    <div className={`bg-bg-primary rounded-xl py-3 px-2 text-center border border-border border-l-[3px] shadow-sm hover:shadow-md transition-all duration-150 active:scale-[0.97] ${ACCENT_COLORS[colorClass] || ''}`}>
      <div className={`text-2xl font-bold leading-tight ${colorClass}`}>{count}</div>
      <div className="text-[0.65rem] font-medium text-text-muted mt-0.5">{label}</div>
    </div>
  );
}

export default function StatsGrid({ issues }) {
  const total = issues.length;
  const builder = issues.filter((i) => i.category === CAT_BUILDER).length;
  const society = issues.filter((i) => i.category === CAT_SOCIETY).length;
  const resolved = issues.filter((i) => i.status === STATUS_RESOLVED).length;

  const stats = [
    { value: total, label: '\u090f\u0915\u0942\u0923 \u0924\u0915\u094d\u0930\u093e\u0930\u0940', colorClass: 'text-text-primary' },
    { value: builder, label: CAT_BUILDER, colorClass: 'text-builder' },
    { value: society, label: CAT_SOCIETY, colorClass: 'text-society' },
    { value: resolved, label: '\u0928\u093f\u0930\u093e\u0915\u0930\u0923', colorClass: 'text-success' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mb-3 animate-fade-in-up max-[380px]:grid-cols-2" style={{ animationDelay: '0.05s' }}>
      {stats.map((s, i) => (
        <StatCard key={i} {...s} />
      ))}
    </div>
  );
}
