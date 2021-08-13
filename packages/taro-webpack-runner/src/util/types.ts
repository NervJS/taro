import * as webpack from 'webpack'
import { IProjectBaseConfig, IH5Config } from '@tarojs/taro/types/compile'

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
  isWatch: boolean;
  port?: number;
  entryFileName?: string;
  modifyWebpackChain: Func;
  modifyMiniConfigs: Func;
  modifyBuildAssets: Func;
  onWebpackChainReady: Func;
  onBuildFinish: Func;
}
