import { pick } from 'lodash'

import type { OnResolveArgs, OnResolveResult } from 'esbuild'

export function externalEsbuildModule (args: Partial<OnResolveArgs>): OnResolveResult {
  return {
    ...pick(args, [
      'resolveDir',
      'kind',
    ]),
    external: true
  }
}
