import { resolve } from 'path'

import type { OnResolveArgs, OnResolveResult } from 'esbuild'

export function externalEsbuildModule ({ path, namespace, importer, pluginData }: Partial<OnResolveArgs>): OnResolveResult {
  if (namespace === 'file' && importer && path) {
    path = resolve(importer, path)
  }
  return {
    path,
    namespace,
    pluginData,
    external: true
  }
}
