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
import type { IH5Config, IMiniAppConfig, IProjectBaseConfig } from '@tarojs/taro/types/compile'
import type Webpack from 'webpack'
import type { PrerenderConfig } from '../prerender/prerender'
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

export interface CommonBuildConfig extends IProjectBaseConfig {
  entry?: Webpack.EntryObject
  mode: 'production' | 'development' | 'none'
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
  runtimePath?: string | string[]
}

export type AddPageChunks = (pages: Map<string, string[]>, pagesNames?: string[]) => void
