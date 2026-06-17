import { Search } from 'lucide-react';
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
        <h1 className="text-2xl font-bold text-warm-900 italic">
          AI Query Interface
        </h1>
        <p className="text-sm text-warm-500 mt-1">
          Sourced and Grounded Answers from Your Documents
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
              <Search size={14} className="text-warm-400" />
              <h3 className="text-sm font-medium text-warm-600">Sources</h3>
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
              <div className="relative bg-cream-200/60 rounded-full p-6">
                <Search size={32} className="text-warm-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-warm-800 mb-2">
              Ask your documents anything
            </h3>
            <p className="text-sm text-warm-500 max-w-md mx-auto">
              AI will find relevant clauses and terms, citing sources directly
              from your uploaded agreements for accuracy and transparency.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
