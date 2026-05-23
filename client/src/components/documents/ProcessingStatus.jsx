import { useDocumentStatus } from '../../hooks/useDocumentStatus';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const stages = {
  uploaded: { label: 'Uploaded', progress: 10 },
  extracting: { label: 'Extracting text', progress: 30 },
  chunking: { label: 'Chunking content', progress: 50 },
  embedding: { label: 'Creating embeddings', progress: 70 },
  analyzing: { label: 'AI analysis', progress: 85 },
  ready: { label: 'Complete', progress: 100 },
  failed: { label: 'Failed', progress: 0 },
};

export default function ProcessingStatus({ documentId }) {
  const queryClient = useQueryClient();

  const { status, progress } = useDocumentStatus(documentId, () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] });
    queryClient.invalidateQueries({ queryKey: ['document', documentId] });
  });

  const stage = stages[status] || stages.uploaded;
  const displayProgress = progress || stage.progress;

  if (status === 'failed') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-rose-500" />
          <span className="text-xs text-rose-400 font-medium">Processing failed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 size={12} className="text-violet-400 animate-spin" />
          <span className="text-xs text-slate-300 font-medium">{stage.label}</span>
        </div>
        <span className="text-xs text-slate-500">{displayProgress}%</span>
      </div>
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
}
