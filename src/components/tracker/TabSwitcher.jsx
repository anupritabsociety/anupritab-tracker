export default function TabSwitcher({ current, onChange }) {
  const tabs = [
    { key: 'table', label: '\u0938\u0942\u091a\u0940' }, // सूची
    { key: 'kanban', label: '\u092c\u094b\u0930\u094d\u0921' }, // बोर्ड
  ];

  return (
    <div className="flex bg-bg-tertiary rounded-full p-[3px] mb-3.5 relative">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 py-[7px] px-4 border-none rounded-full text-[0.78rem] font-medium cursor-pointer transition-all duration-250 relative z-[1] [-webkit-tap-highlight-color:transparent] ${
            current === tab.key
              ? 'bg-bg-primary text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-semibold'
              : 'bg-transparent text-text-secondary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
