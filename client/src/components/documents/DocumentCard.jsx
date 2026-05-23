import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, AlertTriangle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ProcessingStatus from './ProcessingStatus';
import { useDeleteDocument } from '../../hooks/useDocuments';

export default function DocumentCard({ document }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const deleteMutation = useDeleteDocument();

  const isProcessing = document.status !== 'ready' && document.status !== 'failed';

  const handleClick = () => {
    if (!isProcessing) {
      navigate(`/documents/${document._id}`);
    }
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(document._id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`
          glass rounded-2xl overflow-hidden
          transition-all duration-300 ease-out group
          ${isProcessing
            ? 'cursor-default'
            : 'cursor-pointer hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-0.5'
          }
        `}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`
                p-2.5 rounded-xl flex-shrink-0 transition-colors
                ${isProcessing ? 'bg-amber-500/10' : 'bg-violet-500/10 group-hover:bg-violet-500/20'}
              `}>
                <FileText size={18} className={isProcessing ? 'text-amber-400' : 'text-violet-400'} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                  {document.originalName || document.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {document.createdAt
                    ? formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })
                    : 'Recently'}
                </p>
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {document.docType && <Badge docType={document.docType} size="xs" />}
            <Badge status={document.status} size="xs" />
          </div>

          {/* Processing or Summary */}
          {isProcessing ? (
            <ProcessingStatus documentId={document._id} />
          ) : (
            <>
              {document.analysis?.summary && (
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {document.analysis.summary}
                </p>
              )}

              {/* Red flags */}
              {document.analysis?.redFlags?.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <AlertTriangle size={12} className="text-rose-400" />
                  <span className="text-rose-400 font-medium">
                    {document.analysis.redFlags.length} red flag{document.analysis.redFlags.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Document"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-white">
              {document.originalName || document.name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
              icon={Trash2}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
