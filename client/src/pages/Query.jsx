import { Search, FileSearch } from 'lucide-react';
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
        <h1 className="heading-display text-3xl md:text-[2.5rem] leading-tight">
          AI Query Interface
        </h1>
        <p className="text-sm text-mocha-700 mt-2">
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
              <Search size={14} className="text-gold-600" />
              <h3 className="text-sm font-medium text-warm-800">Sources</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sources.map((source, i) => (
                <SourceCitation key={i} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state — the large recessed pane from the Stitch design */}
        {!answer && !isStreaming && (
          <div className="glass flex flex-col items-center justify-center px-6 py-24 text-center animate-fadeIn">
            <div className="relative mb-7">
              <div className="absolute inset-0 rounded-full bg-gold-300/25 blur-2xl scale-150" />
              <div className="glass-soft relative rounded-full p-7">
                <FileSearch size={38} strokeWidth={1.4} className="text-gold-600" />
              </div>
            </div>
            <h3 className="font-display text-2xl font-semibold text-warm-900 mb-3">
              Ask your documents anything
            </h3>
            <p className="text-sm text-mocha-700 max-w-lg leading-relaxed">
              AI will find relevant clauses and terms, citing sources directly
              from your uploaded agreements for accuracy and transparency.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
