import { useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { useCompareDocuments } from '../hooks/useQuery';
import { FileText, ArrowLeftRight, Loader2 } from 'lucide-react';
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

  const handleCompare = (e) => {
    e.preventDefault();
    if (!docIdA || !docIdB || !topic.trim()) return;
    compare({ docIdA, docIdB, topic });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Compare Documents
        </h1>
        <p className="text-slate-400 mt-2">
          See how two agreements differ on a specific topic
        </p>
      </div>

      <Card>
        <form onSubmit={handleCompare} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document A */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Document A
              </label>
              <select
                value={docIdA}
                onChange={(e) => setDocIdA(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
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
              <label className="block text-sm font-medium text-slate-300">
                Document B
              </label>
              <select
                value={docIdB}
                onChange={(e) => setDocIdB(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
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
            <label className="block text-sm font-medium text-slate-300">
              What do you want to compare?
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., maintenance responsibilities, termination clauses, payment terms..."
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
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
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
            <span className="text-slate-400">Analyzing and comparing documents...</span>
          </div>
        </Card>
      )}

      {result?.data && (
        <Card>
          <div className="p-6 space-y-4 animate-slideUp">
            <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-violet-400" />
              Comparison Results
            </h2>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
              {result.data.comparison}
            </div>
          </div>
        </Card>
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
