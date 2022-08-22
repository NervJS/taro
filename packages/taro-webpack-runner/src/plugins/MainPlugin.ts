import {
  FRAMEWORK_MAP,
  isEmptyObject,
  readConfig,
  resolveMainFilePath,
  SCRIPT_EXT
} from '@tarojs/helper'
import { AppConfig } from '@tarojs/taro'
import { defaults } from 'lodash'
import * as path from 'path'

const PLUGIN_NAME = 'MainPlugin'

interface IMainPluginOptions {
  sourceDir: string
  outputDir: string
  routerConfig: any
  entryFileName: string
  framework: FRAMEWORK_MAP
  frameworkExts: string[]
  useHtmlComponents: boolean
  deviceRatio: any
  designWidth: number
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
      deviceRatio: {},
      designWidth: 750
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
        const { framework, entryFileName, sourceDir, designWidth, deviceRatio, loaderMeta } = this.options
        const { dir, name } = path.parse(module.resource)
        if (path.join(dir, name) === this.appEntry) {
          module.loaders.push({
            loader: '@tarojs/taro-loader/lib/h5',
            options: {
              framework,
              loaderMeta,
              entryFileName,
              sourceDir,
              filename: entryFileName,
              pages: this.pagesConfigList,
              useHtmlComponents: this.options.useHtmlComponents,
              config: {
                router: this.options.routerConfig,
                ...this.appConfig
              },
              pxTransformConfig: {
                designWidth,
                deviceRatio
              }
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
    const appEntryPath = getEntryPath(entry)
    return appEntryPath
  }

  run () {
    this.getAppConfig()
    this.getPages()
    this.getPagesConfigList()
  }

  getPages () {
    const appPages = this.appConfig.pages
    if (!appPages || !appPages.length) {
      throw new Error('全局配置缺少 pages 字段，请检查！')
    }
    const { frameworkExts } = this.options

    this.pages = new Set([
      ...appPages.map(item => ({
        name: item,
        path: resolveMainFilePath(path.join(this.options.sourceDir, item), frameworkExts)
      }))
    ])
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
      const pageConfigPath = this.getConfigFilePath(path)
      this.pagesConfigList.set(name, pageConfigPath)
    })
  }

  getAppConfig () {
    const appConfigPath = this.getConfigFilePath(this.appEntry)
    const appConfig = readConfig(appConfigPath)
    if (isEmptyObject(appConfig)) {
      throw new Error('缺少 app 全局配置，请检查！')
    }
    this.appConfig = appConfig
  }

  getConfigFilePath (filePath) {
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }
}
