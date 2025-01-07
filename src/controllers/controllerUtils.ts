import { FormatType } from '../types';

export const getContentTypeForFormat = (format: FormatType): string => {
  switch (format) {
    case 'xml':
      return 'application/xml';
    case 'string':
      return 'text/plain';
    case 'json':
    default:
      return 'application/json';
  }
};
