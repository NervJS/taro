import {
  FRAMEWORK_MAP,
  SCRIPT_EXT
} from '@tarojs/helper'
import { defaults } from 'lodash'
import * as path from 'path'

import { AppHelper } from '../utils'
import TaroComponentsExportsPlugin from './TaroComponentsExportsPlugin'

import type { Func } from '@tarojs/taro/types/compile'

const PLUGIN_NAME = 'TaroH5Plugin'

interface ITaroH5PluginOptions {
  // appPath: string
  sourceDir: string
  routerConfig: any
  entryFileName: string
  framework: FRAMEWORK_MAP
  frameworkExts: string[]
  runtimePath: string[]
  pxTransformConfig: {
    baseFontSize: number
    deviceRatio: any
    designWidth: number
    minRootSize: number
    unitPrecision: number
    targetUnit: string
  }
  // prebundle?: boolean
  isBuildNativeComp?: boolean
  loaderMeta?: Record<string, string>

  onCompilerMake?: Func
  onParseCreateElement?: Func
}

export default class TaroH5Plugin {
  options: ITaroH5PluginOptions
  appHelper: AppHelper

  constructor (options = {}) {
    this.options = defaults(options || {}, {
      appPath: '',
      sourceDir: '',
      entryFileName: 'app',
      routerConfig: {},
      framework: FRAMEWORK_MAP.NERV,
      frameworkExts: SCRIPT_EXT,
      runtimePath: [],
      pxTransformConfig: {
        baseFontSize: 20,
        deviceRatio: {},
        designWidth: 750,
        minRootSize: 20,
        unitPrecision: 5,
        targetUnit: 'rem'
      }
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

  apply (compiler) {
    const { entry } = compiler.options
    this.appHelper = new AppHelper(entry, this.options)
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

    compiler.hooks.make.tapAsync(PLUGIN_NAME, this.tryAsync(async compilation => {
      await this.options.onCompilerMake?.(compilation, compiler, this)
    }))

    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compilation.hooks.normalModuleLoader.tap(PLUGIN_NAME, (_loaderContext, module: any) => {
        const { entryFileName, sourceDir, routerConfig, isBuildNativeComp } = this.options
        const { dir, name } = path.parse(module.resource)
        const suffixRgx = /\.(boot|config)/
        if (!suffixRgx.test(name)) return

        const filePath = path.join(dir, name)
        const pageName = filePath.replace(sourceDir + (process.platform === 'win32' ? '\\' : '/'), '').replace(suffixRgx, '')
        const routerMode = routerConfig?.mode || 'hash'
        const isMultiRouterMode = routerMode === 'multi'
        const isApp = !isMultiRouterMode && pageName === entryFileName
        if (
          isBuildNativeComp
            ? this.appHelper.compsConfigList.has(pageName)
            : (isApp || this.appHelper.pagesConfigList.has(pageName.split(path.sep).join('/')))
        ) {
          module.loaders.push({
            loader: require.resolve('@tarojs/taro-loader/lib/h5'),
            options: {
              /** paths */
              entryFileName,
              filename: name.replace(suffixRgx, ''),
              runtimePath: this.options.runtimePath,
              sourceDir,
              /** config & message */
              config: {
                router: routerConfig,
                ...this.appHelper.appConfig
              },
              framework: this.options.framework,
              loaderMeta: this.options.loaderMeta,
              pages: this.appHelper.pagesConfigList,
              pxTransformConfig: this.options.pxTransformConfig,
              /** building mode */
              isBuildNativeComp
            }
          })
        }
      })
    })

    new TaroComponentsExportsPlugin(this.options).apply(compiler)
  }

  run () {
    this.appHelper.clear()
  }
}
