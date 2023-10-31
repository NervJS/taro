import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import type { IOption, IPostcssOption } from './util'

interface Runtime {
  enableInnerHTML: boolean
  enableSizeAPIs: boolean
  enableAdjacentHTML: boolean
  enableTemplateContent: boolean
  enableCloneNode: boolean
  enableContains: boolean
  enableMutationObserver: boolean
}

export interface IMiniAppConfig {
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

  /** 可用于修改、拓展 Webpack 的 [output](https://webpack.js.org/configuration/output/) 选项 */
  output?: Webpack.Configuration['output'] & {
    /**
     * 编译前清空输出目录
     * @since Taro v3.6.9
     * @description 
     * - 默认清空输出目录，可设置 clean: false 不清空
     * - 可设置 clean: { keep: ['project.config.json'] } 保留指定文件
     * - 注意 clean.keep 不支持函数
     */
    clean?: boolean | {
      /** 保留指定文件不删除 */
      keep?: Array<string | RegExp> | string | RegExp
    }
  }

  /** 配置 postcss 相关插件 */
  postcss?: IPostcssOption

  /** [css-loader](https://github.com/webpack-contrib/css-loader) 的附加配置 */
  cssLoaderOption?: IOption

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
  }

  /** 插件内部使用 */
  runtime?: Runtime
}
