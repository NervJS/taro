import * as path from 'path'
import { defaults } from 'lodash'
import { AppConfig } from '@tarojs/taro'
import {
  readConfig,
  resolveMainFilePath,
  isEmptyObject,
  FRAMEWORK_MAP,
  FRAMEWORK_EXT_MAP
} from '@tarojs/helper'
import * as webpack from 'webpack'

const PLUGIN_NAME = 'H5Plugin'

interface IH5PluginOptions {
  sourceDir: string,
  outputDir: string,
  routerConfig: any,
  entryFileName: string,
  framework: FRAMEWORK_MAP,
  useHtmlComponents: boolean,
  deviceRatio: any
  designWidth: number
  loaderMeta?: Record<string, string>
}

export default class H5Plugin {
  options: IH5PluginOptions
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

  apply (compiler: webpack.Compiler) {
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
      webpack.NormalModule.getCompilationHooks(compilation).loader.tap(PLUGIN_NAME, (_loaderContext, module: any) => {
        const { framework, entryFileName, designWidth, deviceRatio, loaderMeta, routerConfig } = this.options
        const { dir, name } = path.parse(module.resource)
        const configSuffix = '.config'
        if (!name.includes(configSuffix)) return

        const filePath = path.join(dir, name)
        const pageName = filePath.replace(this.sourceDir + '/', '').replace(configSuffix, '')
        const routerMode = routerConfig?.mode || 'hash'
        const isMultiRouterMode = routerMode === 'multi'
        const isApp = !isMultiRouterMode && pageName === entryFileName
        if (isApp || this.pagesConfigList.has(pageName)) {
          module.loaders.push({
            loader: '@tarojs/taro-loader/lib/h5',
            options: {
              framework,
              loaderMeta,
              entryFileName,
              sourceDir: this.sourceDir,
              filename: name.replace(configSuffix, ''),
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

  getAppEntry (compiler: webpack.Compiler) {
    const { entry } = compiler.options
    const { entryFileName, sourceDir } = this.options
    const appEntry = entry[entryFileName]
    if (!appEntry) return path.join(sourceDir, entryFileName)
    if (Array.isArray(appEntry)) {
      return appEntry.filter(item => path.basename(item, path.extname(item)) === entryFileName)[0]
    } else if (Array.isArray(appEntry.import)) {
      return appEntry.import.filter(item => path.basename(item, path.extname(item)) === entryFileName)[0]
    }
    return appEntry
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
    const { framework, sourceDir } = this.options

    this.pages = new Set([
      ...appPages.map(item => ({
        name: item,
        path: resolveMainFilePath(path.join(sourceDir, item), FRAMEWORK_EXT_MAP[framework])
      }))
    ])
    this.getSubPackages()
  }

  getSubPackages () {
    const appConfig = this.appConfig
    const subPackages = appConfig.subPackages || appConfig.subpackages
    const { framework } = this.options
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
              const pagePath = resolveMainFilePath(path.join(this.options.sourceDir, pageItem), FRAMEWORK_EXT_MAP[framework])
              this.pages.add({
                name: pageItem,
                path: pagePath
              })
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

  getConfigFilePath (filePath = '') {
    // console.log('filePath: ', filePath)
    return resolveMainFilePath(`${filePath.replace(path.extname(filePath), '')}.config`)
  }

  getTargetFilePath (filePath: string, targetExtname: string) {
    const extname = path.extname(filePath)
    if (extname) return filePath.replace(extname, targetExtname)
    return filePath + targetExtname
  }
}
