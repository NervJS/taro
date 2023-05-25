import { TaroCompiler } from '../utils/compiler/h5'

import type { PluginOption } from 'vite'
import type { H5BuildConfig } from '../utils/types'

export default function (appPath: string, taroConfig: H5BuildConfig): PluginOption {
  let compiler: TaroCompiler
  return {
    name: 'taro:vite-h5-pipeline',
    enforce: 'pre',
    async buildStart () {
      const compiler = new TaroCompiler(this, appPath, taroConfig)
      await this.load({
        id: TaroCompiler.label,
        meta: { compiler }
      })
    },
    load (id) {
      if (id === TaroCompiler.label) return ''
    },
    closeBundle () {
      compiler.cleanup()
    }
  }
}
