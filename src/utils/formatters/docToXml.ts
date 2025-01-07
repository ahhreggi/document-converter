import { XMLBuilder } from 'fast-xml-parser';
import { DocumentData } from '../../types';
import { xmlConfig } from '../../config';
/**
 * Formats a DocumentData JSON object into a valid XML string representation.
 *
 * @param {DocumentData} documentData - A JSON object containing document data.
 * @param {boolean} minify - Whether or not to keep the output compact.
 * @returns {string} - A valid XML string representation of the document.
 */
export const docToXml = (
  documentData: DocumentData,
  minify = xmlConfig.XML_DEFAULT_MINIFY
): string => {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: !minify,
    suppressEmptyNode: false,
  });

  const xml = builder.build({
    [xmlConfig.XML_ROOT_NAME]: documentData,
  });

  return `${xmlConfig.XML_DECLARATION}${minify ? '' : '\n'}${xml}`;
};
