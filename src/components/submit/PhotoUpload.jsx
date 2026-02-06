import { useRef } from 'react';

export default function PhotoUpload({ photos, onAdd, onRemove }) {
  const inputRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      alert('\u091c\u093e\u0938\u094d\u0924\u0940\u0924 \u091c\u093e\u0938\u094d\u0924 5 \u092b\u094b\u091f\u094b \u0928\u093f\u0935\u0921\u0924\u093e \u092f\u0947\u0924\u093e\u0924.'); // जास्तीत जास्त 5 फोटो निवडता येतात.
      return;
    }
    files.forEach((file) => {
      if (photos.length >= 5) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        onAdd({
          data: ev.target.result.split(',')[1],
          mimeType: file.type,
          extension: file.name.split('.').pop(),
          preview: ev.target.result,
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  return (
    <div>
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-[7px] py-[9px] px-4 border border-dashed border-border rounded-lg bg-bg-secondary text-text-secondary text-[0.8rem] font-medium cursor-pointer hover:border-accent hover:text-accent transition-all duration-150"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="14" height="10" rx="2" />
            <circle cx="5.5" cy="7" r="1.5" />
            <path d="M15 11l-3.5-3.5L6 13" />
          </svg>
          {'\u092b\u094b\u091f\u094b \u0928\u093f\u0935\u0921\u093e'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>
      {photos.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2">
          {photos.map((photo, idx) => (
            <div key={idx} className="relative w-[52px] h-[52px] rounded-lg overflow-hidden border border-border animate-scale-pop">
              <img src={photo.preview} className="w-full h-full object-cover" alt="" />
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="absolute -top-px -right-px w-[18px] h-[18px] rounded-full bg-critical text-white text-[10px] flex items-center justify-center cursor-pointer border-2 border-white leading-none"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
