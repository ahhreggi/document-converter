import { FormatType } from '../../types';
import { parseJson } from './parseJson';
import { parseString } from './parseString';
import { parseXml } from './parseXml';

export const parsers = {
  [FormatType.JSON]: parseJson,
  [FormatType.STRING]: parseString,
  [FormatType.XML]: parseXml,
};
