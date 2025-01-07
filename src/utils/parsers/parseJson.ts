import { JsonObject } from '../../types';

/**
 * Parses a JSON string into a JSON object.
 *
 * @param {string} data - A JSON string representation of a document.
 * @returns {JsonObject} - A JSON object containing document data.
 */
export const parseJson = (data: string): JsonObject => {
  // Leaving this for consistency, but could also implement custom logic here such as
  // force-trimming elements, adding/omitting attributes, etc.
  return JSON.parse(data);
};
