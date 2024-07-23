import type { OutputOptions as RollupOutputOptions } from 'rollup'
import type Webpack from 'webpack'
import type Chain from 'webpack-chain'

import type { IOption, IPostcssOption, IUrlLoaderOption } from './util'
import type { CompilerTypes, CompilerWebpackTypes } from '../compiler'
import type { OutputExt } from './project'

export interface IHarmonyRouterConfig {
  /** 配置自定义路由 */
  customRoutes?: IOption
}

export interface IHarmonyConfig<T extends CompilerTypes = 'vite'> {
  /** Harmony 项目地址 */
  projectPath: string

  /** hap 名
   * @default "entry"
   */
  hapName?: string

  /** 应用名称
   * @default "default"
   */
  name?: string

  /** oh-package.json 配置 */
  ohPackage?: {
    dependencies?: { [name: string]: string }
    devDependencies?: { [name: string]: string }
    main?: string
    [k: string]: any
  }

  /** ohpm-cli
   * @default "~/Library/Huawei/ohpm/bin/ohpm"
   */
  ohpm?: string

  /** 核心依赖前缀
   * @description 用于告诉编译内容如何解析核心依赖，传入时将直接使用依赖前缀，同时不会为工程导入核心依赖
   */
  chorePackagePrefix?: string

  /** 用于告诉 Taro 编译器需要抽取的公共文件 */
  commonChunks?: string[] | ((commonChunks: string[]) => string[])

  /** Harmony 编译过程的相关配置 */
  compile?: {
    exclude?: any[]
    include?: any[]
    filter?: (filename: string) => boolean
  }

  /** 用于配置半编译模式下的选项 */
  compileModeSetting?: {
    componentReplace?: {
      [key: string]: {
        current_init: string
        dependency_define: string
      }
    }
  }

  /** 用于控制是否生成 js、css 对应的 sourceMap (默认值：watch 模式下为 true，否则为 false) */
  enableSourceMap?: boolean

  /** 默认值：'cheap-module-source-map'， 具体参考[Webpack devtool 配置](https://webpack.js.org/configuration/devtool/#devtool) */
  sourceMapType?: string

  /** 指定 React 框架相关的代码是否使用开发环境（未压缩）代码，默认使用生产环境（压缩后）代码 */
  debugReact?: boolean

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
    ? Pick<RollupOutputOptions, 'chunkFileNames'> & OutputExt
    : Webpack.Configuration['output'] & OutputExt

  /** 路由相关的配置 */
  router?: IHarmonyRouterConfig

  /** 配置 postcss 相关插件 */
  postcss?: IPostcssOption<'harmony'>

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
}
