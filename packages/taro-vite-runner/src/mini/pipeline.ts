import { resetComponentConfig } from '../template/component'
import { TARO_COMPILER,TaroCompiler } from '../utils/taroCompiler'

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
    },
    load (id) {
      if (id === TARO_COMPILER) return ''
    },
    closeBundle () {
      compiler.cleanup()
      resetComponentConfig()
      // console.log('this.watchFiles: ', this.getWatchFiles())
    }
  }
}
