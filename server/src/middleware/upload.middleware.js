import multer from 'multer';

const ALLOWED_MIMES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const storage = multer.memoryStorage();

/**
 * File filter that only allows PDF, JPEG, PNG, WebP, and DOCX files.
 */
const fileFilter = (_req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: PDF, JPEG, PNG, WebP, DOCX`), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export default upload;
