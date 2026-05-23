import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SourceCitation({ source }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="glass rounded-xl overflow-hidden transition-all duration-300 hover:border-violet-500/20">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="p-1.5 rounded-lg bg-blue-500/10 flex-shrink-0">
          <FileText size={14} className="text-blue-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-200 truncate">
            {source.documentName || source.name || 'Source document'}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {source.page && (
              <span className="text-[10px] text-slate-500">Page {source.page}</span>
            )}
            {source.relevance && (
              <span className="text-[10px] text-violet-400">
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
              className="p-1 rounded text-slate-500 hover:text-violet-400 transition-colors"
              title="View document"
            >
              <ExternalLink size={12} />
            </button>
          )}
          {expanded ? (
            <ChevronUp size={14} className="text-slate-500" />
          ) : (
            <ChevronDown size={14} className="text-slate-500" />
          )}
        </div>
      </div>

      {expanded && source.excerpt && (
        <div className="px-4 pb-3 animate-slideDown">
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/30 rounded-lg p-3 border-l-2 border-violet-500/30">
            "{source.excerpt}"
          </p>
        </div>
      )}
    </div>
  );
}
