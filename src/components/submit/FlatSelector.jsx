import { FLAT_LIST } from '../../lib/constants';

export default function FlatSelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full py-2.5 px-3 border border-border rounded-lg text-[0.85rem] font-sans bg-bg-primary text-text-primary focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/10 transition-all duration-150 appearance-none"
    >
      <option value="">-- {'\u0928\u093f\u0935\u0921\u093e'} --</option>
      {FLAT_LIST.map((flat) => (
        <option key={flat} value={flat}>{flat}</option>
      ))}
    </select>
  );
}
