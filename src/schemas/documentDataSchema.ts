import { z } from 'zod';
import { DocumentData } from '../types';

/**
 * Schema for DocumentData objects, which are essentially JSON objects that conform
 * to a specific structure.
 *
 * Specifications:
 * 1. DocumentData objects must be a non-empty object containing key-value pairs.
 * 2. All keys must be non-empty strings.
 * 3. Top-level values must be non-empty arrays containing at least one element.
 * 4. Elements of the arrays must be non-empty objects containing key-value pairs.
 * 3. Values in the objects must be strings (the strings may be empty).
 */
export const DocumentDataSchema: z.ZodType<DocumentData> = z.lazy(() =>
  z
    .record(
      z
        .array(
          z
            .record(z.string().min(1), z.string())
            .refine((obj) => Object.keys(obj).length > 0, {
              message: 'Segment data must have at least one key-value pair',
            })
        )
        .min(1, { message: 'Segment must contain at least one element' })
    )
    .refine((obj) => Object.keys(obj).length > 0, {
      message: 'Document should have at least one segment',
    })
    .refine(
      (obj) => {
        return Object.keys(obj).every((key) => key.trim().length > 0);
      },
      {
        message: 'Segment names must be non-empty strings',
      }
    )
);
