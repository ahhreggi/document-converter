import { DocumentData } from '../../../types';
import { parseString } from '../../../utils/parsers/parseString';

describe('parseString', () => {
  it('should correctly parse strings with unique segment names', () => {
    const testString = 'A*a1~B*b1';
    const result: DocumentData = {
      A: [{ A1: 'a1' }],
      B: [{ B1: 'b1' }],
    };
    expect(parseString(testString)).toMatchObject(result);
  });

  it('should correctly parse strings with non-unique segment names', () => {
    const testString = 'A*a1~B*b1~A*100*200~';
    const result: DocumentData = {
      A: [{ A1: 'a1' }, { A1: '100', A2: '200' }],
      B: [{ B1: 'b1' }],
    };
    expect(parseString(testString)).toMatchObject(result);
  });

  it('should correctly parse strings with elements containing unpreserved whitespace', () => {
    const testString = ' A *a1~ A* s p a c e d *200~\n\n B* * 300 ~ \n';
    const result: DocumentData = {
      A: [{ A1: 'a1' }, { A1: 's p a c e d', A2: '200' }],
      B: [{ B1: '', B2: '300' }],
    };
    expect(parseString(testString, '~', '*', false)).toMatchObject(result);
  });

  it('should correctly parse strings with elements containing preserved whitespace', () => {
    const testString = ' A *a1~ A* s p a c e d *200~\n\n B* * 300 ~ \n';
    const result: DocumentData = {
      A: [{ A1: 'a1' }, { A1: ' s p a c e d ', A2: '200' }],
      B: [{ B1: ' ', B2: ' 300 ' }],
    };
    expect(parseString(testString, '~', '*', true)).toMatchObject(result);
  });

  it('should correctly parse strings using custom delimiters', () => {
    const testString = 'A!a1@B!b1';
    const result: DocumentData = {
      A: [{ A1: 'a1' }],
      B: [{ B1: 'b1' }],
    };
    expect(parseString(testString, '@', '!')).toMatchObject(result);
  });

  it('should correctly parse strings with empty elements', () => {
    const testString = 'A*a1~B*b1~A*100**200~';
    const result: DocumentData = {
      A: [{ A1: 'a1' }, { A1: '100', A2: '', A3: '200' }],
      B: [{ B1: 'b1' }],
    };
    expect(parseString(testString)).toMatchObject(result);
  });

  it('should correctly parse empty strings', () => {
    const testString = '';
    const result: DocumentData = {};
    expect(parseString(testString)).toMatchObject(result);
  });
});
