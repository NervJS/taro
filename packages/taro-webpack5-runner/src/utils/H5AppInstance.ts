import {
  isEmptyObject,
  readConfig,
  resolveMainFilePath,
  SCRIPT_EXT
} from '@tarojs/helper'
import { AppConfig } from '@tarojs/taro'
import { defaults } from 'lodash'
import path from 'path'
import { EntryNormalized } from 'webpack'

interface IH5AppInstOptions {
  sourceDir: string
  entryFileName: string
  frameworkExts: string[]
}

export default class H5AppInstance {
  options: IH5AppInstOptions
  entry: EntryNormalized
  __appConfig?: AppConfig
  __pages?: Set<{ name: string, path: string }>
  __pagesConfigList?: Map<string, string>

  constructor (entry: EntryNormalized = {}, options: Partial<IH5AppInstOptions> = {}) {
    this.options = defaults(options || {}, {
      sourceDir: '',
      entryFileName: 'app',
      frameworkExts: SCRIPT_EXT
    })
    this.entry = entry
  }

  get appEntry () {
    const { entryFileName, sourceDir } = this.options
    const appEntry = this.entry[entryFileName]
    if (!appEntry) return path.join(sourceDir, entryFileName)
    if (Array.isArray(appEntry)) {
      return appEntry.filter(item => path.basename(item, path.extname(item)) === entryFileName)[0]
    } else if (Array.isArray(appEntry.import)) {
      return appEntry.import.filter(item => path.basename(item, path.extname(item)) === entryFileName)[0]
    }
    return appEntry
  }

  get appConfig (): AppConfig {
    if (!this.__appConfig) {
      const appConfigPath = this.getConfigFilePath(this.appEntry)
      const appConfig = readConfig(appConfigPath)
      if (isEmptyObject(appConfig)) {
        throw new Error('缺少 app 全局配置，请检查！')
      }
      this.__appConfig = appConfig
    }
    return this.__appConfig as AppConfig
  }

  get pages () {
    if (!this.__pages) {
      const appPages = this.appConfig.pages
      if (!appPages || !appPages.length) {
        throw new Error('全局配置缺少 pages 字段，请检查！')
      }
      const { frameworkExts, sourceDir } = this.options

      this.__pages = new Set([
        ...appPages.map(item => ({
          name: item,
          path: resolveMainFilePath(path.join(sourceDir, item), frameworkExts)
        }))
      ])
      this.getSubPackages()
    }
    return this.__pages
  }

  getSubPackages () {
    const subPackages = this.appConfig.subPackages || this.appConfig.subpackages
    const { frameworkExts, sourceDir } = this.options
    if (subPackages && subPackages.length) {
      subPackages.forEach(item => {
        if (item.pages && item.pages.length) {
          const root = item.root
          item.pages.forEach(page => {
            let pageItem = `${root}/${page}`
            pageItem = pageItem.replace(/\/{2,}/g, '/')
            let hasPageIn = false
            this.pages.forEach(({ name }) => {
              if (name === pageItem) {
                hasPageIn = true
              }
            })
            if (!hasPageIn) {
              const pagePath = resolveMainFilePath(path.join(sourceDir, pageItem), frameworkExts)
              this.pages.add({
                name: pageItem,
                path: pagePath
              })
              this.appConfig.pages?.push(pageItem)
            }
          })
        }
      })
    }
  }

  get pagesConfigList () {
    if (!this.__pagesConfigList) {
      const list = new Map<string, string>()
      const pages = this.pages
      pages.forEach(({ name, path }) => {
        const pageConfigPath = this.getConfigFilePath(path)
        list.set(name, pageConfigPath)
      })
      this.__pagesConfigList = list
    }
    return this.__pagesConfigList
  }

  getConfigFilePath (filePath = '') {
    // console.log('filePath: ', filePath)
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  getTargetFilePath (filePath: string, targetExtname: string) {
    const extname = path.extname(filePath)
    if (extname) return filePath.replace(extname, targetExtname)
    return filePath + targetExtname
  }
}
