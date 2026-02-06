export default function EmptyState({ type = 'empty', message, onRetry }) {
  return (
    <div className="text-center py-9 px-5 animate-fade-in">
      <svg
        className="w-10 h-10 mx-auto mb-3 text-text-muted opacity-50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {type === 'error' ? (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </>
        ) : (
          <>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </>
        )}
      </svg>
      <div className="text-[0.88rem] font-medium text-text-secondary mb-1">
        {message || '\u092f\u093e \u092a\u094d\u0930\u0915\u093e\u0930\u091a\u094d\u092f\u093e \u0924\u0915\u094d\u0930\u093e\u0930\u0940 \u0938\u093e\u092a\u0921\u0932\u094d\u092f\u093e \u0928\u093e\u0939\u0940\u0924'}
      </div>
      <div className="text-[0.78rem] text-text-muted">
        {type === 'error'
          ? '\u0915\u0943\u092a\u092f\u093e \u092a\u0941\u0928\u094d\u0939\u093e \u092a\u094d\u0930\u092f\u0924\u094d\u0928 \u0915\u0930\u093e'
          : '\u0928\u0935\u0940\u0928 \u0924\u0915\u094d\u0930\u093e\u0930 \u0928\u094b\u0902\u0926\u0935\u0923\u094d\u092f\u093e\u0938\u093e\u0920\u0940 \u0924\u0915\u094d\u0930\u093e\u0930 \u0928\u094b\u0902\u0926\u0923\u0940 \u092a\u0947\u091c \u0935\u093e\u092a\u0930\u093e'}
      </div>
      {type === 'error' && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 mt-3 py-2 px-5 bg-accent text-white border-none rounded-full text-[0.78rem] font-medium cursor-pointer hover:bg-accent-hover transition-colors duration-150"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4v6h6" />
            <path d="M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
          {'\u092a\u0941\u0928\u094d\u0939\u093e \u092a\u094d\u0930\u092f\u0924\u094d\u0928 \u0915\u0930\u093e'}
        </button>
      )}
    </div>
  );
}
