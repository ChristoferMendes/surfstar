export enum SurfstarErrorType {
  LEXER_ERROR = 'LEXER_ERROR',
  PARSER_ERROR = 'PARSER_ERROR',
  RENDERER_ERROR = 'RENDERER_ERROR',
  FILE_ERROR = 'FILE_ERROR',
  COMPILATION_ERROR = 'COMPILATION_ERROR'
}

export interface SurfstarErrorOptions {
  message: string;
  type: SurfstarErrorType;
  filePath?: string;
  lineNumber?: number;
  columnNumber?: number;
  originalError?: Error;
}

export class SurfstarError extends Error {
  public readonly type: SurfstarErrorType;
  public readonly filePath?: string;
  public readonly lineNumber?: number;
  public readonly columnNumber?: number;
  public readonly originalError?: Error;

  constructor(options: SurfstarErrorOptions) {
    const { message, type, filePath, lineNumber, columnNumber, originalError } = options;

    let fullMessage = message;
    if (filePath) {
      fullMessage += ` in ${filePath}`;
      if (lineNumber !== undefined) {
        fullMessage += `:${lineNumber}`;
        if (columnNumber !== undefined) {
          fullMessage += `:${columnNumber}`;
        }
      }
    }

    super(fullMessage);

    this.name = 'SurfstarError';
    this.type = type;
    this.filePath = filePath;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;
    this.originalError = originalError;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SurfstarError);
    }
  }

  static lexerError(
    message: string,
    options: { filePath?: string; lineNumber?: number; columnNumber?: number; originalError?: Error } = {}
  ): SurfstarError {
    return new SurfstarError({
      message,
      type: SurfstarErrorType.LEXER_ERROR,
      ...options
    });
  }

  static parserError(
    message: string,
    options: { filePath?: string; lineNumber?: number; columnNumber?: number; originalError?: Error } = {}
  ): SurfstarError {
    return new SurfstarError({
      message,
      type: SurfstarErrorType.PARSER_ERROR,
      ...options
    });
  }

  static rendererError(
    message: string,
    options: { filePath?: string; lineNumber?: number; columnNumber?: number; originalError?: Error } = {}
  ): SurfstarError {
    return new SurfstarError({
      message,
      type: SurfstarErrorType.RENDERER_ERROR,
      ...options
    });
  }

  static fileError(message: string, options: { filePath?: string; originalError?: Error } = {}): SurfstarError {
    return new SurfstarError({
      message,
      type: SurfstarErrorType.FILE_ERROR,
      ...options
    });
  }

  static compilationError(message: string, options: { filePath?: string; originalError?: Error } = {}): SurfstarError {
    return new SurfstarError({
      message,
      type: SurfstarErrorType.COMPILATION_ERROR,
      ...options
    });
  }
}
