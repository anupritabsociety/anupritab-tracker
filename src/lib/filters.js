import { CAT_BUILDER, CAT_SOCIETY, KEY_TO_STATUS } from './constants';

export function filterIssues(issues, filter) {
  switch (filter) {
    case 'builder':
      return issues.filter((i) => i.category === CAT_BUILDER);
    case 'society':
      return issues.filter((i) => i.category === CAT_SOCIETY);
    case 'progress':
      return issues.filter((i) => i.status === KEY_TO_STATUS['progress']);
    case 'resolved':
      return issues.filter((i) => i.status === KEY_TO_STATUS['resolved']);
    default:
      return issues;
  }
}

export function getFilterCounts(issues) {
  return {
    all: issues.length,
    builder: issues.filter((i) => i.category === CAT_BUILDER).length,
    society: issues.filter((i) => i.category === CAT_SOCIETY).length,
    progress: issues.filter((i) => i.status === KEY_TO_STATUS['progress']).length,
    resolved: issues.filter((i) => i.status === KEY_TO_STATUS['resolved']).length,
  };
}
