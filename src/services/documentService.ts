import { DocumentDataSchema } from '../schemas';
import { DocumentData, FormatType, JsonObject } from '../types';
import { formatters } from '../utils/formatters';
import { parsers } from '../utils/parsers';
import { detectJson, detectString, detectXml } from '../utils/detectors';

export type DocumentOptions = {
  lineDelimiter?: string;
  elementDelimiter?: string;
  minify?: boolean;
  preserveWhitespace?: boolean;
};

/**
 * Determines the most plausible format type of the data using basic assertions.
 *
 * @param {string | JsonObject} data - The data to determine the format type of.
 * @returns {FormatType | null} - The format type of the data or null if detection failed.
 */
export const detectFormatType = (
  data: string | JsonObject
): FormatType | null => {
  if (detectJson(data)) {
    return FormatType.JSON;
  } else if (typeof data === 'string') {
    if (detectXml(data)) {
      return FormatType.XML;
    } else if (detectString(data)) {
      return FormatType.STRING;
    }
  }
  return null;
};

/**
 * Parses a document from the specific format into a DocumentData JSON.
 *
 * @param {string} data - The string representation of a document in a valid format type.
 * @param {FormatType} fromFormat - The format type of the document.
 * @param {DocumentOptions} options - Options for configuring the document.
 * @returns {JsonObject} - A JSON object containing document data.
 */
const parseDocument = (
  data: string,
  fromFormat: FormatType,
  options?: DocumentOptions
): JsonObject => {
  if (fromFormat === FormatType.STRING) {
    return parsers[fromFormat](
      data,
      options?.lineDelimiter,
      options?.elementDelimiter,
      options?.preserveWhitespace
    );
  }
  return parsers[fromFormat](data);
};

/**
 * Validates that the JSON object conforms to the DocumentData type.
 *
 * @param {JsonObject} json - A JSON object to validate.
 * @returns {DocumentData} - The JSON object as a DocumentData type.
 * @throws {ZodError} - Throws an error if the JSON object does not conform to the DocumentData type.
 */
const validateDocument = (json: JsonObject): DocumentData => {
  return DocumentDataSchema.parse(json);
};

/**
 * Formats a DocumentData JSON object into the specified format.
 *
 * @param {DocumentData} documentData - A JSON object containing document data.
 * @param {FormatType} toFormat - The format type to convert to.
 * @param {DocumentOptions} options - Options for configuring the document.
 * @returns {string | DocumentData} - The document in the specified format.
 */
const formatDocument = (
  documentData: DocumentData,
  toFormat: FormatType,
  options?: DocumentOptions
): string | DocumentData => {
  if (toFormat === FormatType.STRING) {
    return formatters[toFormat](
      documentData,
      options?.lineDelimiter,
      options?.elementDelimiter,
      options?.minify,
      options?.preserveWhitespace
    );
  } else if (toFormat === FormatType.XML) {
    return formatters[toFormat](documentData, options?.minify);
  }
  return formatters[toFormat](documentData);
};

export default {
  detectFormatType,
  parseDocument,
  validateDocument,
  formatDocument,
};
