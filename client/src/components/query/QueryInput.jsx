import { useState } from 'react';
import { Sparkles, Search, X } from 'lucide-react';
import Button from '../ui/Button';

const suggestions = [
  'What are the termination clauses in my contracts?',
  'Do any of my documents have auto-renewal?',
  'What penalties exist for early termination?',
  'Summarize my financial obligations',
];

export default function QueryInput({
  onSubmit,
  isStreaming = false,
  filters = {},
  onFiltersChange,
  documents = [],
  showFilters = true,
  placeholder = 'Ask a question about your documents...',
  large = false,
}) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || isStreaming) return;
    onSubmit(question, filters);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuestion(suggestion);
    onSubmit(suggestion, filters);
  };

  return (
    <div className="space-y-4">
      {/* Search pill */}
      <form onSubmit={handleSubmit}>
        <div
          className={`
            glass-input group flex items-center gap-3 rounded-full
            ${large ? 'p-2 pl-6' : 'p-1.5 pl-5'}
          `}
        >
          <Search
            size={18}
            className="text-mocha-500 flex-shrink-0 group-focus-within:text-gold-600 transition-colors"
          />
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={placeholder}
            disabled={isStreaming}
            className={`
              flex-1 min-w-0 bg-transparent text-warm-900 placeholder:text-mocha-500/85
              focus:outline-none disabled:opacity-50
              ${large ? 'py-3 text-base' : 'py-2 text-sm'}
            `}
          />
          {question && !isStreaming && (
            <button
              type="button"
              onClick={() => setQuestion('')}
              className="p-1.5 rounded-full text-mocha-500 hover:text-warm-900 hover:bg-white/60 transition-all"
              aria-label="Clear question"
            >
              <X size={16} />
            </button>
          )}
          <Button
            type="submit"
            variant="gold"
            size={large ? 'md' : 'sm'}
            disabled={!question.trim() || isStreaming}
            loading={isStreaming}
            icon={Sparkles}
            className="!rounded-full flex-shrink-0"
          >
            {large ? 'Ask AI' : 'Ask'}
          </Button>
        </div>
      </form>

      {/* Document scope filter */}
      {showFilters && onFiltersChange && documents.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.documentId || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, documentId: e.target.value || undefined })
            }
            className="glass-chip rounded-full px-4 py-2 text-xs text-warm-800 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="">All documents</option>
            {documents.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.originalName || doc.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Suggestion chips */}
      {!question && !isStreaming && large && (
        <div className="flex flex-wrap gap-2.5 animate-fadeIn">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="glass-chip rounded-full px-4 py-2 text-xs text-mocha-700 hover:text-warm-900"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
