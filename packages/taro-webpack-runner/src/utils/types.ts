import { IH5Config, IProjectBaseConfig } from '@tarojs/taro/types/compile'
import * as webpack from 'webpack'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration
export interface Option {
  [key: string]: any
}

export interface Chain {
  [key: string]: any
}

export type Func = (...args: any[]) => void

export interface BuildConfig extends IProjectBaseConfig, IH5Config {
  entry?: webpack.Entry
  entryFileName?: string
  runtimePath?: string | string[]
  /** special mode */
  isBuildNativeComp?: boolean
  /** hooks */
  onCompilerMake: (compilation) => Promise<any>
  onParseCreateElement: (nodeName, componentConfig) => Promise<any>
}
