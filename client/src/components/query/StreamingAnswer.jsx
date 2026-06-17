import { useEffect, useRef } from 'react';
import { Bot, Loader2 } from 'lucide-react';

function parseMarkdown(text) {
  // Simple markdown rendering
  let html = text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-warm-900 font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-cream-200 text-warm-700 text-xs font-mono">$1</code>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-warm-500 pl-3 my-2 text-warm-500 italic">$1</blockquote>')
    // Unordered lists
    .replace(/^[-•] (.+)$/gm, '<li class="ml-4 list-disc text-warm-700">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-warm-700">$1</li>')
    // Headers
    .replace(/^### (.+)$/gm, '<h4 class="text-base font-semibold text-warm-900 mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="text-lg font-semibold text-warm-900 mt-4 mb-2">$1</h3>')
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
    <div className="bg-white/80 border border-cream-300/60 rounded-2xl shadow-sm overflow-hidden animate-slideUp">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-cream-300/50">
        <div className="p-1.5 rounded-lg bg-warm-100">
          <Bot size={16} className="text-warm-600" />
        </div>
        <span className="text-sm font-medium text-warm-700">AI Answer</span>
        {isStreaming && (
          <div className="flex items-center gap-1.5 ml-auto">
            <Loader2 size={12} className="text-warm-500 animate-spin" />
            <span className="text-xs text-warm-400">Generating...</span>
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
            className="text-sm text-warm-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(answer) }}
          />
        ) : isStreaming ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-warm-500 animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-warm-400 animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-warm-300 animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-warm-400">Thinking...</span>
          </div>
        ) : null}

        {/* Blinking cursor while streaming */}
        {isStreaming && answer && (
          <span className="inline-block w-0.5 h-4 bg-warm-500 animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  );
}
