import {
  STRING_DEFAULT_ELEMENT_DELIMITER,
  STRING_DEFAULT_LINE_DELIMITER,
  STRING_DEFAULT_PRESERVE_WHITESPACE,
} from '../../config/string';
import { JsonObject } from '../../types';

/**
 * Parses a string representation of a document into a JSON object.
 *
 * Whitespace is trimmed from segment names and element values.
 * Empty element values ("") are preserved.
 *
 * @param {string} data - A string representation of a document.
 * @param {string} lineDelimiter - The delimiter used to separate lines in the document.
 * @param {string} elementDelimiter - The delimiter used to separate elements within a line.
 * @param {boolean} preserveWhitespace - Whether to preserve whitespace in element values.
 * @returns {JsonObject} - A JSON object containing document data.
 */
export const parseString = (
  data: string,
  lineDelimiter = STRING_DEFAULT_LINE_DELIMITER,
  elementDelimiter = STRING_DEFAULT_ELEMENT_DELIMITER,
  preserveWhitespace = STRING_DEFAULT_PRESERVE_WHITESPACE
): JsonObject => {
  const result: JsonObject = {};

  const lines = data.split(lineDelimiter);
  for (let i = 0; i < lines.length; i++) {
    // Parse non-empty lines to separate the segment name and its elements
    const currentLine = lines[i];
    if (currentLine.length > 0) {
      const parsedSegment = currentLine.split(elementDelimiter);
      const segmentName = parsedSegment[0].trim();
      const elements = parsedSegment.slice(1);

      // Construct an object with the segment elements
      const jsonObject: JsonObject = {};
      let id = 1;
      for (let i = 0; i < elements.length; i++) {
        let value = elements[i];
        if (!preserveWhitespace) {
          value = value.trim();
        }
        jsonObject[segmentName + id] = value;
        id++;
      }

      // Add the object to result under the segment name
      if (result[segmentName]) {
        result[segmentName].push(jsonObject);
      } else {
        result[segmentName] = [jsonObject];
      }
    }
  }

  return result;
};
