import { useState } from 'react';
import { Filter, FileText } from 'lucide-react';
import DocumentCard from './DocumentCard';
import { SkeletonCard } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';

const docTypes = [
  { value: '', label: 'All Types' },
  { value: 'lease', label: 'Lease' },
  { value: 'employment', label: 'Employment' },
  { value: 'nda', label: 'NDA' },
  { value: 'loan', label: 'Loan' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'other', label: 'Other' },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'ready', label: 'Ready' },
  { value: 'processing', label: 'Processing' },
  { value: 'failed', label: 'Failed' },
];

export default function DocumentList({ documents, isLoading }) {
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = (documents || []).filter((doc) => {
    if (typeFilter && doc.docType !== typeFilter) return false;
    if (statusFilter && doc.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter size={16} />
          <span className="text-xs font-medium">Filters</span>
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer hover:border-slate-600 transition-all"
        >
          {docTypes.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer hover:border-slate-600 transition-all"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900">
              {opt.label}
            </option>
          ))}
        </select>

        {(typeFilter || statusFilter) && (
          <button
            onClick={() => { setTypeFilter(''); setStatusFilter(''); }}
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description={
            typeFilter || statusFilter
              ? 'Try adjusting your filters to find what you\'re looking for.'
              : 'Upload your first document to get started with AI analysis.'
          }
        />
      )}

      {/* Document grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <DocumentCard key={doc._id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
