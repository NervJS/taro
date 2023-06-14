import { FRAMEWORK_MAP, SCRIPT_EXT } from '@tarojs/helper'
import { VirtualModule } from '@tarojs/webpack5-prebundle/dist/web'
import { defaults } from 'lodash'
import path from 'path'

import AppHelper from '../utils/app'
import TaroComponentsExportsPlugin from './TaroComponentsExportsPlugin'

import type { Func } from '@tarojs/taro/types/compile'
import type { Compilation, Compiler, LoaderContext, NormalModule } from 'webpack'

const PLUGIN_NAME = 'TaroH5Plugin'

interface ITaroH5PluginOptions {
  appPath: string
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

  prebundle?: boolean
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
      routerConfig: {},
      entryFileName: 'app',
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
      },
      prebundle: false
    })
  }

  tryAsync<T extends Compiler | Compilation | void> (fn: (target?: T) => Promise<void> | void) {
    return async (arg: T, callback: any) => {
      try {
        await fn(arg)
        typeof callback === 'function' && callback()
      } catch (err) {
        typeof callback === 'function' && callback()
      }
    }
  }

  apply (compiler: Compiler) {
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

    compiler.hooks.make.tapAsync(PLUGIN_NAME, this.tryAsync<Compilation>(async compilation => {
      await this.options.onCompilerMake?.(compilation, compiler, this)
    }))

    compiler.hooks.compilation.tap(PLUGIN_NAME, compilation => {
      compiler.webpack.NormalModule.getCompilationHooks(compilation).loader.tap(PLUGIN_NAME, (_loaderContext: LoaderContext<any>, module: NormalModule) => {
        const { entryFileName, appPath, sourceDir, prebundle, routerConfig, isBuildNativeComp } = this.options
        const { dir, name } = path.parse(module.resource)
        const suffixRgx = /\.(boot|config)/
        if (!suffixRgx.test(name)) return

        const filePath = path.join(dir, name)
        const pageName = filePath.replace(sourceDir + (process.platform === 'win32' ? '\\' : '/'), '').replace(suffixRgx, '')
        const routerMode = routerConfig?.mode || 'hash'
        const isMultiRouterMode = routerMode === 'multi'
        const isApp = !isMultiRouterMode && pageName === entryFileName
        const bootstrap = prebundle && !/\.boot$/.test(name)
        if (
          isBuildNativeComp
            ? this.appHelper.compsConfigList.has(pageName)
            : (isApp || this.appHelper.pagesConfigList.has(pageName.split(path.sep).join('/')))
        ) {
          if (bootstrap) {
            const bootPath = path.relative(appPath, path.join(sourceDir, `${isMultiRouterMode ? pageName : entryFileName}.boot.js`))
            VirtualModule.writeModule(bootPath, '/** bootstrap application code */')
          }

          // 把 Map 转换为数组后传递，避免 thread-loader 传递 Map 时变为空对象的问题，fix #13430
          const pagesConfigList: [string, string][] = []
          for (const item of this.appHelper.pagesConfigList.entries()) {
            pagesConfigList.push(item)
          }

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
              pages: pagesConfigList,
              pxTransformConfig: this.options.pxTransformConfig,
              /** building mode */
              bootstrap,
              isBuildNativeComp
            },
            ident: null,
            type: null
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
