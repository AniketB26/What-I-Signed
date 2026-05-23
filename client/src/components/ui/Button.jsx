import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-gradient-to-r from-violet-600 to-blue-500 text-white hover:from-violet-500 hover:to-blue-400 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40',
  secondary:
    'glass text-slate-200 hover:bg-slate-800/60 hover:text-white',
  danger:
    'bg-gradient-to-r from-rose-600 to-red-500 text-white hover:from-rose-500 hover:to-red-400 shadow-lg shadow-rose-500/25',
  ghost:
    'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50',
  outline:
    'border border-slate-600 text-slate-300 hover:border-violet-500 hover:text-violet-400 hover:bg-violet-500/10',
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
