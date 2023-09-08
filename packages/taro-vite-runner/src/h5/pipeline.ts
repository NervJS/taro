import { TaroCompiler } from '../utils/compiler/h5'

import type { PluginOption } from 'vite'

export default function (compiler): PluginOption {
  return {
    name: 'taro:vite-h5-pipeline',
    enforce: 'pre',
    async buildStart () {
      // 下面这么写 是因为生产环境不需要异步，开发环境需要异步。是因为插件的执行顺序正确而这么写的
      process.env.NODE_ENV === 'production'
        ? 
        this.load({ id: TaroCompiler.label })
        :
        await this.load({ id: TaroCompiler.label })
      
      const info = this.getModuleInfo(TaroCompiler.label)
      if (info) {
        info.meta = { compiler }
      }
      compiler.setRollupCtx(this)
    },
    load (id) {
      if (id === TaroCompiler.label) return ''
    },
    closeBundle () {
      compiler.cleanup()
    }
  }
}
