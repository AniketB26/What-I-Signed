const colorMap = {
  default: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
  purple: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  red: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

const docTypeColors = {
  lease: 'cyan',
  employment: 'blue',
  nda: 'purple',
  loan: 'amber',
  insurance: 'green',
  subscription: 'emerald',
  other: 'default',
};

const statusColors = {
  processing: 'amber',
  ready: 'green',
  failed: 'red',
  uploaded: 'blue',
};

export default function Badge({
  children,
  color = 'default',
  docType,
  status,
  size = 'sm',
  className = '',
}) {
  const resolvedColor = docType
    ? docTypeColors[docType] || 'default'
    : status
    ? statusColors[status] || 'default'
    : color;

  const sizeClasses = size === 'xs'
    ? 'px-1.5 py-0.5 text-[10px]'
    : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`
        inline-flex items-center font-medium
        rounded-full border
        ${colorMap[resolvedColor] || colorMap.default}
        ${sizeClasses}
        ${className}
      `}
    >
      {children || docType || status}
    </span>
  );
}
