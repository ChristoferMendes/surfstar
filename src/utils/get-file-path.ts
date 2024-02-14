import { existsSync } from "fs";

export function getFilePath(pathWithoutExtension: string, {
  possibleExtensions = [".ts", ".js", ".tsx", ".jsx", '.surf'],
}: {
  possibleExtensions?: string[]
} = {
}) {
  const pathAlreadyHasSomeExtension = pathWithoutExtension.includes(".");

  if (pathAlreadyHasSomeExtension) return pathWithoutExtension;

  for (const extension of possibleExtensions) {
    const filePath = pathWithoutExtension + extension;
    const fileExists = existsSync(filePath);

    if (fileExists) {
      return filePath;
    }
  }

  return null;

}