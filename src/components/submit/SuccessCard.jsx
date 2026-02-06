import { useEffect, useRef } from 'react';

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

export default function SuccessCard({ results, onViewTracker, onClose }) {
  const cardRef = useRef(null);

  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [results]);

  return (
    <div ref={cardRef} className="bg-bg-primary rounded-2xl border border-border mb-3 overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-success text-white py-3.5 px-4 flex items-center gap-2.5">
        <svg className="w-7 h-7 shrink-0" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="14" fill="rgba(255,255,255,0.2)" />
          <path d="M9 14.5L12.5 18L19 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="text-[0.88rem] font-semibold">
          {'\u0924\u0941\u092e\u091a\u0940 \u0938\u0942\u091a\u0928\u093e \u092f\u0936\u0938\u094d\u0935\u0940\u0930\u0940\u0924\u094d\u092f\u093e \u0928\u094b\u0902\u0926\u0935\u0932\u0940'}
        </div>
      </div>

      {/* Body */}
      <div className="py-3.5 px-4">
        <div className="text-[0.75rem] text-text-muted mb-2.5 font-medium">
          {'\u0916\u093e\u0932\u0940\u0932 \u0924\u0915\u094d\u0930\u093e\u0930\u0940 \u0913\u0933\u0916\u0932\u094d\u092f\u093e:'}
        </div>
        {results.map((r, idx) => (
          <div
            key={idx}
            className={`py-2.5 px-3 rounded-lg mb-1.5 flex items-start gap-2.5 animate-fade-in-up ${
              r.action === 'merged'
                ? 'bg-[#FFFBEB] border border-[#FDE68A]'
                : 'bg-[#EFF6FF] border border-[#BFDBFE]'
            }`}
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            <div
              className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 mt-px ${
                r.action === 'merged'
                  ? 'bg-[#FDE68A] text-[#92400E]'
                  : 'bg-[#BFDBFE] text-[#1E40AF]'
              }`}
            >
              {r.action === 'merged' ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
            </div>
            <div>
              <div
                className="text-[0.78rem] leading-snug text-text-primary"
                dangerouslySetInnerHTML={{ __html: escapeHtml(r.issue) }}
              />
              <div className="text-[0.68rem] font-medium text-text-muted mt-0.5">
                {r.action === 'merged'
                  ? `Issue #${r.issueNo} \u092e\u0927\u094d\u092f\u0947 \u091c\u094b\u0921\u0932\u0947 (${r.previousCount} \u2192 ${r.newCount} \u0924\u0915\u094d\u0930\u093e\u0930\u0940)`
                  : `\u0928\u0935\u0940\u0928 Issue #${r.issueNo} \u0924\u092f\u093e\u0930 \u0915\u0947\u0932\u0947`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex border-t border-border-light">
        <button
          onClick={onViewTracker}
          className="flex-1 py-2.5 border-none bg-transparent text-[0.75rem] text-accent font-medium cursor-pointer hover:bg-[#EEF2FF] transition-all duration-150 border-r border-border-light"
        >
          {'\u0924\u0915\u094d\u0930\u093e\u0930 \u092a\u0939\u093e'} &rarr;
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-2.5 border-none bg-transparent text-[0.75rem] text-text-muted cursor-pointer hover:text-text-secondary hover:bg-bg-secondary transition-all duration-150"
        >
          {'\u092c\u0902\u0926 \u0915\u0930\u093e'}
        </button>
      </div>
    </div>
  );
}
