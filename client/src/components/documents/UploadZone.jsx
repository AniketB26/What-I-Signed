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
            ? 'border-violet-500 bg-violet-500/10 scale-[1.01]'
            : isDragReject
            ? 'border-rose-500 bg-rose-500/10'
            : 'border-slate-700/50 hover:border-violet-500/50 hover:bg-slate-900/30'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center py-10 px-6">
          <div className={`
            p-4 rounded-2xl mb-4 transition-all duration-300
            ${isDragActive
              ? 'bg-violet-500/20 scale-110'
              : 'bg-slate-800/50 group-hover:bg-violet-500/10 group-hover:scale-105'
            }
          `}>
            <Upload
              size={28}
              className={`
                transition-all duration-300
                ${isDragActive ? 'text-violet-400' : 'text-slate-400 group-hover:text-violet-400'}
              `}
            />
          </div>

          <p className="text-sm font-medium text-slate-200 mb-1">
            {isDragActive ? 'Drop your document here' : 'Drag & drop your document'}
          </p>
          <p className="text-xs text-slate-500">
            or <span className="text-violet-400 group-hover:underline">browse files</span>
          </p>
          <p className="text-xs text-slate-600 mt-2">
            PDF, DOCX, or TXT • Max 25MB
          </p>
        </div>
      </div>

      {/* Selected file preview */}
      {selectedFile && (
        <div className="glass rounded-xl p-4 animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10">
              <FileText size={20} className="text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {!isUploading && (
              <button
                onClick={removeFile}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Progress bar */}
          {isUploading && (
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 text-right">{uploadProgress}%</p>
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
