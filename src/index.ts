import { tokenize } from "./lexer/lexer";
import { parse } from "./parser/parser";
import { render } from "./renderer/renderer";
import { loadFile } from "./utils/file-loader";

export async function compileTemplate(
  filePath: string,
  data: Record<string, any>
): Promise<string> {
  try {
    const templateSource = await loadFile(filePath);

    const tokens = tokenize(templateSource);

    const ast = parse(tokens);
    const result = render(ast, data);

    return result;
  } catch (error) {
    console.error("Error compiling template:", error);
    throw error;
  }
}