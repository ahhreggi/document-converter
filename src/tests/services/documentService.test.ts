/* eslint-disable @typescript-eslint/no-explicit-any */
import documentService from '../../services/documentService';
import { FormatType, JsonObject } from '../../types';
import { compareXml } from '../testUtils';

describe('documentService', () => {
  const validDocumentData = {
    A: [
      { A1: 'a1', A2: '' },
      { A1: '100', A2: '200' },
    ],
    B: [{ B1: 'b1', B2: 'b2' }],
  };

  const invalidDocumentData = {
    A: [
      { A1: 'a1', A2: '' },
      { A1: '100', A2: '200' },
    ],
    B: { A: [{}], B: { C: [], '': ['123'] }, D: '' },
  };

  describe('detectFormatType', () => {
    it('should detect JSON format for a JSON object', () => {
      const jsonData = { A: [{ A1: 'a1' }], B: [{ B1: 'b1' }] };
      const result = documentService.detectFormatType(jsonData);
      expect(result).toBe(FormatType.JSON);
    });

    it('should detect JSON format for a JSON string', () => {
      const jsonString = '{"A":[{"A1":"a1"}],"B":[{"B1":"b1"}]}';
      const result = documentService.detectFormatType(jsonString);
      expect(result).toBe(FormatType.JSON);
    });

    it('should detect XML format for an XML string', () => {
      const xmlString = '<root><A><A1>a1</A1></A><B><B1>b1</B1></B></root>';
      const result = documentService.detectFormatType(xmlString);
      expect(result).toBe(FormatType.XML);
    });

    it('should detect string format for a regular string', () => {
      const plainString = 'A*a1~B*b1';
      const result = documentService.detectFormatType(plainString);
      expect(result).toBe(FormatType.STRING);
    });

    it('should return null if format detection is unsuccessful', () => {
      expect(documentService.detectFormatType('')).toBeNull();
      expect(documentService.detectFormatType(12345 as any)).toBeNull();
      expect(documentService.detectFormatType(true as any)).toBeNull();
      expect(documentService.detectFormatType(null as any)).toBeNull();
      expect(documentService.detectFormatType(undefined as any)).toBeNull();
    });
  });

  describe('parseDocument', () => {
    const expectedJson: JsonObject = {
      A: [{ A1: 'a1' }],
      B: [{ B1: 'b1' }],
    };
    it('should parse a JSON string into a JSON object', () => {
      const jsonData = '{"A":[{"A1":"a1"}],"B":[{"B1":"b1"}]}';
      const result = documentService.parseDocument(jsonData, FormatType.JSON);
      expect(result).toEqual(expectedJson);
    });

    it('should parse a delimited string into a JSON object', () => {
      const stringData = 'A*a1~B*b1';
      const result = documentService.parseDocument(
        stringData,
        FormatType.STRING
      );
      expect(result).toEqual(expectedJson);
    });

    it('should parse an XML string into a JSON object', () => {
      const xmlData = '<root><A><A1>a1</A1></A><B><B1>b1</B1></B></root>';
      const result = documentService.parseDocument(xmlData, FormatType.XML);
      expect(result).toEqual(expectedJson);
    });
  });

  describe('validateDocument', () => {
    it('should validate a valid DocumentData structure', () => {
      const result = documentService.validateDocument(validDocumentData);
      expect(result).toMatchObject(validDocumentData);
    });

    it('should throw an error for an invalid DocumentData structure', () => {
      expect(() =>
        documentService.validateDocument(invalidDocumentData)
      ).toThrow();
    });
  });

  describe('formatDocument', () => {
    it('should format a valid DocumentData object into JSON format', () => {
      const result = documentService.formatDocument(
        validDocumentData,
        FormatType.JSON
      );
      expect(result).toMatchObject(validDocumentData);
    });

    it('should format a valid DocumentData object into string format', () => {
      const result = documentService.formatDocument(
        validDocumentData,
        FormatType.STRING,
        { minify: true }
      );
      const expected = 'A*a1*~A*100*200~B*b1*b2~';
      expect(result).toBe(expected);
    });

    it('should format a valid DocumentData object into valid XML format', () => {
      const result = documentService.formatDocument(
        validDocumentData,
        FormatType.XML
      ) as string;
      const expected =
        '<?xml version="1.0" encoding="UTF-8" ?><root><A><A1>a1</A1><A2></A2></A><A><A1>100</A1><A2>200</A2></A><B><B1>b1</B1><B2>b2</B2></B></root>';
      expect(compareXml(result, expected)).toBe(true);
    });
  });
});
