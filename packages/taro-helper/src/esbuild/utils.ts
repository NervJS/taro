import type { OnResolveArgs, OnResolveResult } from 'esbuild'

export function externalEsbuildModule (args: Partial<OnResolveArgs>): OnResolveResult {
  return {
    ...args,
    external: true
  }
}
