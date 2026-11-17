const ERROR_PREFIX = '[taro asyncSubPackage]'

function fail (message: string): never {
  throw new Error(`${ERROR_PREFIX} ${message}`)
}

export function collectDeclaredPagePaths (appConfig: any): string[] {
  const pages = new Set<string>(Array.isArray(appConfig?.pages) ? appConfig.pages : [])
  const subPackages = appConfig?.subPackages || appConfig?.subpackages || []
  for (const subPackage of subPackages) {
    const root = subPackage?.root
    if (!root) continue
    for (const page of subPackage.pages || []) {
      pages.add(`${root}/${page}`.replace(/\/{2,}/g, '/'))
    }
  }
  return Array.from(pages)
}

/**
 * 判断是否存在任一异步分包配置。
 * 包含顶层 asyncSubPackages 及 main 已有的 subPackageIndie 内 asyncSubPackage。
 */
export function hasSubPackageIndieAsyncConfig (appConfig: any): boolean {
  const asyncRules = appConfig?.asyncSubPackages
  if (Array.isArray(asyncRules) && asyncRules.length > 0) return true

  const configs = appConfig?.subPackageIndie
  if (!Array.isArray(configs)) return false
  return configs.some(config => {
    if (!config || typeof config !== 'object') return false
    if (config.mainPackageRoot != null && config.mainPackageRoot.asyncSubPackage) return true
    const roots = config.subPackageRoots
    return Array.isArray(roots) && roots.some((root: any) => root && typeof root === 'object' && root.asyncSubPackage)
  })
}

export function assertDeclaredPages (appConfig: any, options: { allowEmptyMainPages: boolean }): string[] {
  const mainPages = Array.isArray(appConfig?.pages) ? appConfig.pages : []
  const declared = collectDeclaredPagePaths(appConfig)
  const allowEmpty = options.allowEmptyMainPages && hasSubPackageIndieAsyncConfig(appConfig)
  if (!declared.length || (!mainPages.length && !allowEmpty)) {
    fail('全局配置缺少 pages 字段，请检查！')
  }
  return declared
}
