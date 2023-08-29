import { TaroCompiler } from '../utils/compiler/h5'

import type { PluginOption } from 'vite'

export default function (compiler): PluginOption {
  return {
    name: 'taro:vite-h5-pipeline',
    enforce: 'pre',
    async buildStart () {
      compiler.setRollupCtx(this)
      // 生成虚拟模块，别的插件可以获取到该信息
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
