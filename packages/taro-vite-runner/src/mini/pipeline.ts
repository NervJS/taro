import { VITE_COMPILER_LABEL } from '@tarojs/runner-utils'
import { isFunction } from '@tarojs/shared'

import type { UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteMiniCompilerContext): PluginOption {
  const { taroConfig } = viteCompilerContext
  return {
    name: 'taro:vite-mini-pipeline',
    enforce: 'pre',
    buildStart () {
      this.load({ id: VITE_COMPILER_LABEL })
      const info = this.getModuleInfo(VITE_COMPILER_LABEL)
      if (info) {
        info.meta = { viteCompilerContext }
        viteCompilerContext.watchConfigFile(this)
      }
      const { template, baseLevel = 16, experimental } = taroConfig
      if (template.isSupportRecursive === false && baseLevel > 0) {
        (template as UnRecursiveTemplate).baseLevel = baseLevel
      }

      if (experimental?.useXsForTemplate === false) {
        (template as UnRecursiveTemplate).isUseXS = false
      }

      if (experimental?.compileMode === true) {
        template.isUseCompileMode = true
      }
    },
    load (id) {
      if (id === VITE_COMPILER_LABEL) return ''
    },
    closeBundle () {
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
