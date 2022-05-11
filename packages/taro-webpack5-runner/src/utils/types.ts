import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import { IH5Config, IMiniAppConfig, IProjectBaseConfig } from '@tarojs/taro/types/compile'
import type Webpack from 'webpack'
import type Chain from 'webpack-chain'

import { PrerenderConfig } from '../prerender/prerender'
import type { IComponentConfig } from '../template/component'

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

export interface HookModifyWebpackChain {
  (chain: Chain, webpack: typeof Webpack, data: { componentConfig: IComponentConfig }): Promise<any>
}

export interface CommonBuildConfig extends IProjectBaseConfig {
  enableSourceMap?: boolean
  entry?: Webpack.EntryObject
  isWatch: boolean
  mode: 'production' | 'development'
  port?: number
  /** hooks */
  modifyWebpackChain: HookModifyWebpackChain
  modifyMiniConfigs: (configMap) => Promise<any>
  modifyBuildAssets: (assets, plugin?) => Promise<any>
  onWebpackChainReady: (webpackChain: Chain) => Promise<any>
  onBuildFinish: (res: { error, stats, isWatch }) => Promise<any>
}

export interface MiniBuildConfig extends CommonBuildConfig, IMiniAppConfig {
  isBuildPlugin: boolean
  isBuildNativeComp?: boolean
  isSupportRecursive: boolean
  isSupportXS: boolean
  buildAdapter: string
  nodeModulesPath: string
  fileType: IFileType
  globalObject: string
  framework: string
  baseLevel: number
  prerender?: PrerenderConfig
  template: RecursiveTemplate | UnRecursiveTemplate
  runtimePath?: string | string[]
  taroComponentsPath?: string
  blended?: boolean
  hot?: boolean
  /** hooks */
  modifyComponentConfig: (componentConfig: IComponentConfig, config: Partial<MiniBuildConfig>) => Promise<any>
  onCompilerMake: (compilation) => Promise<any>
  onParseCreateElement: (nodeName, componentConfig) => Promise<any>
}

export interface H5BuildConfig extends CommonBuildConfig, IH5Config {
  entryFileName?: string
}

export type AddPageChunks = ((pages: Map<string, string[]>, pagesNames?: string[]) => void)
