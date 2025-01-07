import { z } from 'zod';
import { XMLValidator } from 'fast-xml-parser';
import { FormatType, FORMAT_TYPES } from '../types';

export const ConvertSchema = z
  .object({
    data: z.any(),
    fromFormat: z.union([z.enum(FORMAT_TYPES), z.null()]),
    toFormat: z.enum(FORMAT_TYPES),
    lineDelimiter: z.string().min(1).optional(),
    elementDelimiter: z.string().min(1).optional(),
    minify: z.boolean().optional(),
    preserveWhitespace: z.boolean().optional(),
  })
  // Validate input data
  .refine(
    (obj) =>
      typeof obj.data === 'string' ||
      (typeof obj.data === 'object' &&
        obj.data !== null &&
        !Array.isArray(obj.data)),
    {
      path: ['data'],
      message: 'Required field data must be a string or plain object',
    }
  )
  // Validate that a format type was detected
  .refine(
    (obj) => {
      return obj.fromFormat !== null;
    },
    {
      path: ['data'],
      message: 'Failed to detect a valid input format type',
    }
  )
  // If the detected format is string, validate required fields
  .refine(
    (obj) => {
      if (obj.fromFormat === FormatType.STRING) {
        if (
          obj.lineDelimiter === undefined ||
          obj.elementDelimiter === undefined
        ) {
          return false;
        }
      }
      return true;
    },
    {
      message:
        'lineDelimiter and elementDelimiter are both required for string documents',
    }
  )
  // If the detected format is XML, validate that it's a valid XML document
  .refine(
    (obj) => {
      if (obj.fromFormat === FormatType.XML) {
        try {
          return XMLValidator.validate(obj.data) === true;
        } catch {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Invalid XML document',
      path: ['data'],
    }
  );
