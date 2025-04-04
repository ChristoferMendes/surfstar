import { tokenize } from "./lexer/lexer";
import { parse } from "./parser/parser";
import { render } from "./renderer/renderer";
import { loadFile } from "./utils/file-loader";
import { SurfstarError, SurfstarErrorType } from "./errors/SurfstarError";
import { handleError } from "./utils/error-handler";

export async function compileTemplate(
  filePath: string,
  data: Record<string, any>
): Promise<string> {
  try {
    const templateSource = await loadFile(filePath);
    const tokens = tokenize(templateSource, filePath);
    const ast = parse(tokens, filePath);
    const result = render(ast, data, filePath);
    return result;
  } catch (error) {
    handleError(error, {
      filePath,
      defaultMessage: "Error compiling template",
      errorFactory: SurfstarError.compilationError
    });
  }
}

export { SurfstarError, SurfstarErrorType };