import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import type webpackDevServer from 'webpack-dev-server'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import type { IOption, IPostcssOption, IUrlLoaderOption } from './util'
import type { OutputOptions as RollupOutputOptions } from 'rollup'
import type { Compiler, CompilerTypes, CompilerWebpackTypes } from '../compiler'
import type { OutputExt } from './project'
import type { ServerOptions as ViteServerOptions } from 'vite'

export interface IH5RouterConfig {
  /** 配置路由模式 */
  mode?: 'hash' | 'browser' | 'multi'
  /** 配置自定义路由 */
  customRoutes?: IOption
  /** 配置路由基准路径 */
  basename?: string
  lazyload?: boolean | ((pagename: string) => boolean)
  renamePagename?: (pagename: string) => string
  forcePath?: string
  /** 加上这个参数，可以解决返回页面的时候白屏的问题，但是某些不支持 :has() 选择器的浏览器会有问题 */
  enhanceAnimation?: boolean
}

export interface IH5Config <T extends CompilerTypes = CompilerWebpackTypes> {
  /** 设置输出解析文件的目录（默认值：'/'）*/
  publicPath?: string

  /** h5 编译后的静态文件目录（默认值：'static'） */
  staticDirectory?: string

  /** 编译后非 entry 的 js 文件的存放目录，主要影响动态引入的 pages 的存放路径（默认值：'chunk'） */
  chunkDirectory?: string

  webpack?: ((webpackConfig: Webpack.Configuration, webpack) => Webpack.Configuration) | Webpack.Configuration

  /**
   * 自定义 Webpack 配置
   * @param chain  [webpackChain](https://github.com/neutrinojs/webpack-chain) 对象
   * @param webpack webpack 实例
   */
  webpackChain?: (chain: Chain, webpack: typeof Webpack) => void

  /** webpack 编译模式下，可用于修改、拓展 Webpack 的 output 选项，配置项参考[官方文档](https://webpack.js.org/configuration/output/)
  * vite 编译模式下，用于修改、扩展 rollup 的 output，目前仅适配 chunkFileNames 和 assetFileNames 两个配置，修改其他配置请使用 vite 插件进行修改。配置想参考[官方文档](https://rollupjs.org/configuration-options/)
  */
  output?: T extends 'vite'
    ? Pick<RollupOutputOptions, 'chunkFileNames' | 'assetFileNames'>  & OutputExt
    : Webpack.Configuration['output']

  /** 路由相关的配置 */
  router?: IH5RouterConfig

  /** 预览服务的配置，可以更改端口等参数。具体配置参考 [webpack-dev-server](https://webpack.js.org/configuration/dev-server) */
  // 修改后：同时支持 Webpack 和 Vite
  devServer?: T extends 'vite' ? ViteServerOptions : webpackDevServer.Configuration

  /** 用于控制是否生成 js、css 对应的 sourceMap (默认值：watch 模式下为 true，否则为 false) */
  enableSourceMap?: boolean

  /**  具体配置请参考 [Webpack devtool](https://webpack.js.org/configuration/devtool/#devtool) 配置 (默认值：'cheap-module-eval-source-map')*/
  sourceMapType?:
    | 'none'
    | 'eval'
    | 'cheap-eval-source-map'
    | 'cheap-module-eval-source-map'
    | 'eval-source-map'
    | 'cheap-source-map'
    | 'cheap-module-source-map'
    | 'inline-cheap-source-map'
    | 'inline-cheap-module-source-map'
    | 'source-map'
    | 'inline-source-map'
    | 'hidden-source-map'
    | 'nosources-source-map'

  /** extract 功能开关，开启后将使用 mini-css-extract-plugin 分离 css 文件，可通过 h5.miniCssExtractPluginOption 对插件进行配置 (默认值：watch 模式下为 false，否则为 true) */
  enableExtract?: boolean

  /** [css-loader](https://github.com/webpack-contrib/css-loader) 的附加配置 */
  cssLoaderOption?: IOption

  /** [style-loader](https://github.com/webpack-contrib/style-loader) 的附加配置 */
  styleLoaderOption?: IOption

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

  /** 配置需要额外的经由 Taro 预设的 postcss 编译的模块 */
  esnextModules?: string[]

  /** 用于控制在 H5 端是否使用兼容性组件库，详情请看 [React 兼容性组件库](https://taro-docs.jd.com/docs/h5#react-兼容性组件库)。(默认值：false) */
  useHtmlComponents?: boolean

  /** 用于控制在 H5 端是否使用旧版本适配器，旧版本采用全局注册组件，懒加载组件相关依赖；新版本适配器会自动注册相关组件，不再需要引入 @tarojs/components/loader 中的全局 defineCustomElements 方法。(默认值：false) */
  useDeprecatedAdapterComponent?: boolean

  /** 配置 postcss 相关插件 */
  postcss?: IPostcssOption<'h5'>

  /** html-webpack-plugin 的具体配置 */
  htmlPluginOption?: HtmlWebpackPlugin.Options

  /** Web 编译过程的相关配置 */
  compile?: {
    exclude?: any[]
    include?: any[]
    /** 对应 @rollup/plugin-babel 插件的 filter 配置。只在 vite 编译模式下有效 */
    filter?: (filename: string) => boolean
  }
  /** 生成的代码是否要兼容旧版浏览器，值为 true 时，会去读取 package.json 的 browserslist 字段。只在 vite 编译模式下有效 */
  legacy?: T extends 'vite' ? boolean : undefined

  /** 使用的编译工具。可选值：webpack5、vite */
  compiler?: Compiler<T>
}
