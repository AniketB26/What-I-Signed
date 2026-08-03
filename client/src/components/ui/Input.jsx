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
        <label className="block text-sm font-medium text-warm-800 pl-1">
          {label}
        </label>
      )}
      <div
        className={`glass-input relative group flex items-center rounded-xl ${
          error ? 'border-red-400/70' : ''
        }`}
      >
        {Icon && (
          <span className="pl-3.5 text-mocha-500 group-focus-within:text-gold-600 transition-colors">
            <Icon size={18} />
          </span>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-transparent
            text-warm-900 placeholder:text-mocha-500/80
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-2.5 pr-4' : 'px-4'}
            py-3 text-sm
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 pl-1 animate-slideDown">{error}</p>
      )}
    </div>
  );
});

export default Input;
