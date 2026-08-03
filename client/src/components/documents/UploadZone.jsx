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
          glass-well relative border-2 border-dashed
          transition-all duration-300 cursor-pointer
          group overflow-hidden
          ${isDragActive && !isDragReject
            ? '!border-gold-500 scale-[1.01]'
            : isDragReject
            ? '!border-red-400'
            : '!border-white/60 hover:!border-gold-400/80'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div
            className={`
              glass-soft !rounded-2xl p-4 mb-4 transition-all duration-300
              ${isDragActive ? 'scale-110' : 'group-hover:scale-105'}
            `}
          >
            <Upload
              size={28}
              strokeWidth={1.6}
              className={`transition-all duration-300 ${
                isDragActive ? 'text-gold-600' : 'text-mocha-600 group-hover:text-gold-600'
              }`}
            />
          </div>

          <p className="text-sm font-medium text-warm-900 mb-1">
            {isDragActive ? 'Drop your document here' : 'Drag & drop your document'}
          </p>
          <p className="text-xs text-mocha-700">
            or <span className="text-gold-700 group-hover:underline">browse files</span>
          </p>
          <p className="text-xs text-mocha-600 mt-2">
            PDF, DOCX, or TXT • Max 25MB
          </p>
        </div>
      </div>

      {/* Selected file preview */}
      {selectedFile && (
        <div className="glass-tile p-4 animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="glass-soft !rounded-xl p-2.5">
              <FileText size={20} strokeWidth={1.7} className="text-gold-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-warm-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-mocha-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {!isUploading && (
              <button
                onClick={removeFile}
                className="p-1.5 rounded-lg text-mocha-500 hover:text-red-500 hover:bg-red-50/70 transition-all"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Progress bar */}
          {isUploading && (
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 rounded-full overflow-hidden bg-white/50 shadow-glass-inset">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-mocha-600 text-right">{uploadProgress}%</p>
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
