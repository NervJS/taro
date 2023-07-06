import {
  chalk,
  fs,
  readConfig,
  resolveMainFilePath,
} from '@tarojs/helper'
import { isArray, isFunction } from '@tarojs/shared'
import path from 'path'

import { type PageMeta, Compiler } from './base'

import type { AppConfig, PageConfig } from '@tarojs/taro'
import type { PluginContext } from 'rollup'
import type { HarmonyBuildConfig, IFileType } from '../types'

const defaultFileType = {
  style: '.css',
  config: '.json',
  script: '.ets',
  templ: '.hml'
}

export class TaroCompiler extends Compiler<HarmonyBuildConfig> {
  commonChunks: string[]
  fileType: IFileType
  useETS: boolean
  useJSON5: boolean

  constructor (rollupCtx: PluginContext, appPath: string, taroConfig: HarmonyBuildConfig) {
    super(rollupCtx, appPath, taroConfig)

    this.fileType = taroConfig.fileType || defaultFileType
    this.useETS = taroConfig.useETS !== false
    this.useJSON5 = taroConfig.useJSON5 !== false
    this.commonChunks = this.getCommonChunks()
    this.app = this.getApp()
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

  modifyHarmonyResources(id = '', data: any = {}) {
    const { projectPath, hapName = 'entry' } = this.taroConfig
    const [, key, value] = id.match(/^\$(.+):(.+)$/) || []
    if (!key || !value) {
      return console.warn(chalk.red(`无效的资源 ID：${id}`))
    }
    const isProfile = key === 'profile'
    const dirName = isProfile ? 'src/main/resources/base/profile' : 'src/main/resources/base/element'
    const fileName = `${isProfile ? value : key}.json`
    const configPath = path.join(projectPath, hapName, dirName, fileName)
    const config = fs.readJsonSync(configPath)
    if (isProfile) {
      Object.assign(config, data)
    } else {
      const list = config[key] || []
      const idx = list.findIndex(item => item.name === value)
      if (idx >= 0) {
        list[idx].value = data
      } else {
        list.push({
          name: value,
          value: data,
        })
      }
    }
    fs.writeJsonSync(configPath, config, { spaces: 2 })
  }

  // Note: 修改 harmony Hap 的配置文件，当前仅支持注入路由配置
  modifyHarmonyConfig (config: AppConfig = {}) {
    const { pages = [] } = config
    const { projectPath, hapName = 'entry', name = 'default', designWidth = 750 } = this.taroConfig
    const hapConfigPath = path.join(projectPath, hapName, `src/main/${this.useJSON5 !== false ? 'module.json5' : 'config.json'}`)
    try {
      const config = fs.readJsonSync(hapConfigPath)
      const window = {
        designWidth: (typeof designWidth === 'function' ? designWidth() : designWidth) || 750,
        autoDesignWidth: false
      }
      config.module ||= {}
      if (this.useJSON5 !== false) {
        let pageMetaId = '$profile:main_pages'
        // Stage 模型
        const target = config.module
        target.name = name
        if (target) {
          if (typeof target.pages === 'string') {
            pageMetaId = target.pages
          } else {
            target.pages = pageMetaId
          }
        }
        this.modifyHarmonyResources(pageMetaId, {
          src: pages,
          window,
        })
        /**
         * TOD0: 将 app 其配置为 mainElement 入口
         */
      } else {
        // FA 模型
        config.module.js ||= []
        const jsFAs = config.module.js
        const target = jsFAs.find(item => item.name === name)
        const mode = {
          syntax: this.useETS ? 'ets': 'hml',
          type: 'pageAbility',
        }
        if (target) {
          if (JSON.stringify(target.pages) === JSON.stringify(pages)) return
          target.mode = mode
          target.pages = pages
          target.window = window
        } else {
          jsFAs.push({
            name,
            mode,
            pages,
            window,
          })
        }
      }
      fs.writeJsonSync(hapConfigPath, config, { spaces: 2 })
    } catch (error) {
      console.warn(chalk.red('设置鸿蒙 Hap 配置失败：', error))
    }
  }

  // Note: 更新 oh-package 中项目依赖声明
  modifyHostPackageDep (
    outDir: string,
    hmsDeps: Record<string, string> = {},
  ) {
    const packageJsonFile = path.resolve(outDir, `../../../../../${this.useJSON5 !== false ? 'oh-package.json5' : 'package.json'}`)

    const isExists = fs.pathExistsSync(packageJsonFile)
    if (!isExists) return

    const pkg = fs.readJSONSync(packageJsonFile)
    if (!pkg.dependencies) {
      pkg.dependencies = hmsDeps
    } else {
      for (const hmsDep in hmsDeps) {
        pkg.dependencies[hmsDep] = hmsDeps[hmsDep]
      }
    }
    fs.writeJsonSync(packageJsonFile, pkg, { spaces: 2 })
  }

  /** 工具函数 */
  getScriptPath (filePath: string) {
    return this.getTargetFilePath(filePath, this.fileType.script)
  }

  getStylePath (filePath: string) {
    return this.getTargetFilePath(filePath, this.fileType.style)
  }

  getConfigPath (filePath: string) {
    return this.getTargetFilePath(filePath, this.fileType.config)
  }
}
