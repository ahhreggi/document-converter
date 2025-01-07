import { docToJson } from './docToJson';
import { docToString } from './docToString';
import { docToXml } from './docToXml';

export const formatters = {
  string: docToString,
  xml: docToXml,
  json: docToJson,
};
