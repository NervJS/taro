import { META_TYPE } from '@tarojs/helper'

import { addRequireToSource, getChunkEntryModule, getChunkIdOrName } from '../utils/webpack'

import type { Compiler, sources } from 'webpack'
import type TaroNormalModule from './TaroNormalModule'

const PLUGIN_NAME = 'TaroInjectSyncCorePlugin'

interface IOptions {
  /** 同步核产物在 outputDir 根的文件名（不含 .js），如 'taro-shared-sync' */
  syncCoreName: string
}

/**
 * 方案二 split：在 app 入口（app.js）文本头部同步注入 require('<syncCore>')，
 * 使同步核先于任何 createReactApp / 页面注册执行（填共享全局 + 装占位 shim + 触发异步核加载）。
 * 仿 TaroLoadChunksPlugin 的 render 钩子 + addRequireToSource（用伪 chunk {name}）。
 */
export default class TaroInjectSyncCorePlugin {
  syncCoreName: string

  constructor (options: IOptions) {
    this.syncCoreName = options.syncCoreName
  }

  apply (compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap(
        PLUGIN_NAME,
        (modules: sources.ConcatSource, { chunk }) => {
          const chunkEntryModule = getChunkEntryModule(compilation, chunk) as any
          if (!chunkEntryModule) return modules
          const entryModule: TaroNormalModule = chunkEntryModule.rootModule ?? chunkEntryModule
          if (entryModule.miniType === META_TYPE.ENTRY) {
            // app 入口：头部注入 require('<相对路径>/taro-shared-sync')
            return addRequireToSource(getChunkIdOrName(chunk), modules, [{ name: this.syncCoreName }])
          }
          return modules
        }
      )
    })
  }
}
