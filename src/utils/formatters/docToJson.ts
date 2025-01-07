import { DocumentData } from '../../types';

/**
 * Formats a JSON object into a DocumentData JSON object.
 *
 * @param {DocumentData} documentData - A JSON object containing document data.
 * @returns {DocumentData} - A JSON object containing document data.
 */
export const docToJson = (documentData: DocumentData): DocumentData => {
  // Leaving this for consistency, but could also implement custom logic here such as
  // force-trimming elements, adding/omitting attributes, etc.
  return documentData;
};
