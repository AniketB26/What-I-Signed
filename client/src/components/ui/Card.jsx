export default function Card({
  children,
  header,
  footer,
  className = '',
  hover = true,
  padding = true,
  variant = 'glass', // 'glass' | 'soft' | 'well'
  onClick,
  ...props
}) {
  const base =
    variant === 'soft' ? 'glass-soft' : variant === 'well' ? 'glass-well' : 'glass';

  return (
    <div
      onClick={onClick}
      className={`
        ${base} overflow-hidden
        ${hover ? 'glass-hover' : 'transition-colors duration-300'}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-white/45">{header}</div>
      )}
      {padding ? <div className="p-6">{children}</div> : children}
      {footer && (
        <div className="px-6 py-3.5 border-t border-white/45 bg-white/25">
          {footer}
        </div>
      )}
    </div>
  );
}
