/**
 * Color mappings for document types
 * Used across DocumentCard, Badge, and filter components
 */
export const docTypeColors = {
  rental:       { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/20',    label: 'Rental' },
  employment:   { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Employment' },
  loan:         { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20',   label: 'Loan' },
  subscription: { bg: 'bg-purple-500/10',  text: 'text-purple-400',  border: 'border-purple-500/20',  label: 'Subscription' },
  insurance:    { bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    border: 'border-cyan-500/20',    label: 'Insurance' },
  service:      { bg: 'bg-pink-500/10',    text: 'text-pink-400',    border: 'border-pink-500/20',    label: 'Service' },
  nda:          { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20',     label: 'NDA' },
  society:      { bg: 'bg-indigo-500/10',  text: 'text-indigo-400',  border: 'border-indigo-500/20',  label: 'Society' },
  other:        { bg: 'bg-slate-500/10',   text: 'text-slate-400',   border: 'border-slate-500/20',   label: 'Other' },
};

/**
 * Status color mappings
 */
export const statusColors = {
  queued:     { bg: 'bg-slate-500/10',   text: 'text-slate-400',   label: 'Queued' },
  extracting: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Extracting' },
  chunking:   { bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'Chunking' },
  embedding:  { bg: 'bg-blue-500/10',   text: 'text-blue-400',   label: 'Embedding' },
  analyzing:  { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Analyzing' },
  ready:      { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Ready' },
  failed:     { bg: 'bg-red-500/10',     text: 'text-red-400',     label: 'Failed' },
};

/**
 * Severity color mappings for alerts and red flags
 */
export const severityColors = {
  low:      { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20' },
  medium:   { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  high:     { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20' },
  info:     { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20' },
  warning:  { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  critical: { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20' },
};

/**
 * Get color set for a document type
 * @param {string} docType
 * @returns {object} { bg, text, border, label }
 */
export const getDocTypeColor = (docType) => {
  return docTypeColors[docType] || docTypeColors.other;
};

/**
 * Get color set for a status
 * @param {string} status
 * @returns {object} { bg, text, label }
 */
export const getStatusColor = (status) => {
  return statusColors[status] || statusColors.queued;
};

/**
 * Get color set for a severity level
 * @param {string} severity
 * @returns {object} { bg, text, border }
 */
export const getSeverityColor = (severity) => {
  return severityColors[severity] || severityColors.info;
};
