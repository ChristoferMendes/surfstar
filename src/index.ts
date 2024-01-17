import { tokenize } from "./lexer/lexer";
import { parse } from "./parser/parser";
import { render } from "./renderer/renderer";
import { loadFile } from "./utils/file-loader";

export function compileTemplate(
  filePath: string,
  data: Record<string, any>
): string {
  try {
    const templateSource = loadFile(filePath);

    const tokens = tokenize(templateSource);

    const ast = parse(tokens);
    const result = render(ast, data);

    return result;
  } catch (error) {
    console.error("Error compiling template:", error);
    throw error;
  }
}

compileTemplate("a.surf", { name: "John" });