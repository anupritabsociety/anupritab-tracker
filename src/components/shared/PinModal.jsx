import { useState, useRef, useEffect } from 'react';
import { verifyPin } from '../../api/issues';
import { useAppContext } from '../../App';

export default function PinModal({ open, onClose }) {
  const { dispatch } = useAppContext();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setPin('');
      setError('');
      setShaking(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 300);
  };

  const handleSubmit = async (currentPin) => {
    const p = currentPin || pin;
    if (p.length !== 4) return;
    setLoading(true);
    setError('');
    try {
      const data = await verifyPin(p);
      if (data.valid) {
        dispatch({ type: 'SET_MC_AUTH', payload: true });
        onClose();
      } else {
        setError('\u091a\u0941\u0915\u0940\u091a\u093e PIN'); // चुकीचा PIN
        triggerShake();
        setPin('');
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    } catch {
      setError('\u0915\u0928\u0947\u0915\u094d\u0936\u0928 \u0924\u094d\u0930\u0941\u091f\u0940'); // कनेक्शन त्रुटी
      triggerShake();
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const handleDigit = (digit) => {
    if (loading || pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setError('');
    if (next.length === 4) {
      handleSubmit(next);
    }
  };

  const handleBackspace = () => {
    if (loading) return;
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(val);
    setError('');
    if (val.length === 4) {
      handleSubmit(val);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[3px] z-[3000] flex justify-center items-center p-5">
      <div className="bg-bg-primary rounded-2xl p-7 px-6 text-center max-w-[300px] w-full border border-border animate-scale-pop">
        {/* Lock icon */}
        <div className="mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 mx-auto text-accent">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h3 className="text-[0.92rem] font-semibold mb-0.5">MC {'\u0932\u0949\u0917\u093f\u0928'}</h3>
        <p className="text-[0.72rem] text-text-muted mb-4">4-{'\u0905\u0902\u0915\u0940 PIN \u091f\u093e\u0915\u093e'}</p>

        {/* Hidden input for keyboard */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={pin}
          onChange={handleInputChange}
          maxLength={4}
          className="absolute opacity-0 w-0 h-0"
          autoComplete="off"
        />

        {/* Digit boxes */}
        <div className={`flex justify-center gap-3 mb-2 ${shaking ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              onClick={() => inputRef.current?.focus()}
              className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-150 ${
                i === pin.length && !loading
                  ? 'border-accent shadow-[0_0_0_3px_rgba(99,102,241,0.1)]'
                  : i < pin.length
                    ? 'border-accent bg-accent/5'
                    : 'border-border'
              }`}
            >
              {i < pin.length && (
                <div className="w-3 h-3 rounded-full bg-accent" />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        <div className="text-critical text-[0.72rem] min-h-[1.4em] mb-3">{error}</div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center mb-3">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Numeric keypad */}
        {!loading && (
          <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleDigit(String(n))}
                className="w-[60px] h-[52px] rounded-lg bg-bg-secondary border border-border text-lg font-semibold text-text-primary cursor-pointer active:bg-bg-tertiary active:scale-95 transition-all duration-100 mx-auto"
              >
                {n}
              </button>
            ))}
            <div /> {/* empty cell */}
            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="w-[60px] h-[52px] rounded-lg bg-bg-secondary border border-border text-lg font-semibold text-text-primary cursor-pointer active:bg-bg-tertiary active:scale-95 transition-all duration-100 mx-auto"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="w-[60px] h-[52px] rounded-lg bg-bg-secondary border border-border text-text-secondary cursor-pointer active:bg-bg-tertiary active:scale-95 transition-all duration-100 flex items-center justify-center mx-auto"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="18" y1="9" x2="12" y2="15" />
                <line x1="12" y1="9" x2="18" y2="15" />
              </svg>
            </button>
          </div>
        )}

        {/* Cancel */}
        <button
          type="button"
          onClick={onClose}
          className="text-[0.75rem] text-text-muted cursor-pointer bg-transparent border-none hover:text-text-secondary transition-colors duration-150"
        >
          {'\u0930\u0926\u094d\u0926 \u0915\u0930\u093e'}
        </button>
      </div>
    </div>
  );
}
