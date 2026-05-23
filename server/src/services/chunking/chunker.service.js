import logger from '../../utils/logger.js';

/**
 * Clean text artifacts from extracted document text.
 * @param {string} text - Raw extracted text
 * @returns {string} Cleaned text
 */
const cleanText = (text) => {
  return text
    .replace(/\f/g, '\n') // form feeds → newlines
    .replace(/[ \t]+$/gm, '') // trailing spaces on lines
    .replace(/\n{4,}/g, '\n\n\n') // excessive blank lines
    .replace(/[ \t]{2,}/g, ' ') // multiple spaces/tabs → single space
    .trim();
};

/**
 * Estimate page number for a given character position based on page breaks.
 * @param {number} charIndex - Character position in text
 * @param {number[]} pageBreaks - Array of character positions for page breaks
 * @returns {number} Estimated page number (1-indexed)
 */
const estimatePageNumber = (charIndex, pageBreaks) => {
  if (pageBreaks.length === 0) return 1;
  for (let i = pageBreaks.length - 1; i >= 0; i--) {
    if (charIndex >= pageBreaks[i]) {
      return i + 2;
    }
  }
  return 1;
};

/**
 * Split text using separators
 */
function splitText(text, chunkSize, chunkOverlap, separators) {
  const finalChunks = [];
  const separator = separators.find(s => text.includes(s));
  
  let splits;
  if (separator !== undefined) {
    splits = text.split(separator);
  } else {
    splits = [text];
  }

  let goodSplits = [];
  for (const s of splits) {
    if (s.length < chunkSize) {
      goodSplits.push(s);
    } else {
      if (goodSplits.length > 0) {
        const merged = mergeSplits(goodSplits, separator || "", chunkSize, chunkOverlap);
        finalChunks.push(...merged);
        goodSplits = [];
      }
      if (separators.length > 1) {
        const otherSplits = splitText(s, chunkSize, chunkOverlap, separators.slice(1));
        finalChunks.push(...otherSplits);
      } else {
        finalChunks.push(s); // No more separators, keep as is
      }
    }
  }
  
  if (goodSplits.length > 0) {
    const merged = mergeSplits(goodSplits, separator || "", chunkSize, chunkOverlap);
    finalChunks.push(...merged);
  }
  
  return finalChunks;
}

function mergeSplits(splits, separator, chunkSize, chunkOverlap) {
  const docs = [];
  let currentDoc = [];
  let length = 0;
  
  for (const s of splits) {
    const totalLength = length + s.length + (currentDoc.length > 0 ? separator.length : 0);
    
    if (totalLength > chunkSize && currentDoc.length > 0) {
      const doc = currentDoc.join(separator);
      docs.push(doc);
      
      while (currentDoc.length > 0 && 
             (currentDoc.join(separator).length > chunkOverlap || 
             (currentDoc.join(separator).length + s.length + separator.length > chunkSize))) {
        currentDoc.shift();
      }
      length = currentDoc.reduce((acc, curr, i) => acc + curr.length + (i > 0 ? separator.length : 0), 0);
    }
    
    currentDoc.push(s);
    length += s.length + (currentDoc.length > 1 ? separator.length : 0);
  }
  
  if (currentDoc.length > 0) {
    docs.push(currentDoc.join(separator));
  }
  
  return docs;
}

/**
 * Split document text into chunks optimized for legal documents.
 * @param {string} rawText - Full document text
 * @param {number} [pageCount=1] - Total number of pages in the document
 * @returns {Promise<Array<{ text: string, metadata: { chunkIndex: number, pageNumber: number } }>>}
 */
export const chunkText = async (rawText, pageCount = 1) => {
  const cleaned = cleanText(rawText);

  if (!cleaned || cleaned.length === 0) {
    logger.warn('Empty text provided for chunking');
    return [];
  }

  // Detect page breaks (form feed or multiple newlines followed by page-like patterns)
  const pageBreaks = [];
  const pageBreakRegex = /\f|\n{3,}/g;
  let match;
  while ((match = pageBreakRegex.exec(rawText)) !== null) {
    pageBreaks.push(match.index);
  }

  const LEGAL_SEPARATORS = [
    '\n\n\n',
    '\n\n',
    '\nClause ',
    '\nSection ',
    '\nArticle ',
    '\nSchedule ',
    '\n',
    '. ',
    ' ',
    ''
  ];

  const stringChunks = splitText(cleaned, 500, 60, LEGAL_SEPARATORS);

  // Map chunks with metadata
  let currentSearchPos = 0;
  const chunks = stringChunks.map((chunkText, index) => {
    const pos = cleaned.indexOf(chunkText.substring(0, 50), currentSearchPos);
    if (pos !== -1) {
      currentSearchPos = pos;
    }

    const pageNumber = pageBreaks.length > 0
      ? estimatePageNumber(currentSearchPos, pageBreaks)
      : Math.min(Math.ceil(((currentSearchPos / cleaned.length) * pageCount) + 0.5), pageCount);

    return {
      text: chunkText,
      metadata: {
        chunkIndex: index,
        pageNumber,
      },
    };
  });

  logger.info('Text chunking complete', {
    inputLength: cleaned.length,
    chunkCount: chunks.length,
  });

  return chunks;
};
