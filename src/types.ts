/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type JsonObject = Record<string, any>;

export type DocumentData = {
  [key: string]: DocumentData[] | string;
};

export enum FormatType {
  JSON = 'json',
  STRING = 'string',
  XML = 'xml',
}

export const FORMAT_TYPES = [
  FormatType.JSON,
  FormatType.STRING,
  FormatType.XML,
] as const;
