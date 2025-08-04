import { VITE_COMPILER_LABEL } from '@tarojs/runner-utils'
import { isFunction } from '@tarojs/shared'

import { getMode } from '../utils'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption {
  const { taroConfig } = viteCompilerContext
  return {
    name: 'taro:vite-harmony-pipeline',
    enforce: 'pre',
    async buildStart () {
      const isProd = getMode(taroConfig) === 'production'
      // 下面这么写 是因为生产环境不需要异步，开发环境需要异步。是因为插件的执行顺序正确而这么写的
      isProd
        ? this.load({ id: VITE_COMPILER_LABEL })
        : await this.load({ id: VITE_COMPILER_LABEL })

      const info = this.getModuleInfo(VITE_COMPILER_LABEL)
      if (info) {
        info.meta = { viteCompilerContext }
        viteCompilerContext.watchConfigFile(this)
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
    }
  }
}
