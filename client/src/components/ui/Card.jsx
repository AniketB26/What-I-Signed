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
        glass rounded-2xl overflow-hidden
        ${hover
          ? 'hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-0.5 transition-all duration-300 ease-out'
          : 'transition-colors duration-300'
        }
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="px-5 py-4 border-b border-slate-700/50">
          {header}
        </div>
      )}
      {padding ? (
        <div className="p-5">{children}</div>
      ) : (
        children
      )}
      {footer && (
        <div className="px-5 py-3 border-t border-slate-700/50 bg-slate-900/30">
          {footer}
        </div>
      )}
    </div>
  );
}
