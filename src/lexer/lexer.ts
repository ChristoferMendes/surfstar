import { lexerIndexes } from './indexes';
import { SurfstarError } from '../errors/SurfstarError';
import { handleError } from '../utils/error-handler';

export enum TokenType {
  TEXT = 'TEXT',
  VARIABLE = 'VARIABLE',
  OPEN_BRACE = 'OPEN_BRACE',
  CLOSE_BRACE = 'CLOSE_BRACE',
  EACH_START = 'EACH_START',
  EACH_END = 'EACH_END'
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export function tokenize(source: string, filePath?: string): Token[] {
  const tokens: Token[] = [];
  let currentToken = '';
  let line = 1;
  let column = 1;

  try {
    for (let i = 0; i < source.length; i++) {
      const char = source[i];

      if (char === '\n') {
        line++;
        column = 1;
      } else {
        column++;
      }

      if (isOpenBrace(char, source[i + 1])) {
        currentToken = addTextToken(tokens, currentToken, line, column - 1);

        if (isEachStart(source, i)) {
          try {
            const arrayName = extractEachArrayName(source, i);
            validateEachArrayName(arrayName, line, column, filePath);

            tokens.push(createToken(TokenType.EACH_START, arrayName, line, column));
            const closingPos = findClosingTagPosition(source, i);
            validateClosingTag(closingPos, line, column, filePath);

            i += closingPos;
          } catch (error) {
            handleError(error, {
              filePath,
              lineNumber: line,
              columnNumber: column,
              defaultMessage: 'Invalid each block syntax',
              errorFactory: SurfstarError.lexerError
            });
          }
          continue;
        }

        if (isEachEnd(source, i)) {
          tokens.push(createToken(TokenType.EACH_END, '/each', line, column));
          const closingPos = findClosingTagPosition(source, i);
          validateClosingTag(closingPos, line, column, filePath);

          i += closingPos;
          continue;
        }

        tokens.push(createToken(TokenType.OPEN_BRACE, '{{', line, column));
        i = skipBrace(i);
        continue;
      }

      if (isCloseBrace(char, source[i + 1])) {
        try {
          currentToken = addVariableToken(tokens, currentToken, line, column - currentToken.length);
          tokens.push(createToken(TokenType.CLOSE_BRACE, '}}', line, column));
          i = skipBrace(i);
        } catch (error) {
          handleError(error, {
            filePath,
            lineNumber: line,
            columnNumber: column,
            defaultMessage: 'Invalid variable syntax',
            errorFactory: SurfstarError.lexerError
          });
        }
        continue;
      }

      currentToken += char;
    }

    addTextToken(tokens, currentToken, line, column);

    validateTokens(tokens, filePath);

    return tokens;
  } catch (error) {
    if (error instanceof SurfstarError) throw error;

    throw SurfstarError.lexerError('Error during tokenization', {
      filePath,
      originalError: error instanceof Error ? error : undefined
    });
  }
}

function validateTokens(tokens: Token[], filePath?: string): void {
  let openBraceCount = 0;
  let eachBlockCount = 0;

  for (const token of tokens) {
    if (token.type === TokenType.OPEN_BRACE) openBraceCount++;
    if (token.type === TokenType.CLOSE_BRACE) {
      openBraceCount--;
      if (openBraceCount < 0) {
        throw SurfstarError.lexerError('Unmatched closing brace', {
          filePath,
          lineNumber: token.line,
          columnNumber: token.column
        });
      }
    }

    if (token.type === TokenType.EACH_START) eachBlockCount++;
    if (token.type === TokenType.EACH_END) {
      eachBlockCount--;
      if (eachBlockCount < 0) {
        throw SurfstarError.lexerError('Unmatched {{/each}} tag', {
          filePath,
          lineNumber: token.line,
          columnNumber: token.column
        });
      }
    }
  }

  if (openBraceCount > 0) {
    const lastToken = tokens[tokens.length - 1];
    throw SurfstarError.lexerError('Unclosed braces in template', {
      filePath,
      lineNumber: lastToken.line,
      columnNumber: lastToken.column
    });
  }

  if (eachBlockCount > 0) {
    const lastToken = tokens[tokens.length - 1];
    throw SurfstarError.lexerError('Unclosed {{#each}} block in template', {
      filePath,
      lineNumber: lastToken.line,
      columnNumber: lastToken.column
    });
  }
}

function isOpenBrace(char: string, nextChar: string): boolean {
  return char === '{' && nextChar === '{';
}

function isCloseBrace(char: string, nextChar: string): boolean {
  return char === '}' && nextChar === '}';
}

function isEachStart(source: string, index: number): boolean {
  return (
    source[index + lexerIndexes.eachStart.begin] === '#' &&
    source.slice(index + lexerIndexes.eachStart.wordBegin, index + lexerIndexes.eachStart.end) === 'each'
  );
}

function isEachEnd(source: string, index: number): boolean {
  return source[index + 2] === '/' && source.slice(index + 3, index + 7) === 'each';
}

function extractEachArrayName(source: string, index: number): string {
  return source
    .slice(index + lexerIndexes.eachEnd.end)
    .split('}}')[0]
    .trim();
}

function findClosingTagPosition(source: string, index: number): number {
  const position = source.slice(index).indexOf('}}');
  return position >= 0 ? position + 1 : -1;
}

function addTextToken(tokens: Token[], currentToken: string, line: number, column: number): string {
  if (currentToken) {
    tokens.push(createToken(TokenType.TEXT, currentToken, line, column - currentToken.length + 1));
    return '';
  }
  return currentToken;
}

function addVariableToken(tokens: Token[], currentToken: string, line: number, column: number): string {
  if (currentToken) {
    const trimmedToken = currentToken.trim();
    if (!trimmedToken) {
      throw SurfstarError.lexerError('Empty variable name', { lineNumber: line, columnNumber: column });
    }
    tokens.push(createToken(TokenType.VARIABLE, trimmedToken, line, column));
    return '';
  }
  return currentToken;
}

function createToken(type: TokenType, value: string, line: number, column: number): Token {
  return { type, value, line, column };
}

function skipBrace(index: number): number {
  return index + 1;
}

function validateEachArrayName(arrayName: string, line: number, column: number, filePath?: string): void {
  if (!arrayName) {
    throw SurfstarError.lexerError('Each block is missing array name', { filePath, lineNumber: line, columnNumber: column });
  }
}

function validateClosingTag(position: number, line: number, column: number, filePath?: string): void {
  if (position < 0) {
    throw SurfstarError.lexerError('Unclosed tag', { filePath, lineNumber: line, columnNumber: column });
  }
}
