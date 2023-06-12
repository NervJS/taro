import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import { type Input } from 'postcss'
import type { Compiler } from '../compiler'
import type { IModifyWebpackChain } from '../hooks'
import type { ICopyOptions, IOption, ISassOptions, TogglableOptions } from './util'
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
  /** 项目名称 */
  projectName?: string

  /** 项目创建日期 */
  date?: string

  /** 设计稿尺寸 */
  designWidth?: number | ((size?: string | number | Input) => number)

  /** 设计稿尺寸换算规则 */
  deviceRatio?: TaroGeneral.TDeviceRatio

  watcher?: any[]

  /** 源码存放目录 (默认值：'src') */
  sourceRoot?: string

  /** 代码编译后的生产目录 (默认值：'dist') */
  outputRoot?: string

  /** 用于设置环境变量 (除了NODE_ENV以外，其他环境变量建议在根目录下的.env文件中) */
  env?: IOption

  /** 用于配置目录别名，从而方便书写代码引用路径 */
  alias?: IOption

  /** 用于配置一些全局变量供代码中进行使用（建议放在根目录下的.env文件中） */
  defineConstants?: IOption

  /** 用于把文件从源码目录直接拷贝到编译后的生产目录 */
  copy?: ICopyOptions

  /** 配置 JS 压缩工具 (默认 terser) */
  jsMinimizer?: 'terser' | 'esbuild'

  /** 配置 CSS 压缩工具 (默认 csso) */
  cssMinimizer?: 'csso' | 'esbuild' | 'parcelCss'

  /** 配置 csso 工具以压缩 CSS 代码 */
  csso?: TogglableOptions

  /** 配置 terser 工具以压缩 JS 代码 */
  terser?: TogglableOptions

  esbuild?: Record<'minify', TogglableOptions>

  uglify?: TogglableOptions

  /** 用于控制对 scss 代码的编译行为，默认使用 dart-sass，具体配置可以参考 https://www.npmjs.com/package/sass */
  sass?: ISassOptions

  /** 配置 Taro 插件 */
  plugins?: PluginItem[]

  /** 一个 preset 是一系列 Taro 插件的集合，配置语法同 plugins */
  presets?: PluginItem[]

  /** 模板循环次数 */
  baseLevel?: number

  /** 使用的开发框架。可选值：react、preact、nerv、vue、vue3 */
  framework?: 'react' | 'preact' | 'nerv' | 'vue' | 'vue3'
  frameworkExts?: string[]

  /** 使用的编译工具。可选值：webpack4、webpack5 */
  compiler?: Compiler

  /** Webpack5 持久化缓存配置。具体配置请参考 [WebpackConfig.cache](https://webpack.js.org/configuration/cache/#cache) */
  cache?: ICache

  /** 控制 Taro 编译日志的输出方式 */
  logger?: ILogger

  /** 用于控制是否生成 js、css 对应的 sourceMap */
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
  onBuildFinish?: (res: { error; stats; isWatch }) => Promise<any>

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
  /** 专属于小程序的配置 */
  mini?: IMiniAppConfig

  /** 专属于 H5 的配置 */
  h5?: IH5Config

  /** 专属于 RN 的配置 */
  rn?: IH5Config

  [key: string]: any
}
