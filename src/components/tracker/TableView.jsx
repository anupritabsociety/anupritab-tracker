import { CategoryBadge, StatusBadge, PriorityBadge } from '../shared/Badge';

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

export default function TableView({ issues }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <table className="w-full border-collapse text-[0.8rem]">
        <thead>
          <tr>
            <th className="bg-bg-tertiary/90 backdrop-blur-sm py-2.5 px-3 text-left font-semibold text-[0.72rem] text-text-secondary border-b border-border sticky top-0 z-[1] whitespace-nowrap">
              #
            </th>
            <th className="bg-bg-tertiary/90 backdrop-blur-sm py-2.5 px-3 text-left font-semibold text-[0.72rem] text-text-secondary border-b border-border sticky top-0 z-[1] whitespace-nowrap">
              {'\u0924\u0915\u094d\u0930\u093e\u0930'}
            </th>
            <th className="bg-bg-tertiary/90 backdrop-blur-sm py-2.5 px-3 text-left font-semibold text-[0.72rem] text-text-secondary border-b border-border sticky top-0 z-[1] whitespace-nowrap max-[420px]:hidden">
              {'\u092a\u094d\u0930\u0915\u093e\u0930'}
            </th>
            <th className="bg-bg-tertiary/90 backdrop-blur-sm py-2.5 px-3 text-left font-semibold text-[0.72rem] text-text-secondary border-b border-border sticky top-0 z-[1] whitespace-nowrap max-[480px]:hidden">
              {'\u092a\u094d\u0930\u093e\u0927\u093e\u0928\u094d\u092f'}
            </th>
            <th className="bg-bg-tertiary/90 backdrop-blur-sm py-2.5 px-3 text-left font-semibold text-[0.72rem] text-text-secondary border-b border-border sticky top-0 z-[1] whitespace-nowrap">
              {'\u0938\u094d\u0925\u093f\u0924\u0940'}
            </th>
            <th className="bg-bg-tertiary/90 backdrop-blur-sm py-2.5 px-3 text-center font-semibold text-[0.72rem] text-text-secondary border-b border-border sticky top-0 z-[1] whitespace-nowrap">
              {'\u0924\u0915\u094d\u0930\u093e\u0930\u0940'}
            </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr
              key={issue.issueNo}
              className="transition-colors duration-100 even:bg-bg-secondary hover:bg-accent-light"
            >
              <td className="py-3 px-3 border-b border-border-light align-middle w-9 font-semibold text-text-muted text-[0.72rem]">
                {issue.issueNo}
              </td>
              <td className="py-3 px-3 border-b border-border-light align-middle font-medium text-text-primary leading-snug">
                <span dangerouslySetInnerHTML={{ __html: escapeHtml(issue.issue) }} />
              </td>
              <td className="py-3 px-3 border-b border-border-light align-middle w-[70px] max-[420px]:hidden">
                <CategoryBadge category={issue.category} />
              </td>
              <td className="py-3 px-3 border-b border-border-light align-middle w-[90px] max-[480px]:hidden">
                <PriorityBadge priority={issue.priority} />
              </td>
              <td className="py-3 px-3 border-b border-border-light align-middle w-[72px]">
                <StatusBadge status={issue.status} />
              </td>
              <td className="py-3 px-3 border-b border-border-light align-middle w-[42px] text-center">
                <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-xl bg-accent text-white text-[0.7rem] font-semibold px-1.5">
                  {issue.count || 0}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
