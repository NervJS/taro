import * as webpack from 'webpack'
import { IProjectBaseConfig, IMiniAppConfig } from '@tarojs/taro/types/compile'

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

export interface IComponent {
  name: string,
  path: string,
  isNative: boolean,
  stylePath?: string,
  templatePath?: string
}

export interface IChain {
  [key: string]: any
}

export interface IFileType {
  style: string,
  script: string,
  templ: string,
  config: string
}

export interface IBuildConfig extends IProjectBaseConfig, IMiniAppConfig {
  isWatch: boolean,
  mode: 'production' |'development',
  port?: number,
  buildAdapter: string,
  nodeModulesPath: string,
  quickappJSON: any,
  isBuildPlugin: boolean,
  isBuildQuickapp: boolean,
  fileType: IFileType,
  globalObject: string,
  isUseComponentBuildPage: boolean,
  modifyWebpackChain: Function,
  modifyBuildAssets: Function,
  modifyBuildTempFileContent: Function,
  onBuildFinish: Function
}

export type AddPageChunks = ((pages: Map<string, string[]>, pagesNames?: string[]) => void)
