import { useAppContext } from '../../App';

export default function BottomNav() {
  const { page, navigateTo } = useAppContext();

  const tabs = [
    {
      key: 'submit',
      label: '\u0924\u0915\u094d\u0930\u093e\u0930 \u0928\u094b\u0902\u0926\u0923\u0940', // तक्रार नोंदणी
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      key: 'tracker',
      label: '\u0938\u0926\u094d\u092f\u0938\u094d\u0925\u093f\u0924\u0940', // सद्यस्थिती
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-lg bg-bg-primary/95 border-t border-border flex z-[1000] shadow-[0_-1px_4px_rgba(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const isActive = page === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => navigateTo(tab.key)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 bg-transparent border-none font-sans text-[0.68rem] cursor-pointer relative [-webkit-tap-highlight-color:transparent] transition-colors duration-150 active:scale-95 ${
              isActive
                ? 'text-accent font-semibold'
                : 'text-text-muted'
            }`}
          >
            {isActive && (
              <span className="absolute top-0 left-1/3 right-1/3 h-[3px] bg-accent rounded-b-full" />
            )}
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
