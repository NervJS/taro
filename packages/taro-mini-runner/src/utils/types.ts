import * as webpack from 'webpack'
import { BUILD_TYPES } from './constants'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration
export interface IOption {
  [key: string]: any
}

export interface IComponentObj {
  name?: string,
  path: string | null,
  type?: string
}

type TogglableOptions<T = IOption> = {
  enable?: boolean
  config?: T
}

export namespace PostcssOption {
  export type cssModules = TogglableOptions<{
    namingPattern: 'global' | string
    generateScopedName: string | ((localName: string, absoluteFilePath: string) => string)
  }>
}

export interface IPostcssOption {
  autoprefixer?: TogglableOptions
  pxtransform?: TogglableOptions
  cssModules?: PostcssOption.cssModules
}


export interface IChain {
  [key: string]: any
}

export interface ICopyOptions {
  patterns: {
    from: string
    to: string
    ignore: string[]
  }[]
  options: {
    ignore: string[]
  }
}

export interface ITaroMiniConfig {
  webpackChain: (chain: any, webpack: any) => void
  alias: IOption
  entry: webpack.Entry
  output: webpack.Output
  enableSourceMap: boolean

  cssLoaderOption: IOption
  styleLoaderOption: IOption
  sassLoaderOption: IOption
  lessLoaderOption: IOption
  stylusLoaderOption: IOption
  mediaUrlLoaderOption: IOption
  fontUrlLoaderOption: IOption
  imageUrlLoaderOption: IOption
  esnextModules: string[]

  postcss?: IPostcssOption
}

export interface ICopyOptions {
  patterns: {
    from: string
    to: string
    ignore: string[]
  }[]
  options: {
    ignore: string[]
  }
}

export interface ITaroBaseConfig {
  outputRoot: string
  copy: ICopyOptions

  designWidth: number
  deviceRatio?: number

  defineConstants?: IOption
  env?: IOption

  babel: IOption
  csso?: TogglableOptions
  uglify?: TogglableOptions,
  sass?: IOption
}

export interface IBuildConfig extends ITaroBaseConfig, ITaroMiniConfig {
  isWatch: boolean,
  port?: number,
  buildAdapter: BUILD_TYPES
}
