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
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/60 text-gold-800 text-xs font-mono">$1</code>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-gold-400 pl-3 my-2 text-mocha-700 italic">$1</blockquote>')
    // Unordered lists
    .replace(/^[-•] (.+)$/gm, '<li class="ml-4 list-disc text-mocha-800">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-mocha-800">$1</li>')
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
    <div className="glass overflow-hidden animate-slideUp">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/45">
        <div className="glass-soft !rounded-lg p-1.5">
          <Bot size={16} strokeWidth={1.8} className="text-gold-600" />
        </div>
        <span className="text-sm font-medium text-warm-900">AI Answer</span>
        {isStreaming && (
          <div className="flex items-center gap-1.5 ml-auto">
            <Loader2 size={12} className="text-gold-600 animate-spin" />
            <span className="text-xs text-mocha-600">Generating...</span>
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
            className="text-sm text-mocha-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(answer) }}
          />
        ) : isStreaming ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-gold-300 animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-mocha-600">Thinking...</span>
          </div>
        ) : null}

        {/* Blinking cursor while streaming */}
        {isStreaming && answer && (
          <span className="inline-block w-0.5 h-4 bg-gold-600 animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  );
}
