import { SurfstarError } from '../errors/SurfstarError';

type ErrorHandlerOptions = {
  filePath?: string;
  lineNumber?: number;
  columnNumber?: number;
  defaultMessage: string;
  errorFactory: (message: string, options: any) => SurfstarError;
};

/**
 * A utility function to handle errors consistently throughout the codebase
 */
export function handleError(error: unknown, options: ErrorHandlerOptions): never {
  const { filePath, lineNumber, columnNumber, defaultMessage, errorFactory } = options;

  if (error instanceof SurfstarError) {
    throw error;
  }

  throw errorFactory(error instanceof Error ? error.message : defaultMessage, {
    filePath,
    lineNumber,
    columnNumber,
    originalError: error instanceof Error ? error : undefined
  });
}
