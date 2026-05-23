/**
 * Accepted MIME types for file uploads
 */
export const ACCEPTED_MIME_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

/**
 * Maximum file size in bytes (20MB)
 */
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

/**
 * Get file type category from MIME type
 * @param {string} mimeType
 * @returns {'pdf'|'image'|'docx'|'unknown'}
 */
export const getFileCategory = (mimeType) => {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType?.startsWith('image/')) return 'image';
  if (mimeType?.includes('wordprocessingml')) return 'docx';
  return 'unknown';
};

/**
 * Get file extension from filename
 * @param {string} filename
 * @returns {string}
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Get a human-readable label for the file type
 * @param {string} fileType - 'pdf', 'image', or 'docx'
 * @returns {string}
 */
export const getFileTypeLabel = (fileType) => {
  const labels = {
    pdf: 'PDF Document',
    image: 'Scanned Image',
    docx: 'Word Document',
  };
  return labels[fileType] || 'Document';
};

/**
 * Validate a file before upload
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateFile = (file) => {
  if (!file) return { valid: false, error: 'No file selected' };

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds 20MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)` };
  }

  const acceptedTypes = Object.keys(ACCEPTED_MIME_TYPES);
  if (!acceptedTypes.includes(file.type)) {
    return { valid: false, error: `File type "${file.type}" is not supported. Upload PDF, JPEG, PNG, WebP, or DOCX files.` };
  }

  return { valid: true };
};
