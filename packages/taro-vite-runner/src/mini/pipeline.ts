import { TARO_COMPILER,TaroCompiler } from '../utils/taroCompiler'

import type { UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { PluginOption } from 'vite'
import type { MiniBuildConfig } from '../utils/types'

export default function (appPath: string, taroConfig: MiniBuildConfig): PluginOption {
  let compiler: TaroCompiler
  return {
    name: 'taro:vite-mini-pipeline',
    enforce: 'pre',
    buildStart () {
      this.load({ id: TARO_COMPILER })
      const info = this.getModuleInfo(TARO_COMPILER)
      if (info) {
        compiler = new TaroCompiler(this, appPath, taroConfig)
        info.meta = { compiler }
      }
      const { template, baseLevel = 16 } = taroConfig
      if (template.isSupportRecursive === false && baseLevel > 0) {
        (template as UnRecursiveTemplate).baseLevel = baseLevel
      }
    },
    load (id) {
      if (id === TARO_COMPILER) return ''
    },
    closeBundle () {
      compiler.cleanup()
      // console.log('this.watchFiles: ', this.getWatchFiles())
    }
  }
}
