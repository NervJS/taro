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
