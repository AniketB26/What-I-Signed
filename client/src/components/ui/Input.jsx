import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    icon: Icon,
    className = '',
    containerClassName = '',
    ...props
  },
  ref
) {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300 pl-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-slate-900/50 backdrop-blur-sm
            border border-slate-700/50 rounded-xl
            text-slate-100 placeholder:text-slate-500
            transition-all duration-300
            focus:outline-none focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20
            focus:bg-slate-900/70
            hover:border-slate-600
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-10 pr-4' : 'px-4'}
            py-3 text-sm
            ${error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-400 pl-1 animate-slideDown">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
