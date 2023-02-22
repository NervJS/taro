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
import type { IMINI_APP_FILE_TYPE, IOption, IPostcssOption } from './util'

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
  appOutput?: boolean
  sourceMapType?: string
  debugReact?: boolean
  minifyXML?: {
    collapseWhitespace?: boolean
  }

  webpackChain?: (chain: Chain, webpack: typeof Webpack, PARSE_AST_TYPE: any) => void
  output?: Webpack.Configuration['output']
  postcss?: IPostcssOption
  cssLoaderOption?: IOption
  sassLoaderOption?: IOption
  lessLoaderOption?: IOption
  stylusLoaderOption?: IOption
  mediaUrlLoaderOption?: IOption
  fontUrlLoaderOption?: IOption
  imageUrlLoaderOption?: IOption
  miniCssExtractPluginOption?: IOption

  customFilesTypes?: IMINI_APP_FILE_TYPE
  commonChunks?: string[] | ((commonChunks: string[]) => string[])
  addChunkPages?: ((pages: Map<string, string[]>, pagesNames?: string[]) => void)
  optimizeMainPackage?: {
    enable?: boolean
    exclude?: any[]
  }

  compile?: {
    exclude?: any[]
    include?: any[]
  }
  runtime?: Runtime
}
