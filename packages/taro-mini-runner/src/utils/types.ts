import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import { IMiniAppConfig, IProjectBaseConfig } from '@tarojs/taro/types/compile'
import * as webpack from 'webpack'

import { PrerenderConfig } from '../prerender/prerender'

type FunctionLikeCustomWebpackConfig = (webpackConfig: webpack.Configuration, webpack) => webpack.Configuration

export type CustomWebpackConfig = FunctionLikeCustomWebpackConfig | webpack.Configuration
export interface IOption {
  [key: string]: any
}

export interface IComponent {
  name: string
  path: string
  isNative: boolean
  stylePath?: string
  templatePath?: string
}

export interface IComponentObj {
  name?: string
  path: string | null
  type?: string
}

export interface IChain {
  [key: string]: any
}

export interface IFileType {
  style: string
  script: string
  templ: string
  config: string
  xs?: string
}

export type Func = (...args: any[]) => any

export interface IBuildConfig extends IProjectBaseConfig, IMiniAppConfig {
  blended?: boolean
  buildAdapter: string
  entry?: webpack.Entry
  hot?: boolean
  fileType: IFileType
  globalObject: string
  isBuildNativeComp?: boolean
  isBuildPlugin: boolean
  isBuildQuickapp: boolean
  isSupportRecursive: boolean
  isSupportXS: boolean
  mode: 'production' | 'development'
  modifyComponentConfig: Func
  nodeModulesPath: string
  onCompilerMake: Func
  onParseCreateElement: Func
  prerender?: PrerenderConfig
  quickappJSON: any
  runtimePath?: string | string[]
  taroComponentsPath?: string
  template: RecursiveTemplate | UnRecursiveTemplate
}

export type AddPageChunks = ((pages: Map<string, string[]>, pagesNames?: string[]) => void)
