import { JsonObject } from '../../types';

/**
 * Parses a JSON string into a JSON object.
 *
 * @param {string} data - A JSON string representation of a document.
 * @returns {JsonObject} - A JSON object containing document data.
 */
export const parseJson = (data: string): JsonObject => {
  // Maybe custom logic for trimming elements
  return JSON.parse(data);
};
