import { existsSync } from "fs";

export function loadFile(filePath: string): Promise<string> {
  try {
    if (!existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

    const content = Bun.file(filePath);
    return content.text();
  } catch (error) {
    console.error("Error loading file:", error);
    throw error;
  }
}
