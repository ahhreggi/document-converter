import { XMLParser } from 'fast-xml-parser';

// Returns true if the two XML strings are equal, false otherwise
export const compareXml = (xmlString1: string, xmlString2: string): boolean => {
  const parser = new XMLParser({ ignoreAttributes: false, trimValues: true });
  const json1 = parser.parse(xmlString1);
  const json2 = parser.parse(xmlString2);
  return JSON.stringify(json1) === JSON.stringify(json2);
};

// Returns the data sent to the mock function as a string
export const getMockedSendData = (sendMock: jest.Mock): string => {
  return sendMock.mock.calls[0][0];
};

// Constructs the expected error object for a format validation error
type BuildValidationErrorParams = {
  detectedInputFormat?: string;
  message?: string;
};
export const buildValidationError = ({
  detectedInputFormat,
  message,
}: BuildValidationErrorParams) => ({
  error: 'Validation Error',
  details: expect.arrayContaining([
    expect.objectContaining({
      ...(detectedInputFormat ? { detectedInputFormat } : {}),
      ...(message ? { message } : {}),
    }),
  ]),
});
