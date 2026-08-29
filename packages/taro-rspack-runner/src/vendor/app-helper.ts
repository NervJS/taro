/**
 * 与 @tarojs/webpack5-runner 的 src/utils/app.ts 逻辑一致，独立维护一份，
 * 避免对 webpack5-runner 产生依赖。仅将 webpack 的 EntryNormalized 类型替换为本地等价定义。
 */
import path from 'node:path'

import {
  isEmptyObject,
  readConfig,
  resolveMainFilePath,
  SCRIPT_EXT
} from '@tarojs/helper'
import { defaults } from 'lodash'

import type { AppConfig } from '@tarojs/taro'
import type { Func } from '@tarojs/taro/types/compile'

type EntryItem = string | string[]
interface EntryDescription {
  import?: EntryItem
  [key: string]: any
}
type EntryNormalized = Record<string, EntryItem | EntryDescription>

interface IOptions {
  sourceDir: string
  entryFileName: string
  frameworkExts: string[]
  alias: Record<string, any>
  defineConstants: Record<string, any>
  modifyAppConfig?: Func
}

export default class AppHelper {
  options: IOptions
  entry: EntryNormalized

  private _appConfig?: AppConfig
  private _pages?: Set<{ name: string, path: string }>
  private _pagesConfigList?: Map<string, string>
  private _comps?: Set<{ name: string, path: string }>
  private _compsConfigList?: Map<string, string>

  constructor (entry: EntryNormalized = {}, options: Partial<IOptions> = {}) {
    this.options = defaults(options || {}, {
      sourceDir: '',
      entryFileName: 'app',
      frameworkExts: SCRIPT_EXT,
      alias: {},
      defineConstants: {}
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
    } else if (Array.isArray((appEntry as EntryDescription).import)) {
      return ((appEntry as EntryDescription).import as string[]).filter(item => path.basename(item, path.extname(item)) === entryFileName)[0]
    }
    return appEntry as string
  }

  get appConfig (): AppConfig {
    if (!this._appConfig) {
      const appConfigPath = this.getConfigFilePath(this.appEntry)
      const appConfig = readConfig(appConfigPath, this.options)
      if (isEmptyObject(appConfig)) {
        throw new Error('缺少 app 全局配置，请检查！')
      }
      const { modifyAppConfig } = this.options
      if (typeof modifyAppConfig === 'function') {
        modifyAppConfig(appConfig)
      }
      this._appConfig = appConfig
    }
    return this._appConfig as AppConfig
  }

  get pages () {
    if (!this._pages) {
      const appPages = this.appConfig.pages
      if (!appPages || !appPages.length) {
        throw new Error('全局配置缺少 pages 字段，请检查！')
      }
      const { frameworkExts, sourceDir } = this.options

      this._pages = new Set([
        ...appPages.map(item => ({
          name: item,
          path: resolveMainFilePath(path.join(sourceDir, item), frameworkExts)
        }))
      ])
      this.getSubPackages()
    }
    return this._pages
  }

  get comps () {
    if (!this._comps) {
      const appPages = this.appConfig.components
      if (!appPages || !appPages.length) {
        throw new Error('全局配置缺少 components 字段，请检查！')
      }
      const { frameworkExts, sourceDir } = this.options

      this._comps = new Set([
        ...appPages.map(item => ({
          name: item,
          path: resolveMainFilePath(path.join(sourceDir, item), frameworkExts)
        }))
      ])
    }
    return this._comps
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
    if (!this._pagesConfigList) {
      const list = new Map<string, string>()
      const pages = this.pages
      pages.forEach(({ name, path }) => {
        const pageConfigPath = this.getConfigFilePath(path)
        list.set(name, pageConfigPath)
      })
      this._pagesConfigList = list
    }
    return this._pagesConfigList
  }

  get compsConfigList () {
    if (!this._compsConfigList) {
      const list = new Map<string, string>()
      const comps = this.comps
      comps.forEach(({ name, path }) => {
        const pageConfigPath = this.getConfigFilePath(path)
        list.set(name, pageConfigPath)
      })
      this._compsConfigList = list
    }
    return this._compsConfigList
  }

  getConfigFilePath (filePath = '') {
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  clear () {
    this._appConfig = undefined
    this._pages = undefined
    this._pagesConfigList = undefined
  }
}
