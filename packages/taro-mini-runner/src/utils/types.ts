/*!
* Licensed to the O2Team under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import * as webpack from 'webpack'
import { IProjectBaseConfig, IMiniAppConfig } from '@tarojs/taro/types/compile'
import { PrerenderConfig } from '../prerender/prerender'

import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'

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
