import path from 'node:path'

import { fs, resolveSync } from '@tarojs/helper'

import { appendVirtualModulePrefix, resolveAbsoluteRequire, stripVirtualModulePrefix, virtualModulePrefixREG } from '../utils'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { Plugin, ResolvedConfig } from 'vite'

export const QUERY_IS_NATIVE_SCRIPT = '?isNative'
const etsSetCache = new WeakMap<ResolvedConfig, Set<string>>()
const chunkSetCache = new WeakMap<ResolvedConfig, Set<string>>()
const importAndRequireRegex = /(?:import\s|from\s|require\()['"]([^'"\s]+)['"]\)?/g

export default async function (viteCompilerContext: ViteHarmonyCompilerContext): Promise<Plugin> {
  const name = 'taro:vite-ets'
  const { taroConfig, cwd: appPath } = viteCompilerContext

  let etsSet: Set<string>
  let chunkSet: Set<string>
  let viteConfig: ResolvedConfig

  return {
    name,
    enforce: 'pre',
    configResolved (config) {
      viteConfig = config
    },
    buildStart () {
      if (etsSetCache.has(viteConfig)) {
        etsSet = etsSetCache.get(viteConfig) as Set<string>
      } else {
        etsSet = new Set()
        etsSetCache.set(viteConfig, etsSet)
      }
      if (chunkSetCache.has(viteConfig)) {
        chunkSet = chunkSetCache.get(viteConfig) as Set<string>
      } else {
        chunkSet = new Set()
        chunkSetCache.set(viteConfig, chunkSet)
      }
    },
    resolveId (source) {
      // 判断是否为 ets id，是的话转换成虚拟模块
      if (virtualModulePrefixREG.test(source)) return null

      if (source.endsWith(QUERY_IS_NATIVE_SCRIPT)) {
        const id = appendVirtualModulePrefix(source)

        etsSet.add(id)

        return id
      }

      return null
    },
    load (id) {
      if (etsSet.has(id)) {
        // 获取虚拟模块的真实路径的内容
        const idWithoutVirtualPrefix = stripVirtualModulePrefix(id.split('?')[0])
        const code = fs.readFileSync(idWithoutVirtualPrefix, 'utf-8')

        return code
      }

      return null
    },
    transform (code, id) {
      // 判断是否为虚拟 ets 模块，不是则退出
      if (etsSet.has(id)) {
        let match
        const realId = stripVirtualModulePrefix(id.split('?')[0])

        while ((match = importAndRequireRegex.exec(code)) !== null) {
          const moduleRelativePath = match[1]
          const modulePath = resolveSync(moduleRelativePath, { basedir: path.dirname(realId), extensions: ['.js', '.ts', '.ets'] })

          if (modulePath && !modulePath.includes('node_modules')) {
            const isETS = modulePath.endsWith('.ets')
            const fileName = path.relative(viteCompilerContext.sourceDir, modulePath)

            if (!chunkSet.has(fileName)) {
              this.emitFile({
                type: 'chunk',
                id: isETS ? modulePath + QUERY_IS_NATIVE_SCRIPT : modulePath,
                fileName: isETS ? fileName + QUERY_IS_NATIVE_SCRIPT : fileName,
              })

              if (!isETS) {
                chunkSet.add(fileName)
              }
            }
          }
        }

        const etsPath = path.relative(viteCompilerContext.sourceDir, realId)

        if (!chunkSet.has(etsPath)) {
          this.emitFile({
            code,
            type: 'prebuilt-chunk',
            fileName: etsPath
          })
          chunkSet.add(etsPath)
        }

        return {
          code: 'export default "This is virtual ets module!"',
          map: null
        }
      }
    },
    generateBundle (_, bundle) {
      Object.keys(bundle).forEach(key => {
        if (key.includes(QUERY_IS_NATIVE_SCRIPT)) {
          delete bundle[key]
        }
      })
    },
    renderChunk (code, chunk, opts: any) {
      // TODO ETS 文件改为 prebuilt-chunk 输出，输出前 resolve 依赖
      const id = chunk.facadeModuleId || chunk.fileName
      const etsSuffix = /\.ets(\?\S*)?$/
      if (etsSuffix.test(id) || etsSuffix.test(chunk.fileName) || chunk.moduleIds?.some(id => etsSuffix.test(id))) {
        opts.__vite_skip_esbuild__ = true
      }

      const { outputRoot = 'dist', sourceRoot = 'src' } = taroConfig
      code = resolveAbsoluteRequire({
        name,
        importer: id,
        code,
        outputRoot,
        targetRoot: path.resolve(appPath, sourceRoot),
        resolve: this.resolve,
        modifyResolveId: viteCompilerContext.loaderMeta.modifyResolveId,
      })

      return {
        code,
        map: null,
      }
    },
    // Note: 识别项目内 ets 文件并注入到 Harmony 项目中
  }
}
