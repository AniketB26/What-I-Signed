export default function Card({
  children,
  header,
  footer,
  className = '',
  hover = true,
  padding = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white/80 backdrop-blur-sm border border-cream-300/60 rounded-2xl shadow-sm overflow-hidden
        ${hover
          ? 'hover:border-warm-400/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out'
          : 'transition-colors duration-300'
        }
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="px-5 py-4 border-b border-cream-300/50">
          {header}
        </div>
      )}
      {padding ? (
        <div className="p-5">{children}</div>
      ) : (
        children
      )}
      {footer && (
        <div className="px-5 py-3 border-t border-cream-300/50 bg-cream-100/30">
          {footer}
        </div>
      )}
    </div>
  );
}
