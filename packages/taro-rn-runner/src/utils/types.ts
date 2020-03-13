import * as webpack from 'webpack'
import { IProjectBaseConfig, IMiniAppConfig } from '@tarojs/taro/types/compile'
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

export interface IChain {
  [key: string]: any
}

export interface IBuildConfig extends IProjectBaseConfig, IMiniAppConfig {
  isWatch: boolean,
  mode: 'production' |'development',
  port?: number,
  buildAdapter: BUILD_TYPES,
  nodeModulesPath: string,
  quickappJSON: any,
  isBuildPlugin: boolean,
  appJson?:any
}

export type AddPageChunks = ((pages: Map<string, string[]>, pagesNames?: string[]) => void)
