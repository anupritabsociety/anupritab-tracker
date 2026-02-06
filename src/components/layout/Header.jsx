export default function Header() {
  return (
    <div className="bg-bg-primary py-3 px-4 text-center border-b border-border shadow-md mt-0.5 flex items-center justify-center gap-2.5 relative">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-accent shrink-0">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-4h6v4" />
        <path d="M9 10h1" />
        <path d="M14 10h1" />
        <path d="M9 14h1" />
        <path d="M14 14h1" />
      </svg>
      <div>
        <h1 className="text-[1.05rem] font-bold text-text-primary tracking-tight mb-0">
          {'\u0905\u0928\u0941\u092a\u094d\u0930\u093f\u0924\u093e \u092c\u0940 \u0915\u094b. \u0939\u094c. \u0938\u094b. \u0932\u093f.'}
        </h1>
        <p className="text-[0.72rem] font-normal text-text-secondary">
          {'\u0938\u094b\u0938\u093e\u092f\u091f\u0940 \u0938\u0942\u091a\u0928\u093e / \u0924\u0915\u094d\u0930\u093e\u0930 \u0928\u094b\u0902\u0926\u0923\u0940'}
        </p>
      </div>
    </div>
  );
}
