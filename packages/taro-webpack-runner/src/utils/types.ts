import * as webpack from 'webpack'

import type { Func, IH5Config, IProjectBaseConfig } from '@tarojs/taro/types/compile'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration
export interface Option {
  [key: string]: any
}

export interface Chain {
  [key: string]: any
}

export interface BuildConfig extends IProjectBaseConfig, IH5Config {
  buildAdapter: string // weapp | swan | alipay | tt | qq | jd | h5
  entry?: webpack.Entry
  entryFileName?: string
  runtimePath?: string | string[]
  /** special mode */
  isBuildNativeComp?: boolean
  withoutBuild?: boolean
  /** hooks */
  onCompilerMake: (compilation) => Promise<any>
  onParseCreateElement: (nodeName, componentConfig) => Promise<any>
  modifyComponentConfig: Func
}
