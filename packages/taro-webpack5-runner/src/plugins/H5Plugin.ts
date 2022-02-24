import { AppConfig } from '@tarojs/taro'
import { FRAMEWORK_MAP } from '@tarojs/helper'
import { defaults } from 'lodash'
import * as path from 'path'
import * as webpack from 'webpack'

import H5AppInstance from '../utils/H5AppInstance'

const PLUGIN_NAME = 'H5Plugin'

interface IH5PluginOptions {
  sourceDir: string
  routerConfig: any
  entryFileName: string
  framework: FRAMEWORK_MAP
  useHtmlComponents: boolean
  deviceRatio: any
  designWidth: number
  loaderMeta?: Record<string, string>
}

export default class H5Plugin {
  options: IH5PluginOptions
  appEntry: string
  appConfig: AppConfig
  pagesConfigList = new Map<string, string>()
  pages = new Set<{name: string, path: string}>()
  inst: H5AppInstance

  constructor (options = {}) {
    this.options = defaults(options || {}, {
      sourceDir: '',
      routerConfig: {},
      entryFileName: 'app',
      framework: FRAMEWORK_MAP.NERV,
      useHtmlComponents: false,
      deviceRatio: {},
      designWidth: 750
    })
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
    const { entry } = compiler.options
    this.inst = new H5AppInstance(entry, this.options)
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
        const { framework, entryFileName, sourceDir, designWidth, deviceRatio, loaderMeta, routerConfig } = this.options
        const { dir, name } = path.parse(module.resource)
        const configSuffix = '.config'
        if (!name.includes(configSuffix)) return

        const filePath = path.join(dir, name)
        const pageName = filePath.replace(sourceDir + '/', '').replace(configSuffix, '')
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
              sourceDir,
              filename: name.replace(configSuffix, ''),
              pages: this.pagesConfigList,
              useHtmlComponents: this.options.useHtmlComponents,
              config: {
                router: this.options.routerConfig,
                ...this.inst.appConfig
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

  run () {
    delete this.inst.__appConfig
    delete this.inst.__pages
    delete this.inst.__pagesConfigList
  }
}
