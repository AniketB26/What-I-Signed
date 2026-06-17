import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Bell, CheckCircle2, ArrowRight, Search } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useDocuments } from '../hooks/useDocuments';
import { useAlerts } from '../hooks/useAlerts';
import { useSendQuery } from '../hooks/useQuery';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import DocumentCard from '../components/documents/DocumentCard';
import AlertCard from '../components/alerts/AlertCard';
import QueryInput from '../components/query/QueryInput';
import StreamingAnswer from '../components/query/StreamingAnswer';
import SourceCitation from '../components/query/SourceCitation';
import EmptyState from '../components/ui/EmptyState';

function AnimatedCounter({ target, duration = 1200 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!target) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { data: docData, isLoading: docsLoading } = useDocuments();
  const { data: alertData, isLoading: alertsLoading } = useAlerts();
  const { answer, sources, isStreaming, sendQuery } = useSendQuery();

  const documents = docData?.data?.documents || docData?.documents || (Array.isArray(docData) ? docData : []);
  const alerts = alertData?.data?.alerts || alertData?.alerts || (Array.isArray(alertData) ? alertData : []);

  const totalDocs = Array.isArray(documents) ? documents.length : 0;
  const activeAlerts = Array.isArray(alerts) ? alerts.filter((a) => !a.dismissed).length : 0;
  const processedDocs = Array.isArray(documents) ? documents.filter((d) => d.status === 'ready').length : 0;

  const recentDocs = Array.isArray(documents) ? documents.slice(0, 4) : [];
  const topAlerts = Array.isArray(alerts) ? alerts.filter((a) => !a.dismissed).slice(0, 3) : [];

  const stats = [
    {
      label: 'Total Documents',
      value: totalDocs,
      icon: FileText,
      bg: 'bg-warm-100',
      iconColor: 'text-warm-600',
    },
    {
      label: 'Active Alerts',
      value: activeAlerts,
      icon: Bell,
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Processed',
      value: processedDocs,
      icon: CheckCircle2,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-warm-900">
          Welcome back, {user?.name || 'there'}.
        </h1>
        <p className="text-sm text-warm-500 mt-1">
          Here's what's happening with your agreements.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/80 border border-cream-300/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon size={20} className={stat.iconColor} />
              </div>
            </div>
            <div className="text-2xl font-bold text-warm-900">
              {docsLoading || alertsLoading ? (
                <Skeleton variant="text" className="w-12 h-7" />
              ) : (
                <AnimatedCounter target={stat.value} />
              )}
            </div>
            <p className="text-xs text-warm-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Query */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-warm-600" />
          <h2 className="text-lg font-semibold text-warm-800">Quick Query</h2>
        </div>
        <QueryInput
          onSubmit={(q) => sendQuery(q)}
          isStreaming={isStreaming}
          large={false}
          placeholder="Ask a quick question about your documents..."
          showFilters={false}
        />
        <StreamingAnswer answer={answer} isStreaming={isStreaming} />
        {sources.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sources.map((source, i) => (
              <SourceCitation key={i} source={source} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Alerts */}
      {topAlerts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-warm-800">Recent Alerts</h2>
            <button
              onClick={() => navigate('/alerts')}
              className="flex items-center gap-1 text-xs text-warm-600 hover:text-warm-800 transition-colors group"
            >
              View all <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="space-y-3">
            {topAlerts.map((alert) => (
              <AlertCard key={alert._id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Documents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-warm-800">Recent Documents</h2>
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center gap-1 text-xs text-warm-600 hover:text-warm-800 transition-colors group"
          >
            View all <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        {docsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="card" />
            ))}
          </div>
        ) : recentDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentDocs.map((doc) => (
              <DocumentCard key={doc._id} document={doc} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description="Upload your first document to get started."
            actionLabel="Upload Document"
            onAction={() => navigate('/documents')}
          />
        )}
      </div>
    </div>
  );
}
