import { FRAMEWORK_MAP, SCRIPT_EXT } from '@tarojs/helper'
import { VirtualModule } from '@tarojs/webpack5-prebundle/dist/h5'
import { defaults } from 'lodash'
import path from 'path'

import H5AppInstance from '../utils/H5AppInstance'

import type { AppConfig } from '@tarojs/taro'
import type { Compiler, LoaderContext, NormalModule } from 'webpack'

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
  }
  prebundle?: boolean
  loaderMeta?: Record<string, string>
}

export default class TaroH5Plugin {
  options: ITaroH5PluginOptions
  appEntry: string
  appConfig: AppConfig
  pagesConfigList = new Map<string, string>()
  pages = new Set<{name: string, path: string}>()
  inst: H5AppInstance

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
        minRootSize: 20
      },
      prebundle: false
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

  apply (compiler: Compiler) {
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
      compiler.webpack.NormalModule.getCompilationHooks(compilation).loader.tap(PLUGIN_NAME, (_loaderContext: LoaderContext<any>, module: NormalModule) => {
        const { framework, entryFileName, appPath, sourceDir, pxTransformConfig, loaderMeta, prebundle, routerConfig } = this.options
        const { dir, name } = path.parse(module.resource)
        const suffixRgx = /\.(boot|config)/
        if (!suffixRgx.test(name)) return

        const filePath = path.join(dir, name)
        const pageName = filePath.replace(sourceDir + (process.platform === 'win32' ? '\\' : '/'), '').replace(suffixRgx, '')
        const routerMode = routerConfig?.mode || 'hash'
        const isMultiRouterMode = routerMode === 'multi'
        const isApp = !isMultiRouterMode && pageName === entryFileName
        const bootstrap = prebundle && !/\.boot$/.test(name)
        if (isApp || this.inst.pagesConfigList.has(pageName)) {
          if (bootstrap) {
            const bootPath = path.relative(appPath, path.join(sourceDir, `${isMultiRouterMode ? pageName : entryFileName}.boot.js`))
            VirtualModule.writeModule(bootPath, '/** bootstrap application code */')
          }

          // 把 Map 转换为数组后传递，避免 thread-loader 传递 Map 时变为空对象的问题，fix #13430
          const pagesConfigList: [string, string][] = []
          for (const item of this.inst.pagesConfigList.entries()) {
            pagesConfigList.push(item)
          }

          module.loaders.push({
            loader: '@tarojs/taro-loader/lib/h5',
            options: {
              bootstrap,
              config: {
                router: this.options.routerConfig,
                ...this.inst.appConfig
              },
              entryFileName,
              filename: name.replace(suffixRgx, ''),
              framework,
              runtimePath: this.options.runtimePath,
              loaderMeta,
              pages: pagesConfigList,
              pxTransformConfig,
              sourceDir
            },
            ident: null,
            type: null
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
