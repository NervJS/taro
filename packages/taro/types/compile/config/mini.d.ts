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
