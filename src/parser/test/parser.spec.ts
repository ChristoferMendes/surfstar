import { describe, expect, it } from 'bun:test';
import { parse } from '../parser';
import { Node } from '../ast';
import { tokenize } from '../../lexer/lexer';

describe('Parser Tests', () => {
  it('should parse a template with a variable', () => {
    const template = 'Hello, {{name}}!';
    const expectedAST: Node = {
      type: 'TEMPLATE',
      content: [
        { type: 'TEXT', content: 'Hello, ' },
        { type: 'VARIABLE', name: 'name' },
        { type: 'TEXT', content: '!' },
      ],
    };


    const result = parse(tokenize(template));

    expect(result).toEqual(expectedAST);
  });

  it('should parse a template with a different variable', () => {
    const template = '{{greeting}}, {{name}}!';
    const expectedAST: Node = {
      type: 'TEMPLATE',
      content: [
        { type: 'VARIABLE', name: 'greeting' },
        { type: 'TEXT', content: ', ' },
        { type: 'VARIABLE', name: 'name' },
        { type: 'TEXT', content: '!' },
      ],
    };

    const result = parse(tokenize(template));

    expect(result).toEqual(expectedAST);
  });

  it('should parse a template with nested variables', () => {
    const template = '{{greeting}}, {{person.name}}!';
    const expectedAST: Node = {
      type: 'TEMPLATE',
      content: [
        { type: 'VARIABLE', name: 'greeting' },
        { type: 'TEXT', content: ', ' },
        { type: 'VARIABLE', name: 'person.name' },
        { type: 'TEXT', content: '!' },
      ],
    };

    const result = parse(tokenize(template));

    expect(result).toEqual(expectedAST);
  });

  it('should handle a template with no variables', () => {
    const template = 'This is a simple template.';
    const expectedAST: Node = {
      type: 'TEMPLATE',
      content: [
        { type: 'TEXT', content: 'This is a simple template.' },
      ],
    };

    const result = parse(tokenize(template));

    expect(result).toEqual(expectedAST);
  });
});
