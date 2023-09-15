import {
  readConfig,
  resolveMainFilePath,
  resolveScriptPath,
} from '@tarojs/helper'
import path from 'path'

import { Compiler } from './base'

import type { PageConfig } from '@tarojs/taro'
import type { H5BuildConfig } from '../types'

export class TaroCompiler extends Compiler<H5BuildConfig> {
  pageName?: string

  constructor (appPath: string, taroConfig: H5BuildConfig) {
    super(appPath, taroConfig)

    this.app = this.getApp()
    this.pages = this.getPages()
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
    this.rollupCtx?.addWatchFile(pageMeta.configPath)

    return pageMeta
  }

  setPageName (pageNmae: string): void {
    this.pageName = pageNmae
  }
}
