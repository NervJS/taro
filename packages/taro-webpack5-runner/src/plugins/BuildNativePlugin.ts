import { addRequireToSourceWith } from '@tarojs/runner-utils/bundler/loadChunks'
import {
  collectBuildNativePages,
  injectNativeComponentCommonStyles
} from '@tarojs/runner-utils/bundler/miniPlugin'

import { getChunkEntryModule, getChunkIdOrName } from '../utils/webpack'
import MiniPlugin from './MiniPlugin'

import type { Config } from '@tarojs/taro'
import type { Compilation, Compiler } from 'webpack'

const PLUGIN_NAME = 'BuildNativePlugin'

export default class BuildNativePlugin extends MiniPlugin {
  pageLoaderName = '@tarojs/taro-loader/lib/native-component'

  apply (compiler: Compiler) {
    super.apply(compiler)
    this.addLoadChunksPlugin(compiler)
  }

  async run (compiler: Compiler) {
    this.appConfig = await this.getAppConfig()
    this.getPages()
    this.getPagesConfig()
    this.getConfigFiles(compiler)
    this.addEntries()
    this.addLoader(compiler)
  }

  getPages () {
    collectBuildNativePages(this)
  }

  // entry 删除 app.js
  addEntries () {
    super.addEntries()
    const deps = this.dependencies
    for (const [key, dep] of deps.entries()) {
      if (dep.miniType === 'ENTRY') {
        deps.delete(key)
        break
      }
    }
  }

  addLoadChunksPlugin (compiler: Compiler) {
    const fileChunks = new Map<string, { name: string }[]>()

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, chunks => {
        for (const chunk of chunks) {
          const id = getChunkIdOrName(chunk)
          if (this.options.commonChunks.includes(id)) return

          const deps: { name: string }[] = []

          for (const group of chunk.groupsIterable) {
            group.chunks.forEach(chunk => {
              const currentChunkId = getChunkIdOrName(chunk)
              if (id === currentChunkId) return
              deps.push({
                name: currentChunkId
              })
            })
          }

          fileChunks.set(id, deps)
        }
      })
      compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(compilation).render.tap(PLUGIN_NAME, (modules, { chunk }) => {
        if (!getChunkEntryModule(compilation, chunk)) return modules

        if (fileChunks.size) {
          let source
          const id = getChunkIdOrName(chunk)
          fileChunks.forEach((v, k) => {
            if (k === id) {
              source = addRequireToSourceWith(this.getSources(compiler).ConcatSource, id, modules, v)
            }
          })
          return source
        }
      })
    })
  }

  // 不生成 app.json
  generateConfigFile (compilation: Compilation, compiler: Compiler, filePath: string, config: Config & { component?: boolean }) {
    if (filePath === this.appEntry) return
    super.generateConfigFile(compilation, compiler, filePath, config)
  }

  // 加载 taro-runtime 前必须先加载端平台插件的 runtime
  addLoader (compiler: Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compiler.webpack.NormalModule.getCompilationHooks(compilation).loader.tap(PLUGIN_NAME, (_loaderContext, module: any) => {
        if (module.rawRequest === '@tarojs/runtime') {
          module.loaders.unshift({
            loader: '@tarojs/taro-loader/lib/taro-runtime',
            options: {
              runtimePath: this.options.runtimePath
            }
          })
        }
      })
    })
  }

  /**
   * 各组件的样式文件中引入 common chunks 中的公共样式文件
   */
  injectCommonStyles ({ assets }: Compilation, { webpack }: Compiler) {
    injectNativeComponentCommonStyles({
      assets,
      sources: webpack.sources,
      pages: this.pages,
      commonChunks: this.options.commonChunks,
      styleExt: this.options.fileType.style
    })
  }
}
