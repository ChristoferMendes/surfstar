import { Token, TokenType } from '../lexer/lexer';
import { Node, TemplateNode, TextNode, VariableNode } from './ast';

export function parse(tokens: Token[]): Node {
  const ast: TemplateNode = createEmptyTemplateNode();

  let currentText = '';

  tokens.forEach(token => {
    if (token.type === TokenType.TEXT) {
      currentText += token.value;
    } else if (token.type === TokenType.VARIABLE) {
      currentText = addTextNodeToTemplate(ast, currentText);
      addVariableNodeToTemplate(ast, token.value);
    }
  });

  addTextNodeToTemplate(ast, currentText);

  return ast;
}

function createEmptyTemplateNode(): TemplateNode {
  return {
    type: 'TEMPLATE',
    content: [],
  };
}

function addTextNodeToTemplate(ast: TemplateNode, text: string): string {
  if (text) {
    const textNode: TextNode = { type: 'TEXT', content: text };
    ast.content.push(textNode);
    return '';
  }
  return text;
}

function addVariableNodeToTemplate(ast: TemplateNode, variableName: string): void {
  const variableNode: VariableNode = { type: 'VARIABLE', name: variableName };
  ast.content.push(variableNode);
}