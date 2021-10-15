import * as resolvePath from 'resolve'

export function isQuickAppPkg (name: string): boolean {
  return /^@(system|service)\.[a-zA-Z]{1,}/.test(name)
}

const npmCached = {}
export function resolveNpmSync (pkgName: string, root): string | null {
  try {
    if (!npmCached[pkgName]) {
      return resolvePath.sync(pkgName, { basedir: root })
    }
    return npmCached[pkgName]
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      throw new Error(`包 ${pkgName} 未安装`)
    }
    return null
  }
}
