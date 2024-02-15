
export function getFilePath(path: string) {
  const isProdMod = import.meta.dir.endsWith('dist')

  if (isProdMod) {
    return path.replace('.surf', '.js')
  }
  
  return path;
}