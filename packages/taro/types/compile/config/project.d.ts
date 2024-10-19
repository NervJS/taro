import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import { type Input } from 'postcss'
import type { Compiler } from '../compiler'
import type { IModifyChainData } from '../hooks'
import type { ICopyOptions, IOption, ISassOptions, TogglableOptions } from './util'
import type { IH5Config } from './h5'
import type { IMiniAppConfig } from './mini'
import { IRNConfig } from './rn'
import { AppConfig } from '../..'

export type PluginItem<T = object> = string | [string, T] | [string, () => T | Promise<T>]

interface ICache {
  /**
   * 是否开启持久化缓存 (默认值 false)
   * @description ```
   * 值为 false 时：开发模式下 WebpackConfig.cache.type = 'memory'，而生产模式下 WebpackConfig.cache = false;
   * 值为 true 时：开发模式和生产模式下均为 WebpackConfig.cache.type = 'filesystem'
   * ```
   */
  enable?: boolean

  /**
   * 当依赖的文件或该文件的依赖改变时，使缓存失效。
   * @description  详详情请参考 [WebpackConfig.cache.buildDependencies](https://webpack.js.org/configuration/cache/#cachebuilddependencies)。
   */
  buildDependencies?: Record<string, any>

  /**
   * 缓存子目录的名称 (默认值 process.env.NODE_ENV-process.env.TARO_ENV)
   * @description  详情请参考 [WebpackConfig.cache.name](https://webpack.js.org/configuration/cache/#cachename)
   */
  name?: string
}

interface ILogger {
  /** 是否简化输出日志 (默认值 true)*/
  quiet: boolean
  /** 是否输出 Webpack Stats 信息 (默认值 false) */
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

  /**
   * 用于配置`process.env.xxxx`相关的环境变量
   * @deprecated 建议使用根目录下的 .env 文件替代
   * @description 注意：这里的环境变量只能在业务代码中使用，编译时的 node 环境中无法使用
   * @example
   * ```ts
   * // config/index.ts
   * export default defineConfig({
   *    env: {
   *      xxxx: '"测试"'
   *    }
   * })
   *
   * // src/app.ts
   * onShow() {
   *   console.log(process.env.xxxx) // 打印 "测试"
   * }
   * ```
   */
  env?: IOption

  /** 用于配置目录别名，从而方便书写代码引用路径 */
  alias?: IOption

  /**
   * 用于配置一些常量供代码中进行全局替换使用
   * @description 注意：这里的环境变量只能在业务代码中使用，编译时的 node 环境中无法使用
   * @example
   * ```ts
   * // config/index.ts
   * export default defineConfig({
   *    defineConstants: {
   *        __TEST__: JSON.stringify('test')
   *    }
   * })
   *
   * // src/app.ts
   * onShow() {
   *   console.log(__TEST__) // 打印 "test"
   * }
   * ```
   */
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

  modifyAppConfig?: (appConfig: AppConfig) => Promise<any>

  /**
   * 编译中修改 webpack 配置，在这个钩子中，你可以对 webpackChain 作出想要的调整，等同于配置 [`webpackChain`](./config-detail#miniwebpackchain)
   */
  modifyWebpackChain?: (chain: Chain, webpack: typeof Webpack, data: IModifyChainData) => Promise<any>

  /**
   * 修改编译过程中的页面组件配置
   */
  modifyMiniConfigs?: (configMap: any) => Promise<any>

  /**
   * 修改编译后的结果
   */
  modifyBuildAssets?: (assets: any, miniPlugin?: any) => Promise<any>
}

/** 暴露出来给 config/index 使用的配置类型，参考 https://github.com/NervJS/taro-doctor/blob/main/assets/config_schema.json */
export interface IProjectConfig {
  /** 项目名称 */
  projectName?: string

  /** 项目创建日期 */
  date?: string

  /** 设计稿尺寸 */
  designWidth?: number | ((size?: string | number | Input) => number)

  /** 设计稿尺寸换算规则 */
  deviceRatio?: TaroGeneral.TDeviceRatio

  /** 源码存放目录 (默认值：'src') */
  sourceRoot?: string

  /** 代码编译后的生产目录 (默认值：'dist') */
  outputRoot?: string

  /**
   * 用于配置`process.env.xxxx`相关的环境变量
   * @deprecated 建议使用根目录下的 .env 文件替代
   * @description 注意：这里的环境变量只能在业务代码中使用，编译时的 node 环境中无法使用
   * @example
   * ```ts
   * // config/index.ts
   * export default defineConfig({
   *    env: {
   *      xxxx: '"测试"'
   *    }
   * })
   *
   * // src/app.ts
   * onShow() {
   *   console.log(process.env.xxxx) // 打印 "测试"
   * }
   * ```
   */
  env?: IOption

  /** 用于配置目录别名，从而方便书写代码引用路径 */
  alias?: IOption

  /**
   * 用于配置一些常量供代码中进行全局替换使用
   * @description 注意：这里的环境变量只能在业务代码中使用，编译时的 node 环境中无法使用
   * @example
   * ```ts
   * // config/index.ts
   * export default defineConfig({
   *    defineConstants: {
   *        __TEST__: JSON.stringify('test')
   *    }
   * })
   *
   * // src/app.ts
   * onShow() {
   *   console.log(__TEST__) // 打印 "test"
   * }
   * ```
   */
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

  /** 用于控制对 scss 代码的编译行为，默认使用 dart-sass，具体配置可以参考 https://www.npmjs.com/package/sass */
  sass?: ISassOptions

  /** 配置 Taro 插件 */
  plugins?: PluginItem[]

  /** 一个 preset 是一系列 Taro 插件的集合，配置语法同 plugins */
  presets?: PluginItem[]

  /** 使用的开发框架。可选值：react、preact、nerv、vue、vue3 */
  framework?: 'react' | 'preact' | 'nerv' | 'vue' | 'vue3'

  /** 使用的编译工具。可选值：webpack4、webpack5 */
  compiler?: Compiler

  /** Webpack5 持久化缓存配置。具体配置请参考 [WebpackConfig.cache](https://webpack.js.org/configuration/cache/#cache) */
  cache?: ICache

  /** 控制 Taro 编译日志的输出方式 */
  logger?: ILogger

  /** 专属于小程序的配置 */
  mini?: IMiniAppConfig

  /** 专属于 H5 的配置 */
  h5?: IH5Config

  /** 专属于 RN 的配置 */
  rn?: IRNConfig

  [key: string]: any
}
