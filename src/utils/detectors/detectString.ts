/**
 * Determines if the data is potentially in string format.
 *
 * Basic requirement: The string is non-empty.
 *
 * @param {string} data - The string to check.
 * @returns {boolean} - Whether or not the data is a string.
 */
export const detectString = (data: string): boolean => {
  return typeof data === 'string' && data.length > 0;
};
