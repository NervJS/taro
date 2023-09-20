import {
  readConfig,
  recursiveMerge,
  resolveMainFilePath,
  resolveScriptPath
} from '@tarojs/helper'
import { ViteH5BuildConfig, ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import path from 'path'

import defaultConifg from '../../defaultConfig/defaultConfig.h5'
import { CompilerContext } from './base'

import type { PageConfig } from '@tarojs/taro'

export class TaroCompilerContext extends CompilerContext<ViteH5BuildConfig> implements ViteH5CompilerContext {
  routerMeta: {
    routerCreator: string
    getRoutesConfig: (pageName?: string) => string
  }

  constructor (appPath: string, taroConfig: ViteH5BuildConfig) {
    super(appPath, taroConfig)
    this.app = this.getApp()
    this.pages = this.getPages()
  }

  processConfig () {
    const staticDirectory = this.rawTaroConfig.staticDirectory || defaultConifg.staticDirectory
    defaultConifg.imageUrlLoaderOption!.name = 
      (filename: string) => filename.replace(this.sourceDir + '/', `${staticDirectory}/images/`)
    defaultConifg.fontUrlLoaderOption!.name = 
      (filename: string) => filename.replace(this.sourceDir + '/', `${staticDirectory}/fonts/`)
    defaultConifg.mediaUrlLoaderOption!.name = 
      (filename: string) => filename.replace(this.sourceDir + '/', `${staticDirectory}/media/`)
    
    this.taroConfig = recursiveMerge({}, defaultConifg, this.rawTaroConfig)
  }

  getAppScriptPath (): string {
    const entry = this.taroConfig.entry.app[0].replace(/\.config$/, '')
    return resolveScriptPath(entry)
  }

  compilePage = (pageName: string) => {
    const { sourceDir, frameworkExts } = this

    const scriptPath = resolveMainFilePath(path.join(sourceDir, pageName), frameworkExts)
    const configPath = this.getConfigFilePath(scriptPath)
    const config: PageConfig = readConfig(configPath) || {}

    const pageMeta = {
      name: pageName,
      scriptPath,
      configPath,
      config,
      isNative: false,
    }

    this.filesConfig[this.getConfigFilePath(pageMeta.name)] = {
      path: configPath,
      content: config
    }

    this.configFileList.push(pageMeta.configPath)
    return pageMeta
  }
}
