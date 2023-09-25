import * as path from 'path'

import { includes, isRelativePath, resolveExtFile, resolvePathFromAlias } from './utils'

import type { IProjectConfig } from '@tarojs/taro/types/compile'

interface ResolverOption {
  platform?: 'ios' | 'android'
  include?: (path: boolean) => boolean
  exclude?: (path: boolean) => boolean
  externalResolve: (importee: string, importer: string) => string | undefined | null
}

const DEFAULT_ALIAS = {
  '@tarojs/taro': '@tarojs/taro-rn',
  '@tarojs/components': '@tarojs/components-rn'
}

const isInclude = (_moduleName, originModulePath, config: IProjectConfig ) => {
  return originModulePath.indexOf('node_modules') < 0 || includes(originModulePath, config)
}

export default function resolver (options: ResolverOption, config: IProjectConfig) {
  const { externalResolve, platform } = options

  return {
    name: 'taro-resolver',
    async resolveId (moduleName, originModulePath = '', resolveOptions) {
      if (moduleName.startsWith('\0')) {
        return null
      }

      if (!isInclude(moduleName, originModulePath, config)) {
        return null
      }

      let externalId

      for (const key in DEFAULT_ALIAS) {
        if (key === moduleName) {
          const updatedId = DEFAULT_ALIAS[key]
          if ((externalId = externalResolve(updatedId, originModulePath))) {
            return { id: externalId, external: true }
          }
          return this.resolve(updatedId, originModulePath, Object.assign({ skipSelf: true }, resolveOptions)).then(
            resolved => resolved || { id: updatedId, external: true }
          )
        }
      }

      moduleName = resolvePathFromAlias(moduleName, config)

      if ((externalId = externalResolve(moduleName, originModulePath))) {
        return { id: externalId, external: true }
      }

      if (!path.isAbsolute(moduleName) && !isRelativePath(moduleName)) {
        return null
      }

      moduleName = resolveExtFile({ originModulePath }, moduleName, platform, config)
      return moduleName || null
    }
  }
}
