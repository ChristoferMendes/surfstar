// src/utils/file-loader.ts

import * as fs from 'fs';

export function loadFile(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error loading file:', error);
    throw error;
  }
}
