import { omit } from 'lodash'

import type { OnResolveArgs, OnResolveResult } from 'esbuild'

export function externalEsbuildModule (args: Partial<OnResolveArgs>): OnResolveResult {
  return {
    ...omit(args, [
      'path',
      'namespace',
      'pluginData',
    ]),
    external: true
  }
}
