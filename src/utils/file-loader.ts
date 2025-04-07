import { existsSync } from 'node:fs';
import { SurfstarError } from '../errors/SurfstarError';
import { handleError } from './error-handler';

export async function loadFile(filePath: string): Promise<string> {
  try {
    validateFileExists(filePath);
    const content = Bun.file(filePath);
    return await content.text();
  } catch (error) {
    handleError(error, {
      filePath,
      defaultMessage: `Error loading file: ${filePath}`,
      errorFactory: SurfstarError.fileError
    });
  }
}

function validateFileExists(filePath: string): void {
  if (!existsSync(filePath)) {
    throw SurfstarError.fileError(`File not found: ${filePath}`, { filePath });
  }
}
