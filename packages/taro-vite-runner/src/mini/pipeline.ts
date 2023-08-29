import { isFunction } from '@tarojs/shared'

import { TaroCompiler } from '../utils/compiler/mini'

import type { UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { PluginOption } from 'vite'

export default function (compiler: TaroCompiler): PluginOption {
  const { taroConfig } = compiler
  return {
    name: 'taro:vite-mini-pipeline',
    enforce: 'pre',
    buildStart () {
      this.load({ id: TaroCompiler.label })
      const info = this.getModuleInfo(TaroCompiler.label)
      if (info) {
        compiler.setRollupCtx(this)
        info.meta = { compiler }
      }
      const { template, baseLevel = 16 } = taroConfig
      if (template.isSupportRecursive === false && baseLevel > 0) {
        (template as UnRecursiveTemplate).baseLevel = baseLevel
      }
    },
    load (id) {
      if (id === TaroCompiler.label) return ''
    },
    closeBundle () {
      compiler.cleanup()

      const onBuildFinish = taroConfig.onBuildFinish
      if (isFunction(onBuildFinish)) {
        onBuildFinish({
          error: null,
          stats: {},
          isWatch: taroConfig.isWatch
        })
      }
      // console.log('this.watchFiles: ', this.getWatchFiles())
    }
  }
}
