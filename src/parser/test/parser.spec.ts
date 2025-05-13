import { describe, expect, it } from 'bun:test';
import { tokenize } from '../../lexer/lexer';
import type { Node } from '../ast';
import { parse } from '../parser';

describe('Parser Tests', () => {
  it('should parse a template with a variable', () => {
    const template = 'Hello, {{name}}!';
    const expectedAST: Node = {
      type: 'TEMPLATE',
      content: [
        { type: 'TEXT', content: 'Hello, ' },
        { type: 'VARIABLE', name: 'name' },
        { type: 'TEXT', content: '!' }
      ]
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
        { type: 'TEXT', content: '!' }
      ]
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
        { type: 'TEXT', content: '!' }
      ]
    };

    const result = parse(tokenize(template));

    expect(result).toEqual(expectedAST);
  });

  it('should handle a template with no variables', () => {
    const template = 'This is a simple template.';
    const expectedAST: Node = {
      type: 'TEMPLATE',
      content: [{ type: 'TEXT', content: 'This is a simple template.' }]
    };

    const result = parse(tokenize(template));

    expect(result).toEqual(expectedAST);
  });

  it('should parse a template with a simple each block', () => {
    const template = 'Items:\n{{#each items}}\n- {{this}}\n{{/each}}';
    const expectedAST: Node = {
      type: 'TEMPLATE',
      content: [
        { type: 'TEXT', content: 'Items:\n' },
        {
          type: 'EACH',
          arrayName: 'items',
          content: [
            { type: 'TEXT', content: '- ' },
            { type: 'VARIABLE', name: 'this' },
            { type: 'TEXT', content: '\n' }
          ]
        }
      ]
    };

    const result = parse(tokenize(template));
    expect(result).toEqual(expectedAST);
  });

  it('should parse a template with an each block containing multiple variables', () => {
    const template = '{{#each users}}\nName: {{name}}, Age: {{age}}\n{{/each}}';
    const expectedAST: Node = {
      type: 'TEMPLATE',
      content: [
        {
          type: 'EACH',
          arrayName: 'users',
          content: [
            { type: 'TEXT', content: 'Name: ' },
            { type: 'VARIABLE', name: 'name' },
            { type: 'TEXT', content: ', Age: ' },
            { type: 'VARIABLE', name: 'age' },
            { type: 'TEXT', content: '\n' }
          ]
        }
      ]
    };

    const result = parse(tokenize(template));
    expect(result).toEqual(expectedAST);
  });

  it('should parse nested each blocks', () => {
    const template = '{{#each categories}}\n{{name}}:\n{{#each items}}\n- {{this}}\n{{/each}}{{/each}}';
    const expectedAST: Node = {
      type: 'TEMPLATE',
      content: [
        {
          type: 'EACH',
          arrayName: 'categories',
          content: [
            { type: 'VARIABLE', name: 'name' },
            { type: 'TEXT', content: ':\n' },
            {
              type: 'EACH',
              arrayName: 'items',
              content: [
                { type: 'TEXT', content: '- ' },
                { type: 'VARIABLE', name: 'this' },
                { type: 'TEXT', content: '\n' }
              ]
            },
            { type: 'TEXT', content: '\n- ' },
            { type: 'VARIABLE', name: 'this' },
            { type: 'TEXT', content: '\n' }
          ]
        }
      ]
    };

    const result = parse(tokenize(template));
    expect(result).toEqual(expectedAST);
  });

  it('should throw error for unclosed each block', () => {
    const template = '{{#each items}}\n{{this}}';

    expect(() => {
      parse(tokenize(template));
    }).toThrow('Unclosed {{#each}} block in template');
  });
});
