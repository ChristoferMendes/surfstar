import { existsSync } from "fs";
import { join } from "path";

export function getFilePath(path: string) {
  const root = join(__dirname, "..", "..")
  const isDevMode = existsSync(join(root, 'src'))

  if (isDevMode) {
    return path;
  }

  return path.replace('.surf', '.js')
}