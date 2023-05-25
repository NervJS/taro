import {
  fs,
  isEmptyObject,
  readConfig,
  resolveMainFilePath,
  SCRIPT_EXT,
} from '@tarojs/helper'
import path from 'path'

import { stripMultiPlatformExt } from '../../utils'
import { logger } from '../logger'

import type { AppConfig, Config, PageConfig } from '@tarojs/taro'
import type { PluginContext } from 'rollup'
import type { H5BuildConfig, MiniBuildConfig } from '../types'

export interface AppMeta {
  name: string
  scriptPath: string
  configPath: string
  config: AppConfig
  isNative: false
}

export interface PageMeta {
  name: string
  scriptPath: string
  configPath: string
  config: PageConfig
  isNative: boolean
  templatePath?: string
  cssPath?: string
}

interface FilesConfig {
  [configName: string]: {
    content: Config
    path: string
  }
}

export class Compiler<T extends MiniBuildConfig | H5BuildConfig> {
  static label = 'taro:compiler'
  rollupCtx: PluginContext | null
  cwd: string
  sourceDir: string
  taroConfig: T
  frameworkExts: string[]
  app: AppMeta
  pages: PageMeta[]
  loaderMeta: any
  logger = logger
  filesConfig: FilesConfig = {}
  compilePage: (pageName: string) => PageMeta

  constructor (rollupCtx: PluginContext, appPath: string, taroConfig: T) {
    this.rollupCtx = rollupCtx
    this.cwd = appPath
    this.sourceDir = path.join(appPath, taroConfig.sourceRoot || 'src')
    this.taroConfig = taroConfig
    this.frameworkExts = this.taroConfig.frameworkExts || SCRIPT_EXT
  }

  getAppScriptPath (): string {
    return this.taroConfig.entry.app[0]
  }

  getApp (): AppMeta {
    const scriptPath = this.getAppScriptPath()
    const configPath = this.getConfigFilePath(scriptPath)
    const config: AppConfig = readConfig(configPath)

    if (isEmptyObject(config)) {
      this.logger.error('缺少 app 全局配置文件，请检查！')
      process.exit(1)
    }

    const appMeta: AppMeta = {
      name: path.basename(scriptPath).replace(path.extname(scriptPath), ''),
      scriptPath,
      configPath,
      config,
      isNative: false
    }

    this.filesConfig[this.getConfigFilePath(appMeta.name)] = {
      path: configPath,
      content: config
    }
    this.rollupCtx?.addWatchFile(appMeta.configPath)

    return appMeta
  }

  getPages (): PageMeta[] {
    const appConfig = this.app.config

    if (!appConfig.pages?.length) {
      this.logger.error('全局配置缺少 pages 字段，请检查！')
      process.exit(1)
    }

    const pagesList = appConfig.pages.map<PageMeta>(pageName => this.compilePage(pageName))

    const subPackages = appConfig.subPackages || appConfig.subpackages || []
    subPackages.forEach(item => {
      if (item.pages?.length) {
        const root = item.root
        item.pages.forEach(page => {
          const subPageName = `${root}/${page}`.replace(/\/{2,}/g, '/')

          for (const mainPage of pagesList) {
            if (mainPage.name === subPageName) return
          }

          const pageMeta = this.compilePage(subPageName)
          pagesList.push(pageMeta)
        })
      }
    })

    return pagesList
  }

  /** 工具函数 */

  isApp (id: string): boolean {
    return this.app.scriptPath === id
  }

  isPage (id: string): boolean {
    return this.pages.findIndex(page => page.scriptPath === id) > -1
  }

  isNativePageORComponent (templatePath: string): boolean {
    return fs.existsSync(templatePath)
  }

  getPageById (id: string) {
    return this.pages.find(page => page.scriptPath === id)
  }

  getConfigFilePath (filePath: string) {
    const cleanedPath = stripMultiPlatformExt(filePath.replace(path.extname(filePath), ''))
    return resolveMainFilePath(`${cleanedPath}.config`)
  }

  getTargetFilePath (filePath: string, targetExtName: string) {
    const extname = path.extname(filePath)
    return extname
      ? filePath.replace(extname, targetExtName)
      : filePath + targetExtName
  }

  cleanup () {
    this.rollupCtx = null
  }
}
