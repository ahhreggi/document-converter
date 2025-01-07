import { JsonObject } from '../../types';
import { XMLParser } from 'fast-xml-parser';

/**
 * Parses an XML string representation of a document into a JSON object.
 *
 * @param {string} data - An XML string representation of a document.
 * @returns {JsonObject} - A JSON object containing document data.
 */
export const parseXml = (data: string): JsonObject => {
  // Configure parser to return arrays for all elements except leaf nodes
  const parser = new XMLParser({
    isArray: (_name, _jpath, isLeafNode) => !isLeafNode,
    parseTagValue: false,
    trimValues: true,
  });
  // Extract the root element's children from the parsed XML
  const dataJson: JsonObject = parser.parse(data);
  const rootChildren = Object.values(dataJson).pop();
  return Array.isArray(rootChildren) ? rootChildren[0] : {};
};
