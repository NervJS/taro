import {
  FRAMEWORK_MAP,
  resolveMainFilePath,
  SCRIPT_EXT
} from '@tarojs/helper'
import { AppConfig } from '@tarojs/taro'
import { defaults } from 'lodash'
import * as path from 'path'

import { getAppConfig, getConfigFilePath, getPages } from '../util'

const PLUGIN_NAME = 'MainPlugin'

interface IMainPluginOptions {
  sourceDir: string
  outputDir: string
  routerConfig: any
  entryFileName: string
  framework: FRAMEWORK_MAP
  frameworkExts: string[]
  useHtmlComponents: boolean
  pxTransformConfig: {
    baseFontSize: number
    deviceRatio: any
    designWidth: number
    minRootSize: number
  }
  loaderMeta?: Record<string, string>
}

export default class MainPlugin {
  options: IMainPluginOptions
  appEntry: string
  appConfig: AppConfig
  sourceDir: string
  outputDir: string
  pagesConfigList = new Map<string, string>()
  pages = new Set<{name: string, path: string}>()

  constructor (options = {}) {
    this.options = defaults(options || {}, {
      sourceDir: '',
      outputDir: '',
      entryFileName: 'app',
      routerConfig: {},
      framework: FRAMEWORK_MAP.NERV,
      frameworkExts: SCRIPT_EXT,
      useHtmlComponents: false,
      pxTransformConfig: {
        baseFontSize: 20,
        deviceRatio: {},
        designWidth: 750,
        minRootSize: 20
      }
    })
    this.sourceDir = this.options.sourceDir
    this.outputDir = this.options.outputDir
  }

  tryAsync = fn => async (arg, callback) => {
    try {
      await fn(arg)
      callback()
    } catch (err) {
      callback(err)
    }
  }

  apply (compiler) {
    this.appEntry = this.getAppEntry(compiler)
    compiler.hooks.run.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(() => {
        this.run()
      })
    )
    compiler.hooks.watchRun.tapAsync(
      PLUGIN_NAME,
      this.tryAsync(() => {
        this.run()
      })
    )

    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.normalModuleLoader.tap(PLUGIN_NAME, (_loaderContext, module: any) => {
        const { framework, entryFileName, sourceDir, pxTransformConfig, loaderMeta, routerConfig } = this.options
        const { dir, name } = path.parse(module.resource)
        const suffixRgx = /\.(boot|config)/
        if (!suffixRgx.test(name)) return

        const filePath = path.join(dir, name).replace(sourceDir + (process.platform === 'win32' ? '\\' : '/'), '')
        const pageName = filePath.replace(suffixRgx, '')
        const routerMode = routerConfig?.mode || 'hash'
        const isMultiRouterMode = routerMode === 'multi'
        const isApp = !isMultiRouterMode && pageName === entryFileName
        if (isApp || this.pagesConfigList.has(pageName)) {
          module.loaders.push({
            loader: '@tarojs/taro-loader/lib/h5',
            options: {
              config: {
                router: this.options.routerConfig,
                ...this.appConfig
              },
              entryFileName,
              filename: name.replace(suffixRgx, ''),
              framework,
              loaderMeta,
              pages: this.pagesConfigList,
              pxTransformConfig,
              sourceDir,
              useHtmlComponents: this.options.useHtmlComponents
            }
          })
        }
      })
    })
  }

  getAppEntry (compiler) {
    const { entry } = compiler.options
    const { entryFileName } = this.options
    function getEntryPath (entry) {
      const app = entry[entryFileName]
      if (Array.isArray(app)) {
        return app.filter(item => path.basename(item, path.extname(item)) === entryFileName)[0]
      }
      return app
    }
    return getEntryPath(entry)
  }

  run () {
    this.getAppConfig()
    this.getPages()
    this.getPagesConfigList()
  }

  getPages () {
    const { frameworkExts, sourceDir } = this.options

    this.pages = getPages(this.appConfig.pages, sourceDir, frameworkExts)
    this.getSubPackages()
  }

  getSubPackages () {
    const appConfig = this.appConfig
    const subPackages = appConfig.subPackages || appConfig.subpackages
    const { frameworkExts } = this.options
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
              const pagePath = resolveMainFilePath(path.join(this.options.sourceDir, pageItem), frameworkExts)
              this.pages.add({
                name: pageItem,
                path: pagePath
              })
              // eslint-disable-next-line no-unused-expressions
              this.appConfig.pages?.push(pageItem)
            }
          })
        }
      })
    }
  }

  getPagesConfigList () {
    const pages = this.pages
    pages.forEach(({ name, path }) => {
      const pageConfigPath = getConfigFilePath(path)
      this.pagesConfigList.set(name, pageConfigPath)
    })
  }

  getAppConfig () {
    this.appConfig = getAppConfig(this.appEntry)
  }
}
