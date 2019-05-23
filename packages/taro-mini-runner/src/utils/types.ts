import * as webpack from 'webpack'
import { BUILD_TYPES } from './constants'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration
export interface IOption {
  [key: string]: any
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

export interface ITaroMiniConfig {
  entry: webpack.Entry
  output: webpack.Output,
  buildAdapter: BUILD_TYPES
}

export interface ITaroPlugins {
  babel: IOption
  csso?: TogglableOptions
  uglify?: TogglableOptions
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
  outputDir: string
  staticDirectory: string
  chunkDirectory: string
  copy: ICopyOptions

  designWidth: number
  deviceRatio?: number

  defineConstants?: IOption
  env?: IOption

  plugins: ITaroPlugins
}

export interface IBuildConfig extends ITaroBaseConfig, ITaroMiniConfig {
  isWatch: boolean,
  constantsReplaceList: IOption
}
