import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Format a date string to a human-readable format
 * @param {string|Date} date - ISO date string or Date object
 * @param {string} formatStr - date-fns format string
 * @returns {string} formatted date or fallback
 */
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsed) ? format(parsed, formatStr) : '—';
};

/**
 * Format a date as relative time (e.g., "3 days ago", "in 5 days")
 * @param {string|Date} date
 * @returns {string}
 */
export const formatRelativeDate = (date) => {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return '—';
  return formatDistanceToNow(parsed, { addSuffix: true });
};

/**
 * Format a date for display in document cards
 * @param {string|Date} date
 * @returns {string}
 */
export const formatShortDate = (date) => {
  return formatDate(date, 'MMM d, yyyy');
};

/**
 * Format file size from bytes to human-readable
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
};
