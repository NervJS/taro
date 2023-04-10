import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import type webpackDevServer from 'webpack-dev-server'
import type HtmlWebpackPlugin from 'html-webpack-plugin'
import type { IOption, IPostcssOption } from './util'

export interface IH5RouterConfig {
  mode?: 'hash' | 'browser' | 'multi'
  customRoutes?: IOption
  basename?: string
  lazyload?: boolean | ((pagename: string) => boolean)
  renamePagename?: (pagename: string) => string
  forcePath?: string
}

export interface IH5Config {
  publicPath?: string
  staticDirectory?: string
  chunkDirectory?: string

  webpack?: ((webpackConfig: Webpack.Configuration, webpack) => Webpack.Configuration) | Webpack.Configuration

  webpackChain?: (chain: Chain, webpack: typeof Webpack) => void

  output?: Webpack.Configuration['output']
  router?: IH5RouterConfig
  devServer?: webpackDevServer.Configuration
  sourceMapType?: 'none' | 'eval' | 'cheap-eval-source-map' | 'cheap-module-eval-source-map' | 'eval-source-map' | 'cheap-source-map' | 'cheap-module-source-map' | 'inline-cheap-source-map' | 'inline-cheap-module-source-map' | 'source-map' | 'inline-source-map' | 'hidden-source-map' | 'nosources-source-map'
  enableExtract?: boolean
  transformOnly?: boolean

  cssLoaderOption?: IOption
  styleLoaderOption?: IOption
  sassLoaderOption?: IOption
  lessLoaderOption?: IOption
  stylusLoaderOption?: IOption
  mediaUrlLoaderOption?: IOption
  fontUrlLoaderOption?: IOption
  imageUrlLoaderOption?: IOption
  miniCssExtractPluginOption?: IOption
  esnextModules?: string[]
  useHtmlComponents?: boolean
  useDeprecatedAdapterComponent?: boolean

  postcss?: IPostcssOption
  htmlPluginOption?: HtmlWebpackPlugin.Options

  compile?: {
    exclude?: any[]
    include?: any[]
  }
}
