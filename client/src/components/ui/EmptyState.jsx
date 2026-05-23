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
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-full blur-2xl" />
        <div className="relative glass rounded-full p-5">
          <Icon size={32} className="text-slate-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 text-center max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
