/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import {
  isEmptyObject,
  printLog,
  processTypeEnum,
  resolveMainFilePath
} from '@tarojs/helper'
import { Config } from '@tarojs/taro'
import * as path from 'path'
import * as webpack from 'webpack'

import { IComponent } from '../utils/types'
import MiniPlugin from './MiniPlugin'
import { addRequireToSource, getIdOrName } from './TaroLoadChunksPlugin'

const PLUGIN_NAME = 'BuildNativePlugin'

export default class BuildNativePlugin extends MiniPlugin {
  pageLoaderName = '@tarojs/taro-loader/lib/native-component'

  apply (compiler: webpack.Compiler) {
    super.apply(compiler)
    this.addLoadChunksPlugin(compiler)
  }

  run (compiler: webpack.Compiler) {
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

  addLoadChunksPlugin (compiler: webpack.Compiler) {
    const fileChunks = new Map<string, { name: string }[]>()

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: any) => {
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, (chunks: webpack.compilation.Chunk[]) => {
        chunks.forEach(chunk => {
          const id = getIdOrName(chunk)
          if (this.options.commonChunks.includes(id)) return

          const deps: { name: string }[] = []

          chunk._groups.forEach(group => {
            group.chunks.forEach(chunk => {
              const currentChunkId = getIdOrName(chunk)
              if (id === currentChunkId) return
              deps.push({
                name: currentChunkId
              })
            })
          })

          fileChunks.set(id, deps)
        })
      })
      compilation.chunkTemplate.hooks.renderWithEntry.tap(PLUGIN_NAME, (modules, chunk) => {
        if (!chunk.entryModule) return

        // addChunkPages
        if (fileChunks.size) {
          let source
          const id = getIdOrName(chunk)
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
  generateConfigFile (compilation: webpack.compilation.Compilation, filePath: string, config: Config & { component?: boolean }) {
    if (filePath === this.appEntry) return
    super.generateConfigFile(compilation, filePath, config)
  }

  // 加载 taro-runtime 前必须先加载端平台插件的 runtime
  addLoader (compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.normalModuleLoader.tap(PLUGIN_NAME, (_loaderContext, module: any) => {
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
