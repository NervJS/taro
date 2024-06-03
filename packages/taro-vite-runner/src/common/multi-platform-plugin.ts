import path from 'node:path'

import { NODE_MODULES_REG, SCRIPT_EXT } from '@tarojs/helper'

import { isVirtualModule } from '../utils'

import type { ViteH5CompilerContext, ViteHarmonyCompilerContext, ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (complier: ViteH5CompilerContext | ViteHarmonyCompilerContext | ViteMiniCompilerContext): PluginOption {
  const { taroConfig } = complier

  return {
    name: 'taro:vite-multi-platform-plugin',
    enforce: 'pre',
    async resolveId (source, importer, options) {
      if (isVirtualModule(source)) return null
      if (NODE_MODULES_REG.test(source)) return null

      // example: 'js|jsx|ts|tsx|vue'
      const allowedExts = Array.from(new Set(SCRIPT_EXT.concat(taroConfig.frameworkExts || [])))
        .map((item : string) => item.replace(/^\./, ''))
        .join('|')
      // example: /\.(weapp|mini)\.(js|jsx|ts|tsx|vue)/
      const multiPlatformReg = new RegExp(`\\.(${process.env.TARO_ENV}|${process.env.TARO_PLATFORM})\\.(${allowedExts})`)
      if (multiPlatformReg.test(source)) return null
      if (!importer) return null

      const ext = path.extname(source)
      const dir = path.dirname(source)
      const basename = path.basename(source, ext)

      let resolution = await this.resolve(
        path.resolve(path.dirname(importer), `${path.join(dir, basename)}.${process.env.TARO_ENV}${ext}`),
        importer,
        {
          ...options,
          skipSelf: true
        })
      if (!resolution) {
        resolution = await this.resolve(
          path.resolve(path.dirname(importer), `${path.join(dir, basename)}.${process.env.TARO_PLATFORM}${ext}`),
          importer,
          {
            ...options,
            skipSelf: true
          })
      }

      if (!resolution) {
        resolution = await this.resolve(source, importer, {
          ...options,
          skipSelf: true
        })
      }

      if (!resolution?.id || resolution.external) return resolution
      if (isVirtualModule(resolution.id)) return resolution
      if (/node_modules/.test(resolution.id)) return resolution
      if (multiPlatformReg.test(resolution.id)) return resolution
    },
  }
}
