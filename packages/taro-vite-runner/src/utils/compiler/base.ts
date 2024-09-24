import path from 'node:path'

import {
  fs,
  isEmptyObject,
  readConfig,
  resolveMainFilePath,
  SCRIPT_EXT,
} from '@tarojs/helper'
import { VITE_COMPILER_LABEL } from '@tarojs/runner-utils'

import { stripMultiPlatformExt } from '../../utils'
import { logger } from '../logger'

import type { AppConfig } from '@tarojs/taro'
import type { IMiniFilesConfig } from '@tarojs/taro/types/compile'
import type {
  ViteAppMeta,
  ViteCompilerContext,
  ViteH5BuildConfig,
  ViteHarmonyBuildConfig,
  ViteMiniBuildConfig,
  VitePageMeta
} from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginContext } from 'rollup'

export class CompilerContext <T extends ViteH5BuildConfig | ViteHarmonyBuildConfig | ViteMiniBuildConfig> implements ViteCompilerContext<T> {
  static label = VITE_COMPILER_LABEL
  cwd: string
  sourceDir: string
  taroConfig: T
  rawTaroConfig: T
  frameworkExts: string[]
  app: ViteAppMeta
  pages: VitePageMeta[]
  components?: VitePageMeta[]
  loaderMeta: any
  logger = logger
  filesConfig: IMiniFilesConfig = {}
  configFileList: string[] = []
  compilePage: (pageName: string) => VitePageMeta

  constructor (appPath: string, rawTaroConfig: T) {
    this.cwd = appPath
    this.rawTaroConfig = rawTaroConfig
    this.process()
  }

  protected process () {
    this.processConfig()
    this.sourceDir = path.resolve(this.cwd, this.taroConfig.sourceRoot as string)
    this.frameworkExts = this.taroConfig.frameworkExts || SCRIPT_EXT
  }

  protected processConfig () {}

  watchConfigFile (rollupCtx: PluginContext) {
    this.configFileList.forEach((configFile) => rollupCtx.addWatchFile(configFile))
  }

  getAppScriptPath (): string {
    return this.taroConfig.entry.app[0]
  }

  getApp (): ViteAppMeta {
    const scriptPath = this.getAppScriptPath()
    const configPath = this.getConfigFilePath(scriptPath)
    const config: AppConfig = readConfig(configPath, this.taroConfig)

    if (isEmptyObject(config)) {
      this.logger.error('缺少 app 全局配置文件，请检查！')
      process.exit(1)
    }

    const appMeta: ViteAppMeta = {
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
    return appMeta
  }

  getPages (): VitePageMeta[] {
    const appConfig = this.app.config

    if (this.taroConfig.isBuildNativeComp) return []

    if (!appConfig.pages?.length) {
      this.logger.error('全局配置缺少 pages 字段，请检查！')
      process.exit(1)
    }

    const pagesList = appConfig.pages.map<VitePageMeta>(pageName => this.compilePage(pageName))

    const subPackages = appConfig.subPackages || appConfig.subpackages || []
    subPackages.forEach(item => {
      // 兼容 pages: [''] 等非法情况
      const pages = (item.pages || []).filter(item => !!item)

      if (pages.length > 0) {
        const root = item.root
        pages.forEach(page => {
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

  getComponents (): VitePageMeta[] {
    const appConfig = this.app.config

    if (!appConfig.components?.length) {
      this.logger.error('全局配置缺少 components 字段，请检查！')
      process.exit(1)
    }

    return appConfig.components.map<VitePageMeta>(pageName => this.compilePage(pageName))
  }

  /** 工具函数 */

  isApp (id: string): boolean {
    return this.app.scriptPath === id
  }

  isPage (id: string): boolean {
    return this.pages.findIndex(page => page.scriptPath === id) > -1
  }

  isComponent (id: string): boolean {
    if (this.components && this.components.length) {
      return this.components.findIndex(component => component.scriptPath === id) > -1
    }

    return false
  }

  isNativePageORComponent (templatePath: string): boolean {
    return fs.existsSync(templatePath)
  }

  getPageById (id: string) {
    return this.pages.find(page => page.scriptPath === id)
  }

  getComponentById (id: string) {
    if (this.components && this.components.length) {
      return this.components.find(component => component.scriptPath === id)
    }
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
}
