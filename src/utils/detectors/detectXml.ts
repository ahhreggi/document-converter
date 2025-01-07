import { XMLValidator } from 'fast-xml-parser';

/**
 * Determines if data is potentially in XML format.
 *
 * Basic requirement: The string is a valid XML document or contains common patterns.
 *
 * @param {string} data - The string to check.
 * @returns {boolean} - Whether or not the string is a possible XML document.
 */
export const detectXml = (data: string): boolean => {
  const trimmedData = data.trim();
  if (trimmedData.startsWith('<?xml') || trimmedData.startsWith('<root>')) {
    return true;
  }
  try {
    const isValid = XMLValidator.validate(data);
    return isValid === true;
  } catch {
    return false;
  }
};
