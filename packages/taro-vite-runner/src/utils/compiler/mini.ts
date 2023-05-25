import {
  fs,
  isAliasPath,
  readConfig,
  replaceAliasPath,
  resolveMainFilePath,
} from '@tarojs/helper'
import { isArray, isFunction } from '@tarojs/shared'
import path from 'path'

import { componentConfig } from '../../template/component'
import { getComponentName } from '../../utils'
import { Compiler } from './base'

import type { PageConfig } from '@tarojs/taro'
import type { PluginContext } from 'rollup'
import type { MiniBuildConfig } from '../types'
import type { AppMeta, PageMeta } from './base'

interface FileType {
  config: string
  script: string
  templ: string
  style: string
  xs?: string
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

const defaultFileType = {
  style: '.wxss',
  config: '.json',
  script: '.js',
  templ: '.wxml'
}

export class TaroCompiler extends Compiler<MiniBuildConfig> {
  fileType: FileType
  commonChunks: string[]
  nativeComponents = new Map<string, NativeCompMeta>()

  constructor (rollupCtx: PluginContext, appPath: string, taroConfig: MiniBuildConfig) {
    super(rollupCtx, appPath, taroConfig)

    this.fileType = this.taroConfig.fileType || defaultFileType
    this.commonChunks = this.getCommonChunks()
    this.app = this.getApp()
    this.collectNativeComponents(this.app)
    this.pages = this.getPages()
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

  compilePage = (pageName: string): PageMeta => {
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

  /** 工具函数 */

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
}
