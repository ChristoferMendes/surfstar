export function loadFile(filePath: string): Promise<string> {
  try {
    const content = Bun.file(filePath);
    return content.text();
  } catch (error) {
    console.error("Error loading file:", error);
    throw error;
  }
}
