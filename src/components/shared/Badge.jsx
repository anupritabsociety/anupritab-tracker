import { CAT_BUILDER, STATUS_NEW, STATUS_PROGRESS, STATUS_RESOLVED } from '../../lib/constants';

const BADGE_STYLES = {
  builder: 'bg-[#7C3AED] text-white shadow-sm',
  society: 'bg-[#0284C7] text-white shadow-sm',
  new: 'bg-[#EFF6FF] text-[#1D4ED8]',
  progress: 'bg-[#FFFBEB] text-[#B45309]',
  resolved: 'bg-[#F0FDF4] text-[#15803D]',
  'high': 'bg-[#FEF2F2] text-[#B91C1C]',
  'medium': 'bg-[#FFFBEB] text-[#B45309]',
  'low': 'bg-[#F0FDF4] text-[#15803D]',
};

export function CategoryBadge({ category }) {
  if (!category) return null;
  const key = category === CAT_BUILDER ? 'builder' : 'society';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.72rem] font-bold whitespace-nowrap hover:shadow-md transition-shadow duration-150 ${BADGE_STYLES[key]}`}>
      {category}
    </span>
  );
}

export function StatusBadge({ status }) {
  if (!status) return null;
  let key = 'new';
  if (status === STATUS_PROGRESS) key = 'progress';
  else if (status === STATUS_RESOLVED) key = 'resolved';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.68rem] font-medium whitespace-nowrap ${BADGE_STYLES[key]}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  if (!priority) return null;
  const lower = priority.toLowerCase();
  let key = 'medium';
  if (lower.includes('high')) key = 'high';
  else if (lower.includes('low')) key = 'low';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.68rem] font-medium whitespace-nowrap ${BADGE_STYLES[key]}`}>
      {priority}
    </span>
  );
}
