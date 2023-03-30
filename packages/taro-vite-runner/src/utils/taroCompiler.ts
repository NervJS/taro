import {
  fs,
  isAliasPath,
  isEmptyObject,
  readConfig,
  replaceAliasPath,
  resolveMainFilePath,
  SCRIPT_EXT,
} from '@tarojs/helper'
import { isArray, isFunction } from '@tarojs/shared'
import path from 'path'

import { componentConfig } from '../template/component'
import { getComponentName, stripMultiPlatformExt } from '../utils'
import { logger } from './logger'

import type { AppConfig, Config,PageConfig } from '@tarojs/taro'
import type { PluginContext } from 'rollup'
import type { MiniBuildConfig } from './types'

interface AppMeta {
  name: string
  scriptPath: string
  configPath: string
  config: AppConfig
  isNative: false
}

interface PageMeta {
  name: string
  scriptPath: string
  configPath: string
  config: PageConfig
  isNative: boolean
  templatePath?: string
  cssPath?: string
}

interface NativeCompMeta {
  name: string
  scriptPath: string
  configPath: string
  config: PageConfig
  isNative: true
  templatePath: string
  cssPath?: string
}

interface FileType {
  config: string
  script: string
  templ: string
  style: string
  xs?: string
}

interface FilesConfig {
  [configName: string]: {
    content: Config
    path: string
  }
}

const defaultFileType = {
  style: '.wxss',
  config: '.json',
  script: '.js',
  templ: '.wxml'
}

export const TARO_COMPILER = 'taro:compiler'

export class TaroCompiler {
  rollupCtx: PluginContext | null
  cwd: string
  sourceDir: string
  taroConfig: MiniBuildConfig
  app: AppMeta
  pages: PageMeta[]
  nativeComponents = new Map<string, NativeCompMeta>()
  frameworkExts: string[]
  fileType: FileType
  loaderMeta: any
  commonChunks: string[]
  logger = logger
  filesConfig: FilesConfig = {}

  constructor (rollupCtx: PluginContext, appPath: string, taroConfig: MiniBuildConfig) {
    this.rollupCtx = rollupCtx
    this.cwd = appPath
    this.sourceDir = path.join(appPath, taroConfig.sourceRoot || 'src')
    this.taroConfig = taroConfig
    this.frameworkExts = this.taroConfig.frameworkExts || SCRIPT_EXT
    this.fileType = this.taroConfig.fileType || defaultFileType
    this.commonChunks = this.getCommonChunks()
    this.app = this.getApp()
    this.pages = this.getPages()
  }

  getApp (): AppMeta {
    const scriptPath = this.taroConfig.entry.app[0]
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
    this.collectNativeComponents(appMeta)
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

  compilePage (pageName: string): PageMeta {
    const { sourceDir, frameworkExts } = this

    const scriptPath = resolveMainFilePath(path.join(sourceDir, pageName), frameworkExts)
    const templatePath = this.getTemplatePath(scriptPath)
    const isNative = this.isNativePageORComponent(templatePath)
    const configPath = isNative
      ? this.getConfigPath(scriptPath)
      : this.getConfigFilePath(scriptPath)
    const config: PageConfig = readConfig(configPath) || {}

    const pageMeta = {
      name: pageName,
      scriptPath,
      configPath,
      config,
      isNative,
      templatePath: isNative ? templatePath : undefined,
      cssPath: isNative ? this.getStylePath(scriptPath) : undefined,
    }

    this.filesConfig[this.getConfigFilePath(pageMeta.name)] = {
      path: configPath,
      content: config
    }
    this.collectNativeComponents(pageMeta)
    this.rollupCtx?.addWatchFile(pageMeta.configPath)

    return pageMeta
  }

  collectNativeComponents (meta: AppMeta | PageMeta | NativeCompMeta) {
    const { name, scriptPath, config } = meta
    const { usingComponents } = config
    if (!usingComponents) return

    Object.entries(usingComponents).forEach(([compName, compPath]) => {
      const alias = this.taroConfig.alias

      if (isAliasPath(compPath, alias)) {
        compPath = replaceAliasPath(scriptPath, compPath, alias)
        usingComponents[compName] = compPath
      }

      const compScriptPath = resolveMainFilePath(path.resolve(path.dirname(scriptPath), compPath))

      if (this.nativeComponents.has(compScriptPath)) return

      const configPath = this.getConfigPath(compScriptPath)
      const templatePath = this.getTemplatePath(compScriptPath)
      const cssPath = this.getStylePath(compScriptPath)

      if (!fs.existsSync(compScriptPath)) {
        return this.logger.warn(`找不到页面 ${name} 依赖的自定义组件：${compScriptPath}`)
      }

      const nativeCompMeta: NativeCompMeta = {
        name: getComponentName(this, compScriptPath),
        scriptPath: compScriptPath,
        configPath,
        config: readConfig(configPath) || {},
        templatePath,
        cssPath,
        isNative: true
      }

      this.filesConfig[this.getConfigFilePath(nativeCompMeta.name)] = {
        path: configPath,
        content: nativeCompMeta.config
      }
      this.nativeComponents.set(compScriptPath, nativeCompMeta)
      this.rollupCtx?.addWatchFile(nativeCompMeta.configPath)

      if (!componentConfig.thirdPartyComponents.has(compName) && !meta.isNative) {
        componentConfig.thirdPartyComponents.set(compName, new Set())
      }

      this.collectNativeComponents(nativeCompMeta)
    })
  }

  getCommonChunks () {
    const { commonChunks } = this.taroConfig
    const defaultCommonChunks = ['runtime', 'vendors', 'taro', 'common']
    let customCommonChunks: string[] = defaultCommonChunks
    if (isFunction(commonChunks)) {
      customCommonChunks = commonChunks(defaultCommonChunks.concat()) || defaultCommonChunks
    } else if (isArray(commonChunks) && commonChunks.length) {
      customCommonChunks = commonChunks
    }
    return customCommonChunks
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

  getScriptPath (filePath: string) {
    return this.getTargetFilePath(filePath, this.fileType.script)
  }

  getTemplatePath (filePath: string) {
    return this.getTargetFilePath(filePath, this.fileType.templ)
  }

  getStylePath (filePath: string) {
    return this.getTargetFilePath(filePath, this.fileType.style)
  }

  getConfigPath (filePath: string) {
    return this.getTargetFilePath(filePath, this.fileType.config)
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
