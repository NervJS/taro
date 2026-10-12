import type { IMiniFilesConfig } from '@tarojs/taro/types/compile'

export function computeForceCustomWrapperForIndependentPackage (
  pagePaths: string[],
  pages: Iterable<{ name: string, path: string, isNative?: boolean }>,
  filesConfig: IMiniFilesConfig,
  getConfigFilePath: (filePath: string) => string
): boolean {
  const inPkg = new Set(pagePaths)
  for (const page of pages) {
    if (!inPkg.has(page.path) || page.isNative) continue
    const content = filesConfig[getConfigFilePath(page.name)]?.content as { forceCustomWrapper?: boolean } | undefined
    if (content?.forceCustomWrapper) return true
  }
  return false
}
