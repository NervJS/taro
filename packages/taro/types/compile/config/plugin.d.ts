import type { CustomPluginOptions, ResolvedId, ResolveIdResult } from 'rollup'

interface IRollupPluginResolveIdOptions {
  assertions?: Record<string, string>
  custom?: CustomPluginOptions
  isEntry?: boolean
  skipSelf?: boolean
}

export type TRollupResolveMethod = (
  source: string,
  importer?: string,
  options?: IRollupPluginResolveIdOptions
) => Promise<ResolvedId | null>

export interface ILoaderMeta {
  importFrameworkStatement: string
  importFrameworkName: string
  creator: string
  creatorLocation: string
  extraImportForWeb: string
  execBeforeCreateWebApp: string
  frameworkArgs: string
  isNeedRawLoader?: boolean
  mockAppStatement: string
  modifyConfig?: (config: Record<string, any>, source: string) => void
  modifyResolveId?: (res: {
    source?: string
    importer?: string
    options?: IRollupPluginResolveIdOptions
    name?: string
    resolve: TRollupResolveMethod
  }) => Promise<ResolveIdResult> | ResolveIdResult
}
