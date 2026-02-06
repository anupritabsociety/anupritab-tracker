import { useState } from 'react';
import { useAppContext } from '../../App';
import FlatSelector from './FlatSelector';
import CategorySelector from './CategorySelector';
import PhotoUpload from './PhotoUpload';
import ProcessingOverlay from './ProcessingOverlay';
import { submitComplaint } from '../../api/issues';
import { CAT_BUILDER, CAT_SOCIETY } from '../../lib/constants';

export default function ComplaintForm({ onSuccess }) {
  const { showToast } = useAppContext();
  const [flat, setFlat] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('society');
  const [photos, setPhotos] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flat || !name || !phone || !description) {
      showToast('\u0915\u0943\u092a\u092f\u093e \u0938\u0930\u094d\u0935 \u0906\u0935\u0936\u094d\u092f\u0915 \u092e\u093e\u0939\u093f\u0924\u0940 \u092d\u0930\u093e.', 'error'); // कृपया सर्व आवश्यक माहिती भरा.
      return;
    }

    setProcessing(true);

    const formData = {
      flat,
      name,
      phone,
      description,
      photos: photos.map((p) => ({
        data: p.data,
        mimeType: p.mimeType,
        extension: p.extension,
      })),
    };

    // Set explicit category
    if (category === 'builder') formData.category = CAT_BUILDER;
    else formData.category = CAT_SOCIETY;

    try {
      const text = await submitComplaint(formData);
      setProcessing(false);
      if (text.success) {
        onSuccess(text.results);
        resetForm();
      } else {
        showToast(
          '\u0924\u0915\u094d\u0930\u093e\u0930 \u0928\u094b\u0902\u0926\u0935\u0924\u093e \u0906\u0932\u0940 \u0928\u093e\u0939\u0940: ' +
            (text.error || 'Unknown error'),
          'error',
        );
      }
    } catch {
      setProcessing(false);
      showToast(
        '\u0924\u0915\u094d\u0930\u093e\u0930 \u0928\u094b\u0902\u0926\u0935\u0924\u093e \u0906\u0932\u0940 \u0928\u093e\u0939\u0940. \u0928\u0947\u091f\u0935\u0930\u094d\u0915 \u0915\u0928\u0947\u0915\u094d\u0936\u0928 \u0924\u092a\u093e\u0938\u093e.',
        'error',
      );
    }
  };

  const resetForm = () => {
    setFlat('');
    setName('');
    setPhone('');
    setDescription('');
    setCategory('society');
    setPhotos([]);
  };

  const inputClasses =
    'w-full py-2.5 px-3 border border-border rounded-lg text-[0.85rem] font-sans bg-bg-primary text-text-primary focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/10 transition-all duration-150 placeholder:text-text-muted';

  return (
    <>
      <ProcessingOverlay show={processing} />

      <form onSubmit={handleSubmit}>
        {/* Flat */}
        <div className="mb-3.5">
          <label className="block text-[0.78rem] font-medium text-text-secondary mb-1.5">
            {'\u0938\u0926\u0928\u093f\u0915\u093e \u0915\u094d\u0930\u092e\u093e\u0902\u0915'} <span className="text-critical font-semibold">*</span>
          </label>
          <FlatSelector value={flat} onChange={setFlat} />
        </div>

        {/* Name */}
        <div className="mb-3.5">
          <label className="block text-[0.78rem] font-medium text-text-secondary mb-1.5">
            {'\u0928\u093e\u0935'} <span className="text-critical font-semibold">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={'\u0924\u0941\u092e\u091a\u0947 \u0928\u093e\u0935'}
            className={inputClasses}
          />
        </div>

        {/* Phone */}
        <div className="mb-3.5">
          <label className="block text-[0.78rem] font-medium text-text-secondary mb-1.5">
            {'\u092b\u094b\u0928 \u0928\u0902\u092c\u0930'} <span className="text-critical font-semibold">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            required
            placeholder="98XXXXXXXX"
            pattern="[0-9]{10}"
            maxLength={10}
            className={inputClasses}
          />
        </div>

        {/* Category Selector */}
        <div className="mb-3.5">
          <label className="block text-[0.78rem] font-medium text-text-secondary mb-1.5">
            {'\u092a\u094d\u0930\u0915\u093e\u0930'}
          </label>
          <CategorySelector value={category} onChange={setCategory} />
        </div>

        {/* Description */}
        <div className="mb-3.5">
          <label className="block text-[0.78rem] font-medium text-text-secondary mb-1.5">
            {'\u0924\u0941\u092e\u091a\u0940 \u0938\u0942\u091a\u0928\u093e / \u0924\u0915\u094d\u0930\u093e\u0930'} <span className="text-critical font-semibold">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder={'\u0924\u0941\u092e\u091a\u0940 \u0924\u0915\u094d\u0930\u093e\u0930 \u0915\u093f\u0902\u0935\u093e \u0938\u0942\u091a\u0928\u093e \u0907\u0925\u0947 \u0932\u093f\u0939\u093e. English \u0915\u093f\u0902\u0935\u093e \u092e\u0930\u093e\u0920\u0940 \u2014 \u0926\u094b\u0928\u094d\u0939\u0940 \u091a\u093e\u0932\u0947\u0932. \u090f\u0915\u093e \u0935\u0947\u0933\u0940 \u0905\u0928\u0947\u0915 \u0924\u0915\u094d\u0930\u093e\u0930\u0940 \u0932\u093f\u0939\u0942 \u0936\u0915\u0924\u093e.'}
            className={`${inputClasses} min-h-[100px] resize-y leading-relaxed`}
          />
          <div className="text-[0.7rem] text-text-muted mt-1.5 leading-relaxed">
            {'\u0905\u0928\u0947\u0915 \u0924\u0915\u094d\u0930\u093e\u0930\u0940 \u0938\u094d\u0935\u092f\u0902\u091a\u0932\u093f\u0924\u092a\u0923\u0947 \u0935\u0947\u0917\u0933\u094d\u092f\u093e \u0915\u0947\u0932\u094d\u092f\u093e \u091c\u093e\u0924\u0940\u0932 \u0906\u0923\u093f \u092e\u093e\u0917\u0940\u0932 \u0924\u0915\u094d\u0930\u093e\u0930\u0940\u0902\u0936\u0940 \u091c\u094b\u0921\u0932\u094d\u092f\u093e \u091c\u093e\u0924\u0940\u0932'}
          </div>
        </div>

        {/* Photos */}
        <div className="mb-3.5">
          <label className="block text-[0.78rem] font-medium text-text-secondary mb-1.5">
            {'\u092b\u094b\u091f\u094b (\u0910\u091a\u094d\u091b\u093f\u0915 \u2014 \u091c\u093e\u0938\u094d\u0924\u0940\u0924 \u091c\u093e\u0938\u094d\u0924 5)'}
          </label>
          <PhotoUpload
            photos={photos}
            onAdd={(p) => setPhotos((prev) => [...prev, p])}
            onRemove={(idx) => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={processing}
          className="w-full py-3 bg-gradient-to-br from-accent to-accent-hover text-white border-none rounded-lg text-[0.9rem] font-semibold font-sans cursor-pointer [-webkit-tap-highlight-color:transparent] hover:opacity-92 active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none transition-all duration-150"
        >
          {'\u0938\u092c\u092e\u093f\u091f \u0915\u0930\u093e'}
        </button>
      </form>
    </>
  );
}
