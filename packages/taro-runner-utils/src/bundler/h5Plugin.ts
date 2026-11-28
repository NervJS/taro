import path from 'node:path'

import { FRAMEWORK_MAP, SCRIPT_EXT } from '@tarojs/helper'
import { defaults } from 'lodash'

import AppHelper from './app'

import type { Func } from '@tarojs/taro/types/compile'

export interface ITaroH5PluginOptions {
  appPath: string
  sourceDir: string
  routerConfig: any
  entryFileName: string
  framework: FRAMEWORK_MAP
  frameworkExts: string[]
  runtimePath: string[]
  alias: Record<string, any>
  defineConstants: Record<string, any>
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
  noInjectGlobalStyle?: boolean

  modifyAppConfig?: Func
  onCompilerMake?: Func
  onParseCreateElement?: Func
}

export function normalizeH5PluginOptions (options: Record<string, any> = {}): ITaroH5PluginOptions {
  return defaults(options || {}, {
    appPath: '',
    sourceDir: '',
    routerConfig: {},
    entryFileName: 'app',
    framework: FRAMEWORK_MAP.REACT,
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
    prebundle: false,
    alias: {},
    defineConstants: {},
  })
}

export function resolveH5EntryLoaderConfig (
  resourcePath: string,
  appHelper: AppHelper,
  options: ITaroH5PluginOptions,
  resolveLoaderPath: (id: string) => string
): { loader: string, options: Record<string, any> } | null {
  if (!resourcePath) {
    return null
  }
  const { entryFileName, sourceDir, prebundle, routerConfig, isBuildNativeComp } = options
  const { dir, name } = path.parse(resourcePath)
  const suffixRgx = /\.(boot|config)/
  if (!suffixRgx.test(name)) {
    return null
  }

  const filePath = path.join(dir, name)
  const pageName = filePath.replace(sourceDir + (process.platform === 'win32' ? '\\' : '/'), '').replace(suffixRgx, '')
  const routerMode = routerConfig?.mode || 'hash'
  const isMultiRouterMode = routerMode === 'multi'
  const isApp = !isMultiRouterMode && pageName === entryFileName
  const bootstrap = Boolean(prebundle && !/\.boot$/.test(name))

  const matched = isBuildNativeComp
    ? appHelper.compsConfigList.has(pageName)
    : (isApp || appHelper.pagesConfigList.has(pageName.split(path.sep).join('/')))

  if (!matched) {
    return null
  }

  // 把 Map 转换为数组后传递，避免 thread-loader 传递 Map 时变为空对象的问题，fix #13430
  const pagesConfigList: [string, string][] = []
  for (const item of appHelper.pagesConfigList.entries()) {
    pagesConfigList.push(item)
  }

  return {
    loader: resolveLoaderPath('@tarojs/taro-loader/lib/h5'),
    options: {
      entryFileName,
      filename: name.replace(suffixRgx, ''),
      runtimePath: options.runtimePath,
      sourceDir,
      config: {
        router: routerConfig,
        ...appHelper.appConfig
      },
      framework: options.framework,
      loaderMeta: options.loaderMeta,
      pages: pagesConfigList,
      pxTransformConfig: options.pxTransformConfig,
      alias: options.alias,
      defineConstants: options.defineConstants,
      noInjectGlobalStyle: options.noInjectGlobalStyle,
      bootstrap,
      isBuildNativeComp
    }
  }
}

export abstract class BaseH5Plugin {
  options: ITaroH5PluginOptions
  appHelper: AppHelper

  constructor (options: Record<string, any> = {}) {
    this.options = normalizeH5PluginOptions(options)
  }

  tryAsync<T = any> (fn: (target?: T) => Promise<void> | void) {
    return async (arg: T, callback: any) => {
      try {
        await fn(arg)
        typeof callback === 'function' && callback()
      } catch {
        typeof callback === 'function' && callback()
      }
    }
  }

  protected onAfterRun (): void {}

  protected abstract applyBundlerHooks (compiler: any): void

  apply (compiler: any) {
    const PLUGIN_NAME = 'TaroH5Plugin'
    const { entry } = compiler.options
    this.appHelper = new AppHelper(entry as Record<string, any>, this.options)

    const handleRun = this.tryAsync(() => {
      this.run()
      this.onAfterRun()
    })
    compiler.hooks.run.tapAsync(PLUGIN_NAME, handleRun)
    compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, handleRun)

    compiler.hooks.make.tapAsync(PLUGIN_NAME, this.tryAsync(async compilation => {
      await this.options.onCompilerMake?.(compilation, compiler, this)
    }))

    this.applyBundlerHooks(compiler)
  }

  run () {
    this.appHelper.clear()
  }
}
