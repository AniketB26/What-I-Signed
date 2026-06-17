import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-warm-700 text-white hover:bg-warm-800 shadow-sm hover:shadow-md',
  secondary:
    'bg-white/80 border border-cream-300 text-warm-700 hover:bg-cream-100 hover:text-warm-900',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  ghost:
    'bg-transparent text-warm-500 hover:text-warm-900 hover:bg-cream-200/60',
  outline:
    'border border-warm-400 text-warm-600 hover:border-warm-600 hover:text-warm-700 hover:bg-warm-50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.97]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
    </button>
  );
}
