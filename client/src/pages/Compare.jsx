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
        <h1 className="text-2xl font-bold text-warm-900">
          Document Comparison – Professional View
        </h1>
        <p className="text-sm text-warm-500 mt-2">
          See how two agreements differ on a specific topic
        </p>
      </div>

      <Card>
        <form onSubmit={handleCompare} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document A */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-warm-700">
                Document A
              </label>
              <select
                value={docIdA}
                onChange={(e) => setDocIdA(e.target.value)}
                className="w-full bg-white/80 border border-cream-300 rounded-xl px-4 py-3 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-500/30 focus:border-warm-500 transition-all"
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
              <label className="block text-sm font-medium text-warm-700">
                Document B
              </label>
              <select
                value={docIdB}
                onChange={(e) => setDocIdB(e.target.value)}
                className="w-full bg-white/80 border border-cream-300 rounded-xl px-4 py-3 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-500/30 focus:border-warm-500 transition-all"
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
            <label className="block text-sm font-medium text-warm-700">
              What do you want to compare?
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., maintenance responsibilities, termination clauses, payment terms..."
                className="w-full bg-white/80 border border-cream-300 rounded-xl px-4 py-3 text-warm-800 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-warm-500/30 focus:border-warm-500 transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isPending}
            disabled={!docIdA || !docIdB || !topic.trim() || isPending}
            className="w-full"
          >
            <ArrowLeftRight className="w-5 h-5 mr-2" />
            Compare Documents
          </Button>
        </form>
      </Card>

      {/* Results */}
      {isPending && (
        <Card>
          <div className="flex items-center justify-center py-12 space-x-3">
            <Loader2 className="w-6 h-6 text-warm-500 animate-spin" />
            <span className="text-warm-500">Analyzing and comparing documents...</span>
          </div>
        </Card>
      )}

      {result?.data && (
        <div className="space-y-6 animate-slideUp">
          {/* Document headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedDocA && (
              <div className="bg-white/80 border border-cream-300/60 rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warm-100">
                    <FileText size={16} className="text-warm-600" />
                  </div>
                  <span className="text-sm font-medium text-warm-800 truncate">{selectedDocA.originalName}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 text-xs text-warm-600 hover:text-warm-800 bg-cream-100 px-2.5 py-1.5 rounded-lg transition-colors">
                    <Eye size={12} /> View
                  </button>
                  <button className="flex items-center gap-1 text-xs text-white bg-warm-700 hover:bg-warm-800 px-2.5 py-1.5 rounded-lg transition-colors">
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            )}
            {selectedDocB && (
              <div className="bg-white/80 border border-cream-300/60 rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warm-100">
                    <FileText size={16} className="text-warm-600" />
                  </div>
                  <span className="text-sm font-medium text-warm-800 truncate">{selectedDocB.originalName}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 text-xs text-warm-600 hover:text-warm-800 bg-cream-100 px-2.5 py-1.5 rounded-lg transition-colors">
                    <Eye size={12} /> View
                  </button>
                  <button className="flex items-center gap-1 text-xs text-white bg-warm-700 hover:bg-warm-800 px-2.5 py-1.5 rounded-lg transition-colors">
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Comparison Results */}
          <Card>
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-warm-900 flex items-center gap-2">
                Key Differences & Analysis
              </h2>
              <div className="border-b border-cream-300/50 pb-2 mb-4">
                <h3 className="text-sm font-semibold text-warm-800">Summary</h3>
              </div>
              <div className="text-sm text-warm-700 leading-relaxed whitespace-pre-wrap">
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
