import { type Token, TokenType } from '../lexer/lexer';
import type { Node, TemplateNode, TextNode, VariableNode, EachNode } from './ast';
import { SurfstarError } from '../errors/SurfstarError';
import { handleError } from '../utils/error-handler';

export function parse(tokens: Token[], filePath?: string): Node {
  try {
    const ast: TemplateNode = createEmptyTemplateNode();
    let currentText = '';
    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];

      if (token.type === TokenType.TEXT) {
        currentText += token.value;
      } else if (token.type === TokenType.VARIABLE) {
        currentText = addTextNodeToTemplate(ast, currentText);
        addVariableNodeToTemplate(ast, token.value);
      } else if (token.type === TokenType.EACH_START) {
        currentText = addTextNodeToTemplate(ast, currentText);
        try {
          const [eachNode, newIndex] = parseEachBlock(tokens, i, filePath);
          ast.content.push(eachNode);
          i = newIndex;
        } catch (error) {
          handleError(error, {
            filePath,
            lineNumber: token.line,
            columnNumber: token.column,
            defaultMessage: 'Error parsing each block',
            errorFactory: SurfstarError.parserError
          });
        }
      }
      i++;
    }

    addTextNodeToTemplate(ast, currentText);
    return ast;
  } catch (error) {
    handleError(error, {
      filePath,
      defaultMessage: 'Error parsing template',
      errorFactory: SurfstarError.parserError
    });
  }
}

function createEmptyTemplateNode(): TemplateNode {
  return {
    type: 'TEMPLATE',
    content: []
  };
}

function addTextNodeToTemplate(node: TemplateNode | EachNode, text: string): string {
  if (!text) return text;

  const processedText = processTextContent(node, text);
  if (processedText) {
    const textNode: TextNode = { type: 'TEXT', content: processedText };
    node.content.push(textNode);
  }
  return '';
}

function processTextContent(node: TemplateNode | EachNode, text: string): string {
  if (node.type === 'EACH') {
    return processEachNodeText(node, text);
  }
  return text;
}

function processEachNodeText(node: EachNode, text: string): string {
  if (node.content.length === 0) {
    return trimLeadingWhitespace(text);
  }
  return normalizeNewlines(text);
}

function trimLeadingWhitespace(text: string): string {
  return text.replace(/^\s+/, '');
}

function normalizeNewlines(text: string): string {
  return text.replace(/\n/g, '\n');
}

function addVariableNodeToTemplate(node: TemplateNode | EachNode, variableName: string): void {
  const variableNode: VariableNode = { type: 'VARIABLE', name: variableName };
  node.content.push(variableNode);
}

function parseEachBlock(tokens: Token[], startIndex: number, filePath?: string): [EachNode, number] {
  const startToken = tokens[startIndex];
  const eachNode = createEachNode(startToken.value);
  let currentText = '';
  let i = startIndex + 1;

  while (i < tokens.length) {
    const token = tokens[i];

    if (isEachBlockEnd(token)) {
      handleRemainingText(eachNode, currentText);
      return [eachNode, i];
    }

    try {
      [currentText, i] = handleToken(token, currentText, eachNode, tokens, i, filePath);
    } catch (error) {
      handleError(error, {
        filePath,
        lineNumber: token.line,
        columnNumber: token.column,
        defaultMessage: 'Error processing token in each block',
        errorFactory: SurfstarError.parserError
      });
    }
    i++;
  }

  throw SurfstarError.parserError('Unclosed each block', {
    filePath,
    lineNumber: startToken.line,
    columnNumber: startToken.column
  });
}

function createEachNode(arrayName: string): EachNode {
  return {
    type: 'EACH',
    arrayName,
    content: []
  };
}

function isEachBlockEnd(token: Token): boolean {
  return token.type === TokenType.EACH_END;
}

function handleRemainingText(eachNode: EachNode, text: string): void {
  if (!text) return;
  const formattedText = ensureLeadingNewline(text);
  addTextNodeToTemplate(eachNode, formattedText);
}

function ensureLeadingNewline(text: string): string {
  return text.includes('\n') ? text : `\n${text}`;
}

function handleToken(
  token: Token,
  currentText: string,
  eachNode: EachNode,
  tokens: Token[],
  index: number,
  filePath?: string
): [string, number] {
  if (isTextToken(token)) {
    return handleTextToken(currentText, token, index);
  }
  return handleNonTextToken(token, currentText, eachNode, tokens, index, filePath);
}

function isTextToken(token: Token): boolean {
  return token.type === TokenType.TEXT;
}

function handleTextToken(currentText: string, token: Token, index: number): [string, number] {
  return [currentText + token.value, index];
}

function handleNonTextToken(
  token: Token,
  currentText: string,
  eachNode: EachNode,
  tokens: Token[],
  index: number,
  filePath?: string
): [string, number] {
  const clearedText = processNonTextToken(token, currentText, eachNode, tokens, index, filePath);
  return [clearedText, shouldUpdateIndex(token) ? index : index];
}

function processNonTextToken(
  token: Token,
  currentText: string,
  eachNode: EachNode,
  tokens: Token[],
  index: number,
  filePath?: string
): string {
  if (currentText) {
    addTextNodeToTemplate(eachNode, currentText);
  }

  if (isVariableToken(token)) {
    addVariableNodeToTemplate(eachNode, token.value);
  } else if (isEachStartToken(token)) {
    processNestedEachBlock(eachNode, tokens, index, filePath);
  }

  return '';
}

function isVariableToken(token: Token): boolean {
  return token.type === TokenType.VARIABLE;
}

function isEachStartToken(token: Token): boolean {
  return token.type === TokenType.EACH_START;
}

function shouldUpdateIndex(token: Token): boolean {
  return token.type === TokenType.EACH_START;
}

function processNestedEachBlock(eachNode: EachNode, tokens: Token[], index: number, filePath?: string): void {
  try {
    const [nestedEachNode, newIndex] = parseEachBlock(tokens, index, filePath);
    eachNode.content.push(nestedEachNode);
    index = newIndex;
  } catch (error) {
    if (error instanceof SurfstarError) throw error;

    const token = tokens[index];
    throw SurfstarError.parserError('Error processing nested each block', {
      filePath,
      lineNumber: token.line,
      columnNumber: token.column,
      originalError: error instanceof Error ? error : undefined
    });
  }
}
