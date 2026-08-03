import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data found',
  description = "There's nothing here yet.",
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`glass flex flex-col items-center justify-center py-20 px-6 animate-fadeIn ${className}`}
    >
      {/* Frosted disc holding the icon */}
      <div className="relative mb-7">
        <div className="absolute inset-0 rounded-full bg-gold-300/25 blur-2xl scale-150" />
        <div className="glass-soft relative rounded-full p-6">
          <Icon size={34} strokeWidth={1.5} className="text-gold-600" />
        </div>
      </div>

      <h3 className="font-display text-2xl font-semibold text-warm-900 mb-2.5 text-center">
        {title}
      </h3>
      <p className="text-sm text-mocha-700 text-center max-w-md leading-relaxed mb-7">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
