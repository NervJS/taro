const npmCached = {}
export function resolveNpmSync (pluginName: string, root): string {
  const resolvePath = require('resolve')
  if (!npmCached[pluginName]) {
    const res = resolvePath.sync(pluginName, { basedir: root })
    return res
  }
  return npmCached[pluginName]
}

export function getNpmPkgSync (npmName: string, root: string) {
  const npmPath = resolveNpmSync(npmName, root)
  const npmFn = require(npmPath)
  return npmFn
}