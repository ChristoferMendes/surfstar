import { getFilePath } from "./get-file-path";

export function loadFile(filePath: string): Promise<string> {
  try {
    const path = getFilePath(filePath);

    if (!path) throw new Error(`File not found: ${filePath}`);

    const content = Bun.file(path);
    return content.text();
  } catch (error) {
    console.error("Error loading file:", error);
    throw error;
  }
}
