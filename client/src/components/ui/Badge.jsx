/* Badges sit on glass, so every swatch is translucent with a bright inner
   top edge — a solid fill would read as a sticker pasted on the pane. */
const colorMap = {
  default: 'bg-white/50 text-mocha-700 border-white/60',
  purple: 'bg-purple-100/60 text-purple-800 border-purple-200/70',
  blue: 'bg-blue-100/60 text-blue-800 border-blue-200/70',
  cyan: 'bg-cyan-100/60 text-cyan-800 border-cyan-200/70',
  green: 'bg-emerald-100/60 text-emerald-800 border-emerald-200/70',
  amber: 'bg-gold-100/70 text-gold-800 border-gold-200/70',
  red: 'bg-red-100/60 text-red-800 border-red-200/70',
  emerald: 'bg-emerald-100/60 text-emerald-800 border-emerald-200/70',
  gold: 'bg-gold-100/70 text-gold-800 border-gold-300/60',
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

  const sizeClasses =
    size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`
        inline-flex items-center font-medium
        rounded-full border backdrop-blur-sm
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]
        ${colorMap[resolvedColor] || colorMap.default}
        ${sizeClasses}
        ${className}
      `}
    >
      {children || docType || status}
    </span>
  );
}
