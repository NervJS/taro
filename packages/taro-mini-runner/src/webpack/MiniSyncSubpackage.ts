import { readConfig,resolveMainFilePath } from '@tarojs/helper'
import { AppConfig } from '@tarojs/taro'
import * as path from 'path'
import * as webpack from 'webpack'
import Chain from 'webpack-chain'

import { AddPageChunks } from '../utils/types'

interface IOptions {
  entry: webpack.Entry
  chain: Chain
  appPath?: string
  addChunkPages?: AddPageChunks
  sourceRoot?: string
  entryFileName?: string
}

export default class MiniSyncSubpackPlugin {
  context: string
  pages: string[]
  webpackCacheGroups: unknown
  appEntry: string
  constructor (protected options: IOptions) {
    this.webpackCacheGroups = {}
  }

  // 入口
  run () {
    const { chain, addChunkPages } = this.options
    this.appEntry = this.getAppEntry()
    this.pages = this.getPages()
    const chunkPagesList = new Map<string, string[]>()
    if (typeof addChunkPages === 'function') {
      addChunkPages(chunkPagesList, Array.from(this.pages).map(item => item))
    }
    // 将addPages里面配置的页面全部整合到 webapack 中的 splitChunks 中
    chunkPagesList.forEach((chunkNames, filename) => {
      chunkNames.forEach(chunkName => {
        if (!this.webpackCacheGroups[chunkName]) {
          this.webpackCacheGroups[chunkName] = {
            name: chunkName,
            priority: 1000,
            test: modl => {
              // 实现多个页面打包到一个文件中
              // slice(1)是去掉下面累加的文件名开头多余的 ‘|’
              return new RegExp(this.webpackCacheGroups[chunkName].test?.testExpStr.slice(1)).test(modl.context)
            }
          }
        }
        // 将多个页面判断整合到 test 方法中的属性中，以免 webpack 属性判断报错
        this.webpackCacheGroups[chunkName].test.testExpStr =
        (this.webpackCacheGroups[chunkName].test?.testExpStr || '') + `|${filename}`
      })
    })

    const config = chain.optimization.get('splitChunks') || {}
    chain.optimization
      .splitChunks({
        ...config,
        cacheGroups: {
          ...config?.cacheGroups,
          ...this.webpackCacheGroups
        }
      })
  }

  getAppEntry () {
    const { entryFileName = 'app', entry = {} } = this.options
    const appJsPath = entry[entryFileName] || ''
    if (typeof appJsPath === 'string') {
      return appJsPath
    } else if (appJsPath instanceof Array) {
      return appJsPath[0]
    }
    return ''
  }

  getPages () {
    const appConfigPath = this.getConfigFilePath(this.appEntry)
    const appConfig: AppConfig = readConfig(appConfigPath)

    return appConfig.pages || []
  }

  /**
   * 根据 app、页面、组件的路径获取对应的 config 配置文件的路径
   */
  getConfigFilePath (filePath: string): string {
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }
}