import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SourceCitation({ source }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 border border-cream-300/60 rounded-xl overflow-hidden transition-all duration-300 hover:border-warm-400/50 shadow-sm">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-1.5 rounded-lg bg-warm-100 flex-shrink-0">
          <FileText size={14} className="text-warm-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-warm-800 truncate">
            {source.documentName || source.name || 'Source document'}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {source.page && (
              <span className="text-[10px] text-warm-400">Page {source.page}</span>
            )}
            {source.relevance && (
              <span className="text-[10px] text-warm-600">
                {Math.round(source.relevance * 100)}% relevant
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {source.documentId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/documents/${source.documentId}`);
              }}
              className="p-1 rounded text-warm-400 hover:text-warm-700 transition-colors"
              title="View document"
            >
              <ExternalLink size={12} />
            </button>
          )}
          {expanded ? (
            <ChevronUp size={14} className="text-warm-400" />
          ) : (
            <ChevronDown size={14} className="text-warm-400" />
          )}
        </div>
      </div>

      {expanded && source.excerpt && (
        <div className="px-4 pb-3 animate-slideDown">
          <p className="text-xs text-warm-600 leading-relaxed bg-cream-100/60 rounded-lg p-3 border-l-2 border-warm-500/40">
            "{source.excerpt}"
          </p>
        </div>
      )}
    </div>
  );
}
