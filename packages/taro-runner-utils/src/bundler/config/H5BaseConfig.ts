import path from 'node:path'

import { defaultMainFields, resolveSync } from '@tarojs/helper'

export function getH5ResolveConfig (appPath: string, mode?: string) {
  const mainFields = [...defaultMainFields]
  if (mode !== 'production') {
    mainFields.unshift('main:h5')
  }
  const resolveOptions: Parameters<typeof resolveSync>[1] = {
    basedir: appPath,
    packageFilter: (pkg, pkgFile) => {
      for (let i = 0; i < mainFields.length; i++) {
        try {
          const mainFile = pkg[mainFields[i]] as string
          if (mainFile && resolveSync(path.resolve(pkgFile, mainFile))) {
            pkg.main = mainFile
            break
          }
        } catch (e) {} // eslint-disable-line no-empty
      }
      return pkg
    },
  }
  return {
    mainFields,
    alias: {
      // Note: link 本地依赖调试，runtime 包需要指向本地 node_modules 顶层的 runtime，保证闭包值 Current 一致，shared 也一样
      '@tarojs/runtime': resolveSync('@tarojs/runtime', resolveOptions),
      '@tarojs/shared': resolveSync('@tarojs/shared', resolveOptions),
    },
  }
}
