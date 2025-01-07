import { JsonObject } from '../../types';

/**
 * Determines if data is potentially in JSON format.
 *
 * Basic requirement: The data is either an object or a parsable JSON string.
 *
 * @param {string | JsonObject} data - The string or object to check.
 * @returns {boolean} - Whether or not the data is a possible JSON.
 */
export const detectJson = (data: string | JsonObject): boolean => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return false;
    }
  }
  return typeof data === 'object' && !Array.isArray(data) && data !== null;
};
