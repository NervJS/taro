import path from 'node:path'

import {
  fs,
  isAliasPath,
  readConfig,
  recursiveMerge,
  replaceAliasPath,
  resolveMainFilePath
} from '@tarojs/helper'
import { isArray, isFunction } from '@tarojs/shared'

import defaultConfig from '../../defaultConfig/defaultConfig.mini'
import { getComponentName } from '../../utils'
import { componentConfig } from '../../utils/component'
import { CompilerContext } from './base'

import type { PageConfig } from '@tarojs/taro'
import type {
  ViteAppMeta,
  ViteFileType,
  ViteMiniBuildConfig,
  ViteMiniCompilerContext,
  ViteNativeCompMeta,
  VitePageMeta
} from '@tarojs/taro/types/compile/viteCompilerContext'

export class TaroCompilerContext extends CompilerContext<ViteMiniBuildConfig> implements ViteMiniCompilerContext {
  fileType: ViteFileType
  commonChunks: string[]
  nativeComponents = new Map<string, ViteNativeCompMeta>()

  constructor (appPath: string, taroConfig: ViteMiniBuildConfig) {
    super(appPath, taroConfig)

    this.fileType = this.taroConfig.fileType
    this.commonChunks = this.getCommonChunks()
    this.app = this.getApp()
    this.collectNativeComponents(this.app)
    this.pages = this.getPages()
  }

  processConfig () {
    this.taroConfig = recursiveMerge({}, defaultConfig, this.rawTaroConfig)
  }

  getCommonChunks () {
    const { commonChunks } = this.taroConfig
    const defaultCommonChunks = ['runtime', 'vendors', 'taro', 'common']
    let customCommonChunks: string[] = defaultCommonChunks
    if (isFunction(commonChunks)) {
      customCommonChunks = (commonChunks as ((commonChunks: string[]) => string[]))(defaultCommonChunks.concat()) || defaultCommonChunks
    } else if (isArray(commonChunks) && commonChunks!.length) {
      customCommonChunks = commonChunks as string []
    }
    return customCommonChunks
  }

  compilePage = (pageName: string): VitePageMeta => {
    const { sourceDir, frameworkExts } = this

    const scriptPath = resolveMainFilePath(path.join(sourceDir, pageName), frameworkExts)
    const templatePath = this.getTemplatePath(scriptPath)
    const isNative = this.isNativePageORComponent(templatePath)
    const configPath = isNative
      ? this.getConfigPath(scriptPath)
      : this.getConfigFilePath(scriptPath)
    const config: PageConfig = readConfig(configPath, this.taroConfig) || {}

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
    this.configFileList.push(pageMeta.configPath)

    return pageMeta
  }

  collectNativeComponents (meta: ViteAppMeta | VitePageMeta | ViteNativeCompMeta) {
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

      const nativeCompMeta: ViteNativeCompMeta = {
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
      this.configFileList.push(nativeCompMeta.configPath)
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
