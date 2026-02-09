import { isFunction } from '@tarojs/shared'

import type AppParser from '@tarojs/vite-runner/dist/harmony/template/app'
import type { TaroHarmonyAppMeta } from '@tarojs/vite-runner/dist/harmony/template/app'
import type { PluginContext } from 'rollup'
import type { PluginOption } from 'vite'
import type Harmony from '..'

export default function (this: Harmony): PluginOption {
  const that = this

  return {
    name: 'taro:vite-harmony-template-app',
    enforce: 'pre',
    async buildStart (this: PluginContext) {
      const pluginContext = this
      const { runnerUtils } = that.context

      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = await getViteHarmonyCompilerContext(pluginContext)

      if (compiler) {
        const app: TaroHarmonyAppMeta = compiler.app
        app.modifyAppImport = function (this: AppParser, importStr: string[], _app: TaroHarmonyAppMeta) {
          importStr.splice(-3, 0, 'import { TaroWindowUtil } from "@tarojs/runtime"')
        }
        compiler.loaderMeta ||= {}
        const oddModifyInstantiate = compiler.loaderMeta.modifyInstantiate
        compiler.loaderMeta.modifyInstantiate = function (this: AppParser, code = '', type = '', app: TaroHarmonyAppMeta) {
          if (type === 'app') {
            const codeLines = code.split('\n')
            const resolverIndex = codeLines.findIndex(line => line.includes('context.resolver'))
            if (resolverIndex >= 0) {
              codeLines.splice(
                resolverIndex + 1,
                0,
                codeLines[resolverIndex].replace(/\S+/, 'TaroWindowUtil.setWindowStage(stage)')
              )
              code = codeLines.join('\n')
            }
          }

          compiler.modifyHarmonyConfig(this.appConfig)

          return isFunction(oddModifyInstantiate) ? oddModifyInstantiate.call(this, code, type, app) : code
        }
      }
    },
  }
}
