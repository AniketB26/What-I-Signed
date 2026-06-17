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
        <label className="block text-sm font-medium text-warm-700 pl-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400 group-focus-within:text-warm-600 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-white/80
            border border-cream-300 rounded-xl
            text-warm-900 placeholder:text-warm-400
            transition-all duration-300
            focus:outline-none focus:border-warm-500 focus:ring-2 focus:ring-warm-500/20
            focus:bg-white
            hover:border-warm-400
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-10 pr-4' : 'px-4'}
            py-3 text-sm
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 pl-1 animate-slideDown">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
