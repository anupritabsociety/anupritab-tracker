// Unicode escape sequences for encoding-safe Marathi text
// This prevents double-encoding when deployed via Apps Script

// Status values
export const STATUS_NEW = '\u0928\u0935\u0940\u0928'; // नवीन
export const STATUS_PROGRESS = '\u092a\u094d\u0930\u0917\u0924\u0940\u0924'; // प्रगतीत
export const STATUS_RESOLVED = '\u0928\u093f\u0930\u093e\u0915\u0930\u0923'; // निराकरण

// Category values
export const CAT_BUILDER = '\u092c\u093f\u0932\u094d\u0921\u0930'; // बिल्डर
export const CAT_SOCIETY = '\u0938\u094b\u0938\u093e\u092f\u091f\u0940'; // सोसायटी

// English key ↔ Marathi status mapping (for safe HTTP transport)
export const STATUS_TO_KEY = {
  [STATUS_NEW]: 'new',
  [STATUS_PROGRESS]: 'progress',
  [STATUS_RESOLVED]: 'resolved',
};

export const KEY_TO_STATUS = {
  new: STATUS_NEW,
  progress: STATUS_PROGRESS,
  resolved: STATUS_RESOLVED,
};

export const VALID_CATEGORIES = [CAT_BUILDER, CAT_SOCIETY];

// Flat list for the dropdown
export const FLAT_LIST = [
  '101', '102', '201', '202', '301', '302', '401', '402',
  '501', '502', '601', '602', '701', '702', '801', '802',
  '901', '902', '1001', '1002', '1101', '1102', '1201', '1202',
  'Shop 1', 'Shop 2', 'Office',
];

// Processing overlay messages (Marathi)
export const STATUS_MESSAGES = [
  '\u0924\u0915\u094d\u0930\u093e\u0930 \u0935\u093f\u0936\u094d\u0932\u0947\u0937\u0923 \u0938\u0941\u0930\u0942...', // तक्रार विश्लेषण सुरू...
  '\u092e\u0930\u093e\u0920\u0940 \u092e\u091c\u0915\u0942\u0930 \u0935\u093e\u091a\u0924 \u0906\u0939\u0947...', // मराठी मजकूर वाचत आहे...
  '\u0935\u0947\u0917\u0935\u0947\u0917\u0933\u094d\u092f\u093e \u0924\u0915\u094d\u0930\u093e\u0930\u0940 \u0913\u0933\u0916\u0924 \u0906\u0939\u0947...', // वेगवेगळ्या तक्रारी ओळखत आहे...
  '\u092a\u094d\u0930\u093e\u0927\u093e\u0928\u094d\u092f\u0915\u094d\u0930\u092e \u0920\u0930\u0935\u0924 \u0906\u0939\u0947...', // प्राधान्यक्रम ठरवत आहे...
  '\u092e\u093e\u0917\u0940\u0932 \u0924\u0915\u094d\u0930\u093e\u0930\u0940\u0902\u0936\u0940 \u091c\u0941\u0933\u0935\u0924 \u0906\u0939\u0947...', // मागील तक्रारींशी जुळवत आहे...
  '\u0928\u094b\u0902\u0926\u0923\u0940 \u0905\u0926\u094d\u092f\u092f\u093e\u0935\u0924 \u0915\u0930\u0924 \u0906\u0939\u0947...', // नोंदणी अद्ययावत करत आहे...
];

// Filter definitions
export const FILTERS = [
  { key: 'all', label: '\u0938\u0930\u094d\u0935' }, // सर्व
  { key: 'builder', label: CAT_BUILDER },
  { key: 'society', label: CAT_SOCIETY },
  { key: 'progress', label: STATUS_PROGRESS },
  { key: 'resolved', label: STATUS_RESOLVED },
];

// Category selector options for the form
export const CATEGORY_OPTIONS = [
  { key: 'auto', label: '\u0938\u094d\u0935\u092f\u0902 \u0936\u094b\u0927', description: 'AI \u0928\u093f\u0930\u094d\u0923\u092f' }, // स्वयं शोध, AI निर्णय
  { key: 'builder', label: CAT_BUILDER, color: 'builder' },
  { key: 'society', label: CAT_SOCIETY, color: 'society' },
];
