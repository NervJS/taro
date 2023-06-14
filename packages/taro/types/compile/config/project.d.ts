import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import type { Compiler } from '../compiler'
import type { IModifyWebpackChain } from '../hooks'
import type { ICopyOptions, IOption, ISassOptions, TogglableOptions } from "./util"
import type { IH5Config } from './h5'
import type { IMiniAppConfig } from './mini'

export type PluginItem = string | [string, object]

interface ICache {
  enable?: boolean
  buildDependencies?: Record<string, any>
  name?: string
}

interface ILogger {
  quiet: boolean
  stats: boolean
}

export interface IProjectBaseConfig {
  isWatch?: boolean
  port?: number
  projectName?: string
  date?: string
  designWidth?: number | ((size?: string | number) => number)
  deviceRatio?: TaroGeneral.TDeviceRatio
  watcher?: any[]
  sourceRoot?: string
  outputRoot?: string
  env?: IOption
  alias?: IOption
  defineConstants?: IOption
  copy?: ICopyOptions
  jsMinimizer?: 'terser' | 'esbuild'
  cssMinimizer?: 'csso' | 'esbuild' | 'parcelCss'
  csso?: TogglableOptions
  terser?: TogglableOptions
  esbuild?: Record<'minify', TogglableOptions>
  uglify?: TogglableOptions
  sass?: ISassOptions
  plugins?: PluginItem[]
  presets?: PluginItem[]
  baseLevel?: number
  framework?: string
  frameworkExts?: string[]
  compiler?: Compiler
  cache?: ICache
  logger?: ILogger
  enableSourceMap?: boolean
  /**
   * 编译开始
   */
  onBuildStart?: (...args: any[]) => Promise<any>
  /**
   * 编译完成（启动项目后首次编译结束后会触发一次）
   */
  onBuildComplete?: (...args: any[]) => Promise<any>
  /**
   * 编译结束（保存代码每次编译结束后都会触发）
   */
  onBuildFinish?: (res: { error, stats, isWatch }) => Promise<any>
  /**
   * 修改编译过程中的页面组件配置
   */
  onCompilerMake?: (compilation: Webpack.Compilation, compiler: Webpack.Compiler, plugin: any) => Promise<any>
  onWebpackChainReady?: (webpackChain: Chain) => Promise<any>
  /**
   * 编译中修改 webpack 配置，在这个钩子中，你可以对 webpackChain 作出想要的调整，等同于配置 [`webpackChain`](./config-detail#miniwebpackchain)
   */
  modifyWebpackChain?: (chain: Chain, webpack: typeof Webpack, data: IModifyWebpackChain) => Promise<any>
  /**
   * 修改编译过程中的页面组件配置
   */
  modifyMiniConfigs?: (configMap: any) => Promise<any>
  /**
   * 修改编译后的结果
   */
  modifyBuildAssets?: (assets: any, miniPlugin?: any) => Promise<any>
}

export interface IProjectConfig extends IProjectBaseConfig {
  ui?: {
    extraWatchFiles?: any[]
  }
  mini?: IMiniAppConfig
  h5?: IH5Config
  rn?: IH5Config
  [key: string]: any
}
