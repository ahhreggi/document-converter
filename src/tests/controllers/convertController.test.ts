import * as fs from 'fs';
import * as path from 'path';
import { convertController } from '../../controllers/convertController';
import { Request, Response, NextFunction } from 'express';
import { buildValidationError, getMockedSendData } from '../testUtils';

describe('convertController', () => {
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe('Example Files', () => {
    const loadExample = (filename: string): string => {
      const filePath = path.resolve(__dirname, '../examples', filename);
      return fs.readFileSync(filePath, 'utf8');
    };

    const exampleFiles = {
      json: JSON.parse(loadExample('json.txt')),
      string: loadExample('string.txt'),
      xml: loadExample('xml.txt'),
      testFile: loadExample('test-file.txt'),
    };

    it('should correctly convert test-file.txt to JSON', async () => {
      const req: Partial<Request> = {
        body: {
          data: exampleFiles.testFile,
          toFormat: 'json',
          lineDelimiter: '~',
          elementDelimiter: '*',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/json'
      );
      const sentData = getMockedSendData(res.send as jest.Mock);
      expect(sentData).toMatchObject({
        ISA: [
          {
            ISA1: '00',
            ISA2: '',
            ISA3: '00',
            ISA4: '',
            ISA5: '12',
            ISA6: '5032337522',
            ISA7: '01',
            ISA8: '048337914',
            ISA9: '190225',
            ISA10: '1532',
            ISA11: '^',
            ISA12: '00501',
            ISA13: '000001367',
            ISA14: '0',
            ISA15: 'P',
            ISA16: '>',
          },
        ],
        GE: [
          {
            GE1: '1',
            GE2: '572',
          },
        ],
      });
    });

    it('should correctly convert test-file.txt to XML', async () => {
      const req: Partial<Request> = {
        body: {
          data: exampleFiles.testFile,
          toFormat: 'xml',
          lineDelimiter: '~',
          elementDelimiter: '*',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/xml'
      );
      const sentData = getMockedSendData(res.send as jest.Mock);
      expect(sentData).toEqual(expect.stringContaining(`<GE2>572</GE2>`));
      expect(sentData).toEqual(
        expect.stringContaining(`<N21>CHEHALIS RSC DC - HOME/HCC</N21>`)
      );
    });

    it('should correctly convert the JSON example to the string example', async () => {
      const req: Partial<Request> = {
        body: {
          data: exampleFiles.json,
          toFormat: 'string',
          lineDelimiter: '~',
          elementDelimiter: '*',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
      const sentData = getMockedSendData(res.send as jest.Mock);
      expect(sentData).toEqual(exampleFiles.string);
    });

    it('should correctly convert the JSON example to the XML example', async () => {
      const req: Partial<Request> = {
        body: {
          data: exampleFiles.json,
          toFormat: 'xml',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/xml'
      );

      const sentData = getMockedSendData(res.send as jest.Mock);
      expect(sentData).toEqual(exampleFiles.xml);
    });

    it('should correctly convert the string example to the JSON example', async () => {
      const req: Partial<Request> = {
        body: {
          data: exampleFiles.string,
          toFormat: 'json',
          lineDelimiter: '~',
          elementDelimiter: '*',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/json'
      );
      const sentData = getMockedSendData(res.send as jest.Mock);
      expect(sentData).toMatchObject(exampleFiles.json);
    });

    it('should correctly convert the string example to the XML example', async () => {
      const req: Partial<Request> = {
        body: {
          data: exampleFiles.string,
          toFormat: 'xml',
          lineDelimiter: '~',
          elementDelimiter: '*',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/xml'
      );
      const sentData = getMockedSendData(res.send as jest.Mock);
      expect(sentData).toEqual(exampleFiles.xml);
    });

    it('should correctly convert the XML example to the JSON example', async () => {
      const req: Partial<Request> = {
        body: {
          data: exampleFiles.xml,
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/json'
      );

      const sentData = getMockedSendData(res.send as jest.Mock);
      expect(sentData).toMatchObject(exampleFiles.json);
    });

    it('should correctly convert the XML example to the string example', async () => {
      const req: Partial<Request> = {
        body: {
          data: exampleFiles.xml,
          toFormat: 'string',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
      const sentData = getMockedSendData(res.send as jest.Mock);
      expect(sentData).toEqual(exampleFiles.string);
    });

    it('should produce equivalent data when converting from JSON to JSON', async () => {
      const req: Partial<Request> = {
        body: {
          data: exampleFiles.json,
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/json'
      );
      const sentData = getMockedSendData(res.send as jest.Mock);
      expect(sentData).toMatchObject(exampleFiles.json);
    });

    it('should produce equivalent data when converting from XML to XML', async () => {
      const req: Partial<Request> = {
        body: {
          data: exampleFiles.xml,
          toFormat: 'xml',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/xml'
      );
      const sentData = getMockedSendData(res.send as jest.Mock);
      expect(sentData).toEqual(exampleFiles.xml);
    });

    it('should produce equivalent data when converting from string to string', async () => {
      const req: Partial<Request> = {
        body: {
          data: exampleFiles.string,
          toFormat: 'string',
          lineDelimiter: '~',
          elementDelimiter: '*',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
      const sentData = getMockedSendData(res.send as jest.Mock);
      expect(sentData).toEqual(exampleFiles.string);
    });
  });

  describe('Input Validation', () => {
    it('should return a Validation Error if data field is missing', async () => {
      const req: Partial<Request> = {
        body: {
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const sentData = getMockedSendData(res.json as jest.Mock);
      expect(sentData).toMatchObject(
        buildValidationError({
          detectedInputFormat: 'unknown',
          message: 'Required field data must be a string or plain object',
        })
      );
    });

    it('should return a Validation Error when failing to detect format', async () => {
      const req: Partial<Request> = {
        body: {
          data: '',
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const sentData = getMockedSendData(res.json as jest.Mock);
      expect(sentData).toMatchObject(
        buildValidationError({
          detectedInputFormat: 'unknown',
          message: 'Failed to detect a valid input format type',
        })
      );
    });

    it('should detect string format and return a Validation Error if delimiter fields are missing', async () => {
      const req: Partial<Request> = {
        body: {
          data: 'A*a1~B*b1',
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const sentData = getMockedSendData(res.json as jest.Mock);
      expect(sentData).toMatchObject(
        buildValidationError({
          detectedInputFormat: 'string',
          message: expect.stringContaining(
            'lineDelimiter and elementDelimiter are both required'
          ),
        })
      );
    });

    it('should detect XML format and return an Invalid XML Error for a broken XML string', async () => {
      const req: Partial<Request> = {
        body: {
          data: '<root><roo',
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const sentData = getMockedSendData(res.json as jest.Mock);
      expect(sentData).toMatchObject(
        buildValidationError({
          detectedInputFormat: 'xml',
          message: 'Invalid XML document',
        })
      );
    });
  });

  describe('DocumentData Structure Validation', () => {
    it('should return a Validation Error if parsed data is an empty object', async () => {
      const req: Partial<Request> = {
        body: {
          data: {},
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const sentData = getMockedSendData(res.json as jest.Mock);
      expect(sentData).toMatchObject(
        buildValidationError({
          message: 'Document should have at least one segment',
        })
      );
    });

    it('should return a Validation Error if parsed data contains empty strings for segment names', async () => {
      const req: Partial<Request> = {
        body: {
          data: { '': [{ A1: '100' }] },
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const sentData = getMockedSendData(res.json as jest.Mock);
      expect(sentData).toMatchObject(
        buildValidationError({
          message: 'Segment names must be non-empty strings',
        })
      );
    });

    it('should return a Validation Error if parsed data contains empty strings for element names', async () => {
      const req: Partial<Request> = {
        body: {
          data: { A: [{ '': '100' }] },
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const sentData = getMockedSendData(res.json as jest.Mock);
      expect(sentData).toMatchObject(
        buildValidationError({
          message: 'String must contain at least 1 character(s)',
        })
      );
    });

    it('should return a Validation Error if parsed data contains segments with an empty array for its value', async () => {
      const req: Partial<Request> = {
        body: {
          data: { A: [{ A1: '100' }], B: [] },
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const sentData = getMockedSendData(res.json as jest.Mock);
      expect(sentData).toMatchObject(
        buildValidationError({
          message: 'Segment must contain at least one element',
        })
      );
    });

    it('should return a Validation Error if parsed data contains segment elements of an invalid type', async () => {
      const req: Partial<Request> = {
        body: {
          data: { A: [{ A1: '100' }], B: ['123'] },
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const sentData = getMockedSendData(res.json as jest.Mock);
      expect(sentData).toMatchObject(
        buildValidationError({
          message: 'Expected object, received string',
        })
      );
    });

    it('should return a Validation Error if parsed data contains segment elements of the correct type but are empty', async () => {
      const req: Partial<Request> = {
        body: {
          data: { A: [{ A1: '100' }], B: [{}] },
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const sentData = getMockedSendData(res.json as jest.Mock);
      expect(sentData).toMatchObject(
        buildValidationError({
          message: 'Segment data must have at least one key-value pair',
        })
      );
    });

    it('should return a Validation Error if parsed data contains segment elements of the correct type but have invalid values', async () => {
      const req: Partial<Request> = {
        body: {
          data: { A: [{ A1: '100' }], B: [{ B1: [] }] },
          toFormat: 'json',
        },
      };
      await convertController(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      const sentData = getMockedSendData(res.json as jest.Mock);
      expect(sentData).toMatchObject(
        buildValidationError({
          message: 'Expected string, received array',
        })
      );
    });
  });
});
