import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  BookOpen,
  Shield,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useDocument } from '../hooks/useDocuments';
import { useSendQuery } from '../hooks/useQuery';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import QueryInput from '../components/query/QueryInput';
import StreamingAnswer from '../components/query/StreamingAnswer';
import SourceCitation from '../components/query/SourceCitation';
import ProcessingStatus from '../components/documents/ProcessingStatus';

const tabs = [
  { id: 'summary', label: 'Summary', icon: BookOpen },
  { id: 'clauses', label: 'Clauses', icon: Shield },
  { id: 'redflags', label: 'Red Flags', icon: AlertTriangle },
  { id: 'ask', label: 'Ask', icon: MessageSquare },
];

function SummaryTab({ document }) {
  const clauses = document.extractedClauses || {};
  const parties = clauses.parties || [];
  const keyDates = clauses.keyDates || [];
  const summary = document.summary || '';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* AI Summary */}
      {summary && (
        <Card hover={false}>
          <h3 className="text-sm font-semibold text-warm-900 mb-3 flex items-center gap-2">
            <BookOpen size={16} className="text-warm-600" />
            AI Summary
          </h3>
          <p className="text-sm text-warm-600 leading-relaxed">{summary}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parties */}
        {parties.length > 0 && (
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-warm-900 mb-3 flex items-center gap-2">
              <Users size={16} className="text-blue-600" />
              Parties
            </h3>
            <div className="space-y-2">
              {parties.map((party, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-warm-700">
                    {typeof party === 'string' ? party : party.name}
                  </span>
                  {party.role && (
                    <Badge color="blue" size="xs">{party.role}</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Key Dates */}
        {keyDates.length > 0 && (
          <Card hover={false}>
            <h3 className="text-sm font-semibold text-warm-900 mb-3 flex items-center gap-2">
              <Calendar size={16} className="text-amber-600" />
              Key Dates
            </h3>
            <div className="space-y-2">
              {keyDates.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-mocha-700">{item.label || item.type}</span>
                  <span className="text-warm-800 font-medium">
                    {item.date ? format(new Date(item.date), 'MMM dd, yyyy') : item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Financial Terms */}
        {(clauses.depositAmount || clauses.monthlyAmount) && (
          <Card hover={false} className="md:col-span-2">
            <h3 className="text-sm font-semibold text-warm-900 mb-3 flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-600" />
              Financial Terms
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {clauses.depositAmount && (
                <div className="glass-well p-3">
                  <p className="text-xs text-mocha-600">Deposit</p>
                  <p className="text-sm font-semibold text-emerald-700 mt-1">{clauses.depositAmount}</p>
                </div>
              )}
              {clauses.monthlyAmount && (
                <div className="glass-well p-3">
                  <p className="text-xs text-mocha-600">Monthly Amount</p>
                  <p className="text-sm font-semibold text-warm-800 mt-1">{clauses.monthlyAmount}</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function ClausesTab({ document }) {
  const clauses = document.extractedClauses || {};
  const penaltyClauses = clauses.penaltyClauses || [];
  const hasContent = penaltyClauses.length > 0 || clauses.noticePeriod || clauses.autoRenewal;

  if (!hasContent) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <Shield size={32} className="text-mocha-500 mx-auto mb-3" />
        <p className="text-sm text-mocha-700">No clauses extracted yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fadeIn">
      {clauses.noticePeriod && (
        <Card hover={false}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-white/55 ring-1 ring-white/60 flex items-center justify-center">
              <Shield size={14} className="text-warm-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-warm-900 mb-1">Notice Period</h4>
              <p className="text-xs text-mocha-700 leading-relaxed">{clauses.noticePeriod}</p>
            </div>
          </div>
        </Card>
      )}
      {clauses.autoRenewal !== undefined && (
        <Card hover={false}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-blue-100/60 ring-1 ring-white/60 flex items-center justify-center">
              <Shield size={14} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-warm-900 mb-1">Auto Renewal</h4>
              <p className="text-xs text-mocha-700 leading-relaxed">{clauses.autoRenewal ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </Card>
      )}
      {penaltyClauses.map((clause, i) => (
        <Card key={i} hover={false}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-white/55 ring-1 ring-white/60 flex items-center justify-center">
              <span className="text-xs font-semibold text-warm-600">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-warm-900 mb-1">Penalty Clause</h4>
              <p className="text-xs text-mocha-700 leading-relaxed">{clause}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function RedFlagsTab({ document }) {
  const redFlags = document.extractedClauses?.redFlags || [];

  if (redFlags.length === 0) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <AlertTriangle size={32} className="text-emerald-600 mx-auto mb-3" />
        <p className="text-sm text-emerald-700 font-medium">No red flags detected</p>
        <p className="text-xs text-mocha-700 mt-1">This document looks clean!</p>
      </div>
    );
  }

  const severityColors = {
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
    low: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      {redFlags.map((flag, i) => {
        const colors = severityColors[flag.severity] || severityColors.medium;
        return (
          <div key={i} className={`glass-tile p-4 border ${colors.border}`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${colors.bg} flex-shrink-0`}>
                <AlertTriangle size={16} className={colors.text} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-warm-800">
                    {flag.clause || 'Warning'}
                  </h4>
                  {flag.severity && (
                    <Badge color={flag.severity === 'high' ? 'red' : flag.severity === 'medium' ? 'amber' : 'blue'} size="xs">
                      {flag.severity}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-mocha-700 leading-relaxed">{flag.explanation || ''}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AskTab({ documentId }) {
  const { answer, sources, isStreaming, sendQuery } = useSendQuery();

  return (
    <div className="space-y-4 animate-fadeIn">
      <QueryInput
        onSubmit={(q) => sendQuery(q, { documentId })}
        isStreaming={isStreaming}
        placeholder="Ask about this specific document..."
        showFilters={false}
      />
      <StreamingAnswer answer={answer} isStreaming={isStreaming} />
      {sources.length > 0 && (
        <div className="space-y-2">
          {sources.map((source, i) => (
            <SourceCitation key={i} source={source} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useDocument(id);
  const [activeTab, setActiveTab] = useState('summary');

  const document = data?.data?.document || data?.data || data?.document || data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="text-center py-20 animate-fadeIn">
        <FileText size={48} className="text-mocha-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold text-warm-900 mb-2">Document not found</h2>
        <p className="text-sm text-mocha-700 mb-4">The document you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/documents')} variant="secondary" icon={ArrowLeft}>
          Back to Documents
        </Button>
      </div>
    );
  }

  const isProcessing = document.status !== 'ready' && document.status !== 'failed';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => navigate('/documents')}
        className="flex items-center gap-2 text-sm text-mocha-700 hover:text-warm-900 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Documents
      </button>

      {/* Header */}
      <div className="glass p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="glass-soft !rounded-xl p-3">
              <FileText size={24} strokeWidth={1.7} className="text-gold-600" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold text-warm-900">
                {document.originalName || document.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {document.docType && <Badge docType={document.docType} />}
                <Badge status={document.status} />
                {document.createdAt && (
                  <span className="flex items-center gap-1 text-xs text-mocha-600">
                    <Clock size={12} />
                    {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {isProcessing && (
          <div className="mt-4 pt-4 border-t border-white/45">
            <ProcessingStatus documentId={document._id} />
          </div>
        )}
      </div>

      {/* Tabs */}
      {!isProcessing && (
        <>
          <div className="glass-soft flex gap-1.5 !rounded-full p-1.5 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${activeTab === tab.id
                    ? 'btn-primary-glass'
                    : 'text-mocha-700 hover:text-warm-900 hover:bg-white/50'
                  }
                `}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>
            {activeTab === 'summary' && <SummaryTab document={document} />}
            {activeTab === 'clauses' && <ClausesTab document={document} />}
            {activeTab === 'redflags' && <RedFlagsTab document={document} />}
            {activeTab === 'ask' && <AskTab documentId={document._id} />}
          </div>
        </>
      )}
    </div>
  );
}
