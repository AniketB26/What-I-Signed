import { useEffect, useRef } from 'react';
import { Bot, Loader2 } from 'lucide-react';

function parseMarkdown(text) {
  // Simple markdown rendering
  let html = text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-violet-300 text-xs font-mono">$1</code>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-violet-500/50 pl-3 my-2 text-slate-400 italic">$1</blockquote>')
    // Unordered lists
    .replace(/^[-•] (.+)$/gm, '<li class="ml-4 list-disc text-slate-300">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-slate-300">$1</li>')
    // Headers
    .replace(/^### (.+)$/gm, '<h4 class="text-base font-semibold text-white mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>')
    // Line breaks
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');

  return html;
}

export default function StreamingAnswer({ answer, isStreaming }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [answer]);

  if (!answer && !isStreaming) return null;

  return (
    <div className="glass rounded-2xl overflow-hidden animate-slideUp">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-slate-700/50">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-600/20 to-blue-500/20">
          <Bot size={16} className="text-violet-400" />
        </div>
        <span className="text-sm font-medium text-slate-300">AI Answer</span>
        {isStreaming && (
          <div className="flex items-center gap-1.5 ml-auto">
            <Loader2 size={12} className="text-violet-400 animate-spin" />
            <span className="text-xs text-slate-500">Generating...</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="px-5 py-4 max-h-96 overflow-y-auto scrollbar-thin"
      >
        {answer ? (
          <div
            className="text-sm text-slate-300 leading-relaxed prose-invert"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(answer) }}
          />
        ) : isStreaming ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-slate-500">Thinking...</span>
          </div>
        ) : null}

        {/* Blinking cursor while streaming */}
        {isStreaming && answer && (
          <span className="inline-block w-0.5 h-4 bg-violet-400 animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  );
}
