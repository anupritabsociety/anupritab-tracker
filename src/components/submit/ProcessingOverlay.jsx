import { useState, useEffect, useRef } from 'react';
import { STATUS_MESSAGES } from '../../lib/constants';

export default function ProcessingOverlay({ show }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (show) {
      setMsgIdx(0);
      intervalRef.current = setInterval(() => {
        setMsgIdx((prev) => Math.min(prev + 1, STATUS_MESSAGES.length - 1));
      }, 2200);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-[2000] flex justify-center items-center p-5">
      <div className="bg-bg-primary rounded-2xl py-8 px-7 text-center max-w-[320px] w-full border border-border animate-scale-pop">
        <div className="w-10 h-10 mx-auto mb-4 border-3 border-bg-tertiary border-t-accent rounded-full animate-spin" />
        <div className="text-[0.92rem] font-semibold text-text-primary mb-1">
          {'\u0924\u0915\u094d\u0930\u093e\u0930 \u092a\u094d\u0930\u0915\u094d\u0930\u093f\u092f\u093e \u0938\u0941\u0930\u0942 \u0906\u0939\u0947'}
        </div>
        <div className="text-[0.78rem] text-text-secondary mb-4 min-h-[1.5em]">
          {STATUS_MESSAGES[msgIdx]}
        </div>
        <div className="w-full h-[3px] bg-bg-tertiary rounded-sm overflow-hidden">
          <div className="h-full bg-accent rounded-sm animate-progress-bar" />
        </div>
      </div>
    </div>
  );
}
