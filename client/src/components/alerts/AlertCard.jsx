import {
  AlertTriangle,
  Info,
  AlertCircle,
  Clock,
  X,
  AlarmClock,
  FileText,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useDismissAlert, useSnoozeAlert } from '../../hooks/useAlerts';

const severityConfig = {
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
  },
  critical: {
    icon: AlertCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
  },
};

export default function AlertCard({ alert }) {
  const navigate = useNavigate();
  const dismissMutation = useDismissAlert();
  const snoozeMutation = useSnoozeAlert();

  const severity = severityConfig[alert.severity] || severityConfig.info;
  const SeverityIcon = severity.icon;

  const dueDate = alert.dueDate ? new Date(alert.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date();

  return (
    <div
      className={`
        bg-white/80 border border-cream-300/60 rounded-2xl shadow-sm overflow-hidden
        transition-all duration-300
        hover:shadow-md
        hover:-translate-y-0.5
        ${alert.dismissed ? 'opacity-50' : ''}
      `}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`p-2.5 rounded-xl ${severity.bg} flex-shrink-0`}>
            <SeverityIcon size={18} className={severity.text} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-sm text-warm-800 leading-relaxed">
              {alert.message}
            </p>

            {/* Document link */}
            {alert.documentName && (
              <button
                onClick={() => alert.documentId && navigate(`/documents/${alert.documentId}`)}
                className="flex items-center gap-1.5 text-xs text-warm-600 hover:text-warm-800 transition-colors group"
              >
                <FileText size={12} />
                <span className="group-hover:underline">{alert.documentName}</span>
              </button>
            )}

            {/* Due date */}
            {dueDate && (
              <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-red-500' : 'text-warm-400'}`}>
                <Clock size={12} />
                <span>
                  {isOverdue ? 'Overdue — ' : ''}
                  {formatDistanceToNow(dueDate, { addSuffix: true })}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          {!alert.dismissed && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => snoozeMutation.mutate({ id: alert._id, days: 7 })}
                loading={snoozeMutation.isPending}
                title="Snooze 7 days"
              >
                <AlarmClock size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissMutation.mutate(alert._id)}
                loading={dismissMutation.isPending}
                title="Dismiss"
              >
                <X size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
