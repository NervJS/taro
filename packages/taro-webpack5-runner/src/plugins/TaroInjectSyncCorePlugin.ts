import { META_TYPE } from '@tarojs/helper'

import { addRequireToSource, getChunkEntryModule, getChunkIdOrName } from '../utils/webpack'

import type { Compiler, sources } from 'webpack'
import type TaroNormalModule from './TaroNormalModule'

const PLUGIN_NAME = 'TaroInjectSyncCorePlugin'

interface IOptions {
  /** 同步核产物在 outputDir 根的文件名（不含 .js），如 'taro-shared-sync' */
  syncCoreName: string
  /**
   * F6 共享运行时 native-components 场景：每个 native-component 是 META_TYPE.PAGE(BuildNativePlugin
   * 删了 ENTRY dep、无 app.js)，需在每个 PAGE chunk 顶部也注入同步核 require；非 native-comp
   * 场景仍只在 ENTRY(app.js）注入，PAGE 不动。
   */
  injectOnPage?: boolean
}

/**
 * 共享运行时（split 模式）：在 app 入口（app.js）文本头部同步注入 require('<syncCore>')，
 * 使同步核先于任何 createReactApp / 页面注册执行（填共享全局 + 装占位 shim + 触发异步核加载）。
 * 仿 TaroLoadChunksPlugin 的 render 钩子 + addRequireToSource（用伪 chunk {name}）。
 *
 * F6 扩展：injectOnPage=true(native-components 场景）时，PAGE chunk 顶部也注入同步核 require——
 * 每个 native-component 产物顶层同步调用 createNativeComponentConfig，需同步核先就位。
 */
export default class TaroInjectSyncCorePlugin {
  syncCoreName: string
  injectOnPage: boolean

  constructor (options: IOptions) {
    this.syncCoreName = options.syncCoreName
    this.injectOnPage = !!options.injectOnPage
  }

  apply (compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap(
        PLUGIN_NAME,
        (modules: sources.ConcatSource, { chunk }) => {
          const chunkEntryModule = getChunkEntryModule(compilation, chunk) as any
          if (!chunkEntryModule) return modules
          const entryModule: TaroNormalModule = chunkEntryModule.rootModule ?? chunkEntryModule
          const shouldInject = entryModule.miniType === META_TYPE.ENTRY ||
            (this.injectOnPage && entryModule.miniType === META_TYPE.PAGE)
          if (shouldInject) {
            // app 入口 或 native-component PAGE：头部注入 require('<相对路径>/taro-shared-sync')
            return addRequireToSource(getChunkIdOrName(chunk), modules, [{ name: this.syncCoreName }])
          }
          return modules
        }
      )
    })
  }
}
