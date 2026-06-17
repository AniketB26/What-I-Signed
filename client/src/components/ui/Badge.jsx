const colorMap = {
  default: 'bg-cream-200/60 text-warm-600 border-cream-300',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
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
