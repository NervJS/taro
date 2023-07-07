import { isFunction, isString, toDashed } from '@tarojs/shared'
import path from 'path'

import { getHarmonyCompiler } from '../utils'
import { componentConfig } from '../utils/component'

import type { PluginOption } from 'vite'

export default function (): PluginOption {
  return [{
    name: 'taro:vite-harmony-emit',
    async generateBundle (_outputOpts, bundle) {
      const compiler = getHarmonyCompiler(this)

      if (compiler) {
        const { taroConfig } = compiler

        const compPathId = await this.resolve(taroConfig.taroComponentsPath)
        if (compPathId) {
          const id = compPathId.id
          const depsChunks = ['vendors.js', 'common.js']
          let isFound = false
          // eslint-disable-next-line no-inner-declarations
          function collectDeps (chunkName: string) {
            const chunk = bundle[chunkName]
            if (chunk?.type === 'chunk' && chunk.moduleIds.includes(id)) {
              const module = chunk.modules[id]
              module.renderedExports.forEach(item => componentConfig.includes.add(toDashed(item)))
              isFound = true
              return true
            }
          }
          depsChunks.some(collectDeps)
          if (!isFound) {
            for (const chunkName in bundle) {
              if (collectDeps(chunkName)) break
            }
          }
        }

        // Note: 修改 harmony Hap 的配置文件，注入路由配置
        compiler.modifyHarmonyConfig(compiler.app.config)
      }
    }
  }, {
    name: 'taro:vite-harmony-emit-post',
    enforce: 'post',
    async generateBundle (_outputOpts, bundle) {
      const compiler = getHarmonyCompiler(this)
      if (compiler) {
        const { taroConfig } = compiler
        if (isFunction(taroConfig.modifyBuildAssets)) {
          const assets = {}
          for (const name in bundle) {
            const chunk = bundle[name]
            const source = chunk.type === 'asset' ? chunk.source : chunk.code
            assets[chunk.fileName] = {
              source: () => source
            }
          }
          const assetsProxy = new Proxy(assets, {
            set (target, p, newValue) {
              if (!isString(p)) return false

              target[p] = newValue
              const chunk = bundle[p]
              if (chunk.type === 'asset') {
                chunk.source = newValue.source()
              } else {
                chunk.code = newValue.source()
              }
              return true
            },
          })
          taroConfig.modifyBuildAssets(
            assetsProxy,
            {
              pages: compiler.pages,
              filesConfig: compiler.filesConfig,
              getConfigFilePath: compiler.getConfigFilePath,
              options: {}
            }
          )
        }

        const outDir = path.resolve(process.cwd(), taroConfig.outputRoot || 'dist')
        // TODO 收集运行时使用 Harmony 依赖
        const deps = {
          '@hmscore/hms-js-base': '^6.1.0-300',
          '@hmscore/hms-jsb-account': '^1.0.300'
        }
        compiler.modifyHostPackageDep(outDir, deps)
        // TODO 判断 ohpm 是否存在，如果存在则在 projectPath 目录下执行 ohpm install
      }
    }
  }]
}
