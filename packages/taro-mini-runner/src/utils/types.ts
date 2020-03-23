import * as webpack from 'webpack'
import { IProjectBaseConfig, IMiniAppConfig } from '@tarojs/taro/types/compile'
import { PrerenderConfig } from '../prerender/prerender'
import { BUILD_TYPES } from '@tarojs/runner-utils'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration
export interface IOption {
  [key: string]: any
}

export interface IComponent {
  name: string,
  path: string,
  isNative: boolean,
  stylePath?: string,
  templatePath?: string
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
  port?: number,
  buildAdapter: BUILD_TYPES,
  nodeModulesPath: string,
  quickappJSON: any,
  isBuildPlugin: boolean,
  framework: string,
  baseLevel: number,
  prerender?: PrerenderConfig
}

export type AddPageChunks = ((pages: Map<string, string[]>, pagesNames?: string[]) => void)
