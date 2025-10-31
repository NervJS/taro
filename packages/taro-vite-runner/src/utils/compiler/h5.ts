import path from 'node:path'

import {
  fs,
  readConfig,
  recursiveMerge,
  REG_FONT,
  REG_IMAGE,
  REG_MEDIA,
  resolveMainFilePath,
  resolveScriptPath
} from '@tarojs/helper'

import defaultConfig from '../../defaultConfig/defaultConfig.h5'
import { CompilerContext } from './base'

import type { PageConfig } from '@tarojs/taro'
import type { ViteH5BuildConfig, ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'

export class TaroCompilerContext extends CompilerContext<ViteH5BuildConfig> implements ViteH5CompilerContext {
  routerMeta: {
    routerCreator: string
    getRoutesConfig: (pageName?: string) => string
  }

  browserslist: string[]

  constructor (appPath: string, taroConfig: ViteH5BuildConfig) {
    super(appPath, taroConfig)
    this.app = this.getApp()
    this.pages = this.getPages()
    this.browserslist = this.getBrowserslist()
  }

  processConfig () {
    const staticDirectory = this.rawTaroConfig.staticDirectory || defaultConfig.staticDirectory as string
    defaultConfig.imageUrlLoaderOption!.name =
      (filename: string) => path.join(staticDirectory, 'images', path.basename(filename))
    defaultConfig.fontUrlLoaderOption!.name =
      (filename: string) => path.join(staticDirectory, 'fonts', path.basename(filename))
    defaultConfig.mediaUrlLoaderOption!.name =
      (filename: string) => path.join(staticDirectory, 'media', path.basename(filename))
    defaultConfig.output!.assetFileNames = ({ name }) => {
      if (!name) return '[ext]/[name].[hash][extname]'
      if (REG_IMAGE.test(name)) return `${staticDirectory}/images/${name}`
      if (REG_MEDIA.test(name)) return `${staticDirectory}/media/${name}`
      if (REG_FONT.test(name)) return `${staticDirectory}/fonts/${name}`
      return '[ext]/[name].[hash][extname]'
    }
    this.taroConfig = recursiveMerge({}, defaultConfig, this.rawTaroConfig)
  }

  getAppScriptPath (): string {
    const entry = this.taroConfig.entry.app[0].replace(/\.config$/, '')
    return resolveScriptPath(entry)
  }

  compilePage = (pageName: string) => {
    const { sourceDir, frameworkExts } = this

    const scriptPath = resolveMainFilePath(path.join(sourceDir, pageName), frameworkExts)
    const configPath = this.getConfigFilePath(scriptPath)
    const config: PageConfig = readConfig(configPath, this.taroConfig) || {}

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

  getBrowserslist () {
    const packageJsonPath = path.join(this.cwd, 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      this.logger.error('缺少项目配置 package.json 文件，请检查是否是在taro项目中运行')
      process.exit(1)
    }
    let projectConfigString
    try {
      projectConfigString = fs.readFileSync(packageJsonPath, { encoding: 'utf-8' })
    } catch (error) {
      this.logger.error('解析项目配置文件 package.json 出错')
      this.logger.error(error)
      process.exit(1)
    }

    const projectConfig = JSON.parse(projectConfigString) || {}
    return projectConfig?.browserslist || ['last 3 versions', 'Android >= 4.1', 'ios >= 8']
  }
}
