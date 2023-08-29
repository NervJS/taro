import { fs, SCRIPT_EXT } from '@tarojs/helper'

import { isVirtualModule } from '../utils'

import type { PluginOption } from 'vite'
import type { TaroCompiler as TaroH5Compiler } from '../utils/compiler/h5'
import type { TaroCompiler as TaroMinCompiler } from '../utils/compiler/mini'

export default function (complier: TaroH5Compiler | TaroMinCompiler): PluginOption {
  const { taroConfig } = complier
  let cache: Map<string, string>
  return {
    name: 'taro:vite-multi-platform-plugin',
    enforce: 'pre',
    buildStart () {
      cache = new Map()
    },
    async resolveId (source, importer, options) {
      if (isVirtualModule(source)) return null
      if (/node_modules/.test(source)) return null

      // example: 'js|jsx|ts|tsx|vue'
      const allowedExts = Array.from(new Set(SCRIPT_EXT.concat(taroConfig.frameworkExts || [])))
        .map(item => item.replace(/^\./, ''))
        .join('|')
      // example: /\.weapp\.(js|jsx|ts|tsx|vue)/
      const multiPlatformReg = new RegExp(`\\.${process.env.TARO_ENV}\\.(${allowedExts})`)
      if (multiPlatformReg.test(source)) return null

      const resolution = await this.resolve(source, importer, {
        ...options,
        skipSelf: true
      })

      if (!resolution?.id || resolution.external) return resolution
      if (isVirtualModule(resolution.id)) return resolution
      if (/node_modules/.test(resolution.id)) return resolution
      if (multiPlatformReg.test(source)) return resolution

      const cachedId = cache.get(resolution.id)
      if (cachedId) {
        return {
          ...resolution,
          id: cachedId
        }
      }

      // example: /(\.(?:js|jsx|ts|tsx|vue))$/
      const reg = new RegExp(`(\\.(?:${allowedExts}))$`)
      if (reg.test(resolution.id)) {
        const id = resolution.id.replace(reg, `.${process.env.TARO_ENV}$1`)
        if (fs.existsSync(id)) {
          cache.set(resolution.id, id)
          return {
            ...resolution,
            id
          }
        }
      }
    },
  }
}
