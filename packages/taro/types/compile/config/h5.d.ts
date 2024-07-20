import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import type webpackDevServer from 'webpack-dev-server'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import type { IOption, IPostcssOption } from './util'

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
}

export interface IH5Config {
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

  /** 可用于修改、拓展 Webpack 的 output 选项，配置项参考[官方文档](https://webpack.js.org/configuration/output/) */
  output?: Webpack.Configuration['output']

  /** 路由相关的配置 */
  router?: IH5RouterConfig

  /** 预览服务的配置，可以更改端口等参数。具体配置参考 [webpack-dev-server](https://webpack.js.org/configuration/dev-server) */
  devServer?: webpackDevServer.Configuration

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
  mediaUrlLoaderOption?: IOption

  /** 针对 woff | woff2 | eot | ttf | otf 文件的 [url-loader](https://github.com/webpack-contrib/url-loader) 配置 */
  fontUrlLoaderOption?: IOption

  /** 针对 png | jpg | jpeg | gif | bpm | svg 文件的 [url-loader](https://github.com/webpack-contrib/url-loader) 配置 */
  imageUrlLoaderOption?: IOption

  /** [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) 的附加配置 */
  miniCssExtractPluginOption?: IOption

  /** 配置需要额外的经由 Taro 预设的 postcss 编译的模块 */
  esnextModules?: string[]

  /** 用于控制在 H5 端是否使用兼容性组件库，详情请看 [React 兼容性组件库](https://taro-docs.jd.com/docs/h5#react-兼容性组件库)。(默认值：false) */
  useHtmlComponents?: boolean

  /** 用于控制在 H5 端是否使用旧版本适配器，旧版本采用全局注册组件，懒加载组件相关依赖；新版本适配器会自动注册相关组件，不再需要引入 @tarojs/components/loader 中的全局 defineCustomElements 方法。(默认值：false) */
  useDeprecatedAdapterComponent?: boolean

  /** 配置 postcss 相关插件 */
  postcss?: IPostcssOption

  /** html-webpack-plugin 的具体配置 */
  htmlPluginOption?: HtmlWebpackPlugin.Options

  /** Web 编译过程的相关配置 */
  compile?: {
    exclude?: any[]
    include?: any[]
  }
}
