import { useState } from 'react';
import { FileText, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import UploadZone from '../components/documents/UploadZone';
import DocumentList from '../components/documents/DocumentList';
import Button from '../components/ui/Button';

export default function Documents() {
  const [showUpload, setShowUpload] = useState(false);
  const { data, isLoading } = useDocuments();

  const documents = data?.data?.documents || data?.documents || (Array.isArray(data) ? data : []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <FileText className="text-violet-400" size={24} />
            Documents
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and analyze your agreements
          </p>
        </div>
        <Button
          onClick={() => setShowUpload(!showUpload)}
          icon={showUpload ? ChevronUp : Upload}
          variant={showUpload ? 'secondary' : 'primary'}
        >
          {showUpload ? 'Hide Upload' : 'Upload Document'}
        </Button>
      </div>

      {/* Upload zone (collapsible) */}
      {showUpload && (
        <div className="animate-slideUp">
          <UploadZone />
        </div>
      )}

      {/* Document list */}
      <DocumentList documents={documents} isLoading={isLoading} />
    </div>
  );
}
