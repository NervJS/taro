import * as path from 'path'

import { includes, isRelativePath, resolveExtFile, resolvePathFromAlias } from './utils'

interface ResolverOption {
  include?: (path:boolean) => boolean
  exclude?: (path:boolean) => boolean
  externalResolve: (importee: string, importer: string) => string | undefined | null
}

const DEFAULT_ALIAS = {
  '@tarojs/taro': '@tarojs/taro-rn',
  '@tarojs/components': '@tarojs/components-rn'
}

const isInclude = (_moduleName, originModulePath) => {
  return originModulePath.indexOf('node_modules') < 0 || includes(originModulePath)
}

export default function resolver (options: ResolverOption) {
  const { externalResolve } = options

  return {
    name: 'taro-resolver',
    async resolveId (moduleName, originModulePath = '') {
      if (/\0/.test(moduleName)) return null

      if (!isInclude(moduleName, originModulePath)) {
        return null
      }

      for (const key in DEFAULT_ALIAS) {
        if (key === moduleName) {
          return { id: DEFAULT_ALIAS[key], external: true }
        }
      }

      const externalId = externalResolve(moduleName, originModulePath)
      if (externalId) {
        return { id: externalId, external: true }
      }
      if (!path.isAbsolute(moduleName) && !isRelativePath(moduleName)) {
        return null
      }

      moduleName = resolvePathFromAlias(moduleName)
      // 处理后缀 .rn.ts
      moduleName = resolveExtFile({ originModulePath }, moduleName, undefined)
      return { id: moduleName }
    }
  }
}
