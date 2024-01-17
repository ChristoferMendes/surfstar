export enum TokenType {
  TEXT = 'TEXT',
  VARIABLE = 'VARIABLE',
  OPEN_BRACE = 'OPEN_BRACE',
  CLOSE_BRACE = 'CLOSE_BRACE',
}

export interface Token {
  type: TokenType;
  value: string;
}

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let currentToken = '';

  for (let i = 0; i < source.length; i++) {
    const char = source[i];

    if (isOpenBrace(char, source[i + 1])) {
      currentToken = addTextToken(tokens, currentToken);
      tokens.push(createToken(TokenType.OPEN_BRACE, '{{'));
      i = skipBrace(i);
    } else if (isCloseBrace(char, source[i + 1])) {
      currentToken = addVariableToken(tokens, currentToken);
      tokens.push(createToken(TokenType.CLOSE_BRACE, '}}'));
      i = skipBrace(i);
    } else {
      currentToken += char;
    }
  }

  addTextToken(tokens, currentToken);

  return tokens;
}

function isOpenBrace(char: string, nextChar: string): boolean {
  return char === '{' && nextChar === '{';
}

function isCloseBrace(char: string, nextChar: string): boolean {
  return char === '}' && nextChar === '}';
}

function addTextToken(tokens: Token[], currentToken: string): string {
  if (currentToken) {
    tokens.push(createToken(TokenType.TEXT, currentToken));
    return '';
  }
  return currentToken;
}

function addVariableToken(tokens: Token[], currentToken: string): string {
  if (currentToken) {
    tokens.push(createToken(TokenType.VARIABLE, currentToken.trim()));
    return '';
  }
  return currentToken;
}

function createToken(type: TokenType, value: string): Token {
  return { type, value };
}

function skipBrace(index: number): number {
  return index + 1;
}