import path from 'node:path'

import { REG_NODE_MODULES, SCRIPT_EXT } from '@tarojs/helper'

import { isVirtualModule } from '../utils'

import type { ViteH5CompilerContext, ViteHarmonyCompilerContext, ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { ResolvedId } from 'rollup'
import type { PluginOption } from 'vite'

function isViteDepsPath(filePath: string) {
  const normalizedPath = path.normalize(filePath)

  // 判断路径是否包含 node_modules/.vite/deps
  const isViteDeps = normalizedPath.includes(
    path.join('node_modules', '.vite', 'deps')
  )

  return isViteDeps
}

export default function (compiler: ViteH5CompilerContext | ViteHarmonyCompilerContext | ViteMiniCompilerContext): PluginOption {
  const { taroConfig } = compiler

  return {
    name: 'taro:vite-multi-platform-plugin',
    enforce: 'pre',
    async resolveId (source, importer, options) {
      if (isVirtualModule(source)) return null
      if (REG_NODE_MODULES.test(source)) return null

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

      // Note: H5 端的 dev 模式下，会存在 esbuild 预编译，会把 预编译的 chunk 文件放到 node_modules/.vite/deps 「cacheDir」 目录下，
      // 当时 vite 的源码里面有个钩子，会对改目录下的 resolveId 进行拦截处理，vitejs/vite/packages/vite/src/node/plugins/optimizedDeps.ts，会直接返回传入的 id，所以不会返回 null
      // 最全面的做法是，通过 config 钩子拿到 cacheDir，然后判断是否是 cacheDir 下的文件，如果是，则返回 null
      // 目前先简单处理一下，如果是 node_modules/.vite/deps 目录下 先返回 null
      const rawResolvedPath = path.resolve(path.dirname(importer), `${path.join(dir, basename)}${ext}`)
      if (isViteDepsPath(rawResolvedPath)) return null

      let resolution: ResolvedId | null = null
      const multiExtList = [
        `.${process.env.TARO_ENV}${ext}`,
        `/index.${process.env.TARO_ENV}${ext}`,
        `.${process.env.TARO_PLATFORM}${ext}`,
        `/index.${process.env.TARO_PLATFORM}${ext}`,
      ]

      for (const multiExt of multiExtList) {
        resolution = await this.resolve(
          path.resolve(path.dirname(importer), `${path.join(dir, basename)}${multiExt}`),
          importer,
          {
            ...options,
            skipSelf: true
          })
        if (resolution) break
      }

      if (!resolution) {
        resolution = await this.resolve(source, importer, {
          ...options,
          skipSelf: true
        })
      }

      if (!resolution?.id || resolution.external) return resolution
      if (isVirtualModule(resolution.id)) return resolution
      if (REG_NODE_MODULES.test(resolution.id)) return resolution
      if (multiPlatformReg.test(resolution.id)) return resolution
    },
  }
}
