/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

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

  postcss?: IPostcssOption
  htmlPluginOption?: HtmlWebpackPlugin.Options

  compile?: {
    exclude?: any[]
    include?: any[]
  }
}
