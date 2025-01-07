import { stringConfig } from '../../config';
import { DocumentData } from '../../types';

/**
 * Formats a DocumentData JSON object into a valid string representation.
 *
 * @param {DocumentData} documentData - A JSON object containing document data.
 * @param {string} lineDelimiter - The delimiter used to separate lines in the document.
 * @param {string} elementDelimiter - The delimiter used to separate elements within a line.
 * @param {boolean} minify - Whether or not to keep the output compact.
 * @param {boolean} preserveWhitespace - Whether to preserve whitespace in element values.
 * @returns {string} - A valid string representation of the document.
 */
export const docToString = (
  documentData: DocumentData,
  lineDelimiter = stringConfig.STRING_DEFAULT_LINE_DELIMITER,
  elementDelimiter = stringConfig.STRING_DEFAULT_ELEMENT_DELIMITER,
  minify = stringConfig.STRING_DEFAULT_MINIFY,
  preserveWhitespace = stringConfig.STRING_DEFAULT_PRESERVE_WHITESPACE
): string => {
  const newline = minify ? '' : '\n';
  let result = '';
  // Iterate through the entries of DocumentData
  for (const [segmentName, segmentData] of Object.entries(documentData)) {
    // Format each set of data and add it to the result as an individual occurrence of the segment
    for (const data of segmentData) {
      const segmentString = Object.values(data)
        .map((el) =>
          typeof el === 'string' && !preserveWhitespace ? el.trim() : el
        )
        .join(elementDelimiter);
      result += `${segmentName}${elementDelimiter}${segmentString}${lineDelimiter}${newline}`;
    }
  }
  return result.trim();
};
