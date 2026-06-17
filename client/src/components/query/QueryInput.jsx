import { useState } from 'react';
import { Send, Search, X } from 'lucide-react';
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
      {/* Search input */}
      <form onSubmit={handleSubmit}>
        <div className={`
          relative group rounded-2xl
          transition-all duration-300
        `}>
          <div className={`
            flex items-center gap-3 bg-white/90
            border border-cream-300 rounded-2xl
            transition-all duration-300
            focus-within:border-warm-500 focus-within:shadow-md
            group-hover:border-warm-400
            ${large ? 'p-2 pl-5' : 'p-1.5 pl-4'}
          `}>
            <Search size={18} className="text-warm-400 flex-shrink-0 group-focus-within:text-warm-600 transition-colors" />
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={placeholder}
              disabled={isStreaming}
              className={`
                flex-1 bg-transparent text-warm-900 placeholder:text-warm-400
                focus:outline-none disabled:opacity-50
                ${large ? 'py-3 text-base' : 'py-2 text-sm'}
              `}
            />
            {question && !isStreaming && (
              <button
                type="button"
                onClick={() => setQuestion('')}
                className="p-1.5 text-warm-400 hover:text-warm-700 transition-colors"
              >
                <X size={16} />
              </button>
            )}
            <Button
              type="submit"
              size={large ? 'md' : 'sm'}
              disabled={!question.trim() || isStreaming}
              loading={isStreaming}
              icon={Send}
            >
              {large ? 'Ask AI' : 'Ask'}
            </Button>
          </div>
        </div>
      </form>

      {/* Filter chips */}
      {showFilters && onFiltersChange && (
        <div className="flex flex-wrap gap-2">
          {documents.length > 0 && (
            <select
              value={filters.documentId || ''}
              onChange={(e) => onFiltersChange({ ...filters, documentId: e.target.value || undefined })}
              className="bg-white/80 border border-cream-300 rounded-xl px-3 py-1.5 text-xs text-warm-700 focus:outline-none focus:border-warm-500 appearance-none cursor-pointer hover:border-warm-400 transition-all"
            >
              <option value="">All documents</option>
              {documents.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.originalName || doc.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Suggestions */}
      {!question && !isStreaming && large && (
        <div className="flex flex-wrap gap-2 animate-fadeIn">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1.5 text-xs text-warm-600 bg-white/80 border border-cream-300 rounded-xl hover:text-warm-800 hover:border-warm-400 hover:bg-cream-100 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
