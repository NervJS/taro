export function getAsyncRootAssetNames (assets: Record<string, any>, asyncRoot: string): string[] {
  return Object.keys(assets).filter(name => name.startsWith(`${asyncRoot}/`) && name.endsWith('.js'))
}

export function normalizePathForAsyncSubPackage (value: string): string {
  return value.replace(/\\/g, '/')
}

export function getSourceRootForResource (resource: string | undefined, sourceDir: string, asyncRootMap: Map<string, string>): string | null {
  if (!resource) return null
  const normalizedResource = normalizePathForAsyncSubPackage(resource)
  const normalizedSourceDir = normalizePathForAsyncSubPackage(sourceDir).replace(/\/$/, '')
  let relativeResource = normalizedResource
  if (normalizedResource.startsWith(`${normalizedSourceDir}/`)) {
    relativeResource = normalizedResource.slice(normalizedSourceDir.length + 1)
  }

  const sourceRoots = Array.from(asyncRootMap.keys()).sort((a, b) => b.length - a.length)
  for (const sourceRoot of sourceRoots) {
    const normalizedSourceRoot = normalizePathForAsyncSubPackage(sourceRoot)
    if (relativeResource === normalizedSourceRoot || relativeResource.startsWith(`${normalizedSourceRoot}/`) || relativeResource.startsWith(`${normalizedSourceRoot}.`)) {
      return sourceRoot
    }
  }

  return null
}

export function getAsyncRootForModule (
  module: any,
  sourceDir: string,
  asyncRootMap: Map<string, string>,
  moduleGraph?: any,
  visited: Set<any> = new Set(),
  cache?: WeakMap<any, string | null | undefined>
): string | null | undefined {
  if (!module || visited.has(module)) return undefined
  if (cache?.has(module)) return cache.get(module)
  visited.add(module)

  const resource = module.resource || module.nameForCondition?.()
  const normalizedSourceDir = normalizePathForAsyncSubPackage(sourceDir).replace(/\/$/, '')
  const normalizedResource = resource ? normalizePathForAsyncSubPackage(resource) : ''
  const isProjectSource = normalizedResource.startsWith(`${normalizedSourceDir}/`)
  const sourceRoot = getSourceRootForResource(resource, sourceDir, asyncRootMap)
  if (sourceRoot) {
    const asyncRoot = asyncRootMap.get(sourceRoot)
    cache?.set(module, asyncRoot)
    return asyncRoot
  }

  const asyncRoots = new Set<string>()
  let hasBlockingProjectIssuer = false
  const issuerModules = new Set<any>()
  const incomingConnections = moduleGraph?.getIncomingConnections?.(module)
  if (incomingConnections) {
    for (const connection of incomingConnections) {
      if (connection?.originModule) issuerModules.add(connection.originModule)
    }
  }

  const issuer = moduleGraph?.getIssuer?.(module)
  if (issuer) issuerModules.add(issuer)

  for (const issuerModule of issuerModules) {
    const asyncRoot = getAsyncRootForModule(issuerModule, sourceDir, asyncRootMap, moduleGraph, new Set(visited), cache)
    if (asyncRoot === null) {
      hasBlockingProjectIssuer = true
    } else if (asyncRoot) {
      asyncRoots.add(asyncRoot)
    }
  }

  let result: string | null | undefined
  if (hasBlockingProjectIssuer || asyncRoots.size > 1) {
    result = null
  } else if (asyncRoots.size === 1) {
    result = Array.from(asyncRoots)[0]
  } else {
    result = isProjectSource ? null : undefined
  }

  cache?.set(module, result)
  return result
}

export function getSingleAsyncRootForModules (
  modules: any[],
  sourceDir: string,
  asyncRootMap: Map<string, string>,
  moduleGraph?: any,
  cache?: WeakMap<any, string | null | undefined>
): string | null {
  const asyncRoots = new Set<string>()

  for (const module of modules) {
    const asyncRoot = getAsyncRootForModule(module, sourceDir, asyncRootMap, moduleGraph, undefined, cache)
    if (asyncRoot === null) return null
    if (asyncRoot) {
      asyncRoots.add(asyncRoot)
      if (asyncRoots.size > 1) return null
    }
  }

  if (asyncRoots.size !== 1) return null
  return Array.from(asyncRoots)[0]
}

export function createAsyncCommonChunkName (asyncRoot: string, chunkName: string | undefined): string {
  const safeChunkName = (chunkName || 'common').replace(/[^a-zA-Z0-9_/-]/g, '_').replace(/\//g, '_')
  return `${asyncRoot}/async-${safeChunkName}`
}
