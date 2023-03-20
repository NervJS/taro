import {
  isEmptyObject,
  readConfig,
  resolveMainFilePath,
  SCRIPT_EXT
} from '@tarojs/helper'
import { defaults } from 'lodash'
import * as path from 'path'

import type { AppConfig } from '@tarojs/taro'
import type { Entry, EntryFunc } from 'webpack'

interface IOptions {
  sourceDir: string
  entryFileName: string
  frameworkExts: string[]
}

type TEntry = string | string[] | Entry | EntryFunc

export class AppHelper {
  options: IOptions
  entry: TEntry

  #appConfig?: AppConfig
  #pages?: Set<{ name: string, path: string }>
  #pagesConfigList?: Map<string, string>
  #comps?: Set<{ name: string, path: string }>
  #compsConfigList?: Map<string, string>

  constructor (entry: TEntry = {}, options: Partial<IOptions> = {}) {
    this.options = defaults(options || {}, {
      sourceDir: '',
      entryFileName: 'app',
      frameworkExts: SCRIPT_EXT
    })
    this.entry = entry
  }

  get appEntry () {
    // Note: 不考虑 `() => Promise` 情况
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
    if (!this.#appConfig) {
      const appConfigPath = this.getConfigFilePath(this.appEntry)
      const appConfig = readConfig(appConfigPath)
      if (isEmptyObject(appConfig)) {
        throw new Error('缺少 app 全局配置，请检查！')
      }
      this.#appConfig = appConfig
    }
    return this.#appConfig as AppConfig
  }

  get pages () {
    if (!this.#pages) {
      const appPages = this.appConfig.pages
      if (!appPages || !appPages.length) {
        throw new Error('全局配置缺少 pages 字段，请检查！')
      }
      const { frameworkExts, sourceDir } = this.options

      this.#pages = new Set([
        ...appPages.map(item => ({
          name: item,
          path: resolveMainFilePath(path.join(sourceDir, item), frameworkExts)
        }))
      ])
      this.getSubPackages()
    }
    return this.#pages
  }

  get comps () {
    if (!this.#comps) {
      const appPages = this.appConfig.components
      if (!appPages || !appPages.length) {
        throw new Error('全局配置缺少 components 字段，请检查！')
      }
      const { frameworkExts, sourceDir } = this.options

      this.#comps = new Set([
        ...appPages.map(item => ({
          name: item,
          path: resolveMainFilePath(path.join(sourceDir, item), frameworkExts)
        }))
      ])
    }
    return this.#comps
  }

  private getSubPackages () {
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
    if (!this.#pagesConfigList) {
      const list = new Map<string, string>()
      const pages = this.pages
      pages.forEach(({ name, path }) => {
        const pageConfigPath = this.getConfigFilePath(path)
        list.set(name, pageConfigPath)
      })
      this.#pagesConfigList = list
    }
    return this.#pagesConfigList
  }

  get compsConfigList () {
    if (!this.#compsConfigList) {
      const list = new Map<string, string>()
      const comps = this.comps
      comps.forEach(({ name, path }) => {
        const pageConfigPath = this.getConfigFilePath(path)
        list.set(name, pageConfigPath)
      })
      this.#compsConfigList = list
    }
    return this.#compsConfigList
  }

  getConfigFilePath (filePath = '') {
    // console.log('filePath: ', filePath)
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  clear () {
    this.#appConfig = undefined
    this.#pages = undefined
    this.#pagesConfigList = undefined
  }
}
