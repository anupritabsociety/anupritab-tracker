import {
  KEY_TO_STATUS,
  STATUS_TO_KEY,
  VALID_CATEGORIES,
  CAT_BUILDER,
  CAT_SOCIETY,
} from './constants';

const BUILDER_HINTS = [
  'lift', 'plumbing', 'tile', 'structural', 'waterproof',
  'electrical', 'flooring', 'marble', 'grout', 'leak',
  'crack', 'bathroom',
];

/**
 * Normalize an issue object from the API.
 * Fixes corrupted Marathi text from double-encoded UTF-8.
 */
export function normalizeIssue(issue) {
  // Fix status: prefer statusKey if available
  if (issue.statusKey && KEY_TO_STATUS[issue.statusKey]) {
    issue.status = KEY_TO_STATUS[issue.statusKey];
  } else if (!STATUS_TO_KEY[issue.status]) {
    issue.status = KEY_TO_STATUS['new'];
  }

  // Fix category: detect corruption
  if (issue.category && !VALID_CATEGORIES.includes(issue.category)) {
    const txt = (issue.issue || '').toLowerCase();
    issue.category = CAT_SOCIETY;
    for (const hint of BUILDER_HINTS) {
      if (txt.includes(hint)) {
        issue.category = CAT_BUILDER;
        break;
      }
    }
  }

  return issue;
}
