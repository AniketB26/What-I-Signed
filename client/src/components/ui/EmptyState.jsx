import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data found',
  description = 'There\'s nothing here yet.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 animate-fadeIn ${className}`}>
      <div className="relative mb-6">
        <div className="relative bg-cream-200/60 rounded-full p-5">
          <Icon size={32} className="text-warm-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-warm-900 mb-2">{title}</h3>
      <p className="text-sm text-warm-500 text-center max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
