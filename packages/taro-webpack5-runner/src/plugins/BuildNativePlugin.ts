import {
  isEmptyObject,
  printLog,
  processTypeEnum,
  resolveMainFilePath
} from '@tarojs/helper'
import path from 'path'

import { addRequireToSource, getChunkEntryModule, getChunkIdOrName } from '../utils/webpack'
import MiniPlugin from './MiniPlugin'

import type { Config } from '@tarojs/taro'
import type { Compilation, Compiler } from 'webpack'
import type { IComponent } from '../utils/types'

const PLUGIN_NAME = 'BuildNativePlugin'

export default class BuildNativePlugin extends MiniPlugin {
  pageLoaderName = '@tarojs/taro-loader/lib/native-component'

  apply (compiler: Compiler) {
    super.apply(compiler)
    this.addLoadChunksPlugin(compiler)
  }

  run (compiler: Compiler) {
    this.appConfig = this.getAppConfig()
    this.getPages()
    this.getPagesConfig()
    this.getConfigFiles(compiler)
    this.addEntries()
    this.addLoader(compiler)
  }

  getPages () {
    if (isEmptyObject(this.appConfig)) {
      throw new Error('缺少 app 全局配置，请检查！')
    }
    const appPages = this.appConfig.components
    if (!appPages || !appPages.length) {
      throw new Error('全局配置缺少 components 字段，请检查！')
    }

    if (!this.isWatch) {
      printLog(processTypeEnum.COMPILE, '发现入口', this.getShowPath(this.appEntry))
    }

    const { frameworkExts } = this.options
    this.prerenderPages = new Set()

    this.pages = new Set([
      ...appPages.map<IComponent>(item => {
        const pagePath = resolveMainFilePath(path.join(this.options.sourceDir, item), frameworkExts)

        return {
          name: item,
          path: pagePath,
          isNative: false
        }
      })
    ])
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

        // addChunkPages
        if (fileChunks.size) {
          let source
          const id = getChunkIdOrName(chunk)
          fileChunks.forEach((v, k) => {
            if (k === id) {
              source = addRequireToSource(id, modules, v)
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
}
