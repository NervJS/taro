import * as webpack from 'webpack'
import { IProjectBaseConfig, IMiniAppConfig } from '@tarojs/taro/types/compile'
import { PrerenderConfig } from '../prerender/prerender'

import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared'

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

export interface IFileType {
  style: string,
  script: string,
  templ: string,
  config: string,
  xs?: string
}

export type Func = (...args: any[]) => any

export interface IBuildConfig extends IProjectBaseConfig, IMiniAppConfig {
  isWatch: boolean,
  mode: 'production' | 'development',
  port?: number,
  buildAdapter: string,
  nodeModulesPath: string,
  quickappJSON: any,
  isBuildPlugin: boolean,
  isBuildQuickapp: boolean,
  isSupportRecursive: boolean,
  fileType: IFileType,
  isSupportXS: boolean,
  globalObject: string,
  modifyWebpackChain: Func,
  modifyBuildAssets: Func,
  modifyMiniConfigs: Func,
  modifyComponentConfig: Func,
  onCompilerMake: Func,
  onParseCreateElement: Func,
  onWebpackChainReady: Func,
  onBuildFinish: Func
  framework: string,
  baseLevel: number,
  prerender?: PrerenderConfig
  template: RecursiveTemplate | UnRecursiveTemplate
  runtimePath?: string | string[]
  taroComponentsPath?: string
  blended?: boolean
  isBuildNativeComp?: boolean
}

export type AddPageChunks = ((pages: Map<string, string[]>, pagesNames?: string[]) => void)
