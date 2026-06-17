import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { useUploadDocument } from '../../hooks/useDocuments';
import Button from '../ui/Button';

export default function UploadZone() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadMutation = useUploadDocument();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024, // 25MB
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        onProgress: setUploadProgress,
      });
      setSelectedFile(null);
      setUploadProgress(0);
    } catch {
      // Error handled by mutation
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const isUploading = uploadMutation.isPending;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative rounded-2xl border-2 border-dashed
          transition-all duration-300 cursor-pointer
          group overflow-hidden
          ${isDragActive && !isDragReject
            ? 'border-warm-600 bg-warm-100/50 scale-[1.01]'
            : isDragReject
            ? 'border-red-400 bg-red-50'
            : 'border-cream-400 hover:border-warm-500 hover:bg-cream-100/50'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center py-10 px-6">
          <div className={`
            p-4 rounded-2xl mb-4 transition-all duration-300
            ${isDragActive
              ? 'bg-warm-200/60 scale-110'
              : 'bg-cream-200/60 group-hover:bg-warm-100 group-hover:scale-105'
            }
          `}>
            <Upload
              size={28}
              className={`
                transition-all duration-300
                ${isDragActive ? 'text-warm-600' : 'text-warm-400 group-hover:text-warm-600'}
              `}
            />
          </div>

          <p className="text-sm font-medium text-warm-800 mb-1">
            {isDragActive ? 'Drop your document here' : 'Drag & drop your document'}
          </p>
          <p className="text-xs text-warm-400">
            or <span className="text-warm-600 group-hover:underline">browse files</span>
          </p>
          <p className="text-xs text-warm-400 mt-2">
            PDF, DOCX, or TXT • Max 25MB
          </p>
        </div>
      </div>

      {/* Selected file preview */}
      {selectedFile && (
        <div className="bg-white/80 border border-cream-300/60 rounded-xl p-4 shadow-sm animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-warm-100">
              <FileText size={20} className="text-warm-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-warm-800 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-warm-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {!isUploading && (
              <button
                onClick={removeFile}
                className="p-1.5 rounded-lg text-warm-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Progress bar */}
          {isUploading && (
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-warm-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-warm-400 text-right">{uploadProgress}%</p>
            </div>
          )}

          {!isUploading && (
            <div className="mt-3 flex justify-end">
              <Button onClick={handleUpload} size="sm" icon={CheckCircle2}>
                Upload & Analyze
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
