/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import type { RecursiveTemplate, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import type { Func, IMiniAppConfig, IProjectBaseConfig } from '@tarojs/taro/types/compile'
import type * as webpack from 'webpack'
import type { PrerenderConfig } from '../prerender/prerender'

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
