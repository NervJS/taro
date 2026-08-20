import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import type { IOption, IPostcssOption, IUrlLoaderOption } from './util'
import type { OutputOptions as RollupOutputOptions } from 'rollup'
import type { Compiler, CompilerTypes, CompilerWebpackTypes } from '../compiler'
import type { OutputExt } from './project'

interface Runtime {
  enableInnerHTML?: boolean
  enableSizeAPIs?: boolean
  enableAdjacentHTML?: boolean
  enableTemplateContent?: boolean
  enableCloneNode?: boolean
  enableContains?: boolean
  enableMutationObserver?: boolean
}

/**
 * `mini.sharedRuntimeWebpackChain` 钩子收到的第三个参数：当前运行时核子构建的核心信息。
 * 同步核与异步核各调用一次钩子，`name` 区分。
 */
export interface ISharedRuntimeChainData {
  /** 当前核：'taro-shared-sync'（同步核）| 'async-provider'（异步核），与产物文件名一致 */
  name: string
  /** 产物 emit 目标相对 outputDir 的目录：同步核为 ''（根），异步核为 'shared-async-v1' */
  emitTo: string
  /** 异步核加载路径（require.async 目标），业务 config 的 sharedRuntimeAsyncRequest 覆盖值或默认值 */
  asyncRequest: string
  /** config.mini.sharedRuntimeExtraPackages：随异步核加载的额外共享包 */
  extraPackages: string[]
  /** config.mini.sharedRuntimeSyncExtraPackages：随同步核加载的额外共享包 */
  syncExtraPackages: string[]
  /** 从 runtimePath 自动识别、被作为同步核额外入口的平台插件 runtime（plugin-html 等） */
  missingRuntimes: string[]
  /** 业务项目根目录 */
  appPath: string
  /** 产物输出目录（dist） */
  outputDir: string
  /** 平台全局对象名，如 'wx' */
  globalObject: string
}

export interface IMiniAppConfig<T extends CompilerTypes = CompilerWebpackTypes> {
  /** 用于控制是否生成 js、css 对应的 sourceMap (默认值：watch 模式下为 true，否则为 false) */
  enableSourceMap?: boolean

  /** 默认值：'cheap-module-source-map'， 具体参考[Webpack devtool 配置](https://webpack.js.org/configuration/devtool/#devtool) */
  sourceMapType?: string

  /** 指定 React 框架相关的代码是否使用开发环境（未压缩）代码，默认使用生产环境（压缩后）代码 */
  debugReact?: boolean

  /** 是否跳过第三方依赖 usingComponent 的处理，默认为自动处理第三方依赖的自定义组件 */
  skipProcessUsingComponents?: boolean

  /** 压缩小程序 xml 文件的相关配置 */
  minifyXML?: {
    /** 是否合并 xml 文件中的空格 (默认false) */
    collapseWhitespace?: boolean
  }

  /**
   * 自定义 Webpack 配置
   * @param chain  [webpackChain](https://github.com/neutrinojs/webpack-chain) 对象
   * @param webpack webpack 实例
   * @param PARSE_AST_TYPE 小程序编译时的文件类型集合
   * @returns
   */
  webpackChain?: (chain: Chain, webpack: typeof Webpack, PARSE_AST_TYPE: any) => void

  /** webpack 编译模式下，可用于修改、拓展 Webpack 的 output 选项，配置项参考[官方文档](https://webpack.js.org/configuration/output/)
  * vite 编译模式下，用于修改、扩展 rollup 的 output，目前仅适配 chunkFileNames 和 assetFileNames 两个配置，修改其他配置请使用 vite 插件进行修改。配置想参考[官方文档](https://rollupjs.org/configuration-options/)
  */
  output?: T extends 'vite'
    ? Pick<RollupOutputOptions, 'chunkFileNames'>  & OutputExt
    : Webpack.Configuration['output'] & OutputExt

  /** 配置 postcss 相关插件 */
  postcss?: IPostcssOption<'mini'>

  /** [css-loader](https://github.com/webpack-contrib/css-loader) 的附加配置 */
  cssLoaderOption?: IOption

  /** [sass-loader](https://github.com/webpack-contrib/sass-loader) 的附加配置 */
  sassLoaderOption?: IOption

  /** [less-loader](https://github.com/webpack-contrib/less-loader) 的附加配置 */
  lessLoaderOption?: IOption

  /** [stylus-loader](https://github.com/shama/stylus-loader) 的附加配置 */
  stylusLoaderOption?: IOption

  /** 针对 mp4 | webm | ogg | mp3 | wav | flac | aac 文件的 [url-loader](https://github.com/webpack-contrib/url-loader) 配置 */
  mediaUrlLoaderOption?: IUrlLoaderOption

  /** 针对 woff | woff2 | eot | ttf | otf 文件的 [url-loader](https://github.com/webpack-contrib/url-loader) 配置 */
  fontUrlLoaderOption?: IUrlLoaderOption

  /** 针对 png | jpg | jpeg | gif | bpm | svg 文件的 [url-loader](https://github.com/webpack-contrib/url-loader) 配置 */
  imageUrlLoaderOption?: IUrlLoaderOption

  /** [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) 的附加配置 */
  miniCssExtractPluginOption?: IOption

  /** 用于告诉 Taro 编译器需要抽取的公共文件 */
  commonChunks?: string[] | ((commonChunks: string[]) => string[])

  /** 为某些页面单独指定需要引用的公共文件 */
  addChunkPages?: (pages: Map<string, string[]>, pagesNames?: string[]) => void

  /** 优化主包的体积大小 */
  optimizeMainPackage?: {
    enable?: boolean
    exclude?: any[]
  }

  /** 小程序编译过程的相关配置 */
  compile?: {
    exclude?: any[]
    include?: any[]
    /** 对应 @rollup/plugin-babel 插件的 filter 配置。只在 vite 编译模式下有效 */
    filter?: (filename: string) => boolean
  }

  /** 插件内部使用 */
  runtime?: Runtime

  /**
   * 共享运行时（split 模式）：额外纳入共享的运行时包名列表。
   * 用于把业务自研的运行时 API 也一并 external 到共享运行时全局，随异步核共享一份。
   * 仅在使用 `--shared-runtime --shared-runtime-mode split` 编译时生效。
   */
  sharedRuntimeExtraPackages?: string[]

  /**
   * 共享运行时（split 模式）：需要在**同步核**阶段就执行副作用的额外共享包名列表。
   * 与 `sharedRuntimeExtraPackages` 平行——后者随异步核加载（`.then` 回调，晚于首屏 onLoad），
   * 前者随业务 app.js 顶层同步 `require` 立即执行。适用于必须先于首屏 window `INIT`
   * 事件广播就注册监听器/设置全局状态的场景（如 rem 根字号计算的 `window.on(CONTEXT_ACTIONS.INIT)`
   * 注册）。代价：每个业务包各自打包一份（不共享），故此清单应仅放**必须首屏就位**的极小内容。
   * 仅在 `--shared-runtime --shared-runtime-mode split` 编译时生效。
   */
  sharedRuntimeSyncExtraPackages?: string[]

  /**
   * 共享运行时（split 模式）：自定义两个运行时核（同步核 taro-shared-sync / 异步核
   * async-provider）各自独立 webpack 子构建的配置。
   *
   * 背景：这两个子构建与主构建**完全独立**——主构建的 `webpackChain` / `modifyWebpackChain`
   * 只作用于主 chain，对两核无效。此前接入方没有任何入口可定制它们；而
   * `sharedRuntimeExtraPackages` 引入的私有 runtime 若需要 loader / resolve 级定制
   * （如私有语法插件、特殊 alias），必须从这里改。
   *
   * 同步核、异步核各调用一次本钩子，`data.name` 区分当前是哪个核
   * （`'taro-shared-sync'` / `'async-provider'`，与产物文件名一致）。
   *
   * 注意：两个子构建默认已内置 ES5 转译（babel-loader + 业务项目 babel 配置）与
   * `regenerator-runtime` alias，一般无需再配置；本钩子用于在此之上的微调
   * （追加 loader、改 resolve、追加 plugin 等），不建议移除内置的 babel 规则。
   *
   * 仅在使用 `--shared-runtime --shared-runtime-mode split` 编译时生效。
   */
  sharedRuntimeWebpackChain?: (chain: Chain, webpack: typeof Webpack, data: ISharedRuntimeChainData) => void

  /** 使用的编译工具。可选值：webpack5、vite */
  compiler?: Compiler<T>

  /** 体验式功能 */
  experimental?: {
    /** 是否开启编译模式 */
    compileMode?: boolean | string
    /** 模版渲染时是否使用wxs等小程序脚本语言 */
    useXsForTemplate?: boolean
  }
}

export interface IMiniFilesConfig {
  [configName: string]: {
    content: any
    path: string
  }
}
