import { pick } from 'lodash'

import type { OnResolveArgs, OnResolveResult } from 'esbuild'

export function externalEsbuildModule (args: Partial<OnResolveArgs>): OnResolveResult {
  return {
    ...pick(args, [
      'errors',
      'external',
      'namespace',
      'path',
      'pluginData',
      'pluginName',
      'sideEffects',
      'suffix',
      'warnings',
      'watchDirs',
      'watchFiles'
    ]),
    external: true
  }
}
