import { readConfig,resolveMainFilePath } from '@tarojs/helper'
import { AppConfig, SubPackage } from '@tarojs/taro'
import * as path from 'path'
import * as webpack from 'webpack'
import Chain from 'webpack-chain'

import { AddPageChunks } from '../utils/types'

interface IOptions {
  entry: webpack.EntryObject
  addChunkPages?: AddPageChunks
  chain: Chain
  entryFileName?: string
}

export default class MiniSyncSubpackPlugin {
  context: string
  subPackages: SubPackage[]
  addChunkPages?: AddPageChunks
  pages: string[]
  appEntry: string
  constructor (protected options: IOptions) {
    this.addChunkPages = options.addChunkPages
  }

  // 入口
  run () {
    const { chain } = this.options
    const webpackCacheGroups = {}
    this.appEntry = this.getAppEntry()
    this.pages = this.getPages()
    this.subPackages = this.getSubpackageConfig().map((subPackage: SubPackage) => ({
      ...subPackage,
      root: this.formatSubRoot(subPackage.root)
    }))
    const chunkPagesList = new Map<string, string[]>()
    if (typeof this.addChunkPages === 'function') {
      this.addChunkPages(chunkPagesList, Array.from(this.pages).map(item => item))
    }
    chunkPagesList.forEach((chunkNames, filename) => {
      chunkNames.forEach(chunkName => {
        if (!webpackCacheGroups[chunkName]) {
          webpackCacheGroups[chunkName] = {
            name: chunkName,
            priority: 1000,
            test: modl => {
              // 实现多个页面打包到一个文件中
              // slice(1)是去掉下面累加的文件名开头多余的 ‘|’
              return new RegExp(webpackCacheGroups[chunkName].test?.testExpStr.slice(1)).test(modl.context)
            }
          }
        }
        // 将多个页面判断整合到 test 方法中的属性中，以免 webpack 属性判断报错
        webpackCacheGroups[chunkName].test.testExpStr =
        (webpackCacheGroups[chunkName].test?.testExpStr || '') + `|${filename}`
      })
    })
    const config = chain.optimization.get('splitChunks')
    chain.optimization
      .splitChunks({
        ...config,
        cacheGroups: {
          ...config.cacheGroups,
          ...webpackCacheGroups
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
    } else if (typeof appJsPath.import === 'string') {
      return appJsPath.import
    }
    return ''
  }

  getPages () {
    const appConfigPath = this.getConfigFilePath(this.appEntry)
    const appConfig: AppConfig = readConfig(appConfigPath)

    return appConfig.pages || []
  }

  // 判断是否为分包
  getIsSubPackage (name: string): boolean {
    return !!this.subPackages.find(packageItem => name.includes(packageItem.root))
  }

  /**
   * 去掉尾部的/
   */
  formatSubRoot (subRoot: string): string {
    const lastApl = subRoot[subRoot.length - 1]

    if (lastApl === '/') {
      subRoot = subRoot.slice(0, subRoot.length - 1)
    }
    return subRoot
  }

  /**
   * 根据 app、页面、组件的路径获取对应的 config 配置文件的路径
   */
  getConfigFilePath (filePath: string): string {
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  /**
   * 获取分包配置
   */
  getSubpackageConfig (): SubPackage[] {
    const appConfigPath = this.getConfigFilePath(this.appEntry)
    const appConfig: AppConfig = readConfig(appConfigPath)

    return appConfig.subPackages || appConfig.subpackages || []
  }

}