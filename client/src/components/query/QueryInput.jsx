import { useState } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
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
  placeholder = 'Ask anything about your documents...',
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
          ${large ? 'gradient-border gradient-border-animated' : ''}
        `}>
          <div className={`
            flex items-center gap-3 bg-slate-900/60 backdrop-blur-xl
            border border-slate-700/50 rounded-2xl
            transition-all duration-300
            focus-within:border-violet-500/50 focus-within:shadow-lg focus-within:shadow-violet-500/10
            group-hover:border-slate-600
            ${large ? 'p-2 pl-5' : 'p-1.5 pl-4'}
          `}>
            <Sparkles size={18} className="text-slate-500 flex-shrink-0 group-focus-within:text-violet-400 transition-colors" />
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={placeholder}
              disabled={isStreaming}
              className={`
                flex-1 bg-transparent text-slate-100 placeholder:text-slate-500
                focus:outline-none disabled:opacity-50
                ${large ? 'py-3 text-base' : 'py-2 text-sm'}
              `}
            />
            {question && !isStreaming && (
              <button
                type="button"
                onClick={() => setQuestion('')}
                className="p-1.5 text-slate-500 hover:text-white transition-colors"
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
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-violet-500/50 appearance-none cursor-pointer hover:border-slate-600 transition-all"
            >
              <option value="" className="bg-slate-900">All documents</option>
              {documents.map((doc) => (
                <option key={doc._id} value={doc._id} className="bg-slate-900">
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
              className="px-3 py-1.5 text-xs text-slate-400 glass rounded-xl hover:text-violet-300 hover:border-violet-500/30 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
