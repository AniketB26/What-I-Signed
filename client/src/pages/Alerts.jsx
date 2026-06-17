import { useState } from 'react';
import { useAlerts, useDismissAlert, useSnoozeAlert } from '../hooks/useAlerts';
import AlertCard from '../components/alerts/AlertCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { Bell, Filter } from 'lucide-react';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'red_flag', label: 'Red Flags' },
  { key: 'dismissed', label: 'Dismissed' },
];

export default function Alerts() {
  const [activeTab, setActiveTab] = useState('all');
  const { data, isLoading } = useAlerts();
  const { mutate: dismiss } = useDismissAlert();
  const { mutate: snooze } = useSnoozeAlert();

  const alerts = data?.data?.alerts || data?.alerts || (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));

  const filteredAlerts = alerts.filter(alert => {
    switch (activeTab) {
      case 'upcoming':
        return !alert.dismissed && !alert.fired && alert.dueDate;
      case 'red_flag':
        return alert.alertType === 'red_flag' && !alert.dismissed;
      case 'dismissed':
        return alert.dismissed;
      default:
        return !alert.dismissed;
    }
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-warm-900">
          Alerts & Reminders
        </h1>
        <p className="text-sm text-warm-500 mt-2">
          Stay on top of important dates and flagged clauses
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-white/60 rounded-xl w-fit border border-cream-300/60">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-warm-700 text-white shadow-sm'
                : 'text-warm-500 hover:text-warm-800 hover:bg-cream-200/60'
            }`}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({alerts.filter(a => {
                  switch (tab.key) {
                    case 'upcoming': return !a.dismissed && !a.fired && a.dueDate;
                    case 'red_flag': return a.alertType === 'red_flag' && !a.dismissed;
                    case 'dismissed': return a.dismissed;
                    default: return true;
                  }
                }).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alert List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : filteredAlerts.length > 0 ? (
        <div className="space-y-4 animate-slideUp">
          {filteredAlerts.map(alert => (
            <AlertCard
              key={alert._id}
              alert={alert}
              onDismiss={() => dismiss(alert._id)}
              onSnooze={(days) => snooze({ id: alert._id, days })}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title={activeTab === 'dismissed' ? 'No dismissed alerts' : 'No alerts yet'}
          description={
            activeTab === 'dismissed'
              ? "You haven't dismissed any alerts yet."
              : 'Upload documents with expiry dates or renewal clauses to start receiving alerts.'
          }
        />
      )}
    </div>
  );
}
