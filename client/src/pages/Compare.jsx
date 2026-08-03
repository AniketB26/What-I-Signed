import { useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { useCompareDocuments } from '../hooks/useQuery';
import { FileText, ArrowLeftRight, Loader2, Eye, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';

export default function Compare() {
  const { data: documents, isLoading } = useDocuments();
  const [docIdA, setDocIdA] = useState('');
  const [docIdB, setDocIdB] = useState('');
  const [topic, setTopic] = useState('');
  const { mutate: compare, data: result, isPending, reset } = useCompareDocuments();

  const docList = documents?.data?.documents || documents?.documents || (Array.isArray(documents) ? documents : []);
  const readyDocs = docList.filter(d => d.status === 'ready');

  const selectedDocA = readyDocs.find(d => d._id === docIdA);
  const selectedDocB = readyDocs.find(d => d._id === docIdB);

  const handleCompare = (e) => {
    e.preventDefault();
    if (!docIdA || !docIdB || !topic.trim()) return;
    compare({ docIdA, docIdB, topic });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="heading-display text-3xl md:text-[2.5rem] leading-tight">
          Document Comparison
        </h1>
        <p className="text-sm text-mocha-700 mt-2">
          See how two agreements differ on a specific topic
        </p>
      </div>

      <Card hover={false} padding={false}>
        <form onSubmit={handleCompare} className="space-y-6 p-6 md:p-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document A */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-warm-800">
                Document A
              </label>
              <select
                value={docIdA}
                onChange={(e) => setDocIdA(e.target.value)}
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-warm-900 focus:outline-none cursor-pointer"
              >
                <option value="">Select a document...</option>
                {readyDocs.map(doc => (
                  <option key={doc._id} value={doc._id} disabled={doc._id === docIdB}>
                    {doc.originalName}
                  </option>
                ))}
              </select>
            </div>

            {/* Document B */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-warm-800">
                Document B
              </label>
              <select
                value={docIdB}
                onChange={(e) => setDocIdB(e.target.value)}
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-warm-900 focus:outline-none cursor-pointer"
              >
                <option value="">Select a document...</option>
                {readyDocs.map(doc => (
                  <option key={doc._id} value={doc._id} disabled={doc._id === docIdA}>
                    {doc.originalName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Topic */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-warm-800">
              What do you want to compare?
            </label>
            <div className="glass-input rounded-xl">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., maintenance responsibilities, termination clauses, payment terms..."
                className="w-full bg-transparent px-4 py-3 text-sm text-warm-900 placeholder:text-mocha-500/85 focus:outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isPending}
            disabled={!docIdA || !docIdB || !topic.trim() || isPending}
            icon={isPending ? undefined : ArrowLeftRight}
            className="w-full"
          >
            Compare Documents
          </Button>
        </form>
      </Card>

      {/* Results */}
      {isPending && (
        <Card hover={false}>
          <div className="flex items-center justify-center py-12 space-x-3">
            <Loader2 className="w-6 h-6 text-gold-600 animate-spin" />
            <span className="text-mocha-700">Analyzing and comparing documents...</span>
          </div>
        </Card>
      )}

      {result?.data && (
        <div className="space-y-5 animate-slideUp">
          {/* Document headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[selectedDocA, selectedDocB].filter(Boolean).map((doc, i) => (
              <div
                key={doc._id}
                className="glass-tile flex items-center justify-between gap-3 p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gold-600 flex-shrink-0">
                    {i === 0 ? 'A' : 'B'}
                  </span>
                  <div className="glass-soft !rounded-lg p-2 flex-shrink-0">
                    <FileText size={16} strokeWidth={1.7} className="text-mocha-600" />
                  </div>
                  <span className="text-sm font-medium text-warm-900 truncate">
                    {doc.originalName}
                  </span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="glass-chip flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-mocha-700 hover:text-warm-900">
                    <Eye size={12} /> View
                  </button>
                  <button className="btn-primary-glass flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all active:scale-[0.97]">
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Results */}
          <Card hover={false} padding={false}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/45">
              <h2 className="font-display text-lg font-semibold text-warm-900">
                Key Differences &amp; Analysis
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-gold-600">
                Summary
              </h3>
              <div className="glass-well p-5 text-sm text-mocha-800 leading-relaxed whitespace-pre-wrap">
                {result.data.comparison}
              </div>
            </div>
          </Card>
        </div>
      )}

      {!isPending && !result && readyDocs.length < 2 && (
        <EmptyState
          icon={FileText}
          title="Not enough documents"
          description="You need at least 2 processed documents to use the comparison feature. Upload more agreements to get started."
        />
      )}
    </div>
  );
}
