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
  info: { icon: Info, text: 'text-blue-600', rail: 'bg-blue-400/70' },
  warning: { icon: AlertTriangle, text: 'text-gold-600', rail: 'bg-gold-500/80' },
  critical: { icon: AlertCircle, text: 'text-red-600', rail: 'bg-red-500/80' },
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
        glass-tile glass-hover relative overflow-hidden
        ${alert.dismissed ? 'opacity-50' : ''}
      `}
    >
      {/* Severity rail down the left edge */}
      <span className={`absolute inset-y-0 left-0 w-[3px] ${severity.rail}`} />

      <div className="p-5 pl-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="glass-soft !rounded-xl p-2.5 flex-shrink-0">
            <SeverityIcon size={18} strokeWidth={1.8} className={severity.text} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-sm text-warm-900 leading-relaxed">
              {alert.message}
            </p>

            {/* Document link */}
            {alert.documentName && (
              <button
                onClick={() => alert.documentId && navigate(`/documents/${alert.documentId}`)}
                className="flex items-center gap-1.5 text-xs text-mocha-700 hover:text-warm-900 transition-colors group"
              >
                <FileText size={12} />
                <span className="group-hover:underline">{alert.documentName}</span>
              </button>
            )}

            {/* Due date */}
            {dueDate && (
              <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-red-600' : 'text-mocha-600'}`}>
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
