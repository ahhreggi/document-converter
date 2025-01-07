import { Request, Response, NextFunction } from 'express';
import { ConvertSchema } from '../schemas';
import { documentService } from '../services';
import { getContentTypeForFormat } from './controllerUtils';
import { ZodError } from 'zod';
import { DocumentData, FormatType } from '../types';
import { DocumentOptions } from '../services/documentService';

export const convertController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let fromFormat: FormatType | null;
  try {
    // Detect the plausible input data format type
    fromFormat = documentService.detectFormatType(req.body.data);

    // Validate the request data against a basic schema for the detected format type
    const {
      data,
      toFormat,
      lineDelimiter,
      elementDelimiter,
      minify,
      preserveWhitespace,
    } = ConvertSchema.parse({ ...req.body, fromFormat });

    const options: DocumentOptions = {
      lineDelimiter,
      elementDelimiter,
      minify,
      preserveWhitespace,
    };

    // Parse the input data into a generic JSON object
    let parsedData = data;
    if (typeof parsedData === 'string' && fromFormat) {
      parsedData = documentService.parseDocument(data, fromFormat, options);
    }

    // Validate that the JSON object conforms to the DocumentData type
    const documentData: DocumentData =
      documentService.validateDocument(parsedData);

    // Format the DocumentData JSON as requested
    const formattedData: string | DocumentData = documentService.formatDocument(
      documentData,
      toFormat,
      options
    );

    // Send the formatted data as the correct content type
    res.setHeader('Content-Type', getContentTypeForFormat(toFormat));
    res.send(formattedData);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorDetails = error.errors.map((e) => ({
        field: e.path.length ? e.path : undefined,
        message: e.message,
        detectedInputFormat: fromFormat ?? 'unknown',
      }));

      res.status(400).json({
        error: 'Validation Error',
        details: errorDetails,
      });
    } else {
      next(error);
    }
  }
};
