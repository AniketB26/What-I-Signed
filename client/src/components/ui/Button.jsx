import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'btn-primary-glass',
  gold: 'btn-gold-glass',
  secondary: 'glass-chip text-warm-800 hover:text-warm-900',
  danger:
    'bg-gradient-to-b from-red-500 to-red-600 text-white border border-white/20 shadow-glass-sm hover:from-red-600 hover:to-red-700',
  ghost:
    'bg-transparent text-mocha-600 hover:text-warm-900 hover:bg-white/45 border border-transparent',
  outline:
    'bg-transparent border border-gold-400/70 text-gold-700 hover:bg-white/45 hover:border-gold-500',
};

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
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
        relative inline-flex items-center justify-center font-medium overflow-hidden
        transition-all duration-300 ease-out
        disabled:opacity-60 disabled:cursor-not-allowed
        active:scale-[0.97]
        ${variants[variant] || variants.primary}
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
