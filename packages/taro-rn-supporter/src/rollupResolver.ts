/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import * as path from 'path'

import { includes, isRelativePath, resolveExtFile, resolvePathFromAlias } from './utils'

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

const isInclude = (_moduleName, originModulePath) => {
  return originModulePath.indexOf('node_modules') < 0 || includes(originModulePath)
}

export default function resolver (options: ResolverOption) {
  const { externalResolve, platform } = options

  return {
    name: 'taro-resolver',
    async resolveId (moduleName, originModulePath = '', resolveOptions) {
      if (moduleName.startsWith('\0')) {
        return null
      }

      if (!isInclude(moduleName, originModulePath)) {
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

      moduleName = resolvePathFromAlias(moduleName)

      if ((externalId = externalResolve(moduleName, originModulePath))) {
        return { id: externalId, external: true }
      }

      if (!path.isAbsolute(moduleName) && !isRelativePath(moduleName)) {
        return null
      }

      moduleName = resolveExtFile({ originModulePath }, moduleName, platform)
      return moduleName || null
    }
  }
}
