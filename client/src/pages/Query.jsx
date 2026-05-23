import { Search, Sparkles } from 'lucide-react';
import { useSendQuery } from '../hooks/useQuery';
import { useDocuments } from '../hooks/useDocuments';
import QueryInput from '../components/query/QueryInput';
import StreamingAnswer from '../components/query/StreamingAnswer';
import SourceCitation from '../components/query/SourceCitation';
import { useState } from 'react';

export default function Query() {
  const { answer, sources, isStreaming, sendQuery, reset } = useSendQuery();
  const { data } = useDocuments();
  const [filters, setFilters] = useState({});

  const docList = data?.data?.documents || data?.documents || (Array.isArray(data) ? data : []);
  const documents = docList.filter((d) => d.status === 'ready');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <Search className="text-violet-400" size={24} />
          Query Your Documents
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ask anything — AI will search across all your agreements
        </p>
      </div>

      {/* Query input */}
      <QueryInput
        onSubmit={(q, f) => sendQuery(q, f)}
        isStreaming={isStreaming}
        filters={filters}
        onFiltersChange={setFilters}
        documents={documents}
        large={true}
      />

      {/* Results */}
      <div className="space-y-4">
        <StreamingAnswer answer={answer} isStreaming={isStreaming} />

        {sources.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-slate-500" />
              <h3 className="text-sm font-medium text-slate-400">Sources</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {sources.map((source, i) => (
                <SourceCitation key={i} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!answer && !isStreaming && (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-full blur-2xl" />
              <div className="relative glass rounded-full p-6">
                <Sparkles size={32} className="text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              Ask your documents anything
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Use natural language to query across all your uploaded agreements.
              AI will find relevant clauses, terms, and conditions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
