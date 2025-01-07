import { DocumentData } from '../../../types';
import { docToString } from '../../../utils/formatters/docToString';

describe('docToString', () => {
  it('should correctly format valid DocumentData', () => {
    const validDocumentData: DocumentData = {
      A: [{ A1: 'a1' }],
      B: [{ B1: 'b1', B2: 'b2' }],
    };
    const expected = 'A*a1~B*b1*b2~';
    expect(docToString(validDocumentData, '~', '*', true)).toBe(expected);
  });

  it('should correctly format valid DocumentData with multiple segments and elements', () => {
    const validDocumentData: DocumentData = {
      A: [{ A1: 'a1' }, { A1: '100', A2: '200' }],
      B: [{ B1: 'b1' }],
    };
    const expected = 'A*a1~A*100*200~B*b1~';
    expect(docToString(validDocumentData, '~', '*', true)).toBe(expected);
  });

  it('should correctly format valid DocumentData with empty elements', () => {
    const validDocumentData: DocumentData = {
      A: [{ A1: 'a1' }, { A1: '' }],
      B: [{ B1: 'b1' }],
    };
    const expected = 'A*a1~A*~B*b1~';
    expect(docToString(validDocumentData, '~', '*', true)).toBe(expected);
  });

  it('should correctly format valid DocumentData using custom delimiters', () => {
    const validDocumentData: DocumentData = {
      A: [
        { A1: 'a1', A2: 'a2' },
        { A1: '100', A2: '200' },
      ],
      B: [{ B1: 'b1', B2: 'b2' }],
    };
    const expected = 'A|a1|a2@A|100|200@B|b1|b2@';
    expect(docToString(validDocumentData, '@', '|', true)).toBe(expected);
  });
});
