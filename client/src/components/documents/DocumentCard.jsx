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
          glass-tile overflow-hidden group
          ${isProcessing ? 'cursor-default transition-colors' : 'cursor-pointer glass-hover'}
        `}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`
                  glass-soft !rounded-xl p-2.5 flex-shrink-0
                  ${isProcessing ? 'text-gold-600' : 'text-mocha-600 group-hover:text-gold-600'}
                  transition-colors
                `}
              >
                <FileText size={18} strokeWidth={1.7} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-warm-900 truncate">
                  {document.originalName || document.name}
                </h3>
                <p className="text-xs text-mocha-600 mt-0.5">
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
              className="p-1.5 rounded-lg text-mocha-400 hover:text-red-500 hover:bg-red-50/70 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Delete document"
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
                <p className="text-xs text-mocha-700 line-clamp-2 leading-relaxed mb-3">
                  {document.analysis.summary}
                </p>
              )}

              {/* Red flags */}
              {document.analysis?.redFlags?.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <AlertTriangle size={12} className="text-red-500" />
                  <span className="text-red-500 font-medium">
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
          <p className="text-sm text-mocha-800">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-warm-900">
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
